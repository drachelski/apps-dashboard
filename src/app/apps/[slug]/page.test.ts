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
