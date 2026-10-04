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
