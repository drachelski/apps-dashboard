import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Hero, HERO_SLOGAN } from './Hero';

describe('Hero', () => {
  beforeEach(() => {
    // jsdom has no canvas; EmberBackground only needs a context stub here
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

  it('renders the logo as the page h1, slogan and CTA to the games', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: 'ntwins' })).toBeInTheDocument();
    expect(screen.getByText(HERO_SLOGAN)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore games' })).toHaveAttribute('href', '#apps');
  });

  it('paints the logo (LCP element) without waiting for JS and reserves its size', () => {
    render(<Hero />);
    const logo = screen.getByAltText('ntwins');
    expect(logo.getAttribute('style') ?? '').not.toMatch(/opacity:\s*0/);
    expect(logo).toHaveAttribute('width', '538');
    expect(logo).toHaveAttribute('height', '127');
  });

  it('keeps animated elements visible without JS (data-reveal)', () => {
    render(<Hero />);
    expect(screen.getByText(HERO_SLOGAN).closest('[data-reveal]')).not.toBeNull();
  });
});
