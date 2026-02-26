import React, { useEffect, useState } from 'react';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 7000);
    const dismissTimer = setTimeout(onDismiss, 8000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [message, onDismiss]);

  return (
    <div className={`mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl flex items-center gap-3 transition-opacity duration-1000 animate-slide-up ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onDismiss}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-red-400 hover:text-red-200 hover:bg-red-500/10 transition-colors flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};
