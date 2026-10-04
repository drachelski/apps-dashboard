import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY } from '@/lib/useMediaQueryMatch';
import { mockMatchMedia } from '@/test/matchMedia';
import { EmberBackground } from './EmberBackground';

const fakeContext = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
};

describe('EmberBackground', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      fakeContext as unknown as CanvasRenderingContext2D,
    );
  });

  it('starts the particle animation by default', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    render(<EmberBackground />);
    expect(raf).toHaveBeenCalled();
    expect(screen.getByTestId('ember-canvas')).toBeVisible();
  });

  it('does not animate and hides the canvas with prefers-reduced-motion', () => {
    mockMatchMedia([REDUCED_MOTION_QUERY]);
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    render(<EmberBackground />);
    expect(raf).not.toHaveBeenCalled();
    expect(screen.getByTestId('ember-canvas')).toHaveStyle({ display: 'none' });
  });
});
