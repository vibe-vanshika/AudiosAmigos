export enum VoiceName {
  Puck = 'puck',
  Charon = 'charon',
  Kore = 'kore',
  Fenrir = 'fenrir',
  Zephyr = 'zephyr',
  Aoede = 'aoede',
  Iapetus = 'iapetus',
  Leda = 'leda',
  Orus = 'orus',
  Umbriel = 'umbriel'
}

export const VOICE_METADATA: Record<VoiceName, { gender: 'Male' | 'Female' }> = {
  [VoiceName.Puck]: { gender: 'Male' },
  [VoiceName.Charon]: { gender: 'Male' },
  [VoiceName.Kore]: { gender: 'Female' },
  [VoiceName.Fenrir]: { gender: 'Male' },
  [VoiceName.Zephyr]: { gender: 'Male' },
  [VoiceName.Aoede]: { gender: 'Female' },
  [VoiceName.Iapetus]: { gender: 'Male' },
  [VoiceName.Leda]: { gender: 'Female' },
  [VoiceName.Orus]: { gender: 'Male' },
  [VoiceName.Umbriel]: { gender: 'Male' },
};

export type LanguageCode = 'original' | 'hi-IN' | 'en-US' | 'en-IN' | 'es-ES' | 'fr-FR' | 'de-DE' | 'ja-JP' | 'zh-CN';

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'original', label: 'Original (No Translation)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
];

export interface TTSConfig {
  voice: VoiceName;
  speed: number;
  language: LanguageCode;
}

export interface ChunkProcessResult {
  chunkId: number;
  text: string;
  audioBuffer: AudioBuffer | null;
  error?: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number; // 0 to 100
  currentStep: string;
  totalChunks: number;
  processedChunks: number;
}

export interface ChunkTiming {
  start: number;
  end: number;
  duration: number;
}

export interface SynthesisResult {
  audioUrl: string;
  chunks: string[];
  timings: ChunkTiming[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  config: TTSConfig;
}