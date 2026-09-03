'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  animate,
} from 'framer-motion';
import { ArrowRight, Check, Droplets, Leaf, Truck, ShieldCheck } from 'lucide-react';

type Flavor = 'classic' | 'dark';

const FLAVORS: Record<Flavor, { img: string; glow: string; accent: string }> = {
  classic: { img: '/honey-light.png', glow: '#f59e0b', accent: '#fbbf24' },
  dark: { img: '/honey-dark.png', glow: '#b45309', accent: '#d97706' },
};

/* =================================================================== */
/*  Page                                                               */
/* =================================================================== */

export default function Home() {
  const t = useTranslations('HomePage');
  const [flavor, setFlavor] = useState<Flavor>('classic');
  const active = FLAVORS[flavor];

  return (
    <div className="relative w-full overflow-clip bg-[#0b0705] text-[#f5e9d4]">
      {/* Fixed cinematic backdrop for the whole page */}
      <Backdrop glow={active.glow} />
      <HoneyCursor />

      <Hero t={t} flavor={flavor} setFlavor={setFlavor} active={active} />
      <Marquee />
      <Featured t={t} />
      <Quality t={t} />
      <Why t={t} />
      <CtaBanner t={t} />
    </div>
  );
}

/* =================================================================== */
/*  Backdrop — animated warm mesh + liquid-gold goo blobs              */
/* =================================================================== */

function Backdrop({ glow }: { glow: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0b0705]">
      {/* Drifting light mesh */}
      <div
        className="ass-mesh absolute inset-[-20%]"
        style={{
          background: `
            radial-gradient(40% 40% at 25% 30%, ${glow}55 0%, transparent 60%),
            radial-gradient(45% 45% at 78% 25%, #7c2d1244 0%, transparent 60%),
            radial-gradient(50% 50% at 60% 85%, ${glow}33 0%, transparent 65%)`,
          transition: 'background 1.2s ease',
        }}
      />
      {/* Soft ambient honey glows (blurred, no hard edges) */}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="soften" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="55" />
          </filter>
          <radialGradient id="gooFill" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>
        <g filter="url(#soften)" fill="url(#gooFill)">
          {[
            { cx: '20%', cy: '55%', r: 60, d: 9 },
            { cx: '85%', cy: '45%', r: 55, d: 11 },
            { cx: '88%', cy: '80%', r: 48, d: 8 },
            { cx: '62%', cy: '88%', r: 38, d: 10 },
          ].map((b, i) => (
            <circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              className="ass-float"
              style={{ ['--d' as string]: `${b.d}s`, transformOrigin: `${b.cx} ${b.cy}` }}
            />
          ))}
        </g>
      </svg>
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,#0b0705_100%)]" />
    </div>
  );
}

/* =================================================================== */
/*  Custom trailing honey cursor (desktop / fine pointer only)         */
/* =================================================================== */

function HoneyCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0 -ml-16 -mt-16 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.28),transparent_70%)] blur-md"
      />
      <motion.div
        style={{ x, y }}
        className="absolute left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_4px_rgba(251,191,36,0.6)]"
      />
    </div>
  );
}

/* =================================================================== */
/*  Hero                                                               */
/* =================================================================== */

