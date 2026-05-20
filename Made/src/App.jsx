import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { Heart, Sparkles, Star } from 'lucide-react';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';
import PhotoContainer from './components/PhotoContainer';
import RomanticLetter from './components/RomanticLetter';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const canvasRef = useRef(null);
  
  // Aurora elements refs
  const aurora1Ref = useRef(null);
  const aurora2Ref = useRef(null);
  const aurora3Ref = useRef(null);

  // 📸 FOTOS: Detectadas automáticamente desde src/assets/photos/
  // Solo agrega o quita imágenes (jpg, jpeg, png, webp, gif) en esa carpeta — sin tocar código
  const photoModules = import.meta.glob(
    './assets/photos/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}',
    { eager: true, query: '?url', import: 'default' }
  );
  const fotos = Object.entries(photoModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);

  // 🎵 CANCIONES: Detectadas automáticamente desde src/assets/songs/
  // Solo agrega o quita archivos MP3 de esa carpeta — no hace falta cambiar código
  const songModules = import.meta.glob('./assets/songs/*.mp3', { eager: true, query: '?url', import: 'default' });
  const canciones = Object.entries(songModules)
    .map(([path, url]) => ({
      url,
      name: decodeURIComponent(path.split('/').pop().replace(/\.[^/.]+$/, ''))
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Animate Auroras on Mount
  useEffect(() => {
    if (isLoading) return;

    // Slowly morph and drift the background auroras
    anime({
      targets: aurora1Ref.current,
      translateX: ['-10%', '15%', '-10%'],
      translateY: ['-20%', '10%', '-20%'],
      scale: [1, 1.3, 1],
      duration: 18000,
      easing: 'easeInOutSine',
      loop: true
    });

    anime({
      targets: aurora2Ref.current,
      translateX: ['10%', '-15%', '10%'],
      translateY: ['20%', '-10%', '20%'],
      scale: [1.2, 0.9, 1.2],
      duration: 22000,
      easing: 'easeInOutSine',
      loop: true
    });

    anime({
      targets: aurora3Ref.current,
      translateX: ['-5%', '10%', '-5%'],
      translateY: ['15%', '-15%', '15%'],
      scale: [0.9, 1.2, 0.9],
      duration: 15000,
      easing: 'easeInOutSine',
      loop: true
    });
  }, [isLoading]);

  // Canvas Sparkles Animation Effect
  useEffect(() => {
    if (isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];
    const particleCount = 70;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        opacity: Math.random(),
        opacitySpeed: 0.005 + Math.random() * 0.005,
        glowColor: Math.random() > 0.5 ? 'rgba(236, 72, 153, 0.8)' : 'rgba(168, 85, 247, 0.8)'
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Draw glow back of star
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor.replace('0.8', (p.opacity * 0.3).toString());
        ctx.fill();

        // Draw star core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset if goes off screen
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width;
        }

        // Pulse opacity
        p.opacity += p.opacitySpeed;
        if (p.opacity > 1 || p.opacity < 0.2) {
          p.opacitySpeed = -p.opacitySpeed;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]);

  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden pb-20">
      {/* 1. Loader screen */}
      {isLoading && <Loader onComplete={handleLoaderComplete} />}

      {/* 2. Interactive Background Layer */}
      {!isLoading && (
        <>
          <div className="aurora-bg">
            {/* Morphing Aurora Blurs */}
            <div
              ref={aurora1Ref}
              className="aurora-blur w-[400px] h-[400px] bg-pink-600 rounded-full top-[10%] left-[5%]"
            />
            <div
              ref={aurora2Ref}
              className="aurora-blur w-[500px] h-[500px] bg-purple-700 rounded-full bottom-[10%] right-[10%]"
            />
            <div
              ref={aurora3Ref}
              className="aurora-blur w-[350px] h-[350px] bg-indigo-900 rounded-full top-[40%] left-[30%]"
            />
          </div>
          {/* Canvas Star/Sparkle layer */}
          <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
        </>
      )}

      {/* 3. Audio & Music controls */}
      {!isLoading && (
        <AudioPlayer isUnlocked={isUnlocked} onUnlock={handleUnlock} songs={canciones} />
      )}

      {/* 4. Main romantic birthday layout — solo visible tras el desbloqueo */}
      {!isLoading && (
        <main className="relative z-10 w-full flex flex-col items-center justify-start min-h-screen px-4 pt-16 transition-all duration-1000">
          
          {isUnlocked && (
            <>
              {/* Hero Header */}
              <header className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-semibold uppercase tracking-widest animate__animated animate__fadeInDown mb-4">
                  <Star size={12} fill="currentColor" />
                  Un día de fiesta
                  <Star size={12} fill="currentColor" />
                </div>
                
                <h1 className="font-romantic font-bold text-4xl md:text-7xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200 drop-shadow-[0_0_20px_rgba(236,72,153,0.3)] animate__animated animate__zoomInDown">
                  ¡Feliz Cumpleaños!
                </h1>
                
                <p className="font-handwritten text-5xl md:text-7xl text-pink-400 mt-2 glow-text-romantic animate__animated animate__fadeInUp animate__delay-1s">
                  Madelein
                </p>
              </header>

              {/* Photo Section */}
              <section className="w-full max-w-4xl animate__animated animate__fadeIn animate__delay-1s">
                <PhotoContainer fotos={fotos} />
              </section>

              {/* Romantic message and signature */}
              <section className="w-full max-w-3xl animate__animated animate__fadeIn animate__delay-2s">
                <RomanticLetter isUnlocked={isUnlocked} />
              </section>

              {/* Decorative Floating Hearts */}
              <div className="absolute top-[15%] left-[8%] animate-bounce text-pink-500/20 pointer-events-none hidden md:block">
                <Heart size={32} fill="currentColor" />
              </div>
              <div className="absolute top-[35%] right-[8%] animate-pulse text-purple-500/20 pointer-events-none hidden md:block">
                <Heart size={40} fill="currentColor" />
              </div>
              <div className="absolute bottom-[20%] left-[12%] animate-bounce text-rose-500/20 pointer-events-none hidden md:block">
                <Heart size={28} fill="currentColor" />
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}
