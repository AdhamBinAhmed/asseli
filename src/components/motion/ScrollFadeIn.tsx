'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollFadeIn({ children, className = '', delay = 0 }: ScrollFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.9, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
