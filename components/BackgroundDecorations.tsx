import React, { useMemo, useState, useEffect } from 'react';

export const BackgroundDecorations: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsMobile(mobileQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);

    const handleMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mobileQuery.addEventListener('change', handleMobile);
    motionQuery.addEventListener('change', handleMotion);
    return () => {
      mobileQuery.removeEventListener('change', handleMobile);
      motionQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  const starCount = isMobile ? 20 : 40;

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() > 0.9 ? '3px' : '2px',
      duration: `${10 + Math.random() * 15}s`,
      delay: `${Math.random() * 20}s`
    }));
  }, [starCount]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
        <div 
          className="absolute inset-0 opacity-80"
          style={{ background: 'radial-gradient(circle at 50% 50%, #1a1b26 0%, #050505 100%)' }}
        ></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
      
      <div 
        className="absolute inset-0 opacity-80"
        style={{ background: 'radial-gradient(circle at 50% 50%, #1a1b26 0%, #050505 100%)' }}
      ></div>

      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #312e81 0%, transparent 70%)',
          animation: 'nebula-breath 15s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      ></div>

      <div 
        className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, #1e293b 0%, transparent 70%)',
          animation: 'nebula-breath 20s ease-in-out infinite reverse',
          willChange: 'transform, opacity',
        }}
      ></div>
      
      <div 
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full mix-blend-overlay filter blur-[100px] opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 60%)' }}
      ></div>

      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: 0,
            animationName: 'rare-twinkle',
            animationDuration: star.duration,
            animationDelay: star.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] mix-blend-overlay"></div>
    </div>
  );
};
