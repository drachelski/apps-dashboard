import { describe, expect, it, vi } from 'vitest';
import { asset } from './asset';

describe('asset', () => {
  it('returns the path unchanged without a base path', () => {
    expect(asset('/img/a.png', '')).toBe('/img/a.png');
  });

  it('prefixes the base path', () => {
    expect(asset('/img/a.png', '/apps-dashboard')).toBe('/apps-dashboard/img/a.png');
  });

  it('does not produce double slashes when base path has a trailing slash', () => {
    expect(asset('/img/a.png', '/apps-dashboard/')).toBe('/apps-dashboard/img/a.png');
  });

  it('reads NEXT_PUBLIC_BASE_PATH by default', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/x');
    expect(asset('/img/a.png')).toBe('/x/img/a.png');
  });

  it('throws for paths without a leading slash', () => {
    expect(() => asset('img/a.png', '')).toThrow(/absolute public path/);
  });
});
