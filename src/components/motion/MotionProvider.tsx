'use client';

import { MotionConfig } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

/** reducedMotion="user": transforms are skipped for users with prefers-reduced-motion; opacity still fades. */
export function MotionProvider({ children }: { children: ReactNode }) {
  // Disarms REVEAL_FAILSAFE_CSS: from now on motion controls the reveal animations.
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
