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

// Content must not stay hidden when JS is on but the bundle never runs.
if (existsSync(path.join(OUT, 'index.html'))) {
  const home = readFileSync(path.join(OUT, 'index.html'), 'utf8');
  if (!home.includes('@keyframes reveal-failsafe')) errors.push('index.html: reveal failsafe CSS missing');
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
  console.error(
    `verify-export: ${errors.length} problem(s)\n${errors.map((e) => `  - ${e}`).join('\n')}`,
  );
  process.exit(1);
}

console.log(
  `verify-export: OK (${apps.length} apps, ${htmlFiles.length} HTML files, base path "${basePath || '/'}")`,
);
