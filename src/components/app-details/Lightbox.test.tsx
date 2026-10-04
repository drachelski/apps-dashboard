import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Lightbox } from './Lightbox';

const IMAGES = Array.from({ length: 15 }, (_, i) => ({
  src: `/s${i + 1}.webp`,
  alt: `Screenshot ${i + 1}`,
}));

function Harness({ start, onClose = () => {} }: { start: number | null; onClose?: () => void }) {
  const [index, setIndex] = useState<number | null>(start);
  return <Lightbox images={IMAGES} index={index} onClose={onClose} onIndexChange={setIndex} />;
}

const swipe = (from: number, to: number) => {
  const img = screen.getByRole('img');
  fireEvent.touchStart(img, { touches: [{ clientX: from, clientY: 200 }] });
  fireEvent.touchEnd(img, { changedTouches: [{ clientX: to, clientY: 200 }] });
};

describe('Lightbox', () => {
  it('is closed when index is null', () => {
    render(<Harness start={null} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('wraps from the last image to the first with ArrowRight', () => {
    render(<Harness start={14} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' });
    expect(screen.getByText('1 / 15')).toBeInTheDocument();
    expect(screen.getByAltText('Screenshot 1')).toBeInTheDocument();
  });

  it('wraps from the first image to the last with ArrowLeft', () => {
    render(<Harness start={0} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowLeft' });
    expect(screen.getByText('15 / 15')).toBeInTheDocument();
  });

  it('moves with the arrow buttons', () => {
    render(<Harness start={0} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next screenshot' }));
    expect(screen.getByText('2 / 15')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous screenshot' }));
    expect(screen.getByText('1 / 15')).toBeInTheDocument();
  });

  it('exposes an accessible name on the dialog', () => {
    render(<Harness start={0} />);
    expect(screen.getByRole('dialog', { name: 'Screenshot viewer' })).toBeInTheDocument();
  });

  it('ignores mostly vertical drags', () => {
    render(<Harness start={0} />);
    const img = screen.getByRole('img');
    fireEvent.touchStart(img, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(img, { changedTouches: [{ clientX: 160, clientY: 300 }] });
    expect(screen.getByText('1 / 15')).toBeInTheDocument();
  });

  it('ignores multi-touch gestures such as pinch-zoom', () => {
    render(<Harness start={0} />);
    const img = screen.getByRole('img');
    fireEvent.touchStart(img, {
      touches: [
        { clientX: 300, clientY: 100 },
        { clientX: 350, clientY: 120 },
      ],
    });
    fireEvent.touchEnd(img, { changedTouches: [{ clientX: 100, clientY: 100 }] });
    expect(screen.getByText('1 / 15')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<Harness start={3} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates with touch swipes and ignores small movements', () => {
    render(<Harness start={0} />);
    swipe(300, 100); // swipe left → next
    expect(screen.getByText('2 / 15')).toBeInTheDocument();
    swipe(100, 300); // swipe right → previous
    expect(screen.getByText('1 / 15')).toBeInTheDocument();
    swipe(100, 300); // swipe right on first → wraps to last
    expect(screen.getByText('15 / 15')).toBeInTheDocument();
    swipe(200, 180); // 20 px — not a swipe
    expect(screen.getByText('15 / 15')).toBeInTheDocument();
  });
});
