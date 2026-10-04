import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAppBySlug } from '@/lib/apps';
import { asset } from '@/lib/asset';
import { ScreenshotGallery } from './ScreenshotGallery';

describe('ScreenshotGallery', () => {
  it('lists 15 thumbnails and opens the lightbox on the clicked one', () => {
    render(<ScreenshotGallery app={getAppBySlug('dragon-pet-2')!} />);
    const buttons = screen.getAllByRole('button', { name: /^Open Dragon Pet 2 screenshot/ });
    expect(buttons).toHaveLength(15);

    fireEvent.click(buttons[2]);

    expect(screen.getByText('3 / 15')).toBeInTheDocument();
    expect(screen.getByAltText('Dragon Pet 2 screenshot 3')).toHaveAttribute(
      'src',
      asset('/img/screens/dragon-pet-2/full/land5.webp'),
    );
  });

  it('renders nothing for apps without screenshots', () => {
    const { container } = render(<ScreenshotGallery app={getAppBySlug('dragon-pet')!} />);
    expect(container).toBeEmptyDOMElement();
  });
});
