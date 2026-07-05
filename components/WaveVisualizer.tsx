import React, { useRef, useEffect } from 'react';

interface WaveVisualizerProps {
  analyser: AnalyserNode | null;
}

const idleBars = [18, 38, 24, 58, 32, 72, 44, 64, 28, 52, 36, 68, 46, 30, 56, 40, 62, 26, 48, 34, 70, 42, 54, 22];

export const WaveVisualizer: React.FC<WaveVisualizerProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(228, 109, 50, 0)');
      gradient.addColorStop(0.35, 'rgba(228, 109, 50, 0.22)');
      gradient.addColorStop(0.7, 'rgba(244, 178, 77, 0.55)');
      gradient.addColorStop(1, 'rgba(243, 234, 215, 0.95)');

      ctx.fillStyle = gradient;
      const usableBins = Math.floor(bufferLength * 0.7);
      const widthScaling = width / usableBins;

      let x = 0;
      for (let i = 0; i < usableBins; i++) {
        const percent = dataArray[i] / 255;
        const barHeight = (percent * percent) * height;
        ctx.fillRect(x, height - barHeight, widthScaling - 1, barHeight);
        x += widthScaling;
      }
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [analyser]);

  return (
    <div ref={containerRef} className="w-full h-28 md:h-36 bg-[var(--studio-black)] relative border-b border-[var(--studio-line)] shadow-xl scanline">
      {!analyser && (
        <div className="absolute inset-x-5 bottom-5 top-5 flex items-end justify-between gap-1 opacity-70">
          {idleBars.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-sm bg-[linear-gradient(180deg,var(--studio-paper),var(--signal-amber)_52%,rgba(228,109,50,0.2))]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(243,234,215,0)_50%,rgba(0,0,0,0.24)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--signal-amber),transparent)] pointer-events-none"></div>
    </div>
  );
};
