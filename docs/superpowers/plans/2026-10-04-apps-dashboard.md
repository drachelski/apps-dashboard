# apps-dashboard — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Statyczna strona-wizytówka studia ntwins (Next.js + MUI + motion) z 15 grami, w tym trzema dużymi kaflami (Dragon Pet 2, Dragon Pet, Unicorn Pet), wdrażana na `https://drachelski.github.io/apps-dashboard/`.

**Architecture:** Next.js 15 App Router ze statycznym eksportem (`output: 'export'`, `trailingSlash: true`, `basePath` z env). Jedno źródło danych (`src/data/apps.ts`) zasila stronę główną (hero + siatka bento + kontakt), strony gier `/apps/[slug]/` i polityki prywatności `/apps/[slug]/privacy-policy/` generowane przez `generateStaticParams`. Komponenty serwerowe domyślnie; `'use client'` tylko dla animacji, stanu i API przeglądarki. Deploy przez GitHub Actions.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, MUI v6 + Emotion, `motion` (Framer Motion), Vitest + Testing Library + jsdom, sharp (jednorazowa konwersja obrazów), tsx, pnpm, GitHub Actions / Pages.

**Spec:** `docs/superpowers/specs/2026-10-04-apps-dashboard-design.md` — wykonawca czyta spec i plan razem.

## Global Constraints

- Package manager: **pnpm** (nigdy npm/yarn). Node **22**.
- **Żadnych `git commit` / `git push` / PR** — wszystkie operacje git wykonuje właściciel. Każdy task kończy się *checkpointem*: pokaż `git status --short` i zaproponuj komunikat commita.
- Next.js **15** App Router, `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`, `basePath`/`assetPrefix` z `NEXT_PUBLIC_BASE_PATH` (lokalnie puste, w CI `/apps-dashboard`).
- Każda tekstowa ścieżka do pliku z `public/` w `<img src>`, `motion.img src` lub CSS `url()` musi przejść przez `asset()` z `src/lib/asset.ts`. `SafeImage` robi to sam — przekazujesz mu surową ścieżkę `/img/...`.
- Nawigacja wewnętrzna wyłącznie przez `next/link` (lub `ButtonLink`); nigdy surowe `<a href="/...">` (nie dostałoby basePath). Kotwice w obrębie strony (`href="#apps"`) są OK.
- Komponenty serwerowe **nie** przekazują do komponentów klienckich funkcji ani komponentów jako propsów: zakaz `component={NextLink}` i `sx={(theme) => ...}` w plikach bez `'use client'`. Do linków-przycisków w komponentach serwerowych używaj `ButtonLink`.
- Moduły z `'use client'` nie eksportują stałych używanych przez komponenty serwerowe — wspólne stałe stylów są w `src/theme/tokens.ts` (bez `'use client'`).
- `docs/legacy/**` jest wyłączone z TypeScript, ESLint i Vitest (to referencja, nie kod).
- UI po angielsku. Marka: `ntwins`. Kontakt: `ntwins.info@gmail.com`. Stopka: `© {rok} ntwins. All rights reserved.`
- Fonty wyłącznie z `next/font/google`: **Cinzel Decorative** (nagłówki, `--font-display`) i **Inter** (tekst, `--font-body`). Nie kopiuj żadnych fontów z `../apps-page`.
- Paleta: tło `#0f0c14`, paper `#1a1522`, primary `#8e44c4`, secondary (złoto) `#f5b524`, tekst `#f3eef8`, tekst drugorzędny `#b9aec7`, ramki `rgba(255,255,255,0.08)`.
- 15 aplikacji; kafle duże w kolejności: `dragon-pet-2` (featured, 2×2), `dragon-pet`, `unicorn-pet` (2×1).
- `prefers-reduced-motion: reduce` wyłącza cząstki, tilt, Ken Burns, parallax; zostaje fade.

## Odstępstwa od specu (świadome uproszczenia)

- Screenshoty DP2 w `public/img/screens/dragon-pet-2/{thumb,full}/` (folder = slug) zamiast `.../dp2/...` — generyczny helper `screenshotSrc(slug, file, size)`.
- Ikony w jednym rozmiarze 512 px, bannery w jednym (szer. 1024 px) — model danych ma jedną ścieżkę na zasób; WebP utrzymuje wagę na niskim poziomie.
- Stopka: zamiast `suppressHydrationWarning` rok z buildu jest wstrzykiwany przez `env.BUILD_YEAR` w `next.config.ts` (brak rozjazdu hydracji), a `useEffect` podmienia go na rok z przeglądarki.
- Reduced motion przez własny hook `usePrefersReducedMotion` (SSR-safe, testowalny) zamiast `useReducedMotion` z motion.
- Lightbox animuje wejście obrazu bez `AnimatePresence` (brak animacji wyjścia).
- Smoke test eksportu w TypeScript (`scripts/verify-export.ts`, uruchamiany przez `tsx`) zamiast `.mjs` — importuje listę slugów wprost z `src/data/apps.ts`; dodatkowo sprawdza, że każdy lokalny `src`/`href` w HTML ma basePath i wskazuje na istniejący plik.
- Dodany favicon `src/app/icon.png` (z ikony DP2) — bez niego przeglądarka dostaje 404 na `/favicon.ico`, co łamie kryterium „brak błędów w konsoli”.
- Dodany skrypt `pnpm preview` (serwuje `out/` pod `/apps-dashboard/`), żeby lokalnie sprawdzić build z basePath.
- CTA w hero to pełny fiolet z białym tekstem (gradient fiolet→złoto nie spełniał kontrastu AA dla tekstu).

## Review Focus

1. **Deploy pod `/apps-dashboard/`** — lokalnie wszystko działa, a na Pages obrazki/linki 404, bo ścieżka nie ma basePath → `scripts/verify-export.ts` (Task 13) sprawdza, że każdy `src`/`href` w wyeksportowanym HTML ma prefiks i wskazuje na istniejący plik w `out/`.
2. **Nowy rok bez rebuildu** — 1 stycznia stopka musi pokazać nowy rok, mimo że HTML zbudowano rok wcześniej → test Footer z `BUILD_YEAR=2026` i zegarem 2031 (Task 4).
3. **JS wyłączony/zablokowany** — treść (kafle, opisy, logo) musi być widoczna, mimo że motion renderuje `opacity: 0` → test `Reveal` (atrybut `data-reveal`) + test CSS `<noscript>` (Task 6) + test atrybutu na logo w Hero (Task 8).
4. **Lightbox na dotyku i na krańcach** — swipe w lewo/prawo, przejście 15→1 i 1→15, mały ruch palca nie przełącza → testy Lightbox (Task 11).
5. **Schowek niedostępny / odmowa uprawnień** — przycisk kopiowania nie może rzucać błędem ani wisieć → testy CopyEmailButton (Task 9).

---

## Struktura plików

```
apps-dashboard/
  package.json, pnpm-lock.yaml, next.config.ts, tsconfig.json, eslint.config.mjs,
  .prettierrc.json, .prettierignore, .gitignore, vitest.config.ts, vitest.setup.ts, README.md
  .github/workflows/deploy.yml
  scripts/optimize-images.mjs        # jednorazowa konwersja źródeł → public/img (WebP)
  scripts/verify-export.ts           # smoke test out/
  public/.nojekyll
  public/img/logo-ntwins.webp, google-play-badge.png
  public/img/icons/{slug}.webp, public/img/banners/{slug}.webp
  public/img/screens/dragon-pet-2/{thumb,full}/{file}.webp
  src/
    app/layout.tsx, page.tsx, not-found.tsx
    app/apps/[slug]/page.tsx (+ page.test.ts)
    app/apps/[slug]/privacy-policy/page.tsx
    data/types.ts, data/apps.ts, data/apps.test.ts
    lib/asset.ts (+test), lib/apps.ts (+test), lib/site.ts,
    lib/useMediaQueryMatch.ts, lib/no-bare-paths.test.ts
    test/matchMedia.ts
    theme/tokens.ts, theme/fonts.ts, theme/theme.ts
    components/motion/MotionProvider.tsx, Reveal.tsx (+test), reveal-css.ts
    components/common/SafeImage.tsx (+test), ButtonLink.tsx
    components/layout/NavBar.tsx (+test), Footer.tsx (+test)
    components/home/Hero.tsx (+test), EmberBackground.tsx (+test),
      AppTile.tsx (+test), AppsSection.tsx (+test), ContactSection.tsx, CopyEmailButton.tsx (+test)
    components/app-details/AppHeader.tsx (+test), AppDescription.tsx (+test),
      GooglePlayBadge.tsx (+test), ScreenshotGallery.tsx (+test), Lightbox.tsx (+test)
    components/privacy/PrivacyPolicy.tsx (+test)
```

Testy leżą obok testowanych plików (`*.test.ts(x)`).

---

### Task 1: Szkielet projektu, narzędzia, `asset()`

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `vitest.config.ts`, `vitest.setup.ts`, `public/.nojekyll`, `src/app/layout.tsx` (tymczasowy), `src/app/page.tsx` (tymczasowy), `src/lib/asset.ts`
- Test: `src/lib/asset.test.ts`

**Interfaces:**
- Produces: `asset(path: string, basePath?: string): string` — dokleja basePath (domyślnie `process.env.NEXT_PUBLIC_BASE_PATH ?? ''`) do ścieżki zaczynającej się od `/`; rzuca `Error` dla ścieżek bez wiodącego `/`.
- Produces: env `process.env.BUILD_YEAR` (string, rok z czasu buildu) dostępny w kodzie klienta.
- Produces: skrypty `pnpm dev|build|start|preview|lint|format|test|test:watch|verify|optimize-images`.

- [ ] **Step 1: Utwórz `package.json`**

Katalog roboczy: `/Users/dawid.rachelski/PRIVATE/drachelski/apps-dashboard` (repo jest puste poza `docs/`).

```json
{
  "name": "apps-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "serve out",
    "preview": "rm -rf .preview && mkdir -p .preview && cp -R out .preview/apps-dashboard && serve .preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "verify": "tsx scripts/verify-export.ts",
    "optimize-images": "node scripts/optimize-images.mjs"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["sharp", "unrs-resolver"]
  }
}
```

- [ ] **Step 2: Zainstaluj zależności**

```bash
pnpm add next@15 react@19 react-dom@19 @mui/material@6 @mui/icons-material@6 @mui/material-nextjs@6 @emotion/react @emotion/styled @emotion/cache motion
pnpm add -D typescript @types/node @types/react @types/react-dom eslint@9 eslint-config-next@15 @eslint/eslintrc prettier vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event sharp tsx serve
```

Następnie dopisz do `package.json` pole `"packageManager": "pnpm@<wersja>"`, gdzie `<wersja>` to wynik `pnpm --version` (wymagane przez `pnpm/action-setup` w CI).

- [ ] **Step 3: Pliki konfiguracyjne**

`next.config.ts`:

```ts
import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
  },
};

export default nextConfig;
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out", ".preview", "docs/legacy"]
}
```

`eslint.config.mjs`:

```js
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  { ignores: ['.next/**', 'out/**', '.preview/**', 'docs/legacy/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default config;
```

`.prettierrc.json`:

```json
{ "singleQuote": true, "semi": true, "trailingComma": "all", "printWidth": 100 }
```

`.prettierignore`:

```
.next
out
.preview
docs/legacy
pnpm-lock.yaml
```

`.gitignore`:

```
node_modules/
.next/
out/
.preview/
next-env.d.ts
*.tsbuildinfo
.DS_Store
coverage/
```

`vitest.config.ts`:

```ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['docs/**', 'node_modules/**'],
    restoreMocks: true,
    unstubEnvs: true,
    css: false,
  },
});
```

`vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom lacks browser APIs used by MUI and motion
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

Object.defineProperty(window, 'IntersectionObserver', { writable: true, configurable: true, value: NoopObserver });
Object.defineProperty(window, 'ResizeObserver', { writable: true, configurable: true, value: NoopObserver });

if (!Element.prototype.scrollBy) {
  Element.prototype.scrollBy = () => {};
}
```

`public/.nojekyll` — pusty plik:

```bash
mkdir -p public && touch public/.nojekyll
```

- [ ] **Step 4: Tymczasowy layout i strona**

`src/app/layout.tsx` (zostanie zastąpiony w Task 4):

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx` (zostanie zastąpiony w Task 7):

```tsx
export default function HomePage() {
  return <h1>ntwins</h1>;
}
```

- [ ] **Step 5: Napisz test `asset()`**

`src/lib/asset.test.ts`:

```ts
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
```

- [ ] **Step 6: Uruchom test — ma nie przejść**

Run: `pnpm test src/lib/asset.test.ts`
Expected: FAIL — `Failed to resolve import "./asset"`.

- [ ] **Step 7: Zaimplementuj `asset()`**

`src/lib/asset.ts`:

```ts
/**
 * Resolves a path inside `public/` against the deployment base path.
 * Next.js adds basePath to <Link> and static imports, but not to plain string URLs.
 */
export function asset(
  path: string,
  basePath: string = process.env.NEXT_PUBLIC_BASE_PATH ?? '',
): string {
  if (!path.startsWith('/')) {
    throw new Error(`asset() expects an absolute public path, got "${path}"`);
  }
  return `${basePath.replace(/\/+$/, '')}${path}`;
}
```

- [ ] **Step 8: Uruchom testy, lint i build**

Run: `pnpm test && pnpm lint && pnpm build && ls out`
Expected: 5 testów PASS; lint bez błędów; w `out/` są `index.html`, `404.html`, `.nojekyll`, `_next/`.

Run: `NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm build && grep -o '/apps-dashboard/_next' out/index.html | head -1`
Expected: wypisuje `/apps-dashboard/_next`.

- [ ] **Step 9: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `chore: scaffold Next.js static export with tooling and asset helper`.

---

### Task 2: Zasoby graficzne (WebP) i badge Google Play

**Files:**
- Create: `scripts/optimize-images.mjs`
- Create (wynik skryptu): `src/app/icon.png` (favicon), `public/img/logo-ntwins.webp`, `public/img/icons/*.webp` (15), `public/img/banners/*.webp` (15), `public/img/screens/dragon-pet-2/{thumb,full}/*.webp` (2×15), `public/img/google-play-badge.png`

**Interfaces:**
- Produces: konwencja ścieżek używana w `src/data/apps.ts`:
  - ikona: `/img/icons/{slug}.webp` (512×512)
  - banner: `/img/banners/{slug}.webp` (szer. ≤ 1024, proporcje źródła ≈ 1024×500)
  - screenshot: `/img/screens/{slug}/thumb/{file}.webp` (wys. 360) i `/img/screens/{slug}/full/{file}.webp` (dłuższy bok ≤ 1600)
  - logo: `/img/logo-ntwins.webp` (jasne `#f3eef8` na przezroczystym tle, szer. ≤ 640)
  - badge: `/img/google-play-badge.png` (646×250)

- [ ] **Step 1: Zabezpiecz źródła DP2 poza `~/Downloads`**

```bash
mkdir -p ../ntwins-2020-recovered/dp2-current
cp ~/Downloads/dp2/icon.jpg ~/Downloads/dp2/banner.png ~/Downloads/dp2/dp2.txt ~/Downloads/dp2/interstellar.txt ../ntwins-2020-recovered/dp2-current/
ls ../ntwins-2020-recovered/dp2-current ../ntwins-2020-recovered/public/img/screens/dp2 ../apps-page/public/img/icons ../apps-page/public/img/promos
```

Expected: 4 pliki w `dp2-current`, 15 PNG w `screens/dp2`, 14 ikon `*512.png`, 14 bannerów `banner_*.jpg`.

- [ ] **Step 2: Napisz skrypt konwersji**

`scripts/optimize-images.mjs`:

```js
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

async function icon(src, slug) {
  await ensureExists(src);
  await sharp(src)
    .resize(512, 512, { fit: 'cover' })
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
  await sharp(src).resize({ height: 360 }).webp({ quality: 80 }).toFile(path.join(dir, 'thumb', `${name}.webp`));
  await sharp(src)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(dir, 'full', `${name}.webp`));
}

// Source logo is black text on white; output light text on a transparent background.
async function logo() {
  await ensureExists(LOGO);
  const { data, info } = await sharp(LOGO)
    .flatten({ background: '#ffffff' })
    .greyscale()
    .negate()
    .trim()
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  await sharp({
    create: { width: info.width, height: info.height, channels: 3, background: '#f3eef8' },
  })
    .joinChannel(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .resize({ width: 640, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'logo-ntwins.webp'));
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

  // Next.js picks up app/icon.png as the favicon (with basePath) — avoids a /favicon.ico 404.
  await sharp(DP2_ICON).resize(256, 256).png().toFile(path.join(ROOT, 'src/app/icon.png'));

  console.log('optimize-images: done');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
```

- [ ] **Step 3: Uruchom skrypt**

Run: `pnpm optimize-images`
Expected: `optimize-images: done`.

Run: `find public/img -name '*.webp' | wc -l && du -sh public/img`
Expected: `61` (15 ikon + 15 bannerów + 30 screenów + logo); rozmiar wyraźnie poniżej 13 MB źródeł (orientacyjnie 3–5 MB). Dodatkowo istnieje `src/app/icon.png` (256×256, favicon).

- [ ] **Step 4: Obejrzyj logo**

Otwórz `public/img/logo-ntwins.webp` (np. `open public/img/logo-ntwins.webp`). Expected: jasny napis „ntwins” na przezroczystym tle, przycięty do napisu (bez dużych pustych marginesów). Jeśli wynik jest pusty lub odwrócony — sprawdź, czy `info.channels` wynosi 1 (dodaj tymczasowo `console.log(info)`).

- [ ] **Step 5: Pobierz oficjalny badge Google Play**

```bash
curl -fsSL -o public/img/google-play-badge.png https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png \
  || cp ../apps-page/public/img/google-play-badge.png public/img/google-play-badge.png
file public/img/google-play-badge.png
```

Expected: `PNG image data, 646 x 250`. Jeśli wymiary są inne (fallback ze starej strony), zapisz je — użyjesz ich w Task 10 w `GooglePlayBadge` (`width`/`height`).

- [ ] **Step 6: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add optimized game assets and Google Play badge`.

---

### Task 3: Model danych, lista 15 aplikacji, helpery

**Files:**
- Create: `src/data/types.ts`, `src/data/apps.ts`, `src/lib/apps.ts`
- Test: `src/data/apps.test.ts`, `src/lib/apps.test.ts`

**Interfaces:**
- Consumes: zasoby z Task 2 (konwencja ścieżek).
- Produces (`src/data/types.ts`):
  ```ts
  export type AppTier = 'hero' | 'standard';
  export interface Screenshot { file: string; orientation: 'portrait' | 'landscape' }
  export interface AppEntry {
    slug: string; title: string; packageId: string; icon: string; banner?: string;
    tier: AppTier; description: string[]; features?: string[]; screenshots?: readonly Screenshot[];
  }
  ```
- Produces (`src/data/apps.ts`): `export const apps: readonly AppEntry[]` (kolejność wyświetlania).
- Produces (`src/lib/apps.ts`):
  - `getApps(): readonly AppEntry[]`
  - `getAppBySlug(slug: string): AppEntry | undefined`
  - `getHeroApps(): AppEntry[]` / `getStandardApps(): AppEntry[]` (kolejność z danych)
  - `playStoreUrl(packageId: string): string`
  - `screenshotSrc(slug: string, file: string, size: 'thumb' | 'full'): string` (bez basePath)
  - `stripEmoji(text: string): string`
  - `getTagline(app: AppEntry): string` — pierwsze zdanie pierwszego akapitu, bez emoji
  - `getMetaDescription(app: AppEntry): string` — pierwszy akapit bez emoji, ≤ 160 znaków

- [ ] **Step 1: Typy**

`src/data/types.ts`:

```ts
export type AppTier = 'hero' | 'standard';

export interface Screenshot {
  /** File name without extension, e.g. 'port1' → /img/screens/{slug}/{thumb,full}/port1.webp */
  file: string;
  orientation: 'portrait' | 'landscape';
}

export interface AppEntry {
  /** kebab-case, unique, used in the URL */
  slug: string;
  title: string;
  /** Google Play application id */
  packageId: string;
  /** Path inside public/, e.g. '/img/icons/dragon-pet-2.webp' */
  icon: string;
  banner?: string;
  tier: AppTier;
  /** Paragraphs */
  description: string[];
  /** Bullet list, e.g. "Main features" */
  features?: string[];
  screenshots?: readonly Screenshot[];
}
```

- [ ] **Step 2: Napisz test integralności danych**

`src/data/apps.test.ts`:

```ts
// @vitest-environment node
import { existsSync } from 'node:fs';
import path from 'node:path';
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
    expect(apps.slice(0, 3).map((a) => a.slug)).toEqual(['dragon-pet-2', 'dragon-pet', 'unicorn-pet']);
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
    for (const typo of ['scienist', 'separeted', 'throught', 'fairlyland', 'an it might', 'permisions']) {
      expect(text).not.toContain(typo);
    }
  });

  it('gives Interstellar Lander its own description', () => {
    const lander = apps.find((a) => a.slug === 'interstellar-lander');
    expect(lander?.description.join(' ')).not.toContain('Elemental Jewels');
    expect(lander?.description[0]).toContain('Interstellar Lander');
  });

  it('references only files that exist in public/', () => {
    const missing: string[] = [];
    for (const app of apps) {
      const paths = [app.icon, ...(app.banner ? [app.banner] : [])];
      for (const s of app.screenshots ?? []) {
        paths.push(screenshotSrc(app.slug, s.file, 'thumb'), screenshotSrc(app.slug, s.file, 'full'));
      }
      for (const p of paths) if (!existsSync(publicFile(p))) missing.push(`${app.slug}: ${p}`);
    }
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 3: Napisz test helperów**

`src/lib/apps.test.ts`:

```ts
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
    expect(screenshotSrc('dragon-pet-2', 'port1', 'thumb')).toBe('/img/screens/dragon-pet-2/thumb/port1.webp');
  });

  it('strips emoji and collapses whitespace', () => {
    expect(stripEmoji('🔥🐉 Hi ✨there✨ 🚀')).toBe('Hi there');
  });

  it('uses the first sentence without emoji as tagline', () => {
    expect(getTagline(getAppBySlug('dragon-pet-2')!)).toBe('Have you ever wondered how to train your dragon?');
    expect(getTagline(fake(['No punctuation here']))).toBe('No punctuation here');
  });

  it('limits meta descriptions to 160 characters', () => {
    const meta = getMetaDescription(getAppBySlug('dragon-pet-2')!);
    expect(meta.length).toBeLessThanOrEqual(160);
    expect(meta).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(getMetaDescription(fake(['Short.']))).toBe('Short.');
  });
});
```

- [ ] **Step 4: Uruchom testy — mają nie przejść**

Run: `pnpm test src/data src/lib/apps.test.ts`
Expected: FAIL — `Failed to resolve import "./apps"`.

- [ ] **Step 5: Dane aplikacji**

`src/data/apps.ts` (teksty DP2 i Interstellar Lander z `../ntwins-2020-recovered/dp2-current/*.txt`; pozostałe z `docs/legacy/src-2020/AppsConfig.tsx` z poprawkami literówek):

```ts
import type { AppEntry, Screenshot } from './types';

const DP2_SCREENSHOTS: readonly Screenshot[] = [
  'port1', 'port4', 'land5', 'land1', 'port2', 'land6', 'land4', 'port9',
  'port6', 'port8', 'port3', 'port5', 'port7', 'land2', 'land3',
].map((file) => ({ file, orientation: file.startsWith('port') ? 'portrait' : 'landscape' }));

const DRAGON_PET_INTRO =
  'On the snowy peaks of an ancient mountain you have found a magic dragon egg. All you have to do is to keep it at proper temperature, and it might hatch into a virtual baby pet with whom you can spend wonderful adventures by playing, training and taking care of your cute pet. Train a dragon and become creator of your own saga. Care for him and he will become your best, magic friend or simply ignore him and he will eventually run away, get sick or even die.';

export const apps: readonly AppEntry[] = [
  {
    slug: 'dragon-pet-2',
    title: 'Dragon Pet 2',
    packageId: 'pl.ntwins.dragon.pet2',
    icon: '/img/icons/dragon-pet-2.webp',
    banner: '/img/banners/dragon-pet-2.webp',
    tier: 'hero',
    description: [
      '🔥🐉 Have you ever wondered how to train your dragon? 🐉🔥 Now you can experience it and more in this ✨best pet game for free✨. This is the sequel to one of the first and 🚀✨best dragon games on mobile✨🚀. The ultimate next generation in a tamagotchi-like experience thanks to a game built for the 21st century. A free simulator game for kids and the whole family.',
      'On a snowy peak of an ancient mountain you have found a magic tiny egg. All you need to do is to take care of it and with time, that magic egg will hatch into tiny baby creature. Now your wonderful adventure can begin - play, train and cuddle with your cute pet.',
      'Please note: this is completely free game to download and play, but some items can be purchased for real money. If you wish to disable the in-app purchases, simply turn them off in your device’s settings.',
      "This is one the best dragon games at store - I'm not responsible for excess happiness and fun. Big rewards in pleasure and satisfaction.",
    ],
    features: [
      'take care of your dragons🐲 and they will evolve with time',
      'throw dragon ball to play fetch, merge food to prepare meals or bring the rain to wash dragons',
      'multiple different dragon balls⚽ to use with unique effects',
      'dragons love treasures, they sleep on jewels.. so collect precious coins and jewels to fill their cave to the brim',
      'this simulation game work offline👍 No wifi or internet required to enjoy this game',
      'customize your pet with many different clothes or armors',
      'train your dragon and clash with monsters in the Arena to make him stronger',
      'avoid obstacles, collect coins and make the longest run in a dragon rush',
      'switch into adventure mode and explore wilderness or battle creatures on mystical island in this open world',
      'raise power of your epic dragon to the limits',
      'merge dragons food in a cauldron, create meals and feed your tiny dragon to become best creature tamer',
      'become a farmer, grow food and collect other resources or just build what you need and modify the environment in this simulation',
      'merge dragon elements in "match 3" arena. Battle and clash against other monsters in this animal fantasy experience!',
      'find and unlock mystery paths leading to new abilities',
      'just like in other virtual tamagotchi-like games you have to keep your tiny pet parameters high ❤️ and after some time dragons evolve into their big versions',
      'train your drago and become the best dragons trainer in the whole big world',
      'explore dragons city, craft structures and rise their village',
      'join the mania and collect achievements, get best scores or compete with other trainers in online leaderboards',
    ],
    screenshots: DP2_SCREENSHOTS,
  },
  {
    slug: 'dragon-pet',
    title: 'Dragon Pet',
    packageId: 'eu.aagames.dragopet',
    icon: '/img/icons/dragon-pet.webp',
    banner: '/img/banners/dragon-pet.webp',
    tier: 'hero',
    description: [
      DRAGON_PET_INTRO,
      'Like a modern 3D virtual pet, his life will go on even after you close the game and an icon will notify you anytime your dragon needs your help. Hatch your first egg to receive a cute tiny dragon. Create your own story and become the best Dragon Pet trainer in the dragons world. Hear the yelp of your foes. Visit shops in the dragons city and build this fairyland.',
    ],
  },
  {
    slug: 'unicorn-pet',
    title: 'Unicorn Pet',
    packageId: 'eu.aagames.unicornpet',
    icon: '/img/icons/unicorn-pet.webp',
    banner: '/img/banners/unicorn-pet.webp',
    tier: 'hero',
    description: [
      'Unicorn Pet - a new, magical, 3D virtual pet game is here! Pick your pony and enjoy this magical saga in the unicorns world.',
      "In the magical world of the Unicorns, life was peaceful and pleasant. That was until the evil Warlock imprisoned nearly all of the unicorns in his ghastly castle and took away their magic power. Fortunately, there's still the good wizard, who, from time to time, manages to free one of those fairy ponies and return their powers.",
      'Will you try taking care of one of the saved unicorns?',
    ],
  },
  {
    slug: 'real-dragon-pet',
    title: 'Real Dragon Pet',
    packageId: 'eu.aagames.real.dragon.pet',
    icon: '/img/icons/real-dragon-pet.webp',
    banner: '/img/banners/real-dragon-pet.webp',
    tier: 'standard',
    description: [
      'Play and have fun with your own Dragon in the real world thanks to Augmented Reality! Newest game from the makers of the great hit Dragon Pet.',
      'Have you ever wondered how it is to see Dragons in real life, standing next to you? Now you have this chance!',
    ],
  },
  {
    slug: 'dragon-pet-xmass',
    title: 'Dragon Pet Xmass',
    packageId: 'eu.aagames.dragopet.xmass',
    icon: '/img/icons/dragon-pet-xmass.webp',
    banner: '/img/banners/dragon-pet-xmass.webp',
    tier: 'standard',
    description: ['Special Christmas version of Dragon Pet is here!', DRAGON_PET_INTRO],
  },
  {
    slug: 'interstellar-lander',
    title: 'Interstellar Lander',
    packageId: 'eu.aagames.interstellar.lander',
    icon: '/img/icons/interstellar-lander.webp',
    banner: '/img/banners/interstellar-lander.webp',
    tier: 'standard',
    description: [
      'Interstellar Lander is a new fantastic game from the creators of Dragon Pet.',
      'Do you remember Lunar Lander from old times? Did you ever dream to explore alien planets? Want to colonize Mars and other planets? Visit other exoplanets! In Interstellar Lander your task is to land on hundreds of exoplanets.',
      'Experience real-world physics and gravitational forces. Intuitive and simple interface. Earn points and upgrade your Astro Lander. Experience interstellar adventures.',
      'Each planet represents a real one discovered by Kepler, KOROT, WASP and other Earth based and space telescopes. Gravity of each planet is calculated from real data coming from NASA Exoplanet Archives.',
      'Special thanks to NASA scientist Natalie for consultations in the area of exoplanetary properties and habitability.',
    ],
    features: [
      'Real NASA data',
      'Based on Newtonian physics',
      '3D graphics',
      'Customize your spaceship by upgrades',
      'Hundreds of exoplanets (planets orbiting other Stars)',
      'Challenges: time management, velocity control, fuel limits',
      '44 campaigns contains 660 exoplanets to land',
    ],
  },
  {
    slug: 'beautiful-battery-widget',
    title: 'Beautiful Battery Widget',
    packageId: 'eu.aagames.widget.battery.beautiful',
    icon: '/img/icons/beautiful-battery-widget.webp',
    banner: '/img/banners/beautiful-battery-widget.webp',
    tier: 'standard',
    description: ['An elegant battery widget with battery level on the status bar.'],
  },
  {
    slug: 'circle-battery-widget',
    title: 'Circle Battery Widget',
    packageId: 'eu.aagames.widget.battery.circle',
    icon: '/img/icons/circle-battery-widget.webp',
    banner: '/img/banners/circle-battery-widget.webp',
    tier: 'standard',
    description: ['Beautifully designed, simple battery widget to optimize battery usage and save some energy.'],
  },
  {
    slug: 'elemental-jewels',
    title: 'Elemental Jewels',
    packageId: 'eu.aagames.elementaljewels.free',
    icon: '/img/icons/elemental-jewels.webp',
    banner: '/img/banners/elemental-jewels.webp',
    tier: 'standard',
    description: [
      "Deep under the Earth's surface there is a secret hidden laboratory... For the last 20 years a crazy scientist has been working on a powerful energy source based on natural elements. Your mission is to help him to gather all Elemental Jewels!",
    ],
  },
  {
    slug: 'laboratory-jewels',
    title: 'Laboratory Jewels',
    packageId: 'eu.aagames.laboratory.jewels',
    icon: '/img/icons/laboratory-jewels.webp',
    banner: '/img/banners/laboratory-jewels.webp',
    tier: 'standard',
    description: [
      'Discover the secrets of a mysterious laboratory with Laboratory Jewels.',
      'Join Doctor Jewel - the crazy professor in the great saga of discovering new chemicals!',
      "Match, switch and mix jewels to create new ones through over 70 levels of pure laboratory adventure! Whether you played the other jewels games, you should try to play this game, it's newest, very addicting and completely free to play!",
    ],
  },
  {
    slug: 'flappy-dragon',
    title: 'Flappy Dragon',
    packageId: 'eu.aagames.floppydragon',
    icon: '/img/icons/flappy-dragon.webp',
    banner: '/img/banners/flappy-dragon.webp',
    tier: 'standard',
    description: ['Fly through the sky and avoid trees with your awesome dragon in 3D.'],
  },
  {
    slug: 'unicorn-ride',
    title: 'Unicorn Ride',
    packageId: 'eu.aagames.unicornride',
    icon: '/img/icons/unicorn-ride.webp',
    banner: '/img/banners/unicorn-ride.webp',
    tier: 'standard',
    description: [
      'Your mission seems to be simple - one Unicorn baby got separated from his family and you have to help him in his journey through Scary Lands, full of monsters and obstacles.',
      'Explore the magic world of unicorns riding them in 3D.',
    ],
  },
  {
    slug: 'football-wroclaw-panthers',
    title: 'Football Wroclaw Panthers',
    packageId: 'eu.aagames.kick',
    icon: '/img/icons/football-wroclaw-panthers.webp',
    banner: '/img/banners/football-wroclaw-panthers.webp',
    tier: 'standard',
    description: ['Become a real PLFA kicker! Live out your dream as a player of Wroclaw Panthers and reach for the cup!'],
  },
  {
    slug: 'my-real-girlfriend',
    title: 'My Real Girlfriend',
    packageId: 'eu.aagames.my.real.girl',
    icon: '/img/icons/my-real-girlfriend.webp',
    banner: '/img/banners/my-real-girlfriend.webp',
    tier: 'standard',
    description: ['Play and have fun with your own girlfriend in the real world thanks to Augmented Reality!'],
  },
  {
    slug: 'dragon-pet-vr',
    title: 'Dragon Pet VR',
    packageId: 'eu.aagames.vr.dragonpet',
    icon: '/img/icons/dragon-pet-vr.webp',
    banner: '/img/banners/dragon-pet-vr.webp',
    tier: 'standard',
    description: [
      'Experience the magic of Virtual Reality and feel as if you were standing next to your dragon with VR Dragon Pet.',
    ],
  },
];
```

- [ ] **Step 6: Helpery**

`src/lib/apps.ts`:

```ts
import { apps } from '@/data/apps';
import type { AppEntry } from '@/data/types';

export const getApps = (): readonly AppEntry[] => apps;

export const getAppBySlug = (slug: string): AppEntry | undefined => apps.find((a) => a.slug === slug);

export const getHeroApps = (): AppEntry[] => apps.filter((a) => a.tier === 'hero');

export const getStandardApps = (): AppEntry[] => apps.filter((a) => a.tier === 'standard');

export const playStoreUrl = (packageId: string): string =>
  `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`;

export const screenshotSrc = (slug: string, file: string, size: 'thumb' | 'full'): string =>
  `/img/screens/${slug}/${size}/${file}.webp`;

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

export const stripEmoji = (text: string): string => text.replace(EMOJI, '').replace(/\s+/g, ' ').trim();

export function getTagline(app: AppEntry): string {
  const first = stripEmoji(app.description[0] ?? '');
  const sentence = first.match(/^.*?[.!?](?=\s|$)/);
  return sentence ? sentence[0] : first;
}

const META_MAX = 160;

export function getMetaDescription(app: AppEntry): string {
  const text = stripEmoji(app.description[0] ?? '');
  return text.length <= META_MAX ? text : `${text.slice(0, META_MAX - 1).trimEnd()}…`;
}
```

- [ ] **Step 7: Uruchom testy**

Run: `pnpm test`
Expected: wszystkie PASS (asset 5, apps data 9, apps helpers 7).

- [ ] **Step 8: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add typed apps data for 15 games with helpers`.

---

### Task 4: Motyw, fonty, layout, stopka z dynamicznym rokiem

**Files:**
- Create: `src/theme/tokens.ts`, `src/theme/fonts.ts`, `src/theme/theme.ts`, `src/components/motion/MotionProvider.tsx`, `src/components/motion/reveal-css.ts`, `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx` (całkowite zastąpienie)
- Test: `src/components/layout/Footer.test.tsx`

**Interfaces:**
- Produces (`src/theme/tokens.ts`): `colors` (`bg, paper, primary, gold, text, textMuted, border`), `glass` (obiekt stylów), `accentGradient` (string), `gradientText` (obiekt stylów), `NAV_HEIGHT = 72`.
- Produces: `theme` (MUI, z `'use client'`), `fontBody`, `fontDisplay` (next/font, z `.variable`).
- Produces: `NOSCRIPT_REVEAL_CSS: string`, `<MotionProvider>`, `<Footer />`.

- [ ] **Step 1: Napisz test stopki**

`src/components/layout/Footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('replaces the build year with the current year from the browser', async () => {
    vi.stubEnv('BUILD_YEAR', '2026');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2031-03-01T12:00:00Z'));

    render(<Footer />);

    expect(await screen.findByText('© 2031 ntwins. All rights reserved.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Uruchom test — ma nie przejść**

Run: `pnpm test src/components/layout/Footer.test.tsx`
Expected: FAIL — `Failed to resolve import "./Footer"`.

- [ ] **Step 3: Tokeny, fonty, motyw**

`src/theme/tokens.ts`:

```ts
export const colors = {
  bg: '#0f0c14',
  paper: '#1a1522',
  primary: '#8e44c4',
  gold: '#f5b524',
  text: '#f3eef8',
  textMuted: '#b9aec7',
  border: 'rgba(255,255,255,0.08)',
} as const;

export const NAV_HEIGHT = 72;

export const accentGradient = `linear-gradient(90deg, ${colors.primary}, ${colors.gold})`;

export const glass = {
  backgroundColor: 'rgba(26,21,34,0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${colors.border}`,
} as const;

export const gradientText = {
  backgroundImage: accentGradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const;
```

`src/theme/fonts.ts`:

```ts
import { Cinzel_Decorative, Inter } from 'next/font/google';

export const fontDisplay = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const fontBody = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
});
```

`src/theme/theme.ts`:

```ts
'use client';

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { colors, NAV_HEIGHT } from './tokens';

const display = 'var(--font-display), Georgia, serif';

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.primary },
    secondary: { main: colors.gold },
    background: { default: colors.bg, paper: colors.paper },
    text: { primary: colors.text, secondary: colors.textMuted },
    divider: colors.border,
  },
  typography: {
    fontFamily: 'var(--font-body), system-ui, -apple-system, sans-serif',
    h1: { fontFamily: display, fontWeight: 700, letterSpacing: '0.01em' },
    h2: { fontFamily: display, fontWeight: 700 },
    h3: { fontFamily: display, fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        '@media (prefers-reduced-motion: reduce)': { html: { scrollBehavior: 'auto' } },
        body: {
          backgroundColor: colors.bg,
          backgroundImage: 'radial-gradient(ellipse at top, rgba(142,68,196,0.12), transparent 60%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '[id]': { scrollMarginTop: `${NAV_HEIGHT + 16}px` },
        '::selection': { backgroundColor: colors.primary, color: colors.text },
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export const theme = responsiveFontSizes(baseTheme);
```

- [ ] **Step 4: Motion provider i CSS dla `<noscript>`**

`src/components/motion/reveal-css.ts`:

```ts
/** Without JS, motion's initial state (opacity 0 / offset / clip) would hide content forever. */
export const NOSCRIPT_REVEAL_CSS =
  '[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}';
```

`src/components/motion/MotionProvider.tsx`:

```tsx
'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/** reducedMotion="user": transforms are skipped for users with prefers-reduced-motion; opacity still fades. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

- [ ] **Step 5: Stopka**

`src/components/layout/Footer.tsx`:

```tsx
'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { colors } from '@/theme/tokens';

// BUILD_YEAR is inlined at build time (next.config.ts) so server HTML and first client render match;
// the effect then switches to the visitor's current year, so the footer never goes stale.
const buildYear = () => Number(process.env.BUILD_YEAR) || new Date().getFullYear();

export function Footer() {
  const [year, setYear] = useState(buildYear);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <Box component="footer" sx={{ py: 4, mt: 8, textAlign: 'center', borderTop: `1px solid ${colors.border}` }}>
      <Typography variant="body2" color="text.secondary">
        © {year} ntwins. All rights reserved.
      </Typography>
    </Box>
  );
}
```

- [ ] **Step 6: Layout**

`src/app/layout.tsx` (zastąp całość):

```tsx
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { NOSCRIPT_REVEAL_CSS } from '@/components/motion/reveal-css';
import { fontBody, fontDisplay } from '@/theme/fonts';
import { theme } from '@/theme/theme';

export const metadata: Metadata = {
  metadataBase: new URL('https://drachelski.github.io'),
  title: { default: 'ntwins — virtual pets & indie games', template: '%s — ntwins' },
  description: 'Dragon Pet 2, Dragon Pet, Unicorn Pet and other mobile games and apps by ntwins.',
};

export const viewport: Viewport = { themeColor: '#0f0c14' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: `<style>${NOSCRIPT_REVEAL_CSS}</style>` }} />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MotionProvider>
              <main>{children}</main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

Jeśli zainstalowana wersja `@mui/material-nextjs` nie ma ścieżki `v15-appRouter`, użyj `@mui/material-nextjs/v14-appRouter` (to samo API).

- [ ] **Step 7: Testy, lint, build**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: wszystkie testy PASS (w tym Footer), build OK. `grep -o '© 20[0-9][0-9] ntwins' out/index.html` wypisuje rok bieżący.

- [ ] **Step 8: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add dark theme, fonts, layout and footer with live year`.

---

### Task 5: Pasek nawigacji

**Files:**
- Create: `src/components/layout/NavBar.tsx`
- Modify: `src/app/layout.tsx` (dodanie `<NavBar />`)
- Test: `src/components/layout/NavBar.test.tsx`

**Interfaces:**
- Consumes: `asset()`, `colors`, `NAV_HEIGHT`.
- Produces: `<NavBar />`, `NAV_LINKS: readonly { label: string; href: string }[]` (`Games → /#apps`, `Contact → /#contact`).

- [ ] **Step 1: Napisz test**

`src/components/layout/NavBar.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavBar } from './NavBar';

// jsdom ignores media queries, so the desktop nav (display: none below md) counts as hidden — query with hidden: true.
const link = (name: string) => screen.getAllByRole('link', { name, hidden: true });

describe('NavBar', () => {
  it('links the logo to home and sections via anchors', () => {
    render(<NavBar />);
    expect(link('ntwins home')[0]).toHaveAttribute('href', '/');
    expect(link('Games')[0]).toHaveAttribute('href', '/#apps');
    expect(link('Contact')[0]).toHaveAttribute('href', '/#contact');
  });

  it('opens the mobile drawer with the same links', () => {
    render(<NavBar />);
    expect(link('Games')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(link('Games')).toHaveLength(2);
    expect(link('Contact')).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Uruchom test — ma nie przejść**

Run: `pnpm test src/components/layout/NavBar.test.tsx`
Expected: FAIL — `Failed to resolve import "./NavBar"`.

- [ ] **Step 3: Implementacja**

`src/components/layout/NavBar.tsx`:

```tsx
'use client';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import NextLink from 'next/link';
import { useState } from 'react';
import { asset } from '@/lib/asset';
import { colors, NAV_HEIGHT } from '@/theme/tokens';

export const NAV_LINKS = [
  { label: 'Games', href: '/#apps' },
  { label: 'Contact', href: '/#contact' },
] as const;

export function NavBar() {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: NAV_HEIGHT,
        justifyContent: 'center',
        backgroundColor: scrolled ? 'rgba(15,12,20,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.35)' : 'none',
        borderBottom: `1px solid ${scrolled ? colors.border : 'transparent'}`,
        transition: 'background-color .3s, box-shadow .3s, border-color .3s',
      }}
    >
      <Toolbar sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Box component={NextLink} href="/" aria-label="ntwins home" sx={{ display: 'flex' }}>
          <Box component="img" src={asset('/img/logo-ntwins.webp')} alt="" sx={{ height: 28, width: 'auto' }} />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.href} component={NextLink} href={link.href} color="inherit">
              {link.label}
            </Button>
          ))}
        </Box>
        <IconButton
          aria-label="Open menu"
          color="inherit"
          onClick={() => setOpen(true)}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 260, backgroundColor: colors.paper } } }}
      >
        <List component="nav" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <ListItemButton key={link.href} component={NextLink} href={link.href} onClick={() => setOpen(false)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
```

- [ ] **Step 4: Dodaj NavBar do layoutu**

W `src/app/layout.tsx` dodaj import `import { NavBar } from '@/components/layout/NavBar';` i wstaw `<NavBar />` bezpośrednio przed `<main>{children}</main>`.

- [ ] **Step 5: Testy, lint, build**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: wszystkie PASS, build OK.

- [ ] **Step 6: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add sticky navigation bar with mobile drawer`.

---

### Task 6: Wspólne klocki — SafeImage, ButtonLink, Reveal, hook media query, strażnik ścieżek

**Files:**
- Create: `src/components/common/SafeImage.tsx`, `src/components/common/ButtonLink.tsx`, `src/components/motion/Reveal.tsx`, `src/lib/useMediaQueryMatch.ts`, `src/test/matchMedia.ts`
- Test: `src/components/common/SafeImage.test.tsx`, `src/components/motion/Reveal.test.tsx`, `src/lib/no-bare-paths.test.ts`

**Interfaces:**
- Produces:
  - `SafeImage(props: { src: string; alt: string; fallbackLabel: string; width?: number; height?: number; loading?: 'lazy' | 'eager'; fetchPriority?: 'high' | 'low' | 'auto'; sx?: SxProps<Theme> })` — `src` to surowa ścieżka z `public/` (sam woła `asset()`); przy błędzie renderuje `data-testid="image-fallback"` z pierwszą literą `fallbackLabel`. `sx` musi być obiektem (nie funkcją).
  - `ButtonLink(props: { href: string; children: ReactNode; variant?: ButtonProps['variant']; color?: ButtonProps['color']; size?: ButtonProps['size']; startIcon?: ReactNode; sx?: ButtonProps['sx'] })`.
  - `Reveal(props: { children: ReactNode; delay?: number; fill?: boolean })` — wrapper z `data-reveal`, animuje przy wejściu w viewport.
  - `useMediaQueryMatch(query: string): boolean` (SSR: `false`), `usePrefersReducedMotion(): boolean`, `REDUCED_MOTION_QUERY`, `FINE_POINTER_QUERY`.
  - `mockMatchMedia(matching?: string[])` — helper testowy.

- [ ] **Step 1: Napisz testy**

`src/components/common/SafeImage.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SafeImage } from './SafeImage';

describe('SafeImage', () => {
  it('prefixes the base path', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/apps-dashboard');
    render(<SafeImage src="/img/icons/x.webp" alt="X icon" fallbackLabel="X" />);
    expect(screen.getByAltText('X icon')).toHaveAttribute('src', '/apps-dashboard/img/icons/x.webp');
  });

  it('renders an initial-letter fallback when the image fails', () => {
    render(<SafeImage src="/img/missing.webp" alt="Dragon icon" fallbackLabel="dragon" />);
    fireEvent.error(screen.getByAltText('Dragon icon'));
    const fallback = screen.getByTestId('image-fallback');
    expect(fallback).toHaveTextContent('D');
    expect(fallback).toHaveAttribute('aria-label', 'Dragon icon');
    expect(screen.queryByAltText('Dragon icon')).not.toBeInTheDocument();
  });

  it('hides the fallback from assistive tech for decorative images', () => {
    render(<SafeImage src="/img/missing.webp" alt="" fallbackLabel="X" />);
    fireEvent.error(screen.getByRole('presentation', { hidden: true }));
    expect(screen.getByTestId('image-fallback')).toHaveAttribute('aria-hidden', 'true');
  });
});
```

`src/components/motion/Reveal.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reveal } from './Reveal';
import { NOSCRIPT_REVEAL_CSS } from './reveal-css';

describe('Reveal', () => {
  it('marks content with data-reveal so the noscript style can unhide it', () => {
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>,
    );
    expect(screen.getByText('Hello').parentElement).toHaveAttribute('data-reveal');
  });

  it('noscript CSS neutralises every animated property', () => {
    expect(NOSCRIPT_REVEAL_CSS).toContain('[data-reveal]');
    for (const rule of ['opacity:1', 'transform:none', 'clip-path:none']) {
      expect(NOSCRIPT_REVEAL_CSS).toContain(rule);
    }
  });
});
```

`src/lib/no-bare-paths.test.ts`:

```ts
// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = path.join(process.cwd(), 'src');

// Raw <img>/motion.img/component="img" with a literal "/..." src, or CSS url("/...") — these miss basePath.
const PATTERNS = [
  /<(?:img|motion\.img)\b[^>]*?\bsrc=\{?\s*["'`]\//s,
  /component="img"[^>]*?\bsrc=\{?\s*["'`]\//s,
  /url\(\s*["'`]?\//,
];

describe('public asset paths', () => {
  it('always go through asset() in components', () => {
    const files = readdirSync(SRC, { recursive: true, encoding: 'utf8' }).filter(
      (f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'),
    );
    const offenders = files.filter((f) => {
      const code = readFileSync(path.join(SRC, f), 'utf8');
      return PATTERNS.some((re) => re.test(code));
    });
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `pnpm test src/components/common src/components/motion src/lib/no-bare-paths.test.ts`
Expected: FAIL — brak modułów `./SafeImage`, `./Reveal` (test ścieżek przechodzi już teraz — to strażnik na przyszłość).

- [ ] **Step 3: Hook media query i helper testowy**

`src/lib/useMediaQueryMatch.ts`:

```ts
import { useEffect, useState } from 'react';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** SSR-safe: always false on the server and during hydration, then tracks the real value. */
export function useMediaQueryMatch(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const usePrefersReducedMotion = (): boolean => useMediaQueryMatch(REDUCED_MOTION_QUERY);
```

`src/test/matchMedia.ts`:

```ts
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
```

- [ ] **Step 4: SafeImage**

`src/components/common/SafeImage.tsx`:

```tsx
'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { accentGradient } from '@/theme/tokens';

export interface SafeImageProps {
  /** Path inside public/, e.g. '/img/icons/x.webp' — asset() is applied here. */
  src: string;
  alt: string;
  /** First letter is shown when the image fails to load. */
  fallbackLabel: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sx?: SxProps<Theme>;
}

const asArray = (sx?: SxProps<Theme>) => (Array.isArray(sx) ? sx : [sx]);

export function SafeImage({
  src,
  alt,
  fallbackLabel,
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  sx,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image that failed before hydration never fires onError on the client.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0 && img.currentSrc) setFailed(true);
  }, []);

  if (failed) {
    const decorative = alt === '';
    return (
      <Box
        data-testid="image-fallback"
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : alt}
        aria-hidden={decorative ? true : undefined}
        sx={[
          {
            display: 'grid',
            placeItems: 'center',
            backgroundImage: accentGradient,
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            aspectRatio: width && height ? `${width} / ${height}` : undefined,
          },
          ...asArray(sx),
        ]}
      >
        {fallbackLabel.charAt(0).toUpperCase()}
      </Box>
    );
  }

  return (
    <Box
      component="img"
      ref={imgRef}
      src={asset(src)}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
      sx={[{ display: 'block', maxWidth: '100%', height: 'auto' }, ...asArray(sx)]}
    />
  );
}
```

- [ ] **Step 5: ButtonLink i Reveal**

`src/components/common/ButtonLink.tsx`:

```tsx
'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

/** MUI Button rendered as next/link — usable from server components (no component props cross the boundary). */
export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  startIcon?: ReactNode;
  sx?: ButtonProps['sx'];
}

export function ButtonLink({ href, children, ...props }: ButtonLinkProps) {
  return (
    <Button component={NextLink} href={href} {...props}>
      {children}
    </Button>
  );
}
```

`src/components/motion/Reveal.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export interface RevealProps {
  children: ReactNode;
  /** Seconds; use for staggering lists. */
  delay?: number;
  /** Stretch to the parent's height (grid cells). */
  fill?: boolean;
}

export function Reveal({ children, delay = 0, fill = false }: RevealProps) {
  return (
    <motion.div
      data-reveal=""
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={fill ? { height: '100%' } : undefined}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Uruchom testy**

Run: `pnpm test`
Expected: wszystkie PASS. Jeśli test „decorative” nie znajduje elementu przez `getByRole('presentation')` (obrazek z `alt=""` ma rolę `presentation`), zamień zapytanie na `container.querySelector('img')!` — zachowując asercję.

- [ ] **Step 7: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add SafeImage, ButtonLink, Reveal and media query hook`.

---

### Task 7: Sekcja Apps & Games — kafle i siatka bento

**Files:**
- Create: `src/components/home/AppTile.tsx`, `src/components/home/AppsSection.tsx`
- Modify: `src/app/page.tsx` (całkowite zastąpienie)
- Test: `src/components/home/AppTile.test.tsx`, `src/components/home/AppsSection.test.tsx`

**Interfaces:**
- Consumes: `AppEntry`, `getHeroApps`, `getStandardApps`, `getTagline`, `SafeImage`, `Reveal`, `useMediaQueryMatch`, `FINE_POINTER_QUERY`, `usePrefersReducedMotion`, `glass`, `colors`, `gradientText`.
- Produces: `type TileVariant = 'featured' | 'hero' | 'standard'`, `<AppTile app variant />` (link `/apps/{slug}/`, nazwa dostępna = tytuł, ikona `alt="{tytuł} icon"`), `<AppsSection />` (`<section id="apps">`, lista 15 kafli).

- [ ] **Step 1: Napisz testy**

`src/components/home/AppTile.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAppBySlug } from '@/lib/apps';
import { AppTile } from './AppTile';

const dp2 = getAppBySlug('dragon-pet-2')!;
const lander = getAppBySlug('interstellar-lander')!;

describe('AppTile', () => {
  it('links to the app page with an accessible name and icon alt', () => {
    render(<AppTile app={dp2} variant="featured" />);
    expect(screen.getByRole('link', { name: 'Dragon Pet 2' })).toHaveAttribute('href', '/apps/dragon-pet-2/');
    expect(screen.getByAltText('Dragon Pet 2 icon')).toBeInTheDocument();
  });

  it('shows the Featured badge and tagline only for the featured variant', () => {
    const { unmount } = render(<AppTile app={dp2} variant="featured" />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Have you ever wondered how to train your dragon?')).toBeInTheDocument();
    unmount();

    render(<AppTile app={lander} variant="standard" />);
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Interstellar Lander' })).toBeInTheDocument();
  });
});
```

`src/components/home/AppsSection.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppsSection } from './AppsSection';

describe('AppsSection', () => {
  it('renders all 15 apps with the three hero apps first', () => {
    render(<AppsSection />);
    const list = screen.getByRole('list');
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(15);
    expect(links.slice(0, 3).map((l) => l.getAttribute('aria-label'))).toEqual([
      'Dragon Pet 2',
      'Dragon Pet',
      'Unicorn Pet',
    ]);
    expect(screen.getAllByText('Featured')).toHaveLength(1);
  });

  it('is the #apps anchor target with a heading', () => {
    render(<AppsSection />);
    expect(screen.getByRole('heading', { level: 2, name: 'Apps & Games' }).closest('section')).toHaveAttribute(
      'id',
      'apps',
    );
  });
});
```

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `pnpm test src/components/home`
Expected: FAIL — brak modułów `./AppTile`, `./AppsSection`.

- [ ] **Step 3: AppTile**

`src/components/home/AppTile.tsx`:

```tsx
'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { keyframes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion, useSpring } from 'motion/react';
import NextLink from 'next/link';
import type { PointerEvent } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import type { AppEntry } from '@/data/types';
import { getTagline } from '@/lib/apps';
import { FINE_POINTER_QUERY, useMediaQueryMatch, usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';
import { colors, glass } from '@/theme/tokens';

export type TileVariant = 'featured' | 'hero' | 'standard';

const MAX_TILT_DEG = 6;

const kenBurns = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.08); }
`;

const clamp2 = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
} as const;

export function AppTile({ app, variant }: { app: AppEntry; variant: TileVariant }) {
  const finePointer = useMediaQueryMatch(FINE_POINTER_QUERY);
  const reducedMotion = usePrefersReducedMotion();
  const tiltEnabled = finePointer && !reducedMotion;
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const isLarge = variant !== 'standard';
  const isFeatured = variant === 'featured';

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 2 * MAX_TILT_DEG);
    rotateX.set(-py * 2 * MAX_TILT_DEG);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900, height: '100%' }}
      whileTap={{ scale: 0.97 }}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <Box
        component={NextLink}
        href={`/apps/${app.slug}/`}
        aria-label={app.title}
        sx={{
          ...glass,
          position: 'relative',
          display: 'flex',
          alignItems: isLarge ? 'flex-end' : 'center',
          justifyContent: isLarge ? 'flex-start' : 'center',
          height: '100%',
          p: isLarge ? { xs: 2, md: 3 } : 2,
          borderRadius: 4,
          overflow: 'hidden',
          color: 'text.primary',
          textDecoration: 'none',
          transition: 'box-shadow .3s, border-color .3s',
          '&:hover': {
            borderColor: colors.primary,
            boxShadow: `0 0 0 1px ${colors.primary}, 0 12px 40px rgba(142,68,196,0.45)`,
          },
          '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: 3 },
        }}
      >
        {isLarge && app.banner && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(15,12,20,0.95) 0%, rgba(15,12,20,0.45) 55%, rgba(15,12,20,0) 100%)',
              },
            }}
          >
            <SafeImage
              src={app.banner}
              alt=""
              fallbackLabel={app.title}
              width={1024}
              height={500}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                animation: `${kenBurns} 20s ease-in-out infinite alternate`,
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: isLarge ? 'row' : 'column',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            textAlign: isLarge ? 'left' : 'center',
          }}
        >
          <SafeImage
            src={app.icon}
            alt={`${app.title} icon`}
            fallbackLabel={app.title}
            width={512}
            height={512}
            sx={{
              width: isFeatured ? { xs: 64, md: 96 } : isLarge ? { xs: 56, md: 72 } : { xs: 72, md: 96 },
              flexShrink: 0,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            {isFeatured && <Chip label="Featured" size="small" color="secondary" sx={{ mb: 1, fontWeight: 600 }} />}
            <Typography
              component="h3"
              sx={{
                ...clamp2,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                lineHeight: 1.2,
                overflowWrap: 'anywhere',
                fontSize: isFeatured
                  ? { xs: '1.5rem', md: '2.25rem' }
                  : isLarge
                    ? { xs: '1.2rem', md: '1.5rem' }
                    : { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              {app.title}
            </Typography>
            {isFeatured && (
              <Typography color="text.secondary" sx={{ ...clamp2, mt: 1 }}>
                {getTagline(app)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
```

- [ ] **Step 4: AppsSection**

`src/components/home/AppsSection.tsx`:

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Reveal } from '@/components/motion/Reveal';
import { getHeroApps, getStandardApps } from '@/lib/apps';
import { gradientText } from '@/theme/tokens';
import { AppTile, type TileVariant } from './AppTile';

const SPAN: Record<TileVariant, { gridColumn: string; gridRow?: string }> = {
  featured: { gridColumn: 'span 2', gridRow: 'span 2' },
  hero: { gridColumn: 'span 2' },
  standard: { gridColumn: 'span 1' },
};

const STAGGER_S = 0.06;

export function AppsSection() {
  const tiles = [
    ...getHeroApps().map((app, i) => ({ app, variant: (i === 0 ? 'featured' : 'hero') as TileVariant })),
    ...getStandardApps().map((app) => ({ app, variant: 'standard' as TileVariant })),
  ];

  return (
    <Box component="section" id="apps" aria-labelledby="apps-title" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Reveal>
          <Typography id="apps-title" variant="h2" align="center" sx={{ ...gradientText, mb: { xs: 4, md: 6 } }}>
            Apps &amp; Games
          </Typography>
        </Reveal>
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            p: 0,
            m: 0,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            gridAutoRows: { xs: '180px', sm: '200px', lg: '220px' },
            gridAutoFlow: 'dense',
            gap: { xs: 2, md: 3 },
          }}
        >
          {tiles.map(({ app, variant }, i) => (
            <Box component="li" key={app.slug} sx={SPAN[variant]}>
              <Reveal delay={Math.min(i, 10) * STAGGER_S} fill>
                <AppTile app={app} variant={variant} />
              </Reveal>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 5: Strona główna**

`src/app/page.tsx` (zastąp całość):

```tsx
import { AppsSection } from '@/components/home/AppsSection';

export default function HomePage() {
  return <AppsSection />;
}
```

- [ ] **Step 6: Testy, lint, build, podgląd**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: wszystkie PASS, build OK.

Run: `pnpm dev` i otwórz `http://localhost:3000/`. Expected: na ≥1200 px DP2 zajmuje lewy blok 2×2, DP i UP po prawej (2×1 każdy), poniżej 12 małych kafli po 4 w rzędzie; na 375 px (DevTools) DP2 na całą szerokość, DP i UP pod nim, małe kafle po 2 w rzędzie, długie tytuły („Football Wroclaw Panthers”) zawijają się do 2 linii bez wychodzenia poza kafel.

- [ ] **Step 7: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add bento grid of app tiles with featured Dragon Pet 2`.

---

### Task 8: Hero z animowanym tłem

**Files:**
- Create: `src/components/home/EmberBackground.tsx`, `src/components/home/Hero.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/home/EmberBackground.test.tsx`, `src/components/home/Hero.test.tsx`

**Interfaces:**
- Consumes: `asset()`, `usePrefersReducedMotion`, `REDUCED_MOTION_QUERY`, `colors`, `mockMatchMedia`.
- Produces: `<EmberBackground />` (canvas `data-testid="ember-canvas"`; brak pętli animacji przy reduced motion), `<Hero />`, `HERO_SLOGAN = 'Virtual pets & indie games'`.

- [ ] **Step 1: Napisz testy**

`src/components/home/EmberBackground.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY } from '@/lib/useMediaQueryMatch';
import { mockMatchMedia } from '@/test/matchMedia';
import { EmberBackground } from './EmberBackground';

const fakeContext = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
};

describe('EmberBackground', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      fakeContext as unknown as CanvasRenderingContext2D,
    );
  });

  it('starts the particle animation by default', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    render(<EmberBackground />);
    expect(raf).toHaveBeenCalled();
    expect(screen.getByTestId('ember-canvas')).toBeVisible();
  });

  it('does not animate and hides the canvas with prefers-reduced-motion', () => {
    mockMatchMedia([REDUCED_MOTION_QUERY]);
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    render(<EmberBackground />);
    expect(raf).not.toHaveBeenCalled();
    expect(screen.getByTestId('ember-canvas')).toHaveStyle({ display: 'none' });
  });
});
```

`src/components/home/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero, HERO_SLOGAN } from './Hero';

describe('Hero', () => {
  it('renders the logo as the page h1, slogan and CTA to the games', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: 'ntwins' })).toBeInTheDocument();
    expect(screen.getByText(HERO_SLOGAN)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore games' })).toHaveAttribute('href', '#apps');
  });

  it('keeps animated elements visible without JS (data-reveal)', () => {
    render(<Hero />);
    expect(screen.getByAltText('ntwins')).toHaveAttribute('data-reveal');
    expect(screen.getByText(HERO_SLOGAN).closest('[data-reveal]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `pnpm test src/components/home/EmberBackground.test.tsx src/components/home/Hero.test.tsx`
Expected: FAIL — brak modułów.

- [ ] **Step 3: EmberBackground**

`src/components/home/EmberBackground.tsx`:

```tsx
'use client';

import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { REDUCED_MOTION_QUERY, usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';

const PARTICLE_COUNT = 60;
const MAX_DPR = 2;
// RGB triplets: brand purple, gold, light gold
const PALETTE = ['142, 68, 196', '245, 181, 36', '255, 214, 120'];
const STATIC_BG = [
  'radial-gradient(ellipse at 50% 100%, rgba(142,68,196,0.35), transparent 60%)',
  'radial-gradient(ellipse at 80% 20%, rgba(245,181,36,0.12), transparent 50%)',
].join(', ');

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  color: string;
}

function spawn(width: number, height: number, anywhere: boolean): Particle {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 10,
    r: 0.8 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.2 + Math.random() * 0.6,
    phase: Math.random(),
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
  };
}

export function EmberBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check matchMedia directly too: the hook reports false on the very first render.
    if (reducedMotion || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const pointer = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles = Array.from({ length: PARTICLE_COUNT }, () => spawn(width, height, true));

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.y -= p.vy;
        p.x += p.vx + pointer.x * 0.15 * p.r;
        p.phase += 0.004;
        if (p.y < -10 || p.x < -10 || p.x > width + 10) particles[i] = spawn(width, height, false);
        const alpha = 0.35 + 0.35 * Math.sin(p.phase * Math.PI * 2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.shadowBlur = 8 * p.r;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.arc(p.x, p.y + pointer.y * 4 * p.r, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame && inView && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });

    observer.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundImage: STATIC_BG }}>
      <canvas
        ref={canvasRef}
        data-testid="ember-canvas"
        style={{ width: '100%', height: '100%', display: reducedMotion ? 'none' : 'block' }}
      />
    </Box>
  );
}
```

- [ ] **Step 4: Hero**

`src/components/home/Hero.tsx`:

```tsx
'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { asset } from '@/lib/asset';
import { usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';
import { EmberBackground } from './EmberBackground';

export const HERO_SLOGAN = 'Virtual pets & indie games';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const bounce = keyframes`
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 8px); }
`;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Box
      ref={ref}
      component="section"
      aria-label="Intro"
      sx={{
        position: 'relative',
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <motion.div style={{ position: 'absolute', inset: 0, y: reducedMotion ? 0 : backgroundY }}>
        <EmberBackground />
      </motion.div>

      <motion.div style={{ position: 'relative', zIndex: 1, padding: '0 24px', opacity: reducedMotion ? 1 : contentOpacity }}>
        <Typography component="h1" sx={{ m: 0 }}>
          <motion.img
            data-reveal=""
            src={asset('/img/logo-ntwins.webp')}
            alt="ntwins"
            fetchPriority="high"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
            style={{ display: 'block', width: 'min(80vw, 560px)', height: 'auto', margin: '0 auto' }}
          />
        </Typography>
        <motion.div
          data-reveal=""
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: EASE_OUT }}
        >
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mt: 3 }}>
            {HERO_SLOGAN}
          </Typography>
          <Button
            href="#apps"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4, px: 4, color: '#fff', boxShadow: '0 0 32px rgba(142,68,196,0.55)' }}
          >
            Explore games
          </Button>
        </motion.div>
      </motion.div>

      <Box
        component="a"
        href="#apps"
        aria-label="Scroll to games"
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'text.secondary',
          animation: `${bounce} 2s ease-in-out infinite`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        <KeyboardArrowDownIcon fontSize="large" />
      </Box>
    </Box>
  );
}
```

- [ ] **Step 5: Dodaj Hero do strony**

`src/app/page.tsx` (zastąp całość):

```tsx
import { AppsSection } from '@/components/home/AppsSection';
import { Hero } from '@/components/home/Hero';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AppsSection />
    </>
  );
}
```

- [ ] **Step 6: Testy, lint, build, podgląd**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: wszystkie PASS (w tym strażnik ścieżek — `src={asset(...)}` nie jest flagowany).

Run: `pnpm dev`. Expected: hero na pełną wysokość z unoszącymi się iskrami, logo odsłania się od lewej, po przewinięciu treść blednie, tło przesuwa się wolniej. W DevTools → Rendering → „Emulate CSS prefers-reduced-motion: reduce”: brak iskier (statyczny gradient), brak parallaxu, strzałka nie podskakuje.

- [ ] **Step 7: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add hero with ember particles and scroll parallax`.

---

### Task 9: Sekcja kontaktu z kopiowaniem adresu

**Files:**
- Create: `src/lib/site.ts`, `src/components/home/CopyEmailButton.tsx`, `src/components/home/ContactSection.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/home/CopyEmailButton.test.tsx`

**Interfaces:**
- Produces: `CONTACT_EMAIL = 'ntwins.info@gmail.com'` (`src/lib/site.ts`), `<CopyEmailButton email />` (renderuje się tylko gdy `navigator.clipboard.writeText` istnieje; po odrzuceniu znika), `<ContactSection />` (`<section id="contact">`).

- [ ] **Step 1: Napisz test**

`src/components/home/CopyEmailButton.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyEmailButton } from './CopyEmailButton';

const EMAIL = 'ntwins.info@gmail.com';

function setClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('CopyEmailButton', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('copies the address and confirms with a snackbar', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    render(<CopyEmailButton email={EMAIL} />);

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Copy email address' }));
    });

    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(await screen.findByText('Email copied to clipboard')).toBeInTheDocument();
  });

  it('renders nothing when the Clipboard API is unavailable', () => {
    render(<CopyEmailButton email={EMAIL} />);
    expect(screen.queryByRole('button', { name: 'Copy email address' })).not.toBeInTheDocument();
  });

  it('hides itself when copying is rejected', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(<CopyEmailButton email={EMAIL} />);

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Copy email address' }));
    });

    expect(screen.queryByRole('button', { name: 'Copy email address' })).not.toBeInTheDocument();
    expect(screen.queryByText('Email copied to clipboard')).not.toBeInTheDocument();
  });
});
```

Uwaga: nie używaj tu `userEvent.setup()` — podmienia `navigator.clipboard` na własny stub.

- [ ] **Step 2: Uruchom test — ma nie przejść**

Run: `pnpm test src/components/home/CopyEmailButton.test.tsx`
Expected: FAIL — brak modułu.

- [ ] **Step 3: Implementacja**

`src/lib/site.ts`:

```ts
export const CONTACT_EMAIL = 'ntwins.info@gmail.com';
```

`src/components/home/CopyEmailButton.tsx`:

```tsx
'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';

export function CopyEmailButton({ email }: { email: string }) {
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clipboard API is missing on insecure origins and some browsers — keep only the mailto link then.
  useEffect(() => {
    setCanCopy(typeof navigator.clipboard?.writeText === 'function');
  }, []);

  if (!canCopy) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCanCopy(false);
    }
  };

  return (
    <>
      <Tooltip title="Copy email">
        <IconButton aria-label="Copy email address" color="inherit" onClick={copy}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        message="Email copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
```

`src/components/home/ContactSection.tsx`:

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Reveal } from '@/components/motion/Reveal';
import { CONTACT_EMAIL } from '@/lib/site';
import { glass, gradientText } from '@/theme/tokens';
import { CopyEmailButton } from './CopyEmailButton';

export function ContactSection() {
  return (
    <Box component="section" id="contact" aria-labelledby="contact-title" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm">
        <Reveal>
          <Typography id="contact-title" variant="h2" align="center" sx={{ ...gradientText, mb: 4 }}>
            Contact
          </Typography>
          <Box sx={{ ...glass, borderRadius: 4, p: { xs: 3, md: 5 }, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Questions, feedback or partnership ideas? Drop us a line.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Typography
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                variant="h6"
                sx={{ color: 'secondary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {CONTACT_EMAIL}
              </Typography>
              <CopyEmailButton email={CONTACT_EMAIL} />
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Dodaj sekcję do strony**

`src/app/page.tsx` (zastąp całość):

```tsx
import { AppsSection } from '@/components/home/AppsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Hero } from '@/components/home/Hero';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AppsSection />
      <ContactSection />
    </>
  );
}
```

- [ ] **Step 5: Testy, lint, build**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: wszystkie PASS, build OK.

- [ ] **Step 6: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add contact section with copy-to-clipboard`.

---

### Task 10: Strona gry

**Files:**
- Create: `src/components/app-details/GooglePlayBadge.tsx`, `src/components/app-details/AppHeader.tsx`, `src/components/app-details/AppDescription.tsx`, `src/app/apps/[slug]/page.tsx`
- Test: `src/components/app-details/GooglePlayBadge.test.tsx`, `src/components/app-details/AppHeader.test.tsx`, `src/components/app-details/AppDescription.test.tsx`, `src/app/apps/[slug]/page.test.ts`

**Interfaces:**
- Consumes: `getApps`, `getAppBySlug`, `getMetaDescription`, `playStoreUrl`, `asset`, `SafeImage`, `ButtonLink`, `Reveal`, `colors`, `accentGradient`.
- Produces: `<GooglePlayBadge packageId title />`, `<AppHeader app />`, `<AppDescription app />`; route `/apps/[slug]/` z `generateStaticParams(): { slug: string }[]`, `generateMetadata({ params }): Promise<Metadata>`, `dynamicParams = false`.

- [ ] **Step 1: Napisz testy**

`src/components/app-details/GooglePlayBadge.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GooglePlayBadge } from './GooglePlayBadge';

describe('GooglePlayBadge', () => {
  it('opens the Play Store listing in a new tab safely', () => {
    render(<GooglePlayBadge packageId="pl.ntwins.dragon.pet2" title="Dragon Pet 2" />);
    const link = screen.getByRole('link', { name: 'Get Dragon Pet 2 on Google Play' });
    expect(link).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=pl.ntwins.dragon.pet2');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

`src/components/app-details/AppHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AppEntry } from '@/data/types';
import { getAppBySlug } from '@/lib/apps';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('shows banner, icon and title as h1', () => {
    render(<AppHeader app={getAppBySlug('dragon-pet-2')!} />);
    expect(screen.getByAltText('Dragon Pet 2 banner')).toBeInTheDocument();
    expect(screen.getByAltText('Dragon Pet 2 icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Dragon Pet 2' })).toBeInTheDocument();
  });

  it('falls back to a gradient when the app has no banner', () => {
    const app: AppEntry = { ...getAppBySlug('flappy-dragon')!, banner: undefined };
    render(<AppHeader app={app} />);
    expect(screen.getByTestId('banner-fallback')).toBeInTheDocument();
    expect(screen.queryByAltText('Flappy Dragon banner')).not.toBeInTheDocument();
  });
});
```

`src/components/app-details/AppDescription.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAppBySlug } from '@/lib/apps';
import { AppDescription } from './AppDescription';

describe('AppDescription', () => {
  it('renders paragraphs and the features list', () => {
    render(<AppDescription app={getAppBySlug('dragon-pet-2')!} />);
    expect(screen.getByText(/Please note: this is completely free game/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(18);
  });

  it('omits the features section when there are none', () => {
    render(<AppDescription app={getAppBySlug('dragon-pet')!} />);
    expect(screen.queryByRole('heading', { name: 'Features' })).not.toBeInTheDocument();
  });
});
```

`src/app/apps/[slug]/page.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { dynamicParams, generateMetadata, generateStaticParams } from './page';

describe('app page route', () => {
  it('pre-renders all 15 apps and nothing else', () => {
    expect(generateStaticParams()).toHaveLength(15);
    expect(dynamicParams).toBe(false);
  });

  it('builds metadata from the app', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'dragon-pet-2' }) });
    expect(meta.title).toBe('Dragon Pet 2');
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
  });

  it('returns empty metadata for unknown slugs', async () => {
    expect(await generateMetadata({ params: Promise.resolve({ slug: 'nope' }) })).toEqual({});
  });
});
```

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `pnpm test src/components/app-details src/app`
Expected: FAIL — brak modułów.

- [ ] **Step 3: GooglePlayBadge**

`src/components/app-details/GooglePlayBadge.tsx` (jeśli w Task 2 badge miał inne wymiary niż 646×250, wpisz je w `BADGE_WIDTH`/`BADGE_HEIGHT`):

```tsx
import Box from '@mui/material/Box';
import { playStoreUrl } from '@/lib/apps';
import { asset } from '@/lib/asset';

const BADGE_WIDTH = 646;
const BADGE_HEIGHT = 250;

export function GooglePlayBadge({ packageId, title }: { packageId: string; title: string }) {
  return (
    <Box
      component="a"
      href={playStoreUrl(packageId)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get ${title} on Google Play`}
      sx={{
        display: 'inline-block',
        transition: 'transform .2s',
        '&:hover': { transform: 'translateY(-2px) scale(1.03)' },
        '@media (prefers-reduced-motion: reduce)': { '&:hover': { transform: 'none' } },
      }}
    >
      <Box
        component="img"
        src={asset('/img/google-play-badge.png')}
        alt=""
        width={BADGE_WIDTH}
        height={BADGE_HEIGHT}
        sx={{ display: 'block', height: 64, width: 'auto' }}
      />
    </Box>
  );
}
```

- [ ] **Step 4: AppHeader i AppDescription**

`src/components/app-details/AppHeader.tsx`:

```tsx
'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SafeImage } from '@/components/common/SafeImage';
import type { AppEntry } from '@/data/types';
import { accentGradient, colors } from '@/theme/tokens';

export function AppHeader({ app }: { app: AppEntry }) {
  return (
    <Box component="header" sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1024 / 500',
          maxHeight: '70vh',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, rgba(15,12,20,0.35) 0%, rgba(15,12,20,0) 30%, ${colors.bg} 100%)`,
          },
        }}
      >
        {app.banner ? (
          <SafeImage
            src={app.banner}
            alt={`${app.title} banner`}
            fallbackLabel={app.title}
            width={1024}
            height={500}
            loading="eager"
            fetchPriority="high"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            data-testid="banner-fallback"
            sx={{ position: 'absolute', inset: 0, backgroundImage: accentGradient, overflow: 'hidden' }}
          >
            <SafeImage
              src={app.icon}
              alt=""
              fallbackLabel={app.title}
              sx={{ width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(40px)', opacity: 0.5 }}
            />
          </Box>
        )}
      </Box>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, mt: { xs: -6, md: -10 } }}>
        <motion.div
          data-reveal=""
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}
        >
          <SafeImage
            src={app.icon}
            alt={`${app.title} icon`}
            fallbackLabel={app.title}
            width={512}
            height={512}
            loading="eager"
            sx={{
              width: { xs: 96, md: 128 },
              borderRadius: 4,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, pb: 1 }}>
            {app.title}
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
```

`src/components/app-details/AppDescription.tsx`:

```tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Reveal } from '@/components/motion/Reveal';
import type { AppEntry } from '@/data/types';

export function AppDescription({ app }: { app: AppEntry }) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {app.description.map((paragraph, i) => (
        <Reveal key={i}>
          <Typography sx={{ fontSize: '1.075rem', lineHeight: 1.75 }}>{paragraph}</Typography>
        </Reveal>
      ))}
      {app.features && app.features.length > 0 && (
        <Reveal>
          <Typography variant="h3" component="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, mt: 2, mb: 1 }}>
            Features
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3, display: 'grid', gap: 1, '& li::marker': { color: 'secondary.main' } }}>
            {app.features.map((feature, i) => (
              <Typography component="li" key={i} sx={{ lineHeight: 1.6 }}>
                {feature}
              </Typography>
            ))}
          </Box>
        </Reveal>
      )}
    </Box>
  );
}
```

- [ ] **Step 5: Route strony gry**

`src/app/apps/[slug]/page.tsx`:

```tsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppDescription } from '@/components/app-details/AppDescription';
import { AppHeader } from '@/components/app-details/AppHeader';
import { GooglePlayBadge } from '@/components/app-details/GooglePlayBadge';
import { ButtonLink } from '@/components/common/ButtonLink';
import { getAppBySlug, getApps, getMetaDescription } from '@/lib/apps';
import { asset } from '@/lib/asset';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getApps().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return {};
  const description = getMetaDescription(app);
  return {
    title: app.title,
    description,
    openGraph: { title: `${app.title} — ntwins`, description, images: [asset(app.banner ?? app.icon)] },
  };
}

export default async function AppPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return (
    <Box component="article" sx={{ pb: 8 }}>
      <AppHeader app={app} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 4 }}>
          <GooglePlayBadge packageId={app.packageId} title={app.title} />
          <ButtonLink href={`/apps/${app.slug}/privacy-policy/`} variant="text" color="inherit">
            Privacy policy
          </ButtonLink>
          <ButtonLink href="/#apps" variant="outlined" color="inherit" startIcon={<ArrowBackIcon />}>
            Back to games
          </ButtonLink>
        </Stack>
        <AppDescription app={app} />
      </Container>
    </Box>
  );
}
```

- [ ] **Step 6: Testy, lint, build**

Run: `pnpm test && pnpm lint && pnpm build && ls out/apps | wc -l`
Expected: wszystkie PASS; `15`.

Run: `pnpm dev` i otwórz `http://localhost:3000/apps/dragon-pet-2/`. Expected: banner DP2 na całą szerokość przechodzący w tło, ikona i tytuł nachodzą na dolną krawędź, badge otwiera Google Play w nowej karcie, lista 18 cech ze złotymi punktorami.

- [ ] **Step 7: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add static app detail pages`.

---

### Task 11: Galeria screenshotów DP2 i lightbox

**Files:**
- Create: `src/components/app-details/Lightbox.tsx`, `src/components/app-details/ScreenshotGallery.tsx`
- Modify: `src/app/apps/[slug]/page.tsx`
- Test: `src/components/app-details/Lightbox.test.tsx`, `src/components/app-details/ScreenshotGallery.test.tsx`

**Interfaces:**
- Consumes: `AppEntry`, `screenshotSrc`, `asset`, `SafeImage`, `colors`.
- Produces:
  - `interface LightboxImage { src: string; alt: string }` (src już z basePath)
  - `Lightbox(props: { images: readonly LightboxImage[]; index: number | null; onClose: () => void; onIndexChange: (index: number) => void })` — kontrolowany; `index === null` = zamknięty; nawigacja w pętli; ←/→, Esc, swipe ≥ 50 px.
  - `<ScreenshotGallery app />` — `null` gdy brak screenshotów.

- [ ] **Step 1: Napisz testy**

`src/components/app-details/Lightbox.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Lightbox } from './Lightbox';

const IMAGES = Array.from({ length: 15 }, (_, i) => ({ src: `/s${i + 1}.webp`, alt: `Screenshot ${i + 1}` }));

function Harness({ start, onClose = () => {} }: { start: number | null; onClose?: () => void }) {
  const [index, setIndex] = useState<number | null>(start);
  return <Lightbox images={IMAGES} index={index} onClose={onClose} onIndexChange={setIndex} />;
}

const swipe = (from: number, to: number) => {
  const img = screen.getByRole('img');
  fireEvent.touchStart(img, { touches: [{ clientX: from }] });
  fireEvent.touchEnd(img, { changedTouches: [{ clientX: to }] });
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
```

`src/components/app-details/ScreenshotGallery.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getAppBySlug } from '@/lib/apps';
import { asset } from '@/lib/asset';
import { ScreenshotGallery } from './ScreenshotGallery';

describe('ScreenshotGallery', () => {
  it('lists 15 thumbnails and opens the lightbox on the clicked one', () => {
    render(<ScreenshotGallery app={getAppBySlug('dragon-pet-2')!} />);
    const buttons = screen.getAllByRole('button', { name: /^Open Dragon Pet 2 screenshot/ });
    expect(buttons).toHaveLength(15);

    fireEvent.click(buttons[2]);

    expect(screen.getByText('3 / 15')).toBeInTheDocument();
    expect(screen.getByAltText('Dragon Pet 2 screenshot 3')).toHaveAttribute(
      'src',
      asset('/img/screens/dragon-pet-2/full/land5.webp'),
    );
  });

  it('renders nothing for apps without screenshots', () => {
    const { container } = render(<ScreenshotGallery app={getAppBySlug('dragon-pet')!} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Uruchom testy — mają nie przejść**

Run: `pnpm test src/components/app-details/Lightbox.test.tsx src/components/app-details/ScreenshotGallery.test.tsx`
Expected: FAIL — brak modułów.

- [ ] **Step 3: Lightbox**

`src/components/app-details/Lightbox.tsx`:

```tsx
'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useRef, type KeyboardEvent } from 'react';

export interface LightboxImage {
  /** Already resolved with asset() */
  src: string;
  alt: string;
}

export interface LightboxProps {
  images: readonly LightboxImage[];
  /** null = closed */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD_PX = 50;

const navButtonSx = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#fff',
  backgroundColor: 'rgba(0,0,0,0.35)',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.55)' },
} as const;

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const count = images.length;
  const current = index === null ? null : images[index];

  const go = (delta: number) => {
    if (index === null || count === 0) return;
    onIndexChange((index + delta + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <Dialog
      open={current !== null}
      onClose={onClose}
      onKeyDown={onKeyDown}
      fullScreen
      aria-label="Screenshot viewer"
      slotProps={{ paper: { sx: { backgroundColor: 'rgba(10,8,14,0.96)' } } }}
    >
      {current && index !== null && (
        <Box
          sx={{ position: 'relative', width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start == null || end == null) return;
            const dx = end - start;
            if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) go(dx < 0 ? 1 : -1);
          }}
        >
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            draggable={false}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{ maxWidth: '92vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 12, userSelect: 'none' }}
          />
          <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, color: '#fff' }}>
            <CloseIcon />
          </IconButton>
          <IconButton aria-label="Previous screenshot" onClick={() => go(-1)} sx={{ ...navButtonSx, left: { xs: 4, md: 24 } }}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="Next screenshot" onClick={() => go(1)} sx={{ ...navButtonSx, right: { xs: 4, md: 24 } }}>
            <ChevronRightIcon fontSize="large" />
          </IconButton>
          <Typography
            aria-live="polite"
            color="text.secondary"
            sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)' }}
          >
            {index + 1} / {count}
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}
```

- [ ] **Step 4: ScreenshotGallery**

`src/components/app-details/ScreenshotGallery.tsx`:

```tsx
'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useRef, useState } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import type { AppEntry } from '@/data/types';
import { screenshotSrc } from '@/lib/apps';
import { asset } from '@/lib/asset';
import { colors } from '@/theme/tokens';
import { Lightbox } from './Lightbox';

const THUMB_HEIGHT = 360;
// Source proportions: portrait 500×888, landscape 1000×444
const THUMB_WIDTH = { portrait: 203, landscape: 811 } as const;

export function ScreenshotGallery({ app }: { app: AppEntry }) {
  const [index, setIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const shots = useMemo(() => app.screenshots ?? [], [app.screenshots]);
  const images = useMemo(
    () =>
      shots.map((s, i) => ({
        src: asset(screenshotSrc(app.slug, s.file, 'full')),
        alt: `${app.title} screenshot ${i + 1}`,
      })),
    [app.slug, app.title, shots],
  );

  if (shots.length === 0) return null;

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <Box component="section" aria-labelledby="screenshots-title" sx={{ mt: 8 }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography id="screenshots-title" variant="h3" component="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Screenshots
          </Typography>
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton aria-label="Scroll screenshots left" onClick={() => scrollTrack(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton aria-label="Scroll screenshots right" onClick={() => scrollTrack(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
      <Box
        component="ul"
        ref={trackRef}
        sx={{
          listStyle: 'none',
          m: 0,
          py: 1,
          px: { xs: 2, md: 'max(24px, calc((100vw - 1200px) / 2 + 24px))' },
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: { xs: '16px', md: '24px' },
          scrollbarWidth: 'thin',
        }}
      >
        {shots.map((shot, i) => (
          <Box component="li" key={shot.file} sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
            <Box
              component="button"
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open ${images[i].alt}`}
              sx={{
                display: 'block',
                p: 0,
                border: 0,
                background: 'none',
                cursor: 'zoom-in',
                borderRadius: 3,
                overflow: 'hidden',
                '& img': { transition: 'transform .3s' },
                '&:hover img': { transform: 'scale(1.04)' },
                '&:focus-visible': { outline: `2px solid ${colors.gold}`, outlineOffset: 3 },
              }}
            >
              <SafeImage
                src={screenshotSrc(app.slug, shot.file, 'thumb')}
                alt=""
                fallbackLabel={app.title}
                width={THUMB_WIDTH[shot.orientation]}
                height={THUMB_HEIGHT}
                sx={{ height: { xs: 240, md: THUMB_HEIGHT }, width: 'auto' }}
              />
            </Box>
          </Box>
        ))}
      </Box>
      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </Box>
  );
}
```

- [ ] **Step 5: Dodaj galerię do strony gry**

W `src/app/apps/[slug]/page.tsx`:
- dodaj import `import { ScreenshotGallery } from '@/components/app-details/ScreenshotGallery';`
- wstaw `<ScreenshotGallery app={app} />` bezpośrednio po zamykającym `</Container>` wewnątrz `<Box component="article">` (komponent sam zwraca `null` dla gier bez screenów).

- [ ] **Step 6: Testy, lint, build, podgląd**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: wszystkie PASS, build OK.

Run: `pnpm dev`, `http://localhost:3000/apps/dragon-pet-2/`. Expected: pozioma karuzela miniatur (pion i poziom w naturalnych proporcjach) przyciąga się do krawędzi; klik otwiera pełnoekranowy podgląd, ←/→/Esc działają, licznik `n / 15`. W DevTools (tryb urządzenia dotykowego) przeciągnięcie palcem przełącza obrazy. `/apps/dragon-pet/` nie ma sekcji Screenshots.

