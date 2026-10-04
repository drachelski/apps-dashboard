'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Img } from '@/components/common/Img';
import { revealTransition } from '@/components/motion/reveal-css';
import { asset } from '@/lib/asset';
import { usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';
import { EmberBackground } from './EmberBackground';

export const HERO_SLOGAN = 'Virtual pets & indie games';

// Logo is the LCP element: reveal it with CSS (runs on first paint, no hydration wait, works without JS).
const LOGO_WIDTH = 538;
const LOGO_HEIGHT = 127;
const logoReveal = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 8px); }
`;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Box
      ref={ref}
      component="section"
      aria-label="Intro"
      sx={{
        position: 'relative',
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <motion.div
        style={{ position: 'absolute', inset: 0, y: reducedMotion ? 0 : backgroundY }}
      >
        <EmberBackground />
      </motion.div>

      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '0 24px',
          opacity: reducedMotion ? 1 : contentOpacity,
        }}
      >
        <Typography component="h1" sx={{ m: 0 }}>
          <Img
            src={asset('/img/logo-ntwins.webp')}
            alt="ntwins"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            fetchPriority="high"
            sx={{
              display: 'block',
              width: 'min(80vw, 560px)',
              height: 'auto',
              mx: 'auto',
              animation: `${logoReveal} 1.2s cubic-bezier(0.22, 1, 0.36, 1) both`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          />
        </Typography>
        <motion.div
          data-reveal=""
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(reducedMotion, 0.8, 0.6)}
        >
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mt: 3 }}>
            {HERO_SLOGAN}
          </Typography>
          <Button
            href="#apps"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4, px: 4, color: '#fff', boxShadow: '0 0 32px rgba(142,68,196,0.55)' }}
          >
            Explore games
          </Button>
        </motion.div>
      </motion.div>

      <Box
        component="a"
        href="#apps"
        aria-label="Scroll to games"
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'text.secondary',
          animation: `${bounce} 2s ease-in-out infinite`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        <KeyboardArrowDownIcon fontSize="large" />
      </Box>
    </Box>
  );
}
