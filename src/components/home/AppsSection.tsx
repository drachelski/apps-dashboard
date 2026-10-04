import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Reveal } from '@/components/motion/Reveal';
import { getHeroApps, getStandardApps } from '@/lib/apps';
import { gradientText } from '@/theme/tokens';
import { AppTile, type TileVariant } from './AppTile';

const SPAN: Record<TileVariant, { gridColumn: string; gridRow?: string }> = {
  featured: { gridColumn: 'span 2', gridRow: 'span 2' },
  hero: { gridColumn: 'span 2' },
  standard: { gridColumn: 'span 1' },
};

const STAGGER_S = 0.06;

export function AppsSection() {
  const tiles = [
    ...getHeroApps().map((app, i) => ({
      app,
      variant: (i === 0 ? 'featured' : 'hero') as TileVariant,
    })),
    ...getStandardApps().map((app) => ({ app, variant: 'standard' as TileVariant })),
  ];

  return (
    <Box component="section" id="apps" aria-labelledby="apps-title" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Reveal>
          <Typography
            id="apps-title"
            variant="h2"
            align="center"
            sx={{ ...gradientText, mb: { xs: 4, md: 6 } }}
          >
            Apps &amp; Games
          </Typography>
        </Reveal>
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            p: 0,
            m: 0,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            gridAutoRows: { xs: '180px', sm: '200px', lg: '220px' },
            gridAutoFlow: 'dense',
            gap: { xs: 2, md: 3 },
          }}
        >
          {tiles.map(({ app, variant }, i) => (
            <Box component="li" key={app.slug} sx={SPAN[variant]}>
              <Reveal delay={Math.min(i, 10) * STAGGER_S} fill>
                <AppTile app={app} variant={variant} />
              </Reveal>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
