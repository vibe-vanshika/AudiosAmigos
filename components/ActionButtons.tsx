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
    <div className="flex justify-center mb-6 md:mb-9 w-full animate-slide-up z-20" style={{ animationDelay: '0.3s' }}>
      {isProcessing ? (
          <button
            onClick={onStop}
            className="focus-ring group relative w-full md:w-auto px-7 py-4 rounded-lg font-bold text-base transition-all duration-200 bg-[rgba(242,106,95,0.12)] text-[var(--danger)] border border-[rgba(242,106,95,0.28)] hover:bg-[rgba(242,106,95,0.18)] hover:border-[rgba(242,106,95,0.46)] flex items-center justify-center gap-3 active:scale-[0.98]"
          >
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-[var(--danger)] opacity-50"></span>
                <span className="relative inline-flex rounded-sm h-3 w-3 bg-[var(--danger)]"></span>
             </span>
             Stop Generation
          </button>
      ) : isEditing ? (
        <button
          onClick={onGenerate}
          disabled={!hasText}
          className={`
            focus-ring group relative w-full md:w-auto px-8 py-4 rounded-lg font-extrabold text-base md:text-lg transition-all duration-200 flex items-center justify-center active:scale-[0.98] overflow-hidden
            ${!hasText
              ? 'bg-[rgba(16,19,17,0.74)] text-[var(--studio-dim)] cursor-not-allowed border border-[var(--studio-line)]'
              : 'text-[#24180a] hover:shadow-[0_0_40px_rgba(244,178,77,0.28)] border border-[rgba(255,248,232,0.2)] animate-glow-pulse'
            }
          `}
        >
            {hasText && (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#f7c76b,#f4b24d_48%,#df7d38)] opacity-100 group-hover:opacity-95 transition-opacity duration-200"></div>
            )}
            
            <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h3l2-7 4 14 2-7h3" /></svg>
                Generate Audio
            </span>
        </button>
      ) : (
        <button
          onClick={onEdit}
          className="studio-button focus-ring w-full md:w-auto px-7 py-3 font-semibold text-base flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Refine Input
        </button>
      )}
    </div>
  );
};
