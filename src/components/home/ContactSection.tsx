import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Reveal } from '@/components/motion/Reveal';
import { CONTACT_EMAIL } from '@/lib/site';
import { glass, gradientText } from '@/theme/tokens';
import { CopyEmailButton } from './CopyEmailButton';

export function ContactSection() {
  return (
    <Box
      component="section"
      id="contact"
      aria-labelledby="contact-title"
      sx={{ py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="sm">
        <Reveal>
          <Typography id="contact-title" variant="h2" align="center" sx={{ ...gradientText, mb: 4 }}>
            Contact
          </Typography>
          <Box sx={{ ...glass, borderRadius: 4, p: { xs: 3, md: 5 }, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Questions, feedback or partnership ideas? Drop us a line.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Typography
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                variant="h6"
                sx={{
                  color: 'secondary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {CONTACT_EMAIL}
              </Typography>
              <CopyEmailButton email={CONTACT_EMAIL} />
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
