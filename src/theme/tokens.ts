export const colors = {
  bg: '#0f0c14',
  paper: '#1a1522',
  primary: '#8e44c4',
  gold: '#f5b524',
  text: '#f3eef8',
  textMuted: '#b9aec7',
  border: 'rgba(255,255,255,0.08)',
} as const;

export const NAV_HEIGHT = 72;

export const accentGradient = `linear-gradient(90deg, ${colors.primary}, ${colors.gold})`;

export const glass = {
  backgroundColor: 'rgba(26,21,34,0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${colors.border}`,
} as const;

export const gradientText = {
  backgroundImage: accentGradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const;
