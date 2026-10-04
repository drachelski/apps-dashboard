// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = path.join(process.cwd(), 'src');

// Raw <img>/<Img>/motion.img/component="img" with a literal "/..." src, or CSS url("/...") — these miss basePath.
const PATTERNS = [
  /<(?:img|Img|motion\.img)\b[^>]*?\bsrc=\{?\s*["'`]\//,
  /component="img"[^>]*?\bsrc=\{?\s*["'`]\//,
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
