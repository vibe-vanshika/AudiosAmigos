import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig, ProcessingState, SynthesisResult, VoiceName } from "../types";
import { chunkText, splitChunk } from "../utils/textUtils";
import { decodeAudioData, mergeAudioBuffers } from "../utils/audioEngine";
import {
  generateCacheKey, getCachedAudio, cacheAudio,
  generateChunkCacheKey, getCachedChunkAudio, cacheChunkAudio
} from "../utils/cache";

const CHUNK_SIZE_WORDS = 200;
const SILENCE_GAP_SECONDS = 0.4;
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const TRANSLATION_MODEL = "gemini-2.5-flash";
const INITIAL_CONCURRENCY = 2;
const MAX_RETRIES = 4;
const REQUEST_TIMEOUT_MS = 45000;
const INTER_REQUEST_DELAY_MS = 200;

const SYNTHESIS_MESSAGES = [
  "Initializing neural pathways...",
  "Authenticating synthesis tokens...",
  "Analyzing linguistic patterns...",
  "Encoding phonetic structures...",
  "Harmonizing vocal timbres...",
  "Synthesizing rhythmic prosody...",
  "Calibrating acoustic dynamics...",
  "Applying inflection matrices...",
  "Mapping harmonic resonance...",
  "Optimizing audio stream...",
  "Refining vocal textures...",
  "Finalizing neural export..."
];

interface SegmentSlot {
  index: number;
  text: string;
  buffer: AudioBuffer | null;
  error: string | null;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function isRetryableError(error: any): boolean {
  if (error.status === 429 || error.status === 500 || error.status === 503) return true;
  if (error.message?.includes('Timeout')) return true;
  if (error.message?.includes('Failed to fetch')) return true;
  if (error.message?.includes('NetworkError')) return true;
  if (error.message?.includes('network')) return true;
  if (!error.status && error instanceof TypeError) return true;
  return false;
}

export class TTSService {
  private audioContext: AudioContext;
  private activeConcurrency = INITIAL_CONCURRENCY;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();
  }

