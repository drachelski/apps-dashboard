// @vitest-environment node
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { screenshotSrc } from '@/lib/apps';
import { apps } from './apps';

const publicFile = (p: string) => path.join(process.cwd(), 'public', p);

describe('apps data', () => {
  it('contains 15 apps', () => {
    expect(apps).toHaveLength(15);
  });

  it('has unique kebab-case slugs', () => {
    const slugs = apps.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('starts with exactly three hero apps: DP2, DP, UP', () => {
    expect(apps.slice(0, 3).map((a) => a.slug)).toEqual([
      'dragon-pet-2',
      'dragon-pet',
      'unicorn-pet',
    ]);
    expect(apps.filter((a) => a.tier === 'hero')).toHaveLength(3);
  });

  it('uses valid Google Play package ids', () => {
    for (const app of apps) expect(app.packageId).toMatch(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/);
  });

  it('uses the verified Dragon Pet 2 package id and 15 screenshots', () => {
    const dp2 = apps[0];
    expect(dp2.packageId).toBe('pl.ntwins.dragon.pet2');
    expect(dp2.screenshots).toHaveLength(15);
    expect(dp2.features).toHaveLength(18);
  });

  it('has non-empty descriptions', () => {
    for (const app of apps) {
      expect(app.description.length).toBeGreaterThan(0);
      for (const p of app.description) expect(p.trim()).not.toBe('');
    }
  });

  it('has no known legacy typos', () => {
    const text = JSON.stringify(apps);
    for (const typo of [
      'scienist',
      'separeted',
      'throught',
      'fairlyland',
      'an it might',
      'permisions',
    ]) {
      expect(text).not.toContain(typo);
    }
  });

  it('gives Interstellar Lander its own description', () => {
    const lander = apps.find((a) => a.slug === 'interstellar-lander');
    expect(lander?.description.join(' ')).not.toContain('Elemental Jewels');
    expect(lander?.description[0]).toContain('Interstellar Lander');
  });

  it('ships icons at 256px (displayed at most 128 CSS px)', async () => {
    const sizes = await Promise.all(
      apps.map(async (a) => {
        const { width, height } = await sharp(publicFile(a.icon)).metadata();
        return `${a.slug}:${width}x${height}`;
      }),
    );
    expect(sizes.filter((s) => !s.endsWith(':256x256'))).toEqual([]);
  });

  it('references only files that exist in public/', () => {
    const missing: string[] = [];
    for (const app of apps) {
      const paths = [app.icon, ...(app.banner ? [app.banner] : [])];
      for (const s of app.screenshots ?? []) {
        paths.push(
          screenshotSrc(app.slug, s.file, 'thumb'),
          screenshotSrc(app.slug, s.file, 'full'),
        );
      }
      for (const p of paths) if (!existsSync(publicFile(p))) missing.push(`${app.slug}: ${p}`);
    }
    expect(missing).toEqual([]);
  });
});
