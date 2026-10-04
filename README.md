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
