import { GoogleGenAI, Modality } from "@google/genai";
import { TTSConfig, ProcessingState, SynthesisResult, VoiceName } from "../types";
import { chunkText } from "../utils/textUtils";
import { decodeAudioData, mergeAudioBuffers } from "../utils/audioEngine";
import { generateCacheKey, getCachedAudio, cacheAudio } from "../utils/cache";

// Optimization Constants
const CHUNK_SIZE_WORDS = 300;
const SILENCE_GAP_SECONDS = 0.4;
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const TRANSLATION_MODEL = "gemini-2.5-flash";
const CONCURRENCY_LIMIT = 2;
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 30000;

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

export class TTSService {
  private audioContext: AudioContext;

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
      const isRetryable = error.status === 429 || error.status === 500 || error.status === 503 || error.message?.includes('Timeout');
      if (isRetryable && retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return this.withRetry(task, retryCount + 1, signal);
      }
      throw error;
    }
  }

  /**
   * Generates audio for the provided text. 
   * Note: textToProcess should already be translated if necessary.
   */
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

    let completedCount = 0;
    let virtualProgress = 10;

    const updateProgress = (step: string) => {
      const realProgress = 10 + Math.floor((completedCount / totalChunks) * 80);
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
      if (virtualProgress < 92) {
        virtualProgress += (0.8 + Math.random() * 1.2);
        const msgIndex = Math.min(SYNTHESIS_MESSAGES.length - 1, Math.floor((virtualProgress / 95) * SYNTHESIS_MESSAGES.length));
        const baseMsg = SYNTHESIS_MESSAGES[msgIndex];
        updateProgress(baseMsg + (totalChunks > 1 ? ` (Segment ${completedCount + 1}/${totalChunks})` : ""));
      }
    }, 800);

    const audioBuffers: AudioBuffer[] = new Array(totalChunks);
    const queue = chunks.map((chunk, index) => ({ chunk, index }));

    const worker = async () => {
      while (queue.length > 0) {
        const task = queue.shift();
        if (!task) break;
        const { chunk, index } = task;
        try {
          const buffer = await this.withRetry(() => this.fetchChunkAudio(chunk, config.voice), 0, signal);
          audioBuffers[index] = buffer;
          completedCount++;
          updateProgress(`Segment ${completedCount}/${totalChunks} synthesized`);
        } catch (error: any) {
          clearInterval(interpolationTimer);
          if (signal?.aborted) throw error;
          throw new Error(`Synthesis failed at segment ${index + 1}.`);
        }
      }
    };

    try {
      await Promise.all(Array(Math.min(CONCURRENCY_LIMIT, totalChunks)).fill(null).map(() => worker()));
    } finally {
      clearInterval(interpolationTimer);
    }

    onProgress({ isProcessing: true, progress: 95, currentStep: "Assembling audio stream...", totalChunks, processedChunks: totalChunks });
    const { blob, timings } = await mergeAudioBuffers(audioBuffers, SILENCE_GAP_SECONDS);
    await cacheAudio(cacheKey, { blob, chunks: chunks, timings });
    onProgress({ isProcessing: false, progress: 100, currentStep: "Success!", totalChunks, processedChunks: totalChunks });

    return { audioUrl: URL.createObjectURL(blob), chunks: chunks, timings };
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
    const buffer = await this.fetchChunkAudio("Neural check.", voice);
    const { blob } = await mergeAudioBuffers([buffer], 0);
    return URL.createObjectURL(blob);
  }

  private async fetchChunkAudio(text: string, voiceName: string): Promise<AudioBuffer> {
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
    return await decodeAudioData(audioData, this.audioContext);
  }
}