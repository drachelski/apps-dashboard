import { Cinzel_Decorative, Inter } from 'next/font/google';

// Keep preloads minimal: every extra font file competes with the hero logo (LCP) for bandwidth.
export const fontDisplay = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
  display: 'swap',
});

export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
