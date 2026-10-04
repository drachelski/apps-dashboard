import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('replaces the build year with the current year from the browser', async () => {
    vi.stubEnv('BUILD_YEAR', '2026');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2031-03-01T12:00:00Z'));

    render(<Footer />);

    expect(await screen.findByText('© 2031 ntwins. All rights reserved.')).toBeInTheDocument();
  });
});
