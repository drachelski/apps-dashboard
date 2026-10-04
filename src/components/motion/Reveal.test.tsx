import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MotionProvider } from './MotionProvider';
import { Reveal } from './Reveal';
import { NOSCRIPT_REVEAL_CSS, REVEAL_FAILSAFE_CSS, revealTransition } from './reveal-css';

describe('Reveal', () => {
  it('marks content with data-reveal so the noscript style can unhide it', () => {
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>,
    );
    expect(screen.getByText('Hello').parentElement).toHaveAttribute('data-reveal');
  });

  it('failsafe CSS reveals content when JS is on but never hydrates', () => {
    expect(REVEAL_FAILSAFE_CSS).toContain('html:not([data-hydrated]) [data-reveal]');
    expect(REVEAL_FAILSAFE_CSS).toMatch(/@keyframes reveal-failsafe\{to\{opacity:1;transform:none;clip-path:none\}\}/);
  });

  it('MotionProvider marks the document as hydrated, disarming the failsafe', () => {
    delete document.documentElement.dataset.hydrated;
    render(
      <MotionProvider>
        <p>x</p>
      </MotionProvider>,
    );
    expect(document.documentElement.dataset.hydrated).toBe('true');
  });

  it('limits reveal transitions to a 200 ms fade without delay for reduced motion', () => {
    expect(revealTransition(true, 0.8)).toEqual({ duration: 0.2, delay: 0 });
    expect(revealTransition(false, 0.3)).toMatchObject({ duration: 0.5, delay: 0.3 });
  });

  it('noscript CSS neutralises every animated property', () => {
    expect(NOSCRIPT_REVEAL_CSS).toContain('[data-reveal]');
    for (const rule of ['opacity:1', 'transform:none', 'clip-path:none']) {
      expect(NOSCRIPT_REVEAL_CSS).toContain(rule);
    }
  });
});
