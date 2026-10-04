import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AppEntry } from '@/data/types';
import { getAppBySlug } from '@/lib/apps';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('shows banner, icon and title as h1', () => {
    render(<AppHeader app={getAppBySlug('dragon-pet-2')!} />);
    expect(screen.getByAltText('Dragon Pet 2 banner')).toBeInTheDocument();
    expect(screen.getByAltText('Dragon Pet 2 icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Dragon Pet 2' })).toBeInTheDocument();
  });

  it('falls back to a gradient when the app has no banner', () => {
    const app: AppEntry = { ...getAppBySlug('flappy-dragon')!, banner: undefined };
    render(<AppHeader app={app} />);
    expect(screen.getByTestId('banner-fallback')).toBeInTheDocument();
    expect(screen.queryByAltText('Flappy Dragon banner')).not.toBeInTheDocument();
  });
});
