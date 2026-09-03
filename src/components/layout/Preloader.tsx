'use client';

import { useEffect, useState } from 'react';
import { Logo } from './Logo';

/**
 * Full-screen branded loader that stays until the page's resources (images,
 * fonts, etc.) have finished loading, then fades out. It relies on the browser
 * `window.load` event, which fires only once every image currently in the DOM
 * has loaded — so the heavy honey-jar photos are ready before the site is
 * revealed. A safety timeout guarantees it never hangs indefinitely.
 */
export function Preloader() {
  const [done, setDone] = useState(false); // triggers the fade-out
  const [hidden, setHidden] = useState(false); // unmount after the fade

  useEffect(() => {
    const start = Date.now();
    const MIN_MS = 600; // avoid a jarring flash on fast loads

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => setDone(true), wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    // Never trap the user behind the loader.
    const safety = setTimeout(() => setDone(true), 12000);

    return () => {
      window.removeEventListener('load', finish);
      clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const tmo = setTimeout(() => setHidden(true), 700);
    return () => clearTimeout(tmo);
  }, [done]);

  useEffect(() => {
    document.body.style.overflow = hidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0705] transition-opacity duration-700 ${
        done ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div aria-hidden className="ass-pulse pointer-events-none absolute h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative flex flex-col items-center gap-8">
        <div className="ass-pulse">
          <Logo className="h-16 w-52 drop-shadow-[0_2px_12px_rgba(245,158,11,0.35)]" />
        </div>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="ass-load h-full w-1/2 rounded-full bg-gradient-to-r from-amber-300 to-amber-600" />
        </div>
      </div>
    </div>
  );
}
