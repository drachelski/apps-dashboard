import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

class NoopObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// jsdom lacks browser APIs used by MUI and motion (node-environment tests have no window at all)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: NoopObserver,
  });
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: NoopObserver,
  });

  if (!Element.prototype.scrollBy) {
    Element.prototype.scrollBy = () => {};
  }
}
