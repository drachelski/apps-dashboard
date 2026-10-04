import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacyPolicy } from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
  it('renders the policy for the given app with contact email', () => {
    render(<PrivacyPolicy appTitle="Dragon Pet 2" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Dragon Pet 2 — Privacy Policy' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ntwins.info@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:ntwins.info@gmail.com',
    );
  });

  it('lists the three Android permissions with corrected wording', () => {
    render(<PrivacyPolicy appTitle="X" />);
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText(/the following permissions/)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('permisions');
  });
});
