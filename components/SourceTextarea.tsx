import React, { useRef, useEffect, useState } from 'react';
import { extractTextFromFile } from '../utils/fileUtils';

interface SourceTextareaProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  showLabels: boolean;
  onOpenHistory: () => void;
}

export const SourceTextarea: React.FC<SourceTextareaProps> = ({ value, onChange, disabled, showLabels, onOpenHistory }) => {
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
      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-black/30 border-b border-white/5 flex justify-between items-center z-20 min-h-[44px]">
        <div className="flex items-center gap-3">
          <span>{showLabels ? 'Original' : 'Source Content'}</span>
          {!showLabels && (
             <button 
               onClick={onOpenHistory}
               className="text-[9px] text-slate-600 hover:text-cyan-400 flex items-center gap-1 transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                History
             </button>
          )}
        </div>
        
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
              className="text-cyan-600 hover:text-cyan-400 disabled:opacity-30 transition-colors uppercase tracking-tighter text-[9px] flex items-center gap-1.5 py-1.5 px-2.5 rounded bg-white/5 hover:bg-white/10"
            >
              {isExtracting ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-2 w-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Import
                </>
              )}
            </button>
          )}

          {value.length > 0 && !disabled && !isExtracting && (
            showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 animate-slide-up shadow-lg">
                <span className="text-red-400 text-[8px] font-black">RESET?</span>
                <button 
                  type="button"
                  onClick={handleConfirmClear}
                  className="text-white hover:text-red-400 transition-colors uppercase tracking-tighter text-[9px] font-black"
                >
                  YES
                </button>
                <button 
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-slate-500 hover:text-slate-200 transition-colors uppercase tracking-tighter text-[9px]"
                >
                  NO
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-slate-500 hover:text-red-400 transition-colors uppercase tracking-tighter text-[9px] py-1.5 px-2.5 rounded hover:bg-red-500/5 cursor-pointer"
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
        placeholder="Type, paste, or import a file..."
        className="w-full min-h-[350px] bg-transparent text-lg text-slate-200 p-8 pb-20 focus:outline-none resize-none placeholder:text-slate-800 font-light leading-relaxed font-sans selection:bg-cyan-500/20"
        disabled={disabled || isExtracting}
      />
    </div>
  );
};