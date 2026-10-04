'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { accentGradient } from '@/theme/tokens';
import { Img } from './Img';

export interface SafeImageProps {
  /** Path inside public/, e.g. '/img/icons/x.webp' — asset() is applied here. */
  src: string;
  alt: string;
  /** First letter is shown when the image fails to load. */
  fallbackLabel: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sx?: SxProps<Theme>;
}

const asArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

export function SafeImage({
  src,
  alt,
  fallbackLabel,
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  sx,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image that failed before hydration never fires onError on the client.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0 && img.currentSrc) setFailed(true);
  }, []);

  if (failed) {
    const decorative = alt === '';
    return (
      <Box
        data-testid="image-fallback"
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : alt}
        aria-hidden={decorative ? true : undefined}
        sx={[
          {
            display: 'grid',
            placeItems: 'center',
            backgroundImage: accentGradient,
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            aspectRatio: width && height ? `${width} / ${height}` : undefined,
          },
          ...asArray(sx),
        ]}
      >
        {fallbackLabel.charAt(0).toUpperCase()}
      </Box>
    );
  }

  return (
    <Img
      ref={imgRef}
      src={asset(src)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
      sx={[{ display: 'block', maxWidth: '100%', height: 'auto' }, ...asArray(sx)]}
    />
  );
}
