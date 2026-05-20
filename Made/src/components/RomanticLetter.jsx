import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

export default function RomanticLetter({ isUnlocked }) {
  const [showText, setShowText] = useState(false);
  const letterRef = useRef(null);
  const containerRef = useRef(null);

  const romanticMessage =
    "No puedo creer que ya pasó otro año y aquí seguimos vivitos xd, no soy muy bueno con las palabras largas jsjsjs, pero por ti hago la excepción. " +
    "Cariño hoy tienes terminantemente prohibido estresarte por la universidad, ¿va? Ya sé que te trae loca y que los parciales orales te ponen súper nerviosa (mi futura profe de inglés :3), pero hoy nada de eso. Ademas yo soy el único que te debe traer loca beibe, grrr jskjsjskjskj. " +
    "Bb quiero que comas bien, para que no se te baje el azúcar y te me desmayes por ahí. ¡come, porfis!. " +
    "Me encantas y me encanta ver cómo te crece tu cabello largo, cómo te ves adulta con tus \"brackets\" y hasta cuando te pones cieguita porque no encuentras tus gafas. " +
    "Eres lindota caliño, y aunque tengas \"memoria de pollito\" y se te olviden las cosas, yo siempre voy a estar aquí para recordártelas... " +
    "Ya un día nos veremos de cerquita, ¿shiii?, Por ahora disfruta mucho tu día y recuerda que estoy aqui para ti, te amo <3";

  useEffect(() => {
    if (isUnlocked) {
      // Trigger reveal of the letter card
      setShowText(true);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (!showText) return;

    // Staggered letter animation using Anime.js
    const lettersAnim = anime({
      targets: '.romantic-letter-char',
      opacity: [0, 1],
      translateY: [15, 0],
      scale: [0.8, 1],
      easing: 'easeOutBack',
      duration: 600,
      delay: anime.stagger(25), // 25ms delay per character
      complete: () => {
        // Trigger heart explosion when typing ends
        triggerHeartExplosion();
      }
    });

    return () => {
      lettersAnim.pause();
    };
  }, [showText]);

  const triggerHeartExplosion = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 30 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Heart colors (pinks, reds, roses)
      const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'];

      // Confetti bursts from different sides
      confetti({
        ...defaults,
        particleCount,
        colors,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        colors,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Split string into elements
  const words = romanticMessage.split(' ');

  return (
    <div
      ref={containerRef}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <div className="relative glass-romantic p-8 md:p-12 rounded-3xl glow-romantic overflow-hidden">
        {/* Floating background details */}
        <div className="absolute top-4 left-4 text-pink-500/10"><Heart size={40} fill="currentColor" /></div>
        <div className="absolute bottom-4 right-4 text-pink-500/10"><Heart size={60} fill="currentColor" /></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Letter Header */}
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-pink-300 animate-spin-slow" />
            <h2 className="font-handwritten text-4xl md:text-5xl text-pink-300 glow-text-romantic">
              Para Madelein
            </h2>
            <Sparkles size={20} className="text-pink-300 animate-spin-slow" />
          </div>

          {/* Letter Body */}
          <div
            ref={letterRef}
            className="text-pink-100 text-center leading-relaxed md:leading-loose text-base md:text-lg font-light tracking-wide font-romantic select-none"
          >
            {showText ? (
              words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-2 mb-1.5">
                  {word.split('').map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className="romantic-letter-char inline-block opacity-0"
                      style={{ transformOrigin: 'center' }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))
            ) : (
              <span className="opacity-40 italic text-sm">Esperando que abras tu regalo...</span>
            )}
          </div>

          {/* Decorative Signature */}
          {showText && (
            <div className="mt-8 animate-fade-in border-t border-pink-500/15 pt-6 w-full text-center">
              <p className="text-xs text-pink-400 uppercase tracking-widest font-sans font-light">Con todo mi amor,</p>
              <p className="font-handwritten text-4xl text-pink-300 mt-2 glow-text-romantic">Tu niño</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
