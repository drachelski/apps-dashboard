import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAppBySlug } from '@/lib/apps';
import { AppTile } from './AppTile';

const dp2 = getAppBySlug('dragon-pet-2')!;
const lander = getAppBySlug('interstellar-lander')!;

describe('AppTile', () => {
  it('links to the app page with an accessible name and icon alt', () => {
    render(<AppTile app={dp2} variant="featured" />);
    expect(screen.getByRole('link', { name: 'Dragon Pet 2' })).toHaveAttribute(
      'href',
      '/apps/dragon-pet-2/',
    );
    expect(screen.getByAltText('Dragon Pet 2 icon')).toBeInTheDocument();
  });

  it('shows the Featured badge and tagline only for the featured variant', () => {
    const { unmount } = render(<AppTile app={dp2} variant="featured" />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(
      screen.getByText('Have you ever wondered how to train your dragon?'),
    ).toBeInTheDocument();
    unmount();

    render(<AppTile app={lander} variant="standard" />);
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Interstellar Lander' })).toBeInTheDocument();
  });
});
