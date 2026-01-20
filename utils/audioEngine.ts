import { ChunkTiming } from "../types";

/**
 * Decodes a base64 string (raw PCM) into an AudioBuffer.
 * Gemini 2.5 TTS returns raw 16-bit PCM at 24kHz.
 */
export const decodeAudioData = async (
  base64String: string,
  audioContext: AudioContext,
  sampleRate: number = 24000
): Promise<AudioBuffer> => {
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // CRITICAL FIX: Ensure the buffer length is a multiple of 2 for Int16Array
  // Raw PCM data from APIs can occasionally have trailing bytes or truncation
  let bufferToUse = bytes.buffer;
  if (bytes.length % 2 !== 0) {
    console.warn("PCM data length is odd, slicing last byte for Int16 alignment");
    bufferToUse = bytes.buffer.slice(0, bytes.length - 1);
  }
  
  const pcm16 = new Int16Array(bufferToUse);
  
  const numChannels = 1; // Gemini TTS is mono
  const frameCount = pcm16.length;
  
  const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  // Convert 16-bit integer to Float32 [-1.0, 1.0]
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = pcm16[i] / 32768.0;
  }
  
  return buffer;
};

/**
 * Merges multiple AudioBuffers into a single WAV Blob using direct PCM concatenation.
 */
export const mergeAudioBuffers = async (
  buffers: AudioBuffer[],
  gapSeconds: number
): Promise<{ blob: Blob; timings: ChunkTiming[] }> => {
  if (buffers.length === 0) {
    throw new Error("No audio buffers to merge.");
  }

  const sampleRate = buffers[0].sampleRate;
  const gapSamples = Math.floor(gapSeconds * sampleRate);
  
  let totalSamples = 0;
  const timings: ChunkTiming[] = [];
  
  for (let i = 0; i < buffers.length; i++) {
    const buf = buffers[i];
    const length = buf.length;
    
    timings.push({
      start: totalSamples / sampleRate,
      end: (totalSamples + length) / sampleRate,
      duration: buf.duration
    });

    totalSamples += length;
    if (i < buffers.length - 1) {
      totalSamples += gapSamples;
    }
  }

  const resultFloat32 = new Float32Array(totalSamples);
  
  let offset = 0;
  for (let i = 0; i < buffers.length; i++) {
    const chunkData = buffers[i].getChannelData(0);
    resultFloat32.set(chunkData, offset);
    offset += chunkData.length + gapSamples;
  }

  const blob = encodeWAV(resultFloat32, sampleRate);
  return { blob, timings };
};

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  const pcm16 = new Int16Array(buffer, 44, samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}