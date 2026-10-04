'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SafeImage } from '@/components/common/SafeImage';
import { revealTransition } from '@/components/motion/reveal-css';
import { usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';
import type { AppEntry } from '@/data/types';
import { accentGradient, colors } from '@/theme/tokens';

export function AppHeader({ app }: { app: AppEntry }) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <Box component="header" sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1024 / 500',
          maxHeight: '70vh',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, rgba(15,12,20,0.35) 0%, rgba(15,12,20,0) 30%, ${colors.bg} 100%)`,
          },
        }}
      >
        {app.banner ? (
          <SafeImage
            src={app.banner}
            alt={`${app.title} banner`}
            fallbackLabel={app.title}
            width={1024}
            height={500}
            loading="eager"
            fetchPriority="high"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            data-testid="banner-fallback"
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: accentGradient,
              overflow: 'hidden',
            }}
          >
            <SafeImage
              src={app.icon}
              alt=""
              fallbackLabel={app.title}
              sx={{
                width: '120%',
                height: '120%',
                objectFit: 'cover',
                filter: 'blur(40px)',
                opacity: 0.5,
              }}
            />
          </Box>
        )}
      </Box>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, mt: { xs: -6, md: -10 } }}>
        <motion.div
          data-reveal=""
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(reducedMotion, 0, 0.6)}
          style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}
        >
          <SafeImage
            src={app.icon}
            alt={`${app.title} icon`}
            fallbackLabel={app.title}
            width={512}
            height={512}
            loading="eager"
            sx={{
              width: { xs: 96, md: 128 },
              borderRadius: 4,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, pb: 1 }}>
            {app.title}
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
