import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Reveal } from '@/components/motion/Reveal';
import type { AppEntry } from '@/data/types';

export function AppDescription({ app }: { app: AppEntry }) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {app.description.map((paragraph, i) => (
        <Reveal key={i}>
          <Typography sx={{ fontSize: '1.075rem', lineHeight: 1.75 }}>{paragraph}</Typography>
        </Reveal>
      ))}
      {app.features && app.features.length > 0 && (
        <Reveal>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, mt: 2, mb: 1 }}
          >
            Features
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 3,
              display: 'grid',
              gap: 1,
              '& li::marker': { color: 'secondary.main' },
            }}
          >
            {app.features.map((feature, i) => (
              <Typography component="li" key={i} sx={{ lineHeight: 1.6 }}>
                {feature}
              </Typography>
            ))}
          </Box>
        </Reveal>
      )}
    </Box>
  );
}
