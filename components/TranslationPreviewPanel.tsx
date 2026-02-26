import React, { useState } from 'react';
import { LanguageCode } from '../types';

interface TranslationPreviewPanelProps {
  content: string;
  isTranslating: boolean;
  language: LanguageCode;
}

export const TranslationPreviewPanel: React.FC<TranslationPreviewPanelProps> = ({ content, isTranslating, language }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="flex flex-col w-full md:w-1/2 bg-indigo-500/[0.03]">
      <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border-b border-white/5 flex justify-between items-center min-h-[44px] z-20">
        <div className="flex items-center gap-2">
          <span>{language}</span>
          {isTranslating && <span className="animate-pulse text-xs bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/20">Syncing</span>}
        </div>
        
        {content && (
          <button 
            onClick={handleCopy}
            className={`transition-all duration-200 uppercase tracking-tight text-xs py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 min-h-[36px] flex items-center gap-1.5 active:scale-[0.97] ${copyFeedback ? 'text-emerald-400' : 'text-indigo-400 hover:text-white'}`}
          >
            {copyFeedback ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>
      <div className="p-4 md:p-8 text-base md:text-lg text-slate-300 font-light leading-relaxed min-h-[200px] md:min-h-[350px] whitespace-pre-wrap">
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
