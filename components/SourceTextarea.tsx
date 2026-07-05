import React, { useRef, useEffect, useState } from 'react';
import { extractTextFromFile } from '../utils/fileUtils';

interface SourceTextareaProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  showLabels: boolean;
}

export const SourceTextarea: React.FC<SourceTextareaProps> = ({ value, onChange, disabled, showLabels }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const text = await extractTextFromFile(file);
      if (text) {
        onChange(text);
      }
    } catch (err: any) {
      alert(err.message || "Error extracting file content");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setShowClearConfirm(false);
  };

  return (
    <div className={`flex flex-col ${showLabels ? 'w-full md:w-1/2' : 'w-full'} relative`}>
      <div className="px-4 md:px-5 py-3 label-kicker text-[var(--studio-muted)] bg-[rgba(5,6,4,0.42)] border-b border-[var(--studio-line)] flex justify-between items-center z-20 min-h-[50px]">
        <span>{showLabels ? 'Original' : 'Source Content'}</span>
        
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".txt,.md,.pdf" 
            className="hidden" 
          />
          
          {!showClearConfirm && (
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isExtracting}
              className="studio-button focus-ring group/import text-xs flex items-center gap-1.5 py-2 px-3 min-h-[36px] text-[var(--signal-blue)] disabled:opacity-35 disabled:cursor-not-allowed"
            >
              {isExtracting ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/import:-translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import
                </>
              )}
            </button>
          )}

          {value.length > 0 && !disabled && !isExtracting && (
            showClearConfirm ? (
              <div className="flex items-center gap-2 bg-[rgba(242,106,95,0.1)] px-3 py-1.5 rounded-lg border border-[rgba(242,106,95,0.26)] animate-slide-up shadow-lg">
                <span className="text-[var(--danger)] text-xs font-black">Reset?</span>
                <button 
                  type="button"
                  onClick={handleConfirmClear}
                  className="text-[var(--studio-paper)] hover:text-[var(--danger)] transition-colors text-xs font-black py-1 px-2 min-h-[32px]"
                >
                  Yes
                </button>
                <button 
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-[var(--studio-muted)] hover:text-[var(--studio-paper)] transition-colors text-xs py-1 px-2 min-h-[32px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="studio-button focus-ring text-[var(--studio-muted)] hover:text-[var(--danger)] text-xs py-2 px-3 cursor-pointer min-h-[36px]"
              >
                Clear
              </button>
            )
          )}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the script here..."
        className="w-full min-h-[230px] md:min-h-[380px] bg-transparent text-base md:text-lg text-[var(--studio-paper)] p-4 md:p-7 focus:outline-none resize-none placeholder:text-[var(--studio-dim)] font-normal leading-relaxed font-sans selection:bg-amber-400/20"
        disabled={disabled || isExtracting}
      />
    </div>
  );
};
