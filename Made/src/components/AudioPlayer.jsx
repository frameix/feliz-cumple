import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Heart, Play, Pause, SkipForward } from 'lucide-react';
import anime from 'animejs';

export default function AudioPlayer({ isUnlocked, onUnlock, songs = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const discRef = useRef(null);
  const discAnimRef = useRef(null);

  const currentSong = songs[currentIndex] ?? null;

  // Play when unlocked
  useEffect(() => {
    if (isUnlocked && audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio play blocked:', err));
    }
  }, [isUnlocked]);

  // When currentIndex changes (skip or auto-next), load and play the new song
  useEffect(() => {
    if (!isUnlocked || !audioRef.current || !currentSong) return;
    audioRef.current.src = currentSong.url;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.log('Audio play blocked:', err));
  }, [currentIndex]);

  // Disc spin animation
  useEffect(() => {
    if (!discRef.current) return;

    if (isPlaying) {
      if (discAnimRef.current) {
        discAnimRef.current.play();
      } else {
        discAnimRef.current = anime({
          targets: discRef.current,
          rotate: '360deg',
          duration: 8000,
          easing: 'linear',
          loop: true,
          autoplay: true,
        });
      }
    } else if (discAnimRef.current) {
      discAnimRef.current.pause();
    }
  }, [isPlaying]);

  // Auto-advance to next song when current ends
  const handleSongEnd = () => {
    if (songs.length > 1) {
      setCurrentIndex(prev => (prev + 1) % songs.length);
    }
  };

  const handleUnlockClick = () => {
    if (onUnlock) onUnlock();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skipNext = () => {
    if (songs.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % songs.length);
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong?.url || ''}
        loop={songs.length <= 1}
        onEnded={handleSongEnd}
        preload="auto"
      />

      {/* BEFORE UNLOCK: Elegant Romantic Card */}
      {!isUnlocked && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 px-4">
          <div className="relative max-w-sm w-full glass-romantic p-8 md:p-10 rounded-[32px] shadow-[0_0_50px_rgba(236,72,153,0.25)] border border-pink-500/25 flex flex-col items-center text-center">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-20 h-20 bg-pink-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative p-4 bg-white/10 rounded-full border border-white/20 shadow-lg text-pink-500 animate-bounce">
                <Heart size={36} fill="currentColor" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-romantic font-bold text-pink-100 tracking-wide glow-text-romantic mb-3">
              Algo especial para ti
            </h2>
            <p className="text-xs md:text-sm font-sans text-pink-200/70 max-w-[260px] leading-relaxed mb-8">
              Madelein, activa la música para dar inicio a tu sorpresa
            </p>

            <button
              onClick={handleUnlockClick}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-500 hover:to-purple-700 rounded-full font-sans font-medium tracking-wider text-sm shadow-[0_5px_25px_rgba(236,72,153,0.35)] hover:shadow-[0_5px_35px_rgba(236,72,153,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-300 border border-pink-400/20 text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play size={16} fill="white" />
              Presionar para comenzar
            </button>
          </div>
        </div>
      )}

      {/* AFTER UNLOCK: Floating minimal Vinyl Controller */}
      {isUnlocked && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2.5 rounded-full border border-pink-500/20 shadow-lg pr-4">

          {/* Vinyl Disc */}
          <button
            onClick={togglePlay}
            className="relative flex items-center justify-center w-12 h-12 focus:outline-none flex-shrink-0 cursor-pointer"
          >
            <div
              ref={discRef}
              className="absolute inset-0 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-md flex items-center justify-center overflow-hidden"
              style={{ backgroundImage: 'repeating-radial-gradient(circle, #222, #222 2px, #111 3px, #111 4px)' }}
            >
              <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-black shadow-inner">
                {isPlaying ? (
                  <Pause size={10} fill="currentColor" className="text-black" />
                ) : (
                  <Play size={10} fill="currentColor" className="text-black ml-0.5" />
                )}
              </div>
            </div>
          </button>

          {/* Song info */}
          <div className="flex flex-col select-none min-w-0">
            <div className="marquee-container">
              <span className="animate-marquee text-xs font-semibold text-pink-300 tracking-wide">
                {currentSong?.name ?? 'Sin canción'}
              </span>
            </div>
            {songs.length > 1 && (
              <span className="text-[10px] text-neutral-500 font-light mt-0.5">
                {currentIndex + 1} / {songs.length}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 ml-1 border-l border-neutral-800 pl-3">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-pink-400 transition-colors p-1"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            {songs.length > 1 && (
              <button
                onClick={skipNext}
                className="text-neutral-400 hover:text-pink-400 transition-colors p-1"
                title="Siguiente canción"
              >
                <SkipForward size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
