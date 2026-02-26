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
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-2 group hover:border-violet-500/30 transition-colors">
      <label className="text-xs font-semibold text-violet-300 uppercase tracking-widest flex items-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        Voice Model
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as VoiceName)}
            disabled={disabled}
            className="w-full appearance-none bg-black/20 border border-white/5 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white/5 hover:bg-white/5 transition-all text-sm font-medium cursor-pointer"
          >
            {Object.values(VoiceName).map((voice) => (
              <option key={voice} value={voice} className="bg-slate-900 text-slate-300">
                {capitalize(voice)} ({VOICE_METADATA[voice].gender})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>
        <button
          onClick={handlePreview}
          disabled={disabled || isPreviewing}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
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
    </div>
  );
};