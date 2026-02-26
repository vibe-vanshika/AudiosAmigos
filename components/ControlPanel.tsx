import React from 'react';
import { TTSConfig, VoiceName, LanguageCode } from '../types';
import { VoiceSelector } from './VoiceSelector';
import { LanguageSelector } from './LanguageSelector';

interface ControlPanelProps {
  config: TTSConfig;
  onChange: (newConfig: TTSConfig) => void;
  disabled: boolean;
  onPreviewRequest: (voice: VoiceName) => Promise<void>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, disabled, onPreviewRequest }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <VoiceSelector
        value={config.voice}
        onChange={(voice) => onChange({ ...config, voice })}
        disabled={disabled}
        onPreview={onPreviewRequest}
      />
      <LanguageSelector
        value={config.language}
        onChange={(language) => onChange({ ...config, language })}
        disabled={disabled}
      />
    </div>
  );
};