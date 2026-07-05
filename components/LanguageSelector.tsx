import React from 'react';
import { LANGUAGES, LanguageCode } from '../types';

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (lang: LanguageCode) => void;
  disabled: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, disabled }) => {
  const selectedLanguage = LANGUAGES.find((lang) => lang.code === value)?.label ?? value;

  return (
    <div className="glass-card rounded-lg p-4 md:p-5 flex flex-col gap-3 group transition-all duration-300 hover:border-[rgba(105,199,240,0.3)]">
      <div>
        <label className="label-kicker text-[var(--signal-blue)] flex items-center gap-2" htmlFor="target-language">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10" />
          </svg>
          Language
        </label>
        <p className="mt-1 text-xs text-[var(--studio-dim)]">{selectedLanguage}</p>
      </div>

      <div className="relative">
        <select
          id="target-language"
          value={value}
          onChange={(e) => onChange(e.target.value as LanguageCode)}
          disabled={disabled}
          className="studio-select focus-ring text-sm font-semibold cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-[#101311] text-[#f3ead7]">
              {lang.label}
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
