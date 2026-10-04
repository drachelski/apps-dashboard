'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { keyframes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion, useSpring } from 'motion/react';
import NextLink from 'next/link';
import type { PointerEvent } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import type { AppEntry } from '@/data/types';
import { getTagline } from '@/lib/apps';
import {
  FINE_POINTER_QUERY,
  useMediaQueryMatch,
  usePrefersReducedMotion,
} from '@/lib/useMediaQueryMatch';
import { colors, glass } from '@/theme/tokens';

export type TileVariant = 'featured' | 'hero' | 'standard';

const MAX_TILT_DEG = 6;

const kenBurns = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.08); }
`;

const clamp2 = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
} as const;

export function AppTile({ app, variant }: { app: AppEntry; variant: TileVariant }) {
  const finePointer = useMediaQueryMatch(FINE_POINTER_QUERY);
  const reducedMotion = usePrefersReducedMotion();
  const tiltEnabled = finePointer && !reducedMotion;
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const isLarge = variant !== 'standard';
  const isFeatured = variant === 'featured';

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 2 * MAX_TILT_DEG);
    rotateX.set(-py * 2 * MAX_TILT_DEG);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900, height: '100%' }}
      whileTap={{ scale: 0.97 }}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <Box
        component={NextLink}
        href={`/apps/${app.slug}/`}
        aria-label={app.title}
        sx={{
          ...glass,
          position: 'relative',
          display: 'flex',
          alignItems: isLarge ? 'flex-end' : 'center',
          justifyContent: isLarge ? 'flex-start' : 'center',
          height: '100%',
          p: isLarge ? { xs: 2, md: 3 } : 2,
          borderRadius: 4,
          overflow: 'hidden',
          color: 'text.primary',
          textDecoration: 'none',
          transition: 'box-shadow .3s, border-color .3s',
          '&:hover': {
            borderColor: colors.primary,
            boxShadow: `0 0 0 1px ${colors.primary}, 0 12px 40px rgba(142,68,196,0.45)`,
          },
          '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: 3 },
        }}
      >
        {isLarge && app.banner && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(15,12,20,0.95) 0%, rgba(15,12,20,0.45) 55%, rgba(15,12,20,0) 100%)',
              },
            }}
          >
            <SafeImage
              src={app.banner}
              alt=""
              fallbackLabel={app.title}
              width={1024}
              height={500}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                animation: `${kenBurns} 20s ease-in-out infinite alternate`,
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: isLarge ? 'row' : 'column',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            textAlign: isLarge ? 'left' : 'center',
          }}
        >
          <SafeImage
            src={app.icon}
            alt={`${app.title} icon`}
            fallbackLabel={app.title}
            width={512}
            height={512}
            sx={{
              width: isFeatured
                ? { xs: 64, md: 96 }
                : isLarge
                  ? { xs: 56, md: 72 }
                  : { xs: 72, md: 96 },
              flexShrink: 0,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            {isFeatured && (
              <Chip
                label="Featured"
                size="small"
                color="secondary"
                sx={{ mb: 1, fontWeight: 600 }}
              />
            )}
            <Typography
              component="h3"
              sx={{
                ...clamp2,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                lineHeight: 1.2,
                overflowWrap: 'anywhere',
                fontSize: isFeatured
                  ? { xs: '1.5rem', md: '2.25rem' }
                  : isLarge
                    ? { xs: '1.2rem', md: '1.5rem' }
                    : { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              {app.title}
            </Typography>
            {isFeatured && (
              <Typography color="text.secondary" sx={{ ...clamp2, mt: 1 }}>
                {getTagline(app)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
