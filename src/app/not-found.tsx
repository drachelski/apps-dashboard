import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ButtonLink } from '@/components/common/ButtonLink';
import { SafeImage } from '@/components/common/SafeImage';

export default function NotFound() {
  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', pt: 12 }}
    >
      <Box>
        <SafeImage
          src="/img/icons/dragon-pet-2.webp"
          alt=""
          fallbackLabel="ntwins"
          width={512}
          height={512}
          sx={{ width: 120, mx: 'auto', mb: 3, borderRadius: 4 }}
        />
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Lost in the mountains…
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          The page you are looking for flew away.
        </Typography>
        <ButtonLink href="/#apps" variant="contained" color="primary">
          Back to games
        </ButtonLink>
      </Box>
    </Container>
  );
}
