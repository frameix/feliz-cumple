import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Heart } from 'lucide-react';

export default function Loader({ onComplete }) {
  const heartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Beating heart animation with Anime.js
    const heartAnim = anime({
      targets: heartRef.current,
      scale: [1, 1.25, 1.05, 1.3, 1],
      easing: 'easeInOutQuad',
      duration: 1200,
      loop: true
    });

    // Fade out container after 3 seconds
    const timeout = setTimeout(() => {
      anime({
        targets: containerRef.current,
        opacity: [1, 0],
        easing: 'easeOutQuad',
        duration: 800,
        complete: () => {
          if (onComplete) onComplete();
        }
      });
    }, 3000);

    return () => {
      heartAnim.pause();
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03001e] text-white"
    >
      <div className="relative flex flex-col items-center">
        {/* Glow effect back of the heart */}
        <div className="absolute w-32 h-32 bg-pink-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        
        <div ref={heartRef} className="relative z-10 text-pink-500 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]">
          <Heart size={80} fill="currentColor" />
        </div>
        
        <h1 className="text-xl md:text-2xl font-romantic tracking-widest text-pink-200 uppercase animate-pulse">
          Preparando algo especial...
        </h1>
        <p className="text-sm font-sans text-pink-400 mt-2 tracking-wide font-light">
          Cargando con mucho amor para ti
        </p>
      </div>
    </div>
  );
}
