import React from 'react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenApiKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, onOpenApiKey }) => {
  return (
    <header className="w-full max-w-5xl mb-6 md:mb-10 flex items-center justify-between animate-slide-up relative mt-2 md:mt-6">
      <div className="flex flex-row items-center gap-3 md:gap-6">
        <div className="relative group/logo cursor-default">
          <div className="absolute inset-0 bg-cyan-500/30 rounded-2xl blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative p-3 md:p-3.5 bg-gradient-to-br from-slate-900 to-black backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-transform duration-300 group-hover/logo:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 transition-transform duration-300 group-hover/logo:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight flex items-baseline leading-[1.2]">
            <span className="text-white drop-shadow-sm">Audios</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 ml-1.5 md:ml-2">Amigos</span>
          </h1>
          <p className="text-slate-500 text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase opacity-60 hidden sm:block">
            Neural Audio Engine v2.5
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHistory}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-900/50 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-violet-400 hover:border-violet-500/30 hover:scale-105 transition-all duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 outline-none"
          title="Session History"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          onClick={onOpenApiKey}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-900/50 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-105 transition-all duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 outline-none"
          title="API Key Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6a3 3 0 1 0-6 0 3 3 0 0 0 6 0" />
            <path d="M12 9v12m0 0h3m-3 0h-3m4-6h-4" />
          </svg>
        </button>
      </div>
    </header>
  );
};
