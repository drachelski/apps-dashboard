/** Without JS, motion's initial state (opacity 0 / offset / clip) would hide content forever. */
export const NOSCRIPT_REVEAL_CSS =
  '[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}';

/**
 * JS enabled but the bundle never runs (blocked chunk, flaky network, old browser): reveal after 3 s.
 * CSS animations override motion's inline styles; MotionProvider sets data-hydrated to disarm this.
 */
export const REVEAL_FAILSAFE_CSS =
  'html:not([data-hydrated]) [data-reveal]{animation:reveal-failsafe 0s 3s forwards}' +
  '@keyframes reveal-failsafe{to{opacity:1;transform:none;clip-path:none}}';

const REDUCED_FADE_S = 0.2;
const REVEAL_DURATION_S = 0.5;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Spec: with prefers-reduced-motion only a fade of at most 200 ms remains (no delays). */
export function revealTransition(reducedMotion: boolean, delay = 0, duration = REVEAL_DURATION_S) {
  return reducedMotion
    ? { duration: REDUCED_FADE_S, delay: 0 }
    : { duration, delay, ease: EASE_OUT };
}
