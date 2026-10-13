'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const EASE = [0.83, 0, 0.17, 1] as const;

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      className="flex-grow flex flex-col"
      initial={{
        clipPath: 'circle(0% at 50% 42%)',
        opacity: 0.4,
        scale: 1.06,
      }}
      animate={{
        clipPath: 'circle(150% at 50% 42%)',
        opacity: 1,
        scale: 1,
      }}
      transition={{
        clipPath: { duration: 0.85, ease: EASE },
        opacity: { duration: 0.5, ease: 'easeOut' },
        scale: { duration: 0.9, ease: EASE },
      }}
    >
      {children}
    </motion.div>
  );
}
