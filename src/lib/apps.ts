import { apps } from '@/data/apps';
import type { AppEntry } from '@/data/types';

export const getApps = (): readonly AppEntry[] => apps;

export const getAppBySlug = (slug: string): AppEntry | undefined =>
  apps.find((a) => a.slug === slug);

export const getHeroApps = (): AppEntry[] => apps.filter((a) => a.tier === 'hero');

export const getStandardApps = (): AppEntry[] => apps.filter((a) => a.tier === 'standard');

export const playStoreUrl = (packageId: string): string =>
  `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}`;

export const screenshotSrc = (slug: string, file: string, size: 'thumb' | 'full'): string =>
  `/img/screens/${slug}/${size}/${file}.webp`;

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

export const stripEmoji = (text: string): string =>
  text.replace(EMOJI, '').replace(/\s+/g, ' ').trim();

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
