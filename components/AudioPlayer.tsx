import React, { useRef, useEffect, useState } from 'react';
import { WaveVisualizer } from './WaveVisualizer';
import { TranscriptHighlighter } from './TranscriptHighlighter';
import { PlaybackInterface } from './PlaybackInterface';

interface AudioPlayerProps {
  audioUrl: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  generatedChunks: string[];
  activeChunkIndex: number;
  estimatedWordIndex: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  audioRef,
  generatedChunks,
  activeChunkIndex,
  estimatedWordIndex
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    const handlers = {
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
      play: () => {
        setIsPlaying(true);
        if (!audioContextRef.current) {
          const AC = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AC();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
      },
      pause: () => setIsPlaying(false),
      ended: () => setIsPlaying(false)
    };

    Object.entries(handlers).forEach(([evt, cb]) => audio.addEventListener(evt, cb));
    return () => Object.entries(handlers).forEach(([evt, cb]) => audio.removeEventListener(evt, cb));
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-slide-up flex flex-col w-full max-w-5xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative">
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" autoPlay />
      <WaveVisualizer analyser={analyserRef.current} />
      <TranscriptHighlighter
        generatedChunks={generatedChunks}
        activeChunkIndex={activeChunkIndex}
        estimatedWordIndex={estimatedWordIndex}
      />
      <PlaybackInterface
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        playbackRate={playbackRate}
        audioUrl={audioUrl}
        onTogglePlay={() => audioRef.current?.[isPlaying ? 'pause' : 'play']()}
        onSeek={(time) => { if (audioRef.current) audioRef.current.currentTime = time; }}
        onRateChange={setPlaybackRate}
      />
    </div>
  );
};