function Hero({
  t,
  flavor,
  setFlavor,
  active,
}: {
  t: ReturnType<typeof useTranslations>;
  flavor: Flavor;
  setFlavor: (f: Flavor) => void;
  active: (typeof FLAVORS)[Flavor];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const jarY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // 3D tilt driven by pointer
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const onJarMove = (e: ReactPointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltX.set(py * -22);
    tiltY.set(px * 28);
  };
  const onJarLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      ref={ref}
      className="ass-grain relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden"
    >
      {/* Honey drips from top */}
      {[15, 42, 68, 85].map((left, i) => (
        <span
          key={left}
          className="ass-drip absolute top-0 z-0 w-[3px] rounded-full bg-gradient-to-b from-transparent via-amber-400/70 to-amber-500"
          style={{ left: `${left}%`, height: '120px', ['--d' as string]: `${5 + i}s`, ['--delay' as string]: `${i * 1.3}s` }}
        />
      ))}

      {/* Rotated editorial side label */}
      <span className="absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-[0.5em] text-amber-200/40 lg:block rtl:right-4 rtl:left-auto">
        Asseli · Est. Cairo
      </span>

      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-12 md:px-12">
        {/* Copy */}
        <motion.div style={{ y: copyY }} className="order-2 md:order-1 md:col-span-6 lg:col-span-5">
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              {t('badge')}
            </span>
          </FadeIn>

          <h1 className="mt-6 text-6xl font-bold leading-[0.9] tracking-tight rtl:leading-[1.1] sm:text-7xl lg:text-8xl">
            <KineticLine text={t('headingLine1')} />
            <span className="ass-shimmer block">
              <KineticLine text={t('headingLine2')} delay={0.25} />
            </span>
          </h1>

          <FadeIn delay={0.5}>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-amber-100/70">{t('description')}</p>
          </FadeIn>

          <FadeIn delay={0.65}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 font-semibold text-[#2a1608] shadow-[0_10px_40px_-8px_rgba(245,158,11,0.6)] transition-all hover:shadow-[0_14px_48px_-6px_rgba(245,158,11,0.85)]"
                >
                  {t('ctaPrimary')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/lab-analysis"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 px-8 py-4 font-semibold text-amber-50 backdrop-blur-md transition-colors hover:bg-white/5"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  {t('ctaSecondary')}
                </Link>
              </Magnetic>
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-amber-200/15 pt-6">
              {[
                { v: t('statPureValue'), l: t('statPureLabel') },
                { v: t('statLabValue'), l: t('statLabLabel') },
                { v: t('statLocalValue'), l: t('statLocalLabel') },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl font-bold text-amber-50">{s.v}</dt>
                  <dd className="mt-1 text-xs leading-snug text-amber-100/50">{s.l}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </motion.div>

        {/* Jar */}
        <div className="order-1 md:order-2 md:col-span-6 lg:col-span-7">
          <motion.div
            style={{ y: jarY, opacity: fade }}
            className="relative flex h-[340px] items-center justify-center sm:h-[460px] lg:h-[600px]"
            onPointerMove={onJarMove}
            onPointerLeave={onJarLeave}
          >
            {/* Morphing halo */}
            <div
              className="ass-blob ass-pulse absolute h-72 w-72 blur-3xl sm:h-96 sm:w-96"
              style={{ background: `${active.glow}66`, transition: 'background 1.2s ease' }}
            />
            {/* Rotating ring */}
            <motion.div
              className="absolute h-[300px] w-[300px] rounded-full border border-amber-300/15 sm:h-[420px] sm:w-[420px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
            >
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]" />
            </motion.div>

            <div style={{ perspective: 1200 }} className="relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={flavor}
                  src={active.img}
                  alt={flavor === 'classic' ? t('classicAmber') : t('darkForest')}
                  style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
                  transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                  className="relative h-[300px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] sm:h-[400px] lg:h-[520px]"
                  draggable={false}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Flavor switcher */}
          <FadeIn delay={0.4}>
            <div className="mx-auto mt-4 max-w-sm">
              <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/50">
                {t('chooseFlavor')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { key: 'classic', title: t('classicAmber'), sub: t('rawHoney') },
                    { key: 'dark', title: t('darkForest'), sub: t('premiumBlend') },
                  ] as const
                ).map((f) => {
                  const isActive = flavor === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setFlavor(f.key)}
                      className={`flex flex-col items-start rounded-2xl border p-4 text-start backdrop-blur-md transition-all ${
                        isActive
                          ? 'border-amber-400/70 bg-amber-400/10 shadow-[0_8px_30px_-10px_rgba(245,158,11,0.6)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-amber-300/40 hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2 font-semibold text-amber-50">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: FLAVORS[f.key].accent }} />
                        {f.title}
                      </span>
                      <span className="mt-1 text-xs text-amber-100/50">{f.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-100/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-amber-200/30 p-1">
          <span className="h-1.5 w-1 rounded-full bg-amber-300" />
        </div>
      </motion.div>
    </section>
  );
}

/* =================================================================== */
/*  Marquee band                                                       */
/* =================================================================== */

function Marquee() {
  const words = ['RAW', 'UNFILTERED', 'LAB-VERIFIED', 'SINGLE ORIGIN', 'COLD-EXTRACTED', 'CAIRO'];
  const row = [...words, ...words];
  return (
    <div className="relative flex overflow-hidden border-y border-amber-200/10 bg-black/30 py-5 backdrop-blur-sm">
      <div className="ass-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pe-8" style={{ ['--d' as string]: '32s' }}>
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 text-2xl font-bold tracking-tight text-amber-100/25 sm:text-3xl">
            {w}
            <span className="text-amber-400/60">✦</span>
          </span>
        ))}
      </div>
      <div className="ass-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pe-8" style={{ ['--d' as string]: '32s' }} aria-hidden>
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 text-2xl font-bold tracking-tight text-amber-100/25 sm:text-3xl">
            {w}
            <span className="text-amber-400/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* =================================================================== */
/*  Featured                                                           */
/* =================================================================== */

function Featured({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <Section>
      <Header kicker={t('featuredKicker')} title={t('featuredTitle')} desc={t('featuredDesc')} />
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {(
          [
            { key: 'classic', title: t('classicAmber'), sub: t('rawHoney') },
            { key: 'dark', title: t('darkForest'), sub: t('premiumBlend') },
          ] as const
        ).map((f, i) => (
          <Reveal key={f.key} delay={i * 0.1}>
            <Link
              href="/products"
              className="group relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-md transition-all hover:-translate-y-1.5 hover:border-amber-300/40"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-52 opacity-60 blur-3xl transition-opacity group-hover:opacity-100"
                style={{ background: `radial-gradient(50% 100% at 50% 0%, ${FLAVORS[f.key].glow}55, transparent)` }}
              />
              <img
                src={FLAVORS[f.key].img}
                alt={f.title}
                className="relative h-64 w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-105"
                draggable={false}
              />
              <div className="relative mt-8 flex w-full items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-amber-50">{f.title}</h3>
                  <p className="text-sm text-amber-100/50">{f.sub}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
                  {t('featuredView')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* =================================================================== */
/*  Quality (with animated counters)                                   */
/* =================================================================== */

function Quality({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <Section className="border-y border-amber-200/10 bg-black/20">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">
        <Reveal>
          <div className="relative flex items-center justify-center">
            <div className="ass-blob absolute h-72 w-72 bg-amber-500/20 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { n: 100, s: '%', l: t('qualityPoint1') },
                { n: 0, s: '', l: t('qualityPoint2') },
                { n: 3, s: 'rd', l: t('statLabLabel') },
                { n: 1, s: '', l: t('why2Title') },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
                >
                  <div className="text-4xl font-bold text-amber-300">
                    <Counter to={c.n} />
                    {c.s}
                  </div>
                  <p className="mt-2 text-xs leading-snug text-amber-100/55">{c.l}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">{t('qualityKicker')}</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-amber-50 sm:text-4xl">{t('qualityTitle')}</h2>
            <p className="mt-4 max-w-md text-amber-100/60">{t('qualityDesc')}</p>
            <ul className="mt-6 space-y-3">
              {[t('qualityPoint1'), t('qualityPoint2'), t('qualityPoint3')].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-amber-50/90">{p}</span>
                </li>
              ))}
            </ul>
            <Magnetic>
              <Link
                href="/lab-analysis"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-amber-300/40 px-7 py-3 font-semibold text-amber-200 transition-colors hover:bg-amber-400 hover:text-[#2a1608]"
              >
                {t('qualityCta')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* =================================================================== */
/*  Why                                                                */
/* =================================================================== */

function Why({ t }: { t: ReturnType<typeof useTranslations> }) {
  const items = [
    { icon: Droplets, title: t('why1Title'), desc: t('why1Desc') },
    { icon: Leaf, title: t('why2Title'), desc: t('why2Desc') },
    { icon: Truck, title: t('why3Title'), desc: t('why3Desc') },
  ];
  return (
    <Section>
      <Header title={t('whyTitle')} center />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.1}>
            <div className="group h-full rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md transition-colors hover:border-amber-300/40">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 transition-transform group-hover:scale-110">
                <f.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-amber-50">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/55">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* =================================================================== */
/*  CTA banner                                                         */
/* =================================================================== */

function CtaBanner({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <Section>
      <Reveal>
        <div className="ass-grain relative overflow-hidden rounded-[2.5rem] border border-amber-300/20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 px-8 py-16 text-center shadow-[0_30px_80px_-20px_rgba(245,158,11,0.5)] sm:px-16">
          <div
            aria-hidden
            className="ass-blob absolute -left-10 -top-10 h-56 w-56 bg-white/25 blur-2xl"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold text-[#2a1608] sm:text-5xl">
            {t('ctaBannerTitle')}
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-[#42230c]/80">{t('ctaBannerDesc')}</p>
          <Magnetic>
            <Link
              href="/products"
              className="group relative mt-9 inline-flex items-center gap-2 rounded-full bg-[#1a0f06] px-9 py-4 font-semibold text-amber-100 transition-transform hover:scale-105"
            >
              {t('ctaBannerButton')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </Section>
  );
}

/* =================================================================== */
/*  Reusable building blocks                                           */
/* =================================================================== */

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-screen-xl px-6 md:px-12">{children}</div>
    </section>
  );
}

function Header({
  kicker,
  title,
  desc,
  center = false,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <Reveal>
      <div className={center ? 'text-center' : 'max-w-2xl'}>
        {kicker && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">{kicker}</p>}
        <h2 className="mt-3 text-3xl font-bold leading-tight text-amber-50 sm:text-4xl lg:text-5xl">{title}</h2>
        {desc && <p className={`mt-4 text-amber-100/60 ${center ? 'mx-auto max-w-xl' : 'max-w-md'}`}>{desc}</p>}
      </div>
    </Reveal>
  );
}

/** Simple fade-up on mount */
function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Fade-up when scrolled into view */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Kinetic reveal of a line.
 * English: animates character-by-character.
 * Arabic (RTL): letters are cursive/connected, so splitting them breaks the
 * word — animate the whole line as one unit instead.
 */
function KineticLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (isRtl) {
    return (
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: '0.4em' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    );
  }

  const chars = Array.from(text);
  return (
    <span className="inline-block">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: '0.6em', rotateX: -80 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </span>
  );
}

/** Magnetic hover wrapper */
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 15 });
  const y = useSpring(my, { stiffness: 200, damping: 15 });

  const onMove = (e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/** Count up when in view */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{val}</span>;
}
