import React, { useState } from 'react';
import { VoiceName, VOICE_METADATA } from '../types';

interface VoiceSelectorProps {
  value: VoiceName;
  onChange: (voice: VoiceName) => void;
  disabled: boolean;
  onPreview: (voice: VoiceName) => Promise<void>;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ value, onChange, disabled, onPreview }) => {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handlePreview = async () => {
    if (isPreviewing) return;
    setIsPreviewing(true);
    try {
      await onPreview(value);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPreviewing(false);
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="glass-card rounded-lg p-4 md:p-5 flex flex-col gap-3 group transition-all duration-300 hover:border-[rgba(244,178,77,0.32)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label className="label-kicker text-[var(--signal-amber)] flex items-center gap-2" htmlFor="voice-model">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v1a7 7 0 0 1-14 0v-1" />
            </svg>
            Voice
          </label>
          <p className="mt-1 text-xs text-[var(--studio-dim)]">{VOICE_METADATA[value].gender} model selected</p>
        </div>
        <button
          onClick={handlePreview}
          disabled={disabled || isPreviewing}
          className="icon-button focus-ring text-[var(--signal-amber)] disabled:opacity-35 disabled:cursor-not-allowed"
          title="Preview selected voice"
          aria-label="Preview selected voice"
        >
          {isPreviewing ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>

      <div className="relative">
        <select
          id="voice-model"
          value={value}
          onChange={(e) => onChange(e.target.value as VoiceName)}
          disabled={disabled}
          className="studio-select focus-ring text-sm font-semibold cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {Object.values(VoiceName).map((voice) => (
            <option key={voice} value={voice} className="bg-[#101311] text-[#f3ead7]">
              {capitalize(voice)} ({VOICE_METADATA[voice].gender})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--studio-muted)]">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
};
