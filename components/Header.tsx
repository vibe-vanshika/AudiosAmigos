import React from 'react';

interface HeaderProps {
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="w-full max-w-5xl mb-12 flex flex-col items-center text-center animate-slide-up relative mt-6 md:mt-10">
      <div className="flex flex-row items-center justify-center gap-4 md:gap-8 mb-4">
        {/* Integrated Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/30 rounded-2xl blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative p-3.5 bg-gradient-to-br from-slate-900 to-black backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-9 md:w-9 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight flex items-baseline leading-[1.2]">
          <span className="text-white drop-shadow-sm">Audios</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 ml-2 pb-2">Amigos</span>
        </h1>
      </div>

      <div className="flex items-center gap-4 opacity-60">
        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-700"></span>
        <p className="text-slate-400 text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase">
          Neural Audio Engine v2.5
        </p>
        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-700"></span>
      </div>
    </header>
  );
};