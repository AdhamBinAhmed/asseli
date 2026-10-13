'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="relative flex-grow flex flex-col">
      {/* Honey curtain sweep — covers, then wipes upward to reveal the page */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        style={{
          background:
            'linear-gradient(180deg, #1a0f06 0%, #3a2409 45%, #b45309 80%, #f59e0b 100%)',
        }}
      />

      {/* Thin glowing edge trailing the curtain */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[61] h-24"
        initial={{ y: '100vh', opacity: 0.9 }}
        animate={{ y: '-6rem', opacity: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgba(245,158,11,0.55), transparent 70%)',
        }}
      />

      {/* Page content reveal */}
      <motion.div
        className="flex-grow flex flex-col"
        initial={{ opacity: 0, y: 36, scale: 0.985, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
