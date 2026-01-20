import React, { useMemo } from 'react';

export const BackgroundDecorations: React.FC = () => {
  // Generate stars with randomized positions and timing
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() > 0.9 ? '3px' : '2px', // Some stars slightly larger
      // Animation duration between 10s and 25s for rarity
      duration: `${10 + Math.random() * 15}s`,
      // Random delay so they don't sync
      delay: `${Math.random() * 20}s`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#050505]">
      
      {/* 1. Base Gradient: Animating Midnight/Charcoal */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1a1b26 0%, #050505 100%)',
        }}
      ></div>

      {/* 2. Nebula / Cloud Dust Layer */}
      {/* Deep Indigo Dust - Bottom Left */}
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #312e81 0%, transparent 70%)',
          animation: 'nebula-breath 15s ease-in-out infinite'
        }}
      ></div>

      {/* Charcoal/Slate Dust - Top Right */}
      <div 
        className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, #1e293b 0%, transparent 70%)',
          animation: 'nebula-breath 20s ease-in-out infinite reverse'
        }}
      ></div>
      
      {/* Faint Cyan Haze - Center (Very subtle) */}
      <div 
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full mix-blend-overlay filter blur-[100px] opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, #0891b2 0%, transparent 60%)',
        }}
      ></div>


      {/* 3. Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: 0, // Starts invisible
            animationName: 'rare-twinkle',
            animationDuration: star.duration,
            animationDelay: star.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      ))}
      
      {/* 4. Film Grain Texture for Analog/Professional Feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] mix-blend-overlay"></div>
    </div>
  );
};