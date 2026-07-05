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
    <div className={`mb-6 p-4 bg-[rgba(242,106,95,0.1)] border border-[rgba(242,106,95,0.28)] text-red-100 rounded-lg flex items-center gap-3 transition-opacity duration-1000 animate-slide-up ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onDismiss}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[var(--danger)] hover:text-red-100 hover:bg-[rgba(242,106,95,0.12)] transition-colors flex-shrink-0 focus-ring"
        aria-label="Dismiss error"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};
