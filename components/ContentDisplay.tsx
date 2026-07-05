import React from 'react';
import { LanguageCode } from '../types';
import { SourceTextarea } from './SourceTextarea';
import { TranslationPreviewPanel } from './TranslationPreviewPanel';

interface ContentDisplayProps {
  text: string;
  onTextChange: (text: string) => void;
  isProcessing: boolean;
  translationPreview: string;
  isTranslating: boolean;
  targetLanguage: LanguageCode;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  text,
  onTextChange,
  isProcessing,
  translationPreview,
  isTranslating,
  targetLanguage,
}) => {
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const estSeconds = Math.ceil((wordCount / 150) * 60);
  const estDisplay = estSeconds < 60 ? `${estSeconds}s` : `${Math.floor(estSeconds / 60)}m ${estSeconds % 60}s`;
  const showTranslationPreview = targetLanguage !== 'original';

  return (
    <div className="glass-card rounded-lg mb-4 md:mb-6 relative animate-slide-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
      <div className="h-2 meter-strip border-b border-[var(--studio-line)]" />
      <div className="relative audio-surface min-h-[230px] md:min-h-[380px] transition-colors duration-300">
        <div className={`flex ${showTranslationPreview ? 'flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--studio-line)]' : 'flex-col'} h-full transition-all duration-300`}>
          <SourceTextarea 
            value={text} 
            onChange={onTextChange} 
            disabled={isProcessing} 
            showLabels={showTranslationPreview} 
          />
          {showTranslationPreview && (
            <TranslationPreviewPanel 
              content={translationPreview} 
              isTranslating={isTranslating} 
              language={targetLanguage} 
            />
          )}
        </div>
      </div>
      <div className="px-4 md:px-6 py-3 border-t border-[var(--studio-line)] bg-[rgba(5,6,4,0.66)] flex flex-wrap gap-3 md:gap-5 justify-between items-center text-xs font-mono text-[var(--studio-muted)]">
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-sm bg-[var(--signal-amber)]"></span>{wordCount} words</span>
          {wordCount > 0 && <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-sm bg-[var(--signal-blue)]"></span>{estDisplay} estimated</span>}
        </div>
        {wordCount > 50 && <span className="text-[var(--signal-green)] bg-[rgba(88,214,141,0.08)] px-2.5 py-1 rounded border border-[rgba(88,214,141,0.18)]">Chunking ready</span>}
      </div>
    </div>
  );
};
