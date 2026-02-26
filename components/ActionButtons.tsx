import React from 'react';

interface ActionButtonsProps {
  isEditing: boolean;
  isProcessing: boolean;
  hasText: boolean;
  onGenerate: () => void;
  onEdit: () => void;
  onStop: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  isProcessing,
  hasText,
  onGenerate,
  onEdit,
  onStop
}) => {
  return (
    <div className="flex justify-center mb-6 md:mb-10 w-full animate-slide-up z-20" style={{ animationDelay: '0.3s' }}>
      {isProcessing ? (
          <button
            onClick={onStop}
            className="group relative w-full md:w-auto px-8 py-4 rounded-xl md:rounded-full font-bold text-lg tracking-wide transition-all duration-300 bg-red-950/30 text-red-400 border border-red-500/20 hover:bg-red-900/40 hover:border-red-500/40 flex items-center justify-center gap-3"
          >
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
             Stop Generation
          </button>
      ) : isEditing ? (
        <button
          onClick={onGenerate}
          disabled={!hasText}
          className={`
            group relative w-full md:w-auto px-8 py-4 rounded-xl md:rounded-full font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center
            ${!hasText
              ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5'
              : 'text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:border-cyan-500/30 border border-transparent'
            }
          `}
        >
            {hasText && (
                <div className="absolute inset-0 rounded-xl md:rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 opacity-100 group-hover:opacity-90 transition-opacity"></div>
            )}
            
            <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Generate Audio
            </span>
        </button>
      ) : (
        <button
          onClick={onEdit}
          className="w-full md:w-auto px-8 py-3 rounded-xl md:rounded-full font-semibold text-base tracking-wide shadow-lg bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 transition-all hover:border-cyan-500/30 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Refine Input
        </button>
      )}
    </div>
  );
};