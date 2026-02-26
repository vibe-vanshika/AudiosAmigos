import React, { useRef, useEffect } from 'react';

interface WaveVisualizerProps {
  analyser: AnalyserNode | null;
}

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
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
      gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

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
    <div ref={containerRef} className="w-full h-24 md:h-32 bg-[#020617] relative border-b border-white/5 shadow-xl">
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,22,40,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
    </div>
  );
};
