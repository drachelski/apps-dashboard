import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { NavBar } from '@/components/layout/NavBar';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { NOSCRIPT_REVEAL_CSS, REVEAL_FAILSAFE_CSS } from '@/components/motion/reveal-css';
import { fontBody, fontDisplay } from '@/theme/fonts';
import { theme } from '@/theme/theme';

export const metadata: Metadata = {
  metadataBase: new URL('https://drachelski.github.io'),
  title: { default: 'ntwins — virtual pets & indie games', template: '%s — ntwins' },
  description: 'Dragon Pet 2, Dragon Pet, Unicorn Pet and other mobile games and apps by ntwins.',
};

export const viewport: Viewport = { themeColor: '#0f0c14' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: `<style>${NOSCRIPT_REVEAL_CSS}</style>` }} />
        <style dangerouslySetInnerHTML={{ __html: REVEAL_FAILSAFE_CSS }} />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MotionProvider>
              <NavBar />
              <main>{children}</main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
