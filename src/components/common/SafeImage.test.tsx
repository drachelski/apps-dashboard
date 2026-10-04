import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SafeImage } from './SafeImage';

describe('SafeImage', () => {
  it('prefixes the base path', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/apps-dashboard');
    render(<SafeImage src="/img/icons/x.webp" alt="X icon" fallbackLabel="X" />);
    expect(screen.getByAltText('X icon')).toHaveAttribute('src', '/apps-dashboard/img/icons/x.webp');
  });

  it('renders intrinsic width/height attributes so the browser reserves space', () => {
    render(<SafeImage src="/img/a.webp" alt="A" fallbackLabel="A" width={512} height={256} />);
    const img = screen.getByAltText('A');
    expect(img).toHaveAttribute('width', '512');
    expect(img).toHaveAttribute('height', '256');
  });

  it('renders an initial-letter fallback when the image fails', () => {
    render(<SafeImage src="/img/missing.webp" alt="Dragon icon" fallbackLabel="dragon" />);
    fireEvent.error(screen.getByAltText('Dragon icon'));
    const fallback = screen.getByTestId('image-fallback');
    expect(fallback).toHaveTextContent('D');
    expect(fallback).toHaveAttribute('aria-label', 'Dragon icon');
    expect(screen.queryByAltText('Dragon icon')).not.toBeInTheDocument();
  });

  it('hides the fallback from assistive tech for decorative images', () => {
    render(<SafeImage src="/img/missing.webp" alt="" fallbackLabel="X" />);
    fireEvent.error(screen.getByRole('presentation', { hidden: true }));
    expect(screen.getByTestId('image-fallback')).toHaveAttribute('aria-hidden', 'true');
  });
});
