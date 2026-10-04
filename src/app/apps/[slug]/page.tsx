import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppDescription } from '@/components/app-details/AppDescription';
import { AppHeader } from '@/components/app-details/AppHeader';
import { GooglePlayBadge } from '@/components/app-details/GooglePlayBadge';
import { ScreenshotGallery } from '@/components/app-details/ScreenshotGallery';
import { ButtonLink } from '@/components/common/ButtonLink';
import { getAppBySlug, getApps, getMetaDescription } from '@/lib/apps';
import { asset } from '@/lib/asset';

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
  if (!app) return {};
  const description = getMetaDescription(app);
  return {
    title: app.title,
    description,
    openGraph: {
      title: `${app.title} — ntwins`,
      description,
      images: [asset(app.banner ?? app.icon)],
    },
  };
}

export default async function AppPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return (
    <Box component="article" sx={{ pb: 8 }}>
      <AppHeader app={app} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 4 }}
        >
          <GooglePlayBadge packageId={app.packageId} title={app.title} />
          <ButtonLink href={`/apps/${app.slug}/privacy-policy/`} variant="text" color="inherit">
            Privacy policy
          </ButtonLink>
          <ButtonLink
            href="/#apps"
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
          >
            Back to games
          </ButtonLink>
        </Stack>
        <AppDescription app={app} />
      </Container>
      <ScreenshotGallery app={app} />
    </Box>
  );
}
