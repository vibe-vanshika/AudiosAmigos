import React from 'react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenApiKey: () => void;
}

const miniMeters = [12, 22, 16, 30, 18, 26, 14];

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, onOpenApiKey }) => {
  return (
    <header className="w-full mb-5 md:mb-8 animate-slide-up relative mt-1 md:mt-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4 md:gap-5 min-w-0">
          <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 overflow-hidden rounded-lg border border-[rgba(244,178,77,0.32)] bg-[var(--studio-panel)] shadow-[0_16px_38px_rgba(0,0,0,0.35)] scanline">
            <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-1">
              {miniMeters.map((height, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-sm bg-[var(--signal-amber)] shadow-[0_0_14px_rgba(244,178,77,0.32)]"
                  style={{ height }}
                />
              ))}
            </div>
            <div className="absolute left-3 top-3 h-2 w-2 rounded-sm bg-[var(--signal-green)]" />
            <div className="absolute right-3 top-3 h-2 w-5 rounded-sm bg-[rgba(243,234,215,0.24)]" />
          </div>

          <div className="min-w-0">
            <p className="label-kicker text-[var(--signal-amber)]">Voice studio</p>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-none text-[var(--studio-paper)]">
              Audios Amigos
            </h1>
            <p className="mt-2 max-w-xl text-sm md:text-base text-[var(--studio-muted)]">
              Narration desk // synthesis room
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onOpenHistory}
            className="icon-button focus-ring"
            title="Session history"
            aria-label="Open session history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" />
              <path d="M3.05 11a9 9 0 1 1 2.12 6.78" />
              <path d="M3 17v-6h6" />
            </svg>
          </button>
          <button
            onClick={onOpenApiKey}
            className="icon-button focus-ring"
            title="API key settings"
            aria-label="Open API key settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 7a3 3 0 1 0-5.2 2.04" />
              <path d="M9.8 9.04 3 15.84V20h4.16l6.8-6.8" />
              <path d="M15 13h6" />
              <path d="M18 10v6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
