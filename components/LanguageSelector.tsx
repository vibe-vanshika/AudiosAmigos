import React from 'react';
import { LANGUAGES, LanguageCode } from '../types';

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (lang: LanguageCode) => void;
  disabled: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-2 group hover:border-fuchsia-500/20 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(217,70,239,0.1),0_8px_30px_-5px_rgba(0,0,0,0.5)] transition-all duration-300">
      <label className="text-xs font-semibold text-fuchsia-300 uppercase tracking-widest flex items-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        Translation
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as LanguageCode)}
          disabled={disabled}
          className="w-full appearance-none bg-black/20 border border-white/5 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 focus:bg-white/5 hover:bg-white/5 transition-all duration-200 text-sm font-medium cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-300">
              {lang.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
};
