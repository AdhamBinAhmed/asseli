'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import Image from 'next/image';

const FLOAT_DURATIONS = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];

export default function Home() {
  const t = useTranslations('HomePage');

  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgBerriesRef = useRef<HTMLDivElement>(null);
  const bgBerriesRef = useRef<HTMLDivElement>(null);
  const mainProductRef = useRef<HTMLImageElement>(null);
  const particlesRef = useRef<HTMLImageElement[]>([]);

  const [flavor, setFlavor] = useState<'classic' | 'dark'>('classic');
  const [isSwitching, setIsSwitching] = useState(false);

  const mouse = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const switchSpin = useRef(0);

  useEffect(() => {
    // Initial Setup
    if (bgRef.current) {
      gsap.set(bgRef.current, {
        '--bg-inner': '#d97706', // Amber-500
        '--bg-mid': '#92400e', // Amber-700
        '--bg-outer': '#451a03', // Amber-900
        background: 'radial-gradient(circle at center, var(--bg-inner) 0%, var(--bg-mid) 50%, var(--bg-outer) 100%)'
      });
    }

    // Initialize particle data
    particlesRef.current.forEach((p) => {
      if (!p) return;
      p.dataset.rx = '0';
      p.dataset.ry = '0';
      p.dataset.angle = (Math.random() * 360).toString();
      p.dataset.baseX = '0';
      p.dataset.baseY = '0';
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
      mouse.current.px = e.clientX;
      mouse.current.py = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    let reqId: number;

    const animate = () => {
      const time = Date.now() * 0.001;

      currentMouse.current.x += (mouse.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (mouse.current.y - currentMouse.current.y) * 0.05;

      // Rotate the main 2D product to look 3D
      if (mainProductRef.current) {
        const rotX = currentMouse.current.y * -30;
        const rotY = currentMouse.current.x * 30 + switchSpin.current;
        mainProductRef.current.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.1)`;
      }

      // Parallax containers
      if (fgBerriesRef.current) fgBerriesRef.current.style.transform = `translate(${currentMouse.current.x * 60}px, ${currentMouse.current.y * 60}px)`;
      if (bgBerriesRef.current) bgBerriesRef.current.style.transform = `translate(${currentMouse.current.x * -30}px, ${currentMouse.current.y * -30}px)`;

      // Particles Float and Repel
      if (!isSwitching) {
        particlesRef.current.forEach((particle, i) => {
          if (!particle) return;
          const rect = particle.getBoundingClientRect();
          const px = rect.left + rect.width / 2;
          const py = rect.top + rect.height / 2;

          const diffX = mouse.current.px - px;
          const diffY = mouse.current.py - py;
          const distance = Math.sqrt(diffX * diffX + diffY * diffY);

          let targetRx = 0, targetRy = 0, speedMult = 1;

          if (distance < 400) {
            const force = (400 - distance) / 400;
            targetRx = (diffX / distance) * force * -80;
            targetRy = (diffY / distance) * force * -80;
            speedMult = 1 + force * 5;
          }

          let rx = parseFloat(particle.dataset.rx || '0');
          let ry = parseFloat(particle.dataset.ry || '0');
          let angle = parseFloat(particle.dataset.angle || '0');
          let baseX = parseFloat(particle.dataset.baseX || '0');
          let baseY = parseFloat(particle.dataset.baseY || '0');

          rx += (targetRx - rx) * 0.1;
          ry += (targetRy - ry) * 0.1;
          angle += 0.2 * speedMult;

          particle.dataset.rx = rx.toString();
          particle.dataset.ry = ry.toString();
          particle.dataset.angle = angle.toString();

          const dur = FLOAT_DURATIONS[i % 9];
          const phase = (time + i * 0.7) * (Math.PI * 2 / dur);
          const floatY = Math.sin(phase) * 15;
          const floatAngle = Math.cos(phase) * 6;

          particle.style.transform = `translate(calc(${rx + baseX}px), calc(${ry + baseY}px + ${floatY}px)) rotate(calc(${angle}deg + ${floatAngle}deg))`;
        });
      }

      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    // Bubbles Generator
    const createBubble = () => {
      if (!containerRef.current) return;
      const bubble = document.createElement('div');
      const size = Math.random() * 15 + 5 + 'px';
      bubble.style.width = size;
      bubble.style.height = size;
      bubble.style.background = 'rgba(255,255,255,0.3)';
      bubble.style.borderRadius = '50%';
      bubble.style.position = 'absolute';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.bottom = '-50px';
      bubble.style.pointerEvents = 'none';
      bubble.style.zIndex = '0';

      const duration = Math.random() * 6 + 4;
      bubble.animate([
        { transform: 'translateY(0) translateX(0)', opacity: 0 },
        { opacity: 0.6, offset: 0.1 },
        { opacity: 0.6, offset: 0.9 },
        { transform: 'translateY(-110vh) translateX(30px)', opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'linear',
        fill: 'forwards'
      });

      containerRef.current.appendChild(bubble);
      setTimeout(() => bubble.remove(), duration * 1000);
    };

    const bubbleInterval = setInterval(createBubble, 400);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
      clearInterval(bubbleInterval);
    };
  }, [isSwitching]);

  const switchTheme = (newFlavor: 'classic' | 'dark') => {
    if (isSwitching || newFlavor === flavor) return;
    setIsSwitching(true);

    const targetColors = newFlavor === 'dark' ?
      { inner: '#451a03', mid: '#1c1917', outer: '#0a0a0a' } : // Dark theme
      { inner: '#d97706', mid: '#92400e', outer: '#451a03' };  // Classic theme

    gsap.to(bgRef.current, {
      '--bg-inner': targetColors.inner,
      '--bg-mid': targetColors.mid,
      '--bg-outer': targetColors.outer,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    // Spin main product
    const spinObj = { val: 0, blur: 0 };
    gsap.to(spinObj, {
      val: 360,
      blur: 15,
      duration: 0.6,
      ease: "power2.in",
      onUpdate: () => {
        switchSpin.current = spinObj.val;
        if (mainProductRef.current) mainProductRef.current.style.filter = `blur(${spinObj.blur}px)`;
      },
      onComplete: () => {
        setFlavor(newFlavor); // Instant swap image at peak blur

        gsap.to(spinObj, {
          val: 720,
          blur: 0,
          duration: 1.5,
          ease: "back.out(0.7)",
          onUpdate: () => {
            switchSpin.current = spinObj.val;
            if (mainProductRef.current) mainProductRef.current.style.filter = `blur(${spinObj.blur}px)`;
          },
          onComplete: () => {
            switchSpin.current = 0;
            if (mainProductRef.current) mainProductRef.current.style.filter = 'none';
          }
        });
      }
    });

    // Implode / Explode particles
    let completed = 0;
    particlesRef.current.forEach((particle, i) => {
      if (!particle) return;
      const bW = particle.offsetWidth / 2;
      const bH = particle.offsetHeight / 2;
      const centerX = (window.innerWidth / 2 - particle.offsetLeft - bW);
      const centerY = (window.innerHeight / 2 - particle.offsetTop - bH);

      const startAngle = parseFloat(particle.dataset.angle || '0');
      const currentBaseX = parseFloat(particle.dataset.baseX || '0');
      const currentBaseY = parseFloat(particle.dataset.baseY || '0');

      const nextBaseX = (Math.random() - 0.5) * 300;
      const nextBaseY = (Math.random() - 0.5) * 300;

      gsap.set(particle, { rotation: startAngle, x: currentBaseX, y: currentBaseY });

      const tl = gsap.timeline();
      tl.to(particle, {
        x: centerX, y: centerY, rotation: startAngle + 45, scale: 0.1, opacity: 0,
        duration: 0.5, ease: "power2.in"
      })
        .to(particle, { duration: 0.3 })
        .to(particle, {
          x: nextBaseX, y: nextBaseY, rotation: startAngle + 90, scale: 1, opacity: 1,
          duration: 0.9, ease: "back.out(1.5)",
          onComplete: () => {
            particle.dataset.angle = (startAngle + 90).toString();
            particle.dataset.baseX = nextBaseX.toString();
            particle.dataset.baseY = nextBaseY.toString();
            particle.dataset.rx = '0';
            particle.dataset.ry = '0';

            completed++;
            if (completed === particlesRef.current.length) {
              setIsSwitching(false);
            }
          }
        });
    });
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-y-auto overflow-x-hidden md:overflow-hidden text-white flex items-center justify-center -mt-1" ref={containerRef}>

      {/* Dynamic Background */}
      <div ref={bgRef} className="fixed inset-0 -z-50 transition-all pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch w-full h-full max-w-screen-2xl px-4 md:px-8 z-10 relative pointer-events-none">

        {/* Left Column */}
        <div className="flex flex-col justify-start md:justify-center h-auto md:h-full w-full md:w-1/3 gap-3 md:gap-6 pointer-events-auto z-50 pt-8 md:pt-0">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] rtl:leading-[1.4] drop-shadow-xl" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            <span className="text-white/90 drop-shadow-lg text-stroke">{t('headingLine1')}</span><br />
            {t('headingLine2')}
          </h1>
          <p className="hidden sm:block text-base md:text-lg text-white/90 max-w-sm drop-shadow-md">
            {t('description')}
          </p>
          <div className="mt-1 md:mt-4">
            <Link href="/lab-analysis">
              <button className="flex items-center gap-4 bg-black/50 hover:bg-black/80 text-white rounded-full px-2 py-2 pr-6 font-bold transition-all shadow-xl backdrop-blur-md">
                <span className="bg-amber-400 text-black w-10 h-10 rounded-full flex items-center justify-center"><Plus /></span>
                {t('cta')}
              </button>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 mt-auto pb-8">
            <div className="w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-400"><path d="M12 15L15 18L19 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="flex flex-col drop-shadow-md">
              <span className="text-[10px] tracking-widest text-white/80 uppercase">{t('qualityAssured')}</span>
              <span className="text-sm font-bold uppercase">{t('pureHoney')}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Carousel) */}
        <div className="flex flex-col justify-end md:justify-center items-center md:items-end text-center md:text-right h-auto md:h-full w-full md:w-1/3 z-50 pointer-events-auto pb-20 md:pb-0 mt-auto md:mt-0">
          <div className="flex flex-col gap-4 md:gap-6 items-center md:items-end pb-2 md:pb-8">
            <div className="flex gap-4 md:gap-4">
              <div onClick={() => switchTheme('classic')} className={`cursor-pointer bg-black/20 backdrop-blur-md border ${flavor === 'classic' ? 'border-amber-400 border-2' : 'border-white/20 hover:bg-black/40'} p-2 md:p-4 pt-16 md:pt-16 rounded-2xl md:rounded-3xl flex flex-col items-center w-24 sm:w-28 md:w-32 transition-all relative shadow-xl`}>
                <img src="/honey-light.png" alt={t('classicAmber')} className="absolute -top-16 md:-top-10 drop-shadow-2xl pointer-events-none object-contain w-[60px] md:w-[35px] h-[60px] md:h-[35px]" />
                <span className="font-bold text-[11px] sm:text-xs md:text-sm mt-2 md:mt-2 text-center leading-tight">{t('classicAmber')}</span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-white/70 text-center">{t('rawHoney')}</span>
              </div>
              <div onClick={() => switchTheme('dark')} className={`cursor-pointer bg-black/20 backdrop-blur-md border ${flavor === 'dark' ? 'border-amber-400 border-2' : 'border-white/20 hover:bg-black/40'} p-2 md:p-4 pt-16 md:pt-16 rounded-2xl md:rounded-3xl flex flex-col items-center w-24 sm:w-28 md:w-32 transition-all relative shadow-xl`}>
                <img src="/honey-dark.png" alt={t('darkForest')} className="absolute -top-20 md:-top-12 drop-shadow-2xl pointer-events-none object-contain w-[70px] md:w-[48px] h-[70px] md:h-[48px]" />
                <span className="font-bold text-[11px] sm:text-xs md:text-sm mt-3 md:mt-2 text-center leading-tight">{t('darkForest')}</span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-white/70 text-center">{t('premiumBlend')}</span>
              </div>
            </div>

            <h2 className="hidden md:block text-5xl md:text-6xl font-bold tracking-tight mt-8 drop-shadow-xl leading-[1.1] rtl:leading-[1.4]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              <span className="text-white/90">{t('subheadingLine1')}</span><br />
              {t('subheadingLine2')}
            </h2>
          </div>
        </div>

      </div>

      {/* Main Center Product (3D CSS Trick) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ perspective: '1200px' }}>
        <img
          ref={mainProductRef}
          src={flavor === 'classic' ? '/honey-light.png' : '/honey-dark.png'}
          alt="Main Honey Jar"
          className="w-[156px] sm:w-[216px] md:w-[420px] lg:w-[540px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] absolute top-[48%] md:top-1/2 left-1/2"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </div>

      {/* Parallax Background Honeycombs */}
      <div ref={bgBerriesRef} className="hidden md:block absolute inset-0 pointer-events-none z-10">
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[6] = el }} className="absolute top-[20%] left-[40%] w-24 opacity-60 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[7] = el }} className="absolute top-[50%] left-[55%] w-20 opacity-50 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[8] = el }} className="absolute top-[70%] left-[30%] w-28 opacity-40 drop-shadow-2xl" alt="" />
      </div>

      {/* Parallax Foreground Honeycombs */}
      <div ref={fgBerriesRef} className="hidden md:block absolute inset-0 pointer-events-none z-40">
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[0] = el }} className="absolute top-[25%] left-[25%] w-40 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[1] = el }} className="absolute top-[60%] left-[42%] w-24 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[2] = el }} className="absolute top-[30%] left-[62%] w-48 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[3] = el }} className="absolute top-[15%] left-[55%] w-32 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[4] = el }} className="absolute top-[75%] left-[20%] w-28 drop-shadow-2xl" alt="" />
        <img src="/honeycomb.png" ref={el => { if (el) particlesRef.current[5] = el }} className="absolute top-[45%] left-[75%] w-36 drop-shadow-2xl" alt="" />
      </div>

    </div>
  );
}
