import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GooglePlayBadge } from './GooglePlayBadge';

describe('GooglePlayBadge', () => {
  it('opens the Play Store listing in a new tab safely', () => {
    render(<GooglePlayBadge packageId="pl.ntwins.dragon.pet2" title="Dragon Pet 2" />);
    const link = screen.getByRole('link', { name: 'Get Dragon Pet 2 on Google Play' });
    expect(link).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=pl.ntwins.dragon.pet2',
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
