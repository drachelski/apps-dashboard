import Box from '@mui/material/Box';
import { Img } from '@/components/common/Img';
import { playStoreUrl } from '@/lib/apps';
import { asset } from '@/lib/asset';

const BADGE_WIDTH = 646;
const BADGE_HEIGHT = 250;

export function GooglePlayBadge({ packageId, title }: { packageId: string; title: string }) {
  return (
    <Box
      component="a"
      href={playStoreUrl(packageId)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get ${title} on Google Play`}
      sx={{
        display: 'inline-block',
        transition: 'transform .2s',
        '&:hover': { transform: 'translateY(-2px) scale(1.03)' },
        '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
      }}
    >
      <Img
        src={asset('/img/google-play-badge.png')}
        alt=""
        width={BADGE_WIDTH}
        height={BADGE_HEIGHT}
        sx={{ display: 'block', height: 64, width: 'auto' }}
      />
    </Box>
  );
}
