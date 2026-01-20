import React from 'react';

interface PlaybackInterfaceProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRateChange: (rate: number) => void;
  audioUrl: string;
}

export const PlaybackInterface: React.FC<PlaybackInterfaceProps> = ({
  currentTime,
  duration,
  isPlaying,
  playbackRate,
  onTogglePlay,
  onSeek,
  onRateChange,
  audioUrl
}) => {
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pt-10 pb-4 px-6">
      <div className="relative w-full h-1.5 bg-slate-800 rounded-full mb-4 cursor-pointer group">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full" 
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        ></div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-all active:scale-95"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <div className="flex flex-col">
            <span className="text-white font-mono text-sm font-bold tracking-widest">{formatTime(currentTime)}</span>
            <span className="text-slate-500 text-xs font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-2 border border-white/5 backdrop-blur-md">
            <span className="text-[10px] uppercase text-slate-400 font-bold">Speed</span>
            <select 
              value={playbackRate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="bg-transparent text-cyan-400 text-sm font-mono font-bold focus:outline-none cursor-pointer"
            >
              {speeds.map(s => <option key={s} value={s} className="bg-slate-900">{s}x</option>)}
            </select>
          </div>
          <a
            href={audioUrl}
            download={`lumina-export-${Date.now()}.wav`}
            className="p-3 rounded-lg bg-slate-800/80 border border-white/5 text-slate-400 hover:text-white transition-all backdrop-blur-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};