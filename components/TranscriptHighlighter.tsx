import React, { useRef, useEffect } from 'react';

interface TranscriptHighlighterProps {
  generatedChunks: string[];
  activeChunkIndex: number;
  estimatedWordIndex: number;
}

export const TranscriptHighlighter: React.FC<TranscriptHighlighterProps> = ({
  generatedChunks,
  activeChunkIndex,
  estimatedWordIndex
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChunkIndex !== -1 && containerRef.current) {
      const activeElement = containerRef.current.querySelector(`[data-chunk-index="${activeChunkIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeChunkIndex]);

  return (
    <div ref={containerRef} className="w-full bg-slate-900/50 min-h-[250px] md:min-h-[400px] max-h-[60vh] overflow-y-auto p-4 md:p-8 custom-scrollbar text-base md:text-lg leading-loose relative">
      {generatedChunks.map((chunk, cIdx) => {
        const isActiveChunk = cIdx === activeChunkIndex;
        const words = chunk.split(/\s+/);

        return (
          <div
            key={cIdx}
            data-chunk-index={cIdx}
            className={`mb-4 md:mb-8 transition-all duration-500 ease-out ${
              isActiveChunk
                ? 'opacity-100 border-l-2 border-cyan-500/30 pl-4'
                : 'opacity-40 blur-[0.3px]'
            }`}
          >
            {words.map((word, wIdx) => {
              const isCurrentWord = isActiveChunk && wIdx === estimatedWordIndex;
              return (
                <span
                  key={`${cIdx}-${wIdx}`}
                  className={`inline-block mr-1.5 transition-all duration-150 ${
                    isCurrentWord
                      ? 'text-cyan-400 font-semibold tracking-wide scale-[1.02] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                      : 'text-slate-300'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
      <div className="h-16 md:h-24"></div>
    </div>
  );
};
