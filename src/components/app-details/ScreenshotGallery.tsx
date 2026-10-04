'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useRef, useState } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import type { AppEntry } from '@/data/types';
import { screenshotSrc } from '@/lib/apps';
import { asset } from '@/lib/asset';
import { colors } from '@/theme/tokens';
import { Lightbox } from './Lightbox';

const THUMB_HEIGHT = 360;
// Source proportions: portrait 500×888, landscape 1000×444
const THUMB_WIDTH = { portrait: 203, landscape: 811 } as const;

export function ScreenshotGallery({ app }: { app: AppEntry }) {
  const [index, setIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const shots = useMemo(() => app.screenshots ?? [], [app.screenshots]);
  const images = useMemo(
    () =>
      shots.map((s, i) => ({
        src: asset(screenshotSrc(app.slug, s.file, 'full')),
        alt: `${app.title} screenshot ${i + 1}`,
      })),
    [app.slug, app.title, shots],
  );

  if (shots.length === 0) return null;

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <Box component="section" aria-labelledby="screenshots-title" sx={{ mt: 8 }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            id="screenshots-title"
            variant="h3"
            component="h2"
            sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
          >
            Screenshots
          </Typography>
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton aria-label="Scroll screenshots left" onClick={() => scrollTrack(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton aria-label="Scroll screenshots right" onClick={() => scrollTrack(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
      <Box
        component="ul"
        ref={trackRef}
        sx={{
          listStyle: 'none',
          m: 0,
          py: 1,
          px: { xs: 2, md: 'max(24px, calc((100vw - 1200px) / 2 + 24px))' },
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: { xs: '16px', md: '24px' },
          scrollbarWidth: 'thin',
        }}
      >
        {shots.map((shot, i) => (
          <Box component="li" key={shot.file} sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
            <Box
              component="button"
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open ${images[i].alt}`}
              sx={{
                display: 'block',
                p: 0,
                border: 0,
                background: 'none',
                cursor: 'zoom-in',
                borderRadius: 3,
                overflow: 'hidden',
                '& img': { transition: 'transform .3s' },
                '&:hover img': { transform: 'scale(1.04)' },
                '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: 3 },
              }}
            >
              <SafeImage
                src={screenshotSrc(app.slug, shot.file, 'thumb')}
                alt=""
                fallbackLabel={app.title}
                width={THUMB_WIDTH[shot.orientation]}
                height={THUMB_HEIGHT}
                sx={{ height: { xs: 240, md: THUMB_HEIGHT }, width: 'auto' }}
              />
            </Box>
          </Box>
        ))}
      </Box>
      <Lightbox
        images={images}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </Box>
  );
}
