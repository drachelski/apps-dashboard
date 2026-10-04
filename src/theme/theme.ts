'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { colors, NAV_HEIGHT } from './tokens';

const display = 'var(--font-display), Georgia, serif';

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.primary },
    secondary: { main: colors.gold },
    background: { default: colors.bg, paper: colors.paper },
    text: { primary: colors.text, secondary: colors.textMuted },
    divider: colors.border,
  },
  typography: {
    fontFamily: 'var(--font-body), system-ui, -apple-system, sans-serif',
    h1: { fontFamily: display, fontWeight: 700, letterSpacing: '0.01em' },
    h2: { fontFamily: display, fontWeight: 700 },
    h3: { fontFamily: display, fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        '@media (prefers-reduced-motion: reduce)': { html: { scrollBehavior: 'auto' } },
        body: {
          backgroundColor: colors.bg,
          backgroundImage: 'radial-gradient(ellipse at top, rgba(142,68,196,0.12), transparent 60%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '[id]': { scrollMarginTop: `${NAV_HEIGHT + 16}px` },
        '::selection': { backgroundColor: colors.primary, color: colors.text },
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export const theme = responsiveFontSizes(baseTheme);
