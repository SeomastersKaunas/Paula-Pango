/**
 * Hreflang mapping for paulapango.com
 * Two locales: en (default) + lt
 */

export const BASE_URL = 'https://www.paulapango.com';

export interface HreflangTag {
  hreflang: string;
  href: string;
}

/**
 * Static page mapping: canonical EN path -> { en, lt }
 */
const STATIC_MAP: Record<string, { en: string; lt: string }> = {
  '/':            { en: '/',                     lt: '/lt/' },
  '/lt/':         { en: '/',                     lt: '/lt/' },
  '/gallery':     { en: '/gallery',              lt: '/lt/galerija' },
  '/lt/galerija': { en: '/gallery',              lt: '/lt/galerija' },
  '/about':       { en: '/about',                lt: '/lt/apie' },
  '/lt/apie':     { en: '/about',                lt: '/lt/apie' },
  '/contact':     { en: '/contact',              lt: '/lt/kontaktai' },
  '/lt/kontaktai':{ en: '/contact',              lt: '/lt/kontaktai' },
  '/blog':        { en: '/blog',                 lt: '/lt/straipsniai' },
  '/lt/straipsniai': { en: '/blog',              lt: '/lt/straipsniai' },
  '/privacy-policy': { en: '/privacy-policy',   lt: '/lt/sub/privatumo-politika' },
  '/lt/sub/privatumo-politika': { en: '/privacy-policy', lt: '/lt/sub/privatumo-politika' },
};

/**
 * Build hreflang <link> tags for a given path.
 * Returns en-GB (root), lt-LT, and x-default tags.
 */
export function buildHreflangTags(path: string): HreflangTag[] {
  const entry = STATIC_MAP[path];
  if (!entry) return [];

  return [
    { hreflang: 'en',      href: `${BASE_URL}${entry.en}` },
    { hreflang: 'lt-LT',   href: `${BASE_URL}${entry.lt}` },
    { hreflang: 'x-default', href: `${BASE_URL}${entry.en}` },
  ];
}

/**
 * Build hreflang tags for dynamic gallery/artwork pages.
 */
export function buildArtworkHreflangTags(slug: string, slugLt?: string): HreflangTag[] {
  const lt = slugLt || slug;
  return [
    { hreflang: 'en',       href: `${BASE_URL}/gallery/${slug}` },
    { hreflang: 'lt-LT',    href: `${BASE_URL}/lt/galerija/${lt}` },
    { hreflang: 'x-default',href: `${BASE_URL}/gallery/${slug}` },
  ];
}

/**
 * Build hreflang tags for dynamic blog posts.
 */
export function buildBlogHreflangTags(slug: string, slugLt?: string): HreflangTag[] {
  const lt = slugLt || slug;
  return [
    { hreflang: 'en',       href: `${BASE_URL}/blog/${slug}` },
    { hreflang: 'lt-LT',    href: `${BASE_URL}/lt/straipsniai/${lt}` },
    { hreflang: 'x-default',href: `${BASE_URL}/blog/${slug}` },
  ];
}
