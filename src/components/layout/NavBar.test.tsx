import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavBar } from './NavBar';

// jsdom ignores media queries, so the desktop nav (display: none below md) counts as hidden — query with hidden: true.
const link = (name: string) => screen.getAllByRole('link', { name, hidden: true });

describe('NavBar', () => {
  it('links the logo to home and sections via anchors', () => {
    render(<NavBar />);
    expect(link('ntwins home')[0]).toHaveAttribute('href', '/');
    expect(link('Games')[0]).toHaveAttribute('href', '/#apps');
    expect(link('Contact')[0]).toHaveAttribute('href', '/#contact');
  });

  it('opens the mobile drawer with the same links', () => {
    render(<NavBar />);
    expect(link('Games')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(link('Games')).toHaveLength(2);
    expect(link('Contact')).toHaveLength(2);
  });
});
