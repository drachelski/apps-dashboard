import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAppBySlug } from '@/lib/apps';
import { AppDescription } from './AppDescription';

describe('AppDescription', () => {
  it('renders paragraphs and the features list', () => {
    render(<AppDescription app={getAppBySlug('dragon-pet-2')!} />);
    expect(screen.getByText(/Please note: this is completely free game/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(18);
  });

  it('omits the features section when there are none', () => {
    render(<AppDescription app={getAppBySlug('dragon-pet')!} />);
    expect(screen.queryByRole('heading', { name: 'Features' })).not.toBeInTheDocument();
  });
});
