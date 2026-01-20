import React, { useState } from 'react';
import { LanguageCode } from '../types';

interface TranslationPreviewPanelProps {
  content: string;
  isTranslating: boolean;
  language: LanguageCode;
  onOpenHistory: () => void;
}

export const TranslationPreviewPanel: React.FC<TranslationPreviewPanelProps> = ({ content, isTranslating, language, onOpenHistory }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 bg-indigo-500/[0.03]">
      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border-b border-white/5 flex justify-between items-center min-h-[44px] z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>{language}</span>
            {isTranslating && <span className="animate-pulse text-[8px] bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/20">Syncing</span>}
          </div>
          <button 
            onClick={onOpenHistory}
            className="text-[9px] text-indigo-400/50 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            History
          </button>
        </div>
        
        {content && (
          <button 
            onClick={handleCopy}
            className={`transition-all uppercase tracking-tighter text-[9px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 ${copyFeedback ? 'text-emerald-400' : 'text-indigo-400 hover:text-white'}`}
          >
            {copyFeedback ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="p-8 text-lg text-slate-300 font-light leading-relaxed min-h-[350px] whitespace-pre-wrap">
        {isTranslating && !content ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
            <div className="h-4 bg-white/5 rounded w-2/3"></div>
          </div>
        ) : (
          content || <span className="text-slate-800 italic font-mono text-sm tracking-tight">Translation engine idle...</span>
        )}
      </div>
    </div>
  );
};