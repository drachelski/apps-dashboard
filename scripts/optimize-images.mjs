// One-off conversion of legacy/source images into optimized WebP files in public/img.
// Sources live outside the repo: ../apps-page (2019 site) and ../ntwins-2020-recovered.
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const LEGACY_IMG = path.resolve(ROOT, '../apps-page/public/img');
const RECOVERED = path.resolve(ROOT, '../ntwins-2020-recovered');
const OUT = path.join(ROOT, 'public/img');

// slug -> file code used by the legacy site (icons/<code>512.png, promos/banner_<code>.jpg)
const LEGACY_CODES = {
  'dragon-pet': 'dp',
  'unicorn-pet': 'up',
  'real-dragon-pet': 'rdp',
  'dragon-pet-xmass': 'dpx',
  'interstellar-lander': 'lander',
  'beautiful-battery-widget': 'bbw',
  'circle-battery-widget': 'cbw',
  'elemental-jewels': 'ej',
  'laboratory-jewels': 'lj',
  'flappy-dragon': 'flappy',
  'unicorn-ride': 'ur',
  'football-wroclaw-panthers': 'fwp',
  'my-real-girlfriend': 'mrg',
  'dragon-pet-vr': 'dpvr',
};

const DP2_SLUG = 'dragon-pet-2';
const DP2_ICON = path.join(RECOVERED, 'dp2-current/icon.jpg');
const DP2_BANNER = path.join(RECOVERED, 'dp2-current/banner.png');
const DP2_SCREENS_DIR = path.join(RECOVERED, 'public/img/screens/dp2');
const DP2_SCREENS = [
  'port1', 'port2', 'port3', 'port4', 'port5', 'port6', 'port7', 'port8', 'port9',
  'land1', 'land2', 'land3', 'land4', 'land5', 'land6',
];
const LOGO = path.join(RECOVERED, 'public/static/media/logo.06f76d69.png');

async function ensureExists(file) {
  try {
    await access(file);
  } catch {
    throw new Error(`Missing source image: ${file}`);
  }
}

// Icons are displayed at most 128 CSS px — 256 px covers 2x screens.
const ICON_SIZE = 256;

async function icon(src, slug) {
  await ensureExists(src);
  await sharp(src)
    .resize(ICON_SIZE, ICON_SIZE, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(path.join(OUT, 'icons', `${slug}.webp`));
}

async function banner(src, slug) {
  await ensureExists(src);
  await sharp(src)
    .resize({ width: 1024, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(OUT, 'banners', `${slug}.webp`));
}

async function screenshot(name) {
  const src = path.join(DP2_SCREENS_DIR, `${name}.png`);
  await ensureExists(src);
  const dir = path.join(OUT, 'screens', DP2_SLUG);
  await sharp(src)
    .resize({ height: 360 })
    .webp({ quality: 80 })
    .toFile(path.join(dir, 'thumb', `${name}.webp`));
  await sharp(src)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(dir, 'full', `${name}.webp`));
}

const LOGO_COLOR = [0xf3, 0xee, 0xf8];
const LOGO_PADDING = 8;
const MASK_THRESHOLD = 16;

// Source logo is dark text (on a transparent background); output light text on transparency,
// cropped to the text. Mask = alpha × darkness, so a white background would work too.
async function logo() {
  await ensureExists(LOGO);
  const { data, info } = await sharp(LOGO).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const darkness = 255 - (data[i] + data[i + 1] + data[i + 2]) / 3;
      const alpha = Math.round((data[i + 3] * darkness) / 255);
      out.set([...LOGO_COLOR, alpha], i);
      if (alpha > MASK_THRESHOLD) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < 0) throw new Error('Logo mask is empty');

  const cropped = await sharp(out, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer();
  await sharp(cropped)
    .extend({
      top: LOGO_PADDING,
      bottom: LOGO_PADDING,
      left: LOGO_PADDING,
      right: LOGO_PADDING,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'logo-ntwins.webp'));
}

const FAVICON_BG = '#0f0c14';
const FAVICON_FG = { r: 0xf5, g: 0xb5, b: 0x24 };
const FAVICON_GLYPH_SCALE = 0.78;

// Alpha mask of the first two letters ("nt") of the generated logo, split on empty columns.
async function ntMask() {
  const logoFile = path.join(OUT, 'logo-ntwins.webp');
  const { data, info } = await sharp(logoFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const hasInk = (x) => {
    for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] > 40) return true;
    return false;
  };
  const glyphs = [];
  for (let x = 0, start = -1; x <= info.width; x++) {
    const ink = x < info.width && hasInk(x);
    if (ink && start < 0) start = x;
    if (!ink && start >= 0) {
      glyphs.push([start, x - 1]);
      start = -1;
    }
  }
  if (glyphs.length < 2) throw new Error('Could not find "nt" glyphs in the logo');
  const [[left], [, right]] = glyphs;
  // sharp runs operations in a fixed order, so crop, extract alpha and trim in separate passes
  const crop = await sharp(logoFile)
    .extract({ left, top: 0, width: right - left + 1, height: info.height })
    .png()
    .toBuffer();
  const alpha = await sharp(crop).extractChannel('alpha').png().toBuffer();
  return sharp(alpha).trim({ background: '#000000' }).png().toBuffer();
}

// Gold "nt" (cut from the logo) on the dark page background; rounded unless the platform rounds itself.
async function favicon(mask, size, file, { rounded }) {
  const glyphMask = await sharp(mask)
    .resize({ width: Math.round(size * FAVICON_GLYPH_SCALE), height: Math.round(size * FAVICON_GLYPH_SCALE), fit: 'inside' })
    .toBuffer();
  const { width, height } = await sharp(glyphMask).metadata();
  const glyph = await sharp({ create: { width, height, channels: 3, background: FAVICON_FG } })
    .joinChannel(glyphMask)
    .png()
    .toBuffer();
  const radius = rounded ? Math.round(size * 0.22) : 0;
  const background = `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${FAVICON_BG}"/></svg>`;
  await sharp(Buffer.from(background))
    .composite([{ input: glyph, gravity: 'center' }])
    .png()
    .toFile(path.join(ROOT, 'src/app', file));
}

async function main() {
  for (const dir of ['icons', 'banners', `screens/${DP2_SLUG}/thumb`, `screens/${DP2_SLUG}/full`]) {
    await mkdir(path.join(OUT, dir), { recursive: true });
  }

  await icon(DP2_ICON, DP2_SLUG);
  await banner(DP2_BANNER, DP2_SLUG);
  for (const name of DP2_SCREENS) await screenshot(name);

  for (const [slug, code] of Object.entries(LEGACY_CODES)) {
    await icon(path.join(LEGACY_IMG, 'icons', `${code}512.png`), slug);
    await banner(path.join(LEGACY_IMG, 'promos', `banner_${code}.jpg`), slug);
  }

  await logo();

  // Next.js picks up app/icon.png and app/apple-icon.png (with basePath) — avoids a /favicon.ico 404.
  const mask = await ntMask();
  await favicon(mask, 256, 'icon.png', { rounded: true });
  await favicon(mask, 180, 'apple-icon.png', { rounded: false });

  console.log('optimize-images: done');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