- [ ] **Step 7: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add Dragon Pet 2 screenshot gallery with lightbox`.

---

### Task 12: Polityka prywatności i strona 404

**Files:**
- Create: `src/components/privacy/PrivacyPolicy.tsx`, `src/app/apps/[slug]/privacy-policy/page.tsx`, `src/app/not-found.tsx`
- Test: `src/components/privacy/PrivacyPolicy.test.tsx`

**Interfaces:**
- Consumes: `CONTACT_EMAIL`, `getApps`, `getAppBySlug`, `ButtonLink`, `SafeImage`, `glass`, `NAV_HEIGHT`.
- Produces: `<PrivacyPolicy appTitle />`, route `/apps/[slug]/privacy-policy/`, `out/404.html`.

- [ ] **Step 1: Napisz test**

`src/components/privacy/PrivacyPolicy.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacyPolicy } from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
  it('renders the policy for the given app with contact email', () => {
    render(<PrivacyPolicy appTitle="Dragon Pet 2" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dragon Pet 2 — Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ntwins.info@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:ntwins.info@gmail.com',
    );
  });

  it('lists the three Android permissions with corrected wording', () => {
    render(<PrivacyPolicy appTitle="X" />);
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText(/the following permissions/)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('permisions');
  });
});
```

- [ ] **Step 2: Uruchom test — ma nie przejść**

Run: `pnpm test src/components/privacy`
Expected: FAIL — brak modułu.

- [ ] **Step 3: Komponent polityki (treść z `docs/legacy/src-2020/privacy-policy/PrivacyPolicyContent.tsx`)**

`src/components/privacy/PrivacyPolicy.tsx`:

```tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { CONTACT_EMAIL } from '@/lib/site';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

const P = ({ children }: { children: ReactNode }) => (
  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
    {children}
  </Typography>
);

export function PrivacyPolicy({ appTitle }: { appTitle: string }) {
  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        {appTitle} — Privacy Policy
      </Typography>

      <Section title="What information do we collect?">
        <P>We do not collect any of your information when you use our application.</P>
      </Section>

      <Section title="Which Android permissions do we use">
        <P>We commonly use the following permissions in our applications. Here are the reasons of their usage:</P>
        <Box component="ul" sx={{ pl: 3, color: 'text.secondary', lineHeight: 1.7 }}>
          <li>
            <b>Read Phone State</b> - We need to know if there is an internet connection for third party libraries
            like Google or advertisement networks.
          </li>
          <li>
            <b>Camera</b> - We use your phone camera <b>ONLY</b> in Augmented Reality or Virtual Reality modes in our
            applications that contain these modes.
          </li>
          <li>
            <b>Location</b> - Optional permission. Required for global, online users map.
          </li>
        </Box>
      </Section>

      <Section title="How do we protect your information?">
        <P>
          We only use Google libraries for online gaming or dashboards in our games, so your information is secured by
          Google the same way as your Google account is.
        </P>
      </Section>

      <Section title="Do we disclose any information to outside parties?">
        <P>
          We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
          This does not include trusted third parties who assist us in operating our application, conducting our
          business, or servicing you, so long as those parties agree to keep this information confidential. We may also
          release your information when we believe release is appropriate to comply with the law, enforce our
          application policies, or protect ours or others rights, property, or safety. However, non-personally
          identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
        </P>
      </Section>

      <Section title="Third party links">
        <P>
          Occasionally, at our discretion, we may include or offer third party products or services in our application.
          These third party sites have separate and independent privacy policies. We therefore have no responsibility or
          liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity
          of our application and welcome any feedback about these sites.
        </P>
      </Section>

      <Section title="Online Privacy Policy Only">
        <P>
          This online privacy policy applies only to information collected through our application and not to
          information collected offline.
        </P>
      </Section>

      <Section title="Your Consent">
        <P>By using our application, you consent to our application privacy policy.</P>
      </Section>

      <Section title="Changes to our Privacy Policy">
        <P>
          If we decide to change our privacy policy, we will post those changes on this page, and/or update the Privacy
          Policy modification date below.
        </P>
      </Section>

      <Section title="Contact">
        <P>If there are any questions regarding this privacy policy you may contact me using the information below.</P>
        <Typography
          component="a"
          href={`mailto:${CONTACT_EMAIL}`}
          sx={{ display: 'inline-block', mt: 1, color: 'secondary.main' }}
        >
          {CONTACT_EMAIL}
        </Typography>
      </Section>
    </Box>
  );
}
```

- [ ] **Step 4: Route polityki i 404**

`src/app/apps/[slug]/privacy-policy/page.tsx`:

```tsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/common/ButtonLink';
import { PrivacyPolicy } from '@/components/privacy/PrivacyPolicy';
import { getAppBySlug, getApps } from '@/lib/apps';
import { glass, NAV_HEIGHT } from '@/theme/tokens';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getApps().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  return app ? { title: `${app.title} Privacy Policy` } : {};
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return (
    <Container maxWidth="md" sx={{ pt: `${NAV_HEIGHT + 32}px`, pb: 8 }}>
      <ButtonLink href={`/apps/${app.slug}/`} variant="outlined" color="inherit" startIcon={<ArrowBackIcon />}>
        Back to {app.title}
      </ButtonLink>
      <Box sx={{ ...glass, borderRadius: 4, p: { xs: 3, md: 5 }, mt: 3 }}>
        <PrivacyPolicy appTitle={app.title} />
      </Box>
    </Container>
  );
}
```

`src/app/not-found.tsx`:

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ButtonLink } from '@/components/common/ButtonLink';
import { SafeImage } from '@/components/common/SafeImage';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', pt: 12 }}>
      <Box>
        <SafeImage
          src="/img/icons/dragon-pet-2.webp"
          alt=""
          fallbackLabel="ntwins"
          width={512}
          height={512}
          sx={{ width: 120, mx: 'auto', mb: 3, borderRadius: 4 }}
        />
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Lost in the mountains…
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          The page you are looking for flew away.
        </Typography>
        <ButtonLink href="/#apps" variant="contained" color="primary">
          Back to games
        </ButtonLink>
      </Box>
    </Container>
  );
}
```

- [ ] **Step 5: Testy, lint, build**

Run: `pnpm test && pnpm lint && pnpm build && ls out/apps/dragon-pet-2/privacy-policy/index.html && grep -c 'Lost in the mountains' out/404.html`
Expected: wszystkie PASS; plik istnieje; `1`.

- [ ] **Step 6: Checkpoint (bez commita)**

Pokaż `git status --short`. Proponowany commit: `feat: add per-app privacy policy pages and 404`.

---

### Task 13: Smoke test eksportu, deploy na GitHub Pages, weryfikacja końcowa

**Files:**
- Create: `scripts/verify-export.ts`, `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Consumes: `apps` z `src/data/apps.ts` (import względny), `out/` z `pnpm build`, env `NEXT_PUBLIC_BASE_PATH`.
- Produces: `pnpm verify` (exit 1 przy brakach), workflow `Deploy to GitHub Pages`.

- [ ] **Step 1: Napisz skrypt weryfikujący**

`scripts/verify-export.ts`:

```ts
// Smoke test of the static export: required pages exist and every local src/href in the HTML
// carries the base path and resolves to a real file in out/ (catches assets missing asset()).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { apps } from '../src/data/apps';

const OUT = path.resolve('out');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
const errors: string[] = [];

const requireFile = (rel: string) => {
  if (!existsSync(path.join(OUT, rel))) errors.push(`missing out/${rel}`);
};

['index.html', '404.html', '.nojekyll'].forEach(requireFile);
for (const app of apps) {
  requireFile(`apps/${app.slug}/index.html`);
  requireFile(`apps/${app.slug}/privacy-policy/index.html`);
}

const resolves = (local: string) => {
  const target = path.join(OUT, decodeURIComponent(local));
  if (!existsSync(target)) return false;
  return statSync(target).isFile() || existsSync(path.join(target, 'index.html'));
};

const htmlFiles = existsSync(OUT)
  ? readdirSync(OUT, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.html'))
  : [];

for (const file of htmlFiles) {
  const html = readFileSync(path.join(OUT, file), 'utf8');
  for (const [, url] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (!url.startsWith('/') || url.startsWith('//')) continue; // external, relative or #hash
    const clean = url.split(/[?#]/)[0];
    if (basePath && clean !== basePath && !clean.startsWith(`${basePath}/`)) {
      errors.push(`${file}: "${url}" lacks base path ${basePath}`);
      continue;
    }
    const local = clean.slice(basePath.length) || '/';
    if (!resolves(local)) errors.push(`${file}: "${url}" does not resolve to a file in out/`);
  }
}

if (errors.length > 0) {
  console.error(`verify-export: ${errors.length} problem(s)\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}

console.log(`verify-export: OK (${apps.length} apps, ${htmlFiles.length} HTML files, base path "${basePath || '/'}")`);
```

- [ ] **Step 2: Sprawdź, że skrypt wykrywa błędy**

Run: `rm -rf out && pnpm verify; echo "exit=$?"`
Expected: lista `missing out/...`, `exit=1`.

Run: `pnpm build && NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm verify; echo "exit=$?"`
Expected: build bez basePath sprawdzany z basePath → błędy `lacks base path /apps-dashboard`, `exit=1` (dowód, że brak prefiksu zostanie złapany).

- [ ] **Step 3: Sprawdź poprawny build pod basePath**

Run: `NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm build && NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm verify`
Expected: `verify-export: OK (15 apps, … HTML files, base path "/apps-dashboard")`. Jeśli pojawią się błędy `does not resolve` dla `/img/...`, znajdź komponent, który pomija `asset()`, i popraw go (test `no-bare-paths` powinien był to złapać — dopisz brakujący wzorzec).

- [ ] **Step 4: Workflow GitHub Actions**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
        env:
          NEXT_PUBLIC_BASE_PATH: /apps-dashboard
      - run: pnpm verify
        env:
          NEXT_PUBLIC_BASE_PATH: /apps-dashboard
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`NEXT_PUBLIC_BASE_PATH` jest ustawiane tylko dla `build` i `verify` — testy jednostkowe zakładają pusty basePath.

- [ ] **Step 5: README**

`README.md`:

````markdown
# apps-dashboard

Portfolio of ntwins games and apps — Next.js (static export) + MUI + motion, hosted on GitHub Pages:
https://drachelski.github.io/apps-dashboard/

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # unit tests (Vitest)
pnpm lint
```

## Production build

```bash
NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm build
NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm verify   # smoke test of out/
pnpm preview                                         # http://localhost:3000/apps-dashboard/
```

Pushing to `main` deploys via `.github/workflows/deploy.yml`
(one-time setup: *Settings → Pages → Source: GitHub Actions*).

## Content

All games are defined in `src/data/apps.ts`. Images live in `public/img` (WebP); they were generated once
from the legacy sites with `pnpm optimize-images` (sources in `../apps-page` and `../ntwins-2020-recovered`).
Always reference public files through `asset()` or `SafeImage` so the base path is applied.

`docs/legacy/src-2020/` holds the 2020 ntwins.pl source recovered from its source maps (reference only).
````

- [ ] **Step 6: Pełna weryfikacja lokalna**

Run: `pnpm lint && pnpm test && NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm build && NEXT_PUBLIC_BASE_PATH=/apps-dashboard pnpm verify`
Expected: wszystko zielone.

Run (w tle): `pnpm preview`, potem otwórz `http://localhost:3000/apps-dashboard/` i sprawdź ręcznie:
- strona główna: hero, 15 kafli (DP2 2×2, DP i UP 2×1), kontakt, stopka z bieżącym rokiem; brak sekcji Incoming games i News;
- każdy z 3 dużych kafli i 2–3 małe prowadzą na strony gier; polityka prywatności i „Back to …” działają;
- `http://localhost:3000/apps-dashboard/nie-ma/` → ostylowane 404 (serwer `serve` zwraca `404.html`);
- konsola przeglądarki bez błędów i ostrzeżeń hydracji; zakładka Network bez 404;
- DevTools → wyłącz JavaScript → przeładuj: kafle, opisy i logo są widoczne;
- DevTools → Rendering → `prefers-reduced-motion: reduce`: brak iskier, tiltu, Ken Burns, parallaxu.

- [ ] **Step 7: Lighthouse (mobile)**

```bash
npx lighthouse http://localhost:3000/apps-dashboard/ --only-categories=performance,accessibility \
  --form-factor=mobile --screenEmulation.mobile --output=json --output-path=./.preview/lh.json \
  --chrome-flags="--headless=new" --quiet
node -e "const r=require('./.preview/lh.json');for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100))"
```

Expected: `performance ≥ 90`, `accessibility ≥ 95`. Przy niższym wyniku popraw wskazane audyty (najczęściej: rozmiar obrazów hero/bannerów, kontrast, brakujące etykiety) i powtórz.

- [ ] **Step 8: Checkpoint (bez commita) i przekazanie**

Pokaż `git status --short`. Proponowany commit: `ci: deploy static export to GitHub Pages with export smoke test`.
Przekaż właścicielowi: po pushu na `main` ustawić *Settings → Pages → Source: GitHub Actions* i sprawdzić run „Deploy to GitHub Pages”.
