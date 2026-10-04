import { vi } from 'vitest';

/** Makes window.matchMedia return matches=true only for the given queries (restored after each test). */
export function mockMatchMedia(matching: string[] = []) {
  return vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: matching.includes(query),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}
