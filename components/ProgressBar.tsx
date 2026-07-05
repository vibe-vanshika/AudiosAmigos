import React, { useEffect, useState } from 'react';
import { ProcessingState } from '../types';

interface ProgressBarProps {
  state: ProcessingState;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ state }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (state.isProcessing) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender && !state.isProcessing) {
      // Start exit animation
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 800); // Match CSS animation duration
      return () => clearTimeout(timer);
    }
  }, [state.isProcessing, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={`w-full mb-6 md:mb-8 px-0 md:px-4 ${isExiting ? 'animate-collapse-out' : 'animate-slide-up'}`}>
      <div className="flex justify-between text-xs text-[var(--studio-muted)] mb-2 font-mono">
        <span className="flex items-center gap-2">
            {!isExiting && <span className="w-2 h-2 rounded-sm border-2 border-[var(--signal-amber)] border-t-transparent animate-spin"></span>}
            {isExiting ? <span className="text-[var(--signal-green)]">Generation Complete</span> : state.currentStep}
        </span>
        <span className="text-[var(--signal-amber)]">{Math.round(state.progress)}%</span>
      </div>
      
      <div className="w-full bg-[rgba(16,19,17,0.9)] rounded h-2 overflow-hidden border border-[var(--studio-line)]">
        <div 
          className={`h-full rounded transition-all duration-300 ease-out relative overflow-hidden ${isExiting ? 'bg-[var(--signal-green)]' : 'bg-[linear-gradient(90deg,var(--signal-orange),var(--signal-amber))]'}`}
          style={{ width: `${state.progress}%` }}
        >
          {/* Shimmer effect */}
          {!isExiting && (
             <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
          )}
        </div>
      </div>
      
      {state.totalChunks > 1 && !isExiting && (
        <div className="flex gap-1 mt-3 justify-center">
            {Array.from({ length: state.totalChunks }).map((_, idx) => (
                <div 
                    key={idx}
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                        idx < state.processedChunks 
                            ? 'bg-[var(--signal-green)] w-3'
                            : idx === state.processedChunks
                                ? 'bg-[var(--signal-amber)] w-6 animate-pulse'
                                : 'bg-[rgba(243,234,215,0.12)] w-1'
                    }`}
                />
            ))}
        </div>
      )}
    </div>
  );
};
