'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';
import { revealTransition } from './reveal-css';

export interface RevealProps {
  children: ReactNode;
  /** Seconds; use for staggering lists. */
  delay?: number;
  /** Stretch to the parent's height (grid cells). */
  fill?: boolean;
}

export function Reveal({ children, delay = 0, fill = false }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <motion.div
      data-reveal=""
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={revealTransition(reducedMotion, delay)}
      style={fill ? { height: '100%' } : undefined}
    >
      {children}
    </motion.div>
  );
}
