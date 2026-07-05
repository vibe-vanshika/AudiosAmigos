import React from 'react';

export const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[var(--studio-ink)]">
      <div className="absolute inset-0 signal-grid opacity-[0.18]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(244,178,77,0.14)] to-transparent" />
      <div className="absolute left-0 top-0 h-full w-10 md:w-16 border-r border-[var(--studio-line)] bg-[linear-gradient(180deg,rgba(244,178,77,0.08),rgba(88,214,141,0.04),transparent)]" />
      <div className="absolute right-0 top-0 h-full w-10 md:w-16 border-l border-[var(--studio-line)] bg-[linear-gradient(180deg,rgba(105,199,240,0.08),rgba(244,178,77,0.04),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(5,6,4,0.96),rgba(5,6,4,0))]" />
      <div className="absolute left-0 right-0 top-[72px] h-px bg-[linear-gradient(90deg,transparent,rgba(244,178,77,0.42),transparent)]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-[linear-gradient(180deg,rgba(243,234,215,0.16),transparent_44%)]" />
    </div>
  );
};
