import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppsSection } from './AppsSection';

describe('AppsSection', () => {
  it('renders all 15 apps with the three hero apps first', () => {
    render(<AppsSection />);
    const list = screen.getByRole('list');
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(15);
    expect(links.slice(0, 3).map((l) => l.getAttribute('aria-label'))).toEqual([
      'Dragon Pet 2',
      'Dragon Pet',
      'Unicorn Pet',
    ]);
    expect(screen.getAllByText('Featured')).toHaveLength(1);
  });

  it('is the #apps anchor target with a heading', () => {
    render(<AppsSection />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Apps & Games' }).closest('section'),
    ).toHaveAttribute('id', 'apps');
  });
});
