import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyEmailButton } from './CopyEmailButton';

const EMAIL = 'ntwins.info@gmail.com';

function setClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('CopyEmailButton', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('copies the address and confirms with a snackbar', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    render(<CopyEmailButton email={EMAIL} />);

    const button = await screen.findByRole('button', { name: 'Copy email address' });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(await screen.findByText('Email copied to clipboard')).toBeInTheDocument();
  });

  it('renders nothing when the Clipboard API is unavailable', () => {
    render(<CopyEmailButton email={EMAIL} />);
    expect(screen.queryByRole('button', { name: 'Copy email address' })).not.toBeInTheDocument();
  });

  it('hides itself when copying is rejected', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(<CopyEmailButton email={EMAIL} />);

    const button = await screen.findByRole('button', { name: 'Copy email address' });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.queryByRole('button', { name: 'Copy email address' })).not.toBeInTheDocument();
    expect(screen.queryByText('Email copied to clipboard')).not.toBeInTheDocument();
  });
});
