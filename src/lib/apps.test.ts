import { describe, expect, it } from 'vitest';
import type { AppEntry } from '@/data/types';
import {
  getAppBySlug,
  getApps,
  getHeroApps,
  getMetaDescription,
  getStandardApps,
  getTagline,
  playStoreUrl,
  screenshotSrc,
  stripEmoji,
} from './apps';

const fake = (description: string[]): AppEntry => ({
  slug: 'x',
  title: 'X',
  packageId: 'a.b',
  icon: '/img/icons/x.webp',
  tier: 'standard',
  description,
});

describe('apps helpers', () => {
  it('finds apps by slug', () => {
    expect(getAppBySlug('dragon-pet-2')?.title).toBe('Dragon Pet 2');
    expect(getAppBySlug('nope')).toBeUndefined();
  });

  it('splits hero and standard apps preserving order', () => {
    expect(getHeroApps().map((a) => a.slug)).toEqual(['dragon-pet-2', 'dragon-pet', 'unicorn-pet']);
    expect(getStandardApps()).toHaveLength(12);
    expect(getHeroApps().length + getStandardApps().length).toBe(getApps().length);
  });

  it('builds Google Play URLs', () => {
    expect(playStoreUrl('pl.ntwins.dragon.pet2')).toBe(
      'https://play.google.com/store/apps/details?id=pl.ntwins.dragon.pet2',
    );
  });

  it('builds screenshot paths', () => {
    expect(screenshotSrc('dragon-pet-2', 'port1', 'thumb')).toBe(
      '/img/screens/dragon-pet-2/thumb/port1.webp',
    );
  });

  it('strips emoji and collapses whitespace', () => {
    expect(stripEmoji('🔥🐉 Hi ✨there✨ 🚀')).toBe('Hi there');
  });

  it('uses the first sentence without emoji as tagline', () => {
    expect(getTagline(getAppBySlug('dragon-pet-2')!)).toBe(
      'Have you ever wondered how to train your dragon?',
    );
    expect(getTagline(fake(['No punctuation here']))).toBe('No punctuation here');
  });

  it('limits meta descriptions to 160 characters', () => {
    const meta = getMetaDescription(getAppBySlug('dragon-pet-2')!);
    expect(meta.length).toBeLessThanOrEqual(160);
    expect(meta).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(getMetaDescription(fake(['Short.']))).toBe('Short.');
  });
});
