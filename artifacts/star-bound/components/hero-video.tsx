'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroVideo({ poster = '/media/star-bound-hero-poster.jpg' }: { poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [autoplay, setAutoplay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      const shouldPlay = !motion.matches && !document.hidden && !manuallyPaused.current;
      setAutoplay(shouldPlay);
      if (!shouldPlay) video.pause();
      else {
        video.muted = true;
        void video.play().catch(() => setPlaying(false));
      }
    };
    video.addEventListener('canplay', sync);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      video.pause();
      video.removeEventListener('canplay', sync);
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    manuallyPaused.current = !video.paused;
    setAutoplay(!manuallyPaused.current);
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <figure className="hero-film">
      <div className="hero-film-screen">
        {failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="Freckles becoming a golden constellation" />
        ) : (
          <video
            ref={ref}
            autoPlay={autoplay}
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            aria-label="Freckles transform into a glowing constellation"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            data-testid="hero-video"
          >
            <source src="/media/star-bound-hero.mp4" type="video/mp4" />
          </video>
        )}
        {!failed && (
          <button type="button" className="hero-film-control" onClick={toggle} aria-label={playing ? 'Pause hero video' : 'Play hero video'} data-testid="hero-video-toggle">
            {playing ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
      <figcaption>From freckles to constellations <span>Concept visual</span></figcaption>
    </figure>
  );
}