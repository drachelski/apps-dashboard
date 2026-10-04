import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/common/ButtonLink';
import { PrivacyPolicy } from '@/components/privacy/PrivacyPolicy';
import { getAppBySlug, getApps } from '@/lib/apps';
import { glass, NAV_HEIGHT } from '@/theme/tokens';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getApps().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  return app ? { title: `${app.title} Privacy Policy` } : {};
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return (
    <Container maxWidth="md" sx={{ pt: `${NAV_HEIGHT + 32}px`, pb: 8 }}>
      <ButtonLink
        href={`/apps/${app.slug}/`}
        variant="outlined"
        color="inherit"
        startIcon={<ArrowBackIcon />}
      >
        Back to {app.title}
      </ButtonLink>
      <Box sx={{ ...glass, borderRadius: 4, p: { xs: 3, md: 5 }, mt: 3 }}>
        <PrivacyPolicy appTitle={app.title} />
      </Box>
    </Container>
  );
}
