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
    <div className="glass-card rounded-2xl p-1 mb-4 md:mb-6 relative group animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="absolute -inset-[1px] bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 rounded-2xl pointer-events-none opacity-50 transition-opacity duration-500 group-hover:opacity-80"></div>
      
      <div className="relative bg-black/40 rounded-xl overflow-hidden min-h-[200px] md:min-h-[350px] backdrop-blur-sm shadow-inner transition-colors duration-300">
        <div className={`flex ${showTranslationPreview ? 'flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5' : 'flex-col'} h-full transition-all duration-300`}>
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
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 py-2 md:py-2.5 bg-black/60 border-t border-white/5 backdrop-blur-xl flex flex-wrap gap-3 md:gap-4 justify-between items-center text-xs font-mono text-slate-500 pointer-events-none z-10">
            <div className="flex items-center gap-4 md:gap-6">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-cyan-500/50"></span>{wordCount} Words</span>
              {wordCount > 0 && <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-slate-700"></span>Est. {estDisplay}</span>}
            </div>
            {wordCount > 50 && <span className="text-cyan-400/70 bg-cyan-500/5 px-2 py-0.5 rounded-full border border-cyan-500/10">Smart Chunking Ready</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