  private getAI(): GoogleGenAI {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      throw new Error("Gemini API Key missing. Please set it using the key icon in the top-left corner.");
    }
    return new GoogleGenAI({ apiKey });
  }

  private async withRetry<T>(task: () => Promise<T>, retryCount = 0, signal?: AbortSignal): Promise<T> {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request Timeout")), REQUEST_TIMEOUT_MS);
      });
      return await Promise.race([task(), timeoutPromise]);
    } catch (error: any) {
      if (signal?.aborted) throw new Error("Aborted");

      if (error.status === 429) {
        this.activeConcurrency = 1;
      }

      if (isRetryableError(error) && retryCount < MAX_RETRIES) {
        const jitter = Math.random() * 1000;
        await delay(Math.pow(2, retryCount) * 1000 + jitter);
        return this.withRetry(task, retryCount + 1, signal);
      }
      throw error;
    }
  }

  async synthesize(
    textToProcess: string,
    config: TTSConfig,
    onProgress: (state: ProcessingState) => void,
    signal?: AbortSignal
  ): Promise<SynthesisResult> {

    const cacheKey = await generateCacheKey(textToProcess, config);
    const cachedData = await getCachedAudio(cacheKey);

    if (cachedData) {
      onProgress({ isProcessing: false, progress: 100, currentStep: "Retrieved from neural cache", totalChunks: cachedData.chunks.length, processedChunks: cachedData.chunks.length });
      return { audioUrl: URL.createObjectURL(cachedData.blob), chunks: cachedData.chunks, timings: cachedData.timings };
    }

    const chunks = chunkText(textToProcess, CHUNK_SIZE_WORDS);
    const totalChunks = chunks.length;
    if (totalChunks === 0) throw new Error("No text found to process");

    this.activeConcurrency = INITIAL_CONCURRENCY;

    const slots: SegmentSlot[] = chunks.map((text, index) => ({
      index, text, buffer: null, error: null
    }));

    let completedCount = 0;
    let virtualProgress = 5;

    const updateProgress = (step: string) => {
      const realProgress = 5 + Math.floor((completedCount / totalChunks) * 85);
      onProgress({
        isProcessing: true,
        progress: Math.max(realProgress, virtualProgress),
        currentStep: step,
        totalChunks,
        processedChunks: completedCount
      });
    };

    updateProgress(SYNTHESIS_MESSAGES[0]);

    const interpolationTimer = setInterval(() => {
      if (virtualProgress < 90) {
        virtualProgress += (0.5 + Math.random() * 0.8);
        const msgIndex = Math.min(SYNTHESIS_MESSAGES.length - 1, Math.floor((virtualProgress / 92) * SYNTHESIS_MESSAGES.length));
        const baseMsg = SYNTHESIS_MESSAGES[msgIndex];
        updateProgress(baseMsg + (totalChunks > 1 ? ` (Segment ${completedCount + 1}/${totalChunks})` : ""));
      }
    }, 800);

    try {
      // --- Pass 1: Load per-chunk cache hits ---
      updateProgress("Checking segment cache...");
      await this.loadCachedChunks(slots, config.voice);
      completedCount = slots.filter(s => s.buffer !== null).length;
      if (completedCount > 0) {
        updateProgress(`${completedCount}/${totalChunks} segments loaded from cache`);
      }

      // --- Pass 2: Concurrent synthesis of uncached segments ---
      const uncached = slots.filter(s => s.buffer === null);
      if (uncached.length > 0) {
        updateProgress(`Synthesizing ${uncached.length} segments...`);
        await this.synthesizeBatch(uncached, config.voice, signal, (slot) => {
          completedCount++;
          updateProgress(`Segment ${completedCount}/${totalChunks} synthesized`);
        });
      }

      // --- Pass 3: Sequential retry of any failures ---
      const failedAfterPass2 = slots.filter(s => s.buffer === null);
      if (failedAfterPass2.length > 0) {
        if (signal?.aborted) throw new Error("Aborted");
        updateProgress(`Retrying ${failedAfterPass2.length} failed segment(s)...`);
        for (const slot of failedAfterPass2) {
          if (signal?.aborted) throw new Error("Aborted");
          try {
            const rawAudio = await this.withRetry(
              () => this.fetchChunkRawAudio(slot.text, config.voice), 0, signal
            );
            slot.buffer = await decodeAudioData(rawAudio, this.audioContext);
            slot.error = null;
            await cacheChunkAudio(await generateChunkCacheKey(slot.text, config.voice), rawAudio);
            completedCount++;
            updateProgress(`Retry: segment ${slot.index + 1} recovered`);
          } catch (e: any) {
            slot.error = e.message || "Unknown error";
          }
          await delay(INTER_REQUEST_DELAY_MS);
        }
      }

      // --- Pass 4: Split still-failing segments and retry halves ---
      const failedAfterPass3 = slots.filter(s => s.buffer === null);
      if (failedAfterPass3.length > 0) {
        if (signal?.aborted) throw new Error("Aborted");
        updateProgress(`Splitting ${failedAfterPass3.length} stubborn segment(s)...`);
        for (const slot of failedAfterPass3) {
          if (signal?.aborted) throw new Error("Aborted");
          const halves = splitChunk(slot.text);
          const halfBuffers: AudioBuffer[] = [];
          let allSucceeded = true;

          for (const half of halves) {
            try {
              const rawAudio = await this.withRetry(
                () => this.fetchChunkRawAudio(half, config.voice), 0, signal
              );
              halfBuffers.push(await decodeAudioData(rawAudio, this.audioContext));
              await cacheChunkAudio(await generateChunkCacheKey(half, config.voice), rawAudio);
            } catch (e: any) {
              allSucceeded = false;
              slot.error = e.message || "Unknown error";
              break;
            }
            await delay(INTER_REQUEST_DELAY_MS);
          }

          if (allSucceeded && halfBuffers.length > 0) {
            slot.buffer = this.concatenateBuffers(halfBuffers);
            slot.text = halves.join(' ');
            slot.error = null;
            completedCount++;
            updateProgress(`Split recovery: segment ${slot.index + 1} succeeded`);
          }
        }
      }

      // --- Final check ---
      const finalFailures = slots.filter(s => s.buffer === null);
      if (finalFailures.length > 0) {
        const indices = finalFailures.map(s => s.index + 1).join(', ');
        throw new Error(
          `Synthesis failed for segment(s) ${indices} after all retry passes. ` +
          `Try with shorter text or check your network connection.`
        );
      }

      // --- Merge ---
      updateProgress("Assembling audio stream...");
      const audioBuffers = slots.map(s => s.buffer!);
      const finalChunks = slots.map(s => s.text);
      const { blob, timings } = await mergeAudioBuffers(audioBuffers, SILENCE_GAP_SECONDS);
      await cacheAudio(cacheKey, { blob, chunks: finalChunks, timings });
      onProgress({ isProcessing: false, progress: 100, currentStep: "Success!", totalChunks, processedChunks: totalChunks });

      return { audioUrl: URL.createObjectURL(blob), chunks: finalChunks, timings };
    } finally {
      clearInterval(interpolationTimer);
    }
  }

  private async loadCachedChunks(slots: SegmentSlot[], voice: string): Promise<void> {
    for (const slot of slots) {
      try {
        const key = await generateChunkCacheKey(slot.text, voice);
        const cached = await getCachedChunkAudio(key);
        if (cached) {
          slot.buffer = await decodeAudioData(cached, this.audioContext);
        }
      } catch {
        // cache miss, will synthesize
      }
    }
  }

  private async synthesizeBatch(
    slots: SegmentSlot[],
    voice: string,
    signal: AbortSignal | undefined,
    onSlotDone: (slot: SegmentSlot) => void
  ): Promise<void> {
    const queue = [...slots];

    const worker = async () => {
      while (queue.length > 0) {
        if (signal?.aborted) throw new Error("Aborted");
        const slot = queue.shift();
        if (!slot) break;

        try {
          const rawAudio = await this.withRetry(
            () => this.fetchChunkRawAudio(slot.text, voice), 0, signal
          );
          slot.buffer = await decodeAudioData(rawAudio, this.audioContext);
          slot.error = null;
          await cacheChunkAudio(await generateChunkCacheKey(slot.text, voice), rawAudio);
          onSlotDone(slot);
        } catch (e: any) {
          if (signal?.aborted) throw new Error("Aborted");
          slot.error = e.message || "Unknown error";
        }

        await delay(INTER_REQUEST_DELAY_MS);
      }
    };

    const workerCount = Math.min(this.activeConcurrency, queue.length);
    await Promise.all(Array(workerCount).fill(null).map(() => worker()));
  }

  private concatenateBuffers(buffers: AudioBuffer[]): AudioBuffer {
    const sampleRate = buffers[0].sampleRate;
    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
    const result = this.audioContext.createBuffer(1, totalLength, sampleRate);
    const channel = result.getChannelData(0);
    let offset = 0;
    for (const buf of buffers) {
      channel.set(buf.getChannelData(0), offset);
      offset += buf.length;
    }
    return result;
  }

  async translateText(text: string, targetLangCode: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: TRANSLATION_MODEL,
      contents: [{ parts: [{ text: `Translate to ${targetLangCode}. Return ONLY translation: "${text}"` }] }],
    });
    return response.text?.trim() || "";
  }

  async previewVoice(voice: VoiceName): Promise<string> {
    const rawAudio = await this.fetchChunkRawAudio("Neural check.", voice);
    const buffer = await decodeAudioData(rawAudio, this.audioContext);
    const { blob } = await mergeAudioBuffers([buffer], 0);
    return URL.createObjectURL(blob);
  }

  private async fetchChunkRawAudio(text: string, voiceName: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });
    const audioData = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (!audioData) throw new Error("No audio data returned from API");
    return audioData;
  }
}
