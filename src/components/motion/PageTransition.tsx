'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Gentle, buttery ease-out — no overshoot, settles softly.
const EASE = [0.25, 0.1, 0.25, 1] as const;

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      className="flex-grow flex flex-col"
      // transform + opacity only → fully GPU-composited, no layout/paint jank
      initial={{ opacity: 0, y: 16, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        opacity: { duration: 0.45, ease: 'easeOut' },
        y: { duration: 0.65, ease: EASE },
        scale: { duration: 0.65, ease: EASE },
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
