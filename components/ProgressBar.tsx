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
    <div className={`w-full mb-8 px-4 ${isExiting ? 'animate-collapse-out' : 'animate-slide-up'}`}>
      <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono tracking-wide">
        <span className="flex items-center gap-2">
            {!isExiting && <span className="w-2 h-2 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></span>}
            {isExiting ? "Generation Complete" : state.currentStep}
        </span>
        <span className="text-cyan-400">{Math.round(state.progress)}%</span>
      </div>
      
      <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-white/5">
        <div 
          className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden ${isExiting ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`}
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
                            ? 'bg-emerald-500 w-3' 
                            : idx === state.processedChunks
                                ? 'bg-cyan-500 w-6 animate-pulse'
                                : 'bg-slate-800 w-1'
                    }`}
                />
            ))}
        </div>
      )}
    </div>
  );
};