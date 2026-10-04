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
