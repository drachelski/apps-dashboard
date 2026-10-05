// @vitest-environment node
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const APP = path.join(process.cwd(), 'src/app');
const BG = [0x0f, 0x0c, 0x14];
const GOLD = [0xf5, 0xb5, 0x24];

const near = (px: number[], target: number[], tolerance = 24) =>
  target.every((c, i) => Math.abs(px[i] - c) <= tolerance);

async function pixels(file: string) {
  const { data, info } = await sharp(path.join(APP, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const at = (x: number, y: number) => {
    const i = (y * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  const all = Array.from({ length: info.width * info.height }, (_, i) =>
    Array.from(data.subarray(i * 4, i * 4 + 4)),
  );
  return { info, at, all };
}

describe('favicon', () => {
  it('is gold "nt" on the dark page background with rounded corners', async () => {
    const { info, at, all } = await pixels('icon.png');
    expect([info.width, info.height]).toEqual([256, 256]);
    expect(at(0, 0)[3]).toBe(0); // rounded corner is transparent
    expect(near(at(128, 20), BG)).toBe(true); // background above the letters
    const goldShare = all.filter((p) => p[3] > 200 && near(p, GOLD)).length / all.length;
    expect(goldShare).toBeGreaterThan(0.1);
  });

  it('has an opaque 180px apple touch icon in the same style', async () => {
    const { info, at, all } = await pixels('apple-icon.png');
    expect([info.width, info.height]).toEqual([180, 180]);
    expect(near(at(0, 0), BG)).toBe(true); // iOS rounds corners itself
    expect(at(0, 0)[3]).toBe(255);
    expect(all.some((p) => near(p, GOLD))).toBe(true);
  });
});
