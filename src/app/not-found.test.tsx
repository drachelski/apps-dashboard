import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  it('shows the message and a way back, without any game icon', () => {
    const { container } = render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: 'Lost in the mountains…' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to games' })).toHaveAttribute('href', '/#apps');
    expect(container.querySelector('img')).toBeNull();
  });
});
