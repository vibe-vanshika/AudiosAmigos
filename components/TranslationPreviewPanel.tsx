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
    <div className="flex flex-col w-full md:w-1/2 bg-[rgba(105,199,240,0.035)]">
      <div className="px-4 md:px-5 py-3 label-kicker text-[var(--signal-blue)] bg-[rgba(5,6,4,0.42)] border-b border-[var(--studio-line)] flex justify-between items-center min-h-[50px] z-20">
        <div className="flex items-center gap-2">
          <span>{language}</span>
          {isTranslating && <span className="animate-pulse text-xs bg-[rgba(105,199,240,0.12)] px-2 py-0.5 rounded border border-[rgba(105,199,240,0.22)]">Syncing</span>}
        </div>
        
        {content && (
          <button 
            onClick={handleCopy}
            className={`studio-button focus-ring text-xs py-2 px-3 min-h-[36px] flex items-center gap-1.5 ${copyFeedback ? 'text-[var(--signal-green)]' : 'text-[var(--signal-blue)] hover:text-[var(--studio-paper)]'}`}
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
      <div className="p-4 md:p-7 text-base md:text-lg text-[var(--studio-paper)] font-normal leading-relaxed min-h-[230px] md:min-h-[380px] whitespace-pre-wrap">
        {isTranslating && !content ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-4 bg-[rgba(243,234,215,0.08)] rounded w-3/4"></div>
            <div className="h-4 bg-[rgba(243,234,215,0.08)] rounded w-full"></div>
            <div className="h-4 bg-[rgba(243,234,215,0.08)] rounded w-5/6"></div>
            <div className="h-4 bg-[rgba(243,234,215,0.08)] rounded w-2/3"></div>
          </div>
        ) : (
          content || <span className="text-[var(--studio-dim)] italic font-mono text-sm">Translation idle</span>
        )}
      </div>
    </div>
  );
};
