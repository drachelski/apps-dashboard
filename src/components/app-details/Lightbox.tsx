'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useRef, type KeyboardEvent } from 'react';
import { revealTransition } from '@/components/motion/reveal-css';
import { usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';

export interface LightboxImage {
  /** Already resolved with asset() */
  src: string;
  alt: string;
}

export interface LightboxProps {
  images: readonly LightboxImage[];
  /** null = closed */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD_PX = 50;

const navButtonSx = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#fff',
  backgroundColor: 'rgba(0,0,0,0.35)',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.55)' },
} as const;

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const count = images.length;
  const current = index === null ? null : images[index];

  const go = (delta: number) => {
    if (index === null || count === 0) return;
    onIndexChange((index + delta + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <Dialog
      open={current !== null}
      onClose={onClose}
      onKeyDown={onKeyDown}
      fullScreen
      // aria-label on Dialog itself lands on the Modal root; the role="dialog" element is the paper.
      slotProps={{
        paper: {
          'aria-label': 'Screenshot viewer',
          sx: { backgroundColor: 'rgba(10,8,14,0.96)' },
        },
      }}
    >
      {current && index !== null && (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
          }}
          onTouchStart={(e) => {
            // Multi-touch (pinch-zoom) is never a swipe.
            const touch = e.touches.length === 1 ? e.touches[0] : undefined;
            touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 1) touchStart.current = null;
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            const end = e.changedTouches[0];
            touchStart.current = null;
            if (!start || !end) return;
            const dx = end.clientX - start.x;
            const dy = end.clientY - start.y;
            if (Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
              go(dx < 0 ? 1 : -1);
            }
          }}
        >
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            draggable={false}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={revealTransition(reducedMotion, 0, 0.25)}
            style={{
              maxWidth: '92vw',
              maxHeight: '82vh',
              objectFit: 'contain',
              borderRadius: 12,
              userSelect: 'none',
            }}
          />
          <IconButton
            aria-label="Close"
            onClick={onClose}
            sx={{ position: 'absolute', top: 16, right: 16, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            aria-label="Previous screenshot"
            onClick={() => go(-1)}
            sx={{ ...navButtonSx, left: { xs: 4, md: 24 } }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="Next screenshot"
            onClick={() => go(1)}
            sx={{ ...navButtonSx, right: { xs: 4, md: 24 } }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
          <Typography
            aria-live="polite"
            color="text.secondary"
            sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)' }}
          >
            {index + 1} / {count}
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}
