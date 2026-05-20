import React, { useState, useRef } from 'react';
import { Heart, ChevronRight } from 'lucide-react';

export default function PhotoContainer({ fotos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  // 3D hover tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  const handlePhotoClick = () => {
    if (fotos.length <= 1 || transitioning) return;
    const nextIndex = (currentIndex + 1) % fotos.length;

    setPrevIndex(currentIndex);  // save old image
    setCurrentIndex(nextIndex);  // set new image immediately (it renders below)
    setTransitioning(true);

    // After the CSS transition finishes, clear the old image
    setTimeout(() => {
      setPrevIndex(null);
      setTransitioning(false);
    }, 550);
  };

  if (!fotos || fotos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 glass-romantic rounded-2xl max-w-md mx-auto my-12">
        <p className="text-pink-200 text-center font-light">Ninguna foto cargada aún.</p>
      </div>
    );
  }

  const isMultiple = fotos.length > 1;

  return (
    <div className="flex justify-center items-center py-10 px-4 md:py-16">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        onClick={isMultiple ? handlePhotoClick : undefined}
        className={`relative max-w-xs md:max-w-md w-full glass-romantic p-4 md:p-6 rounded-3xl glow-romantic animate-float transition-all duration-300 select-none ${isMultiple ? 'cursor-pointer' : ''}`}
      >
        {/* Heart badge */}
        <div className="absolute -top-3 -right-3 z-10 p-2.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-white shadow-lg shadow-pink-500/30 animate-pulse">
          <Heart size={20} fill="white" />
        </div>

        {/* Photo Frame — stacked crossfade */}
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 aspect-square md:aspect-[4/3] border border-white/10">
          
          {/* LAYER 1: Previous image (fades OUT) */}
          {prevIndex !== null && (
            <img
              src={fotos[prevIndex]}
              alt={`Madelein - foto ${prevIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: transitioning ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: 1,
              }}
            />
          )}

          {/* LAYER 2: Current image (fades IN or stays at full opacity) */}
          <img
            src={fotos[currentIndex]}
            alt={`Madelein - foto ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: transitioning ? 1 : 1,
              transition: 'opacity 0.5s ease-in-out',
              zIndex: 2,
            }}
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop';
            }}
          />

          {/* Gradient overlay (always on top) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent pointer-events-none"
            style={{ zIndex: 3 }}
          />

          {/* Click hint arrow */}
          {isMultiple && (
            <div
              className="absolute inset-0 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ zIndex: 4 }}
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white border border-white/20">
                <ChevronRight size={20} />
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-center">
          <span className="font-handwritten text-3xl md:text-4xl text-pink-300 glow-text-romantic">
            Feliz Cumpleaños amochito
          </span>
          <p className="text-xs text-pink-200/60 font-light mt-1 uppercase tracking-widest">
            Prometo no molestarte tanto hoy... o bueno, tal vez un poquito sí jsjsjsjs
          </p>
        </div>

        {/* Dot indicator */}
        {isMultiple && (
          <div className="flex justify-center gap-2 mt-4">
            {fotos.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === currentIndex ? '20px' : '8px',
                  height: '8px',
                  background:
                    i === currentIndex
                      ? 'rgba(236,72,153,1)'
                      : 'rgba(236,72,153,0.25)',
                  boxShadow:
                    i === currentIndex
                      ? '0 0 8px rgba(236,72,153,0.7)'
                      : 'none',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
