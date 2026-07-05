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
  const percentage = (currentTime / (duration || 1)) * 100;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(5,6,4,0.98)] via-[rgba(5,6,4,0.9)] to-transparent pt-10 pb-4 px-4 md:px-6">
      <div className="relative w-full h-2 bg-[rgba(243,234,215,0.12)] rounded mb-4 cursor-pointer group border border-[rgba(243,234,215,0.1)]">
        <div
          className="absolute top-0 left-0 h-full bg-[linear-gradient(90deg,var(--signal-orange),var(--signal-amber))] shadow-[0_0_12px_rgba(244,178,77,0.42)] rounded transition-[width] duration-100"
          style={{ width: `${percentage}%` }}
        ></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm bg-[var(--studio-paper)] shadow-[0_0_10px_rgba(244,178,77,0.64)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
        />
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute -inset-y-3 inset-x-0 w-full h-[calc(100%+24px)] opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={onTogglePlay}
            className="focus-ring w-12 h-12 rounded-lg bg-[var(--signal-amber)] text-[#25190b] flex items-center justify-center hover:bg-[#f7c76b] hover:shadow-[0_0_22px_rgba(244,178,77,0.36)] transition-all duration-200 active:scale-[0.97] flex-shrink-0"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <div className="flex flex-col">
            <span className="text-[var(--studio-paper)] font-display text-sm md:text-base font-bold">{formatTime(currentTime)}</span>
            <span className="text-[var(--studio-muted)] text-xs font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 md:gap-2 bg-[rgba(16,19,17,0.82)] rounded-lg px-2.5 md:px-3 py-2.5 border border-[var(--studio-line)] backdrop-blur-md min-h-[44px]">
            <span className="text-xs text-[var(--studio-muted)] font-bold hidden sm:inline">Speed</span>
            <select 
              value={playbackRate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="bg-transparent text-[var(--signal-amber)] text-sm font-mono font-bold focus:outline-none cursor-pointer min-h-[24px]"
            >
              {speeds.map(s => <option key={s} value={s} className="bg-[#101311]">{s}x</option>)}
            </select>
          </div>
          <a
            href={audioUrl}
            download={`audios-amigos-${Date.now()}.wav`}
            className="icon-button focus-ring"
            title="Download audio"
            aria-label="Download audio"
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
