import { GetServerSideProps } from 'next';
import { db, isFirebaseAdminConfigured } from '../lib/firebaseAdmin';
import { BASE_URL, buildHreflangTags, buildBlogHreflangTags } from '../lib/hreflangMap';
import { artworks } from '../lib/artworks';

const lastmod = new Date().toISOString().split('T')[0];

const toHreflangXml = (tags: Array<{ hreflang: string; href: string }>) =>
  tags
    .map((t) => `    <xhtml:link rel="alternate" hreflang="${t.hreflang}" href="${t.href}" />`)
    .join('\n');

// Static pages: [path, priority]
const STATIC_PAGES: Array<[string, number]> = [
  ['/', 1.0],
  ['/lt/', 1.0],
  ['/shop', 0.9],
  ['/lt/parduotuve', 0.9],
  ['/paintings', 0.8],
  ['/lt/paveikslai', 0.8],
  ['/about', 0.7],
  ['/lt/apie', 0.7],
  ['/contact', 0.7],
  ['/lt/kontaktai', 0.7],
  ['/privacy-policy', 0.4],
  ['/lt/sub/privatumo-politika', 0.4],
  ['/sub/faq', 0.4],
  ['/lt/sub/duk', 0.4],
  ['/sub/terms-of-service', 0.4],
  ['/lt/sub/naudojimo-taisykles', 0.4],
  ['/sub/cookies-info', 0.3],
  ['/lt/sub/slapukai', 0.3],
];

type BlogEntry = { slug: string; slugLt?: string; lastmod: string };

function buildSitemapXml(blogEntries: BlogEntry[] = []): string {
  const staticXml = STATIC_PAGES.map(([path, priority]) => {
    const hreflang = toHreflangXml(buildHreflangTags(path));
    return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
${hreflang}
  </url>`;
  }).join('\n\n');

  const blogXml = blogEntries
    .flatMap((post) => {
      const lt = post.slugLt || post.slug;
      const hreflang = toHreflangXml(buildBlogHreflangTags(post.slug, post.slugLt));
      return [
        `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <priority>0.6</priority>
${hreflang}
  </url>`,
        `  <url>
    <loc>${BASE_URL}/lt/straipsniai/${lt}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <priority>0.6</priority>
${hreflang}
  </url>`,
      ];
    })
    .join('\n\n');

  // Artwork detail pages: /shop/[slug] (EN) + /lt/parduotuve/[slug] (LT)
  const artworkXml = artworks
    .flatMap((a) => {
      const lt = a.slugLt || a.slug;
      const hreflang = toHreflangXml([
        { hreflang: 'en', href: `${BASE_URL}/shop/${a.slug}` },
        { hreflang: 'lt-LT', href: `${BASE_URL}/lt/parduotuve/${lt}` },
        { hreflang: 'x-default', href: `${BASE_URL}/shop/${a.slug}` },
      ]);
      return [
        `  <url>
    <loc>${BASE_URL}/shop/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
${hreflang}
  </url>`,
        `  <url>
    <loc>${BASE_URL}/lt/parduotuve/${lt}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
${hreflang}
  </url>`,
      ];
    })
    .join('\n\n');

  const allEntries = [staticXml, artworkXml].filter(Boolean).join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${allEntries}

</urlset>`;
}

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let blogEntries: BlogEntry[] = [];
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

  if (clientId && isFirebaseAdminConfigured) {
    try {
      const snap = await db
        .collection('clients')
        .doc(clientId)
        .collection('blogPosts')
        .orderBy('createdAt', 'desc')
        .get();

      blogEntries = snap.docs.map((doc) => {
        const data = doc.data();
        const toDate = (v: unknown): Date | null => {
          if (!v) return null;
          if (typeof (v as { toDate?: () => Date }).toDate === 'function')
            return (v as { toDate: () => Date }).toDate();
          if (typeof (v as { _seconds?: number })._seconds === 'number')
            return new Date((v as { _seconds: number })._seconds * 1000);
          return null;
        };
        const date = toDate(data.updatedAt) ?? toDate(data.createdAt) ?? new Date();
        return {
          slug: (data.slug as string) || doc.id,
          slugLt: data.slugLt as string | undefined,
          lastmod: date.toISOString().split('T')[0],
        };
      });
    } catch {
      // serve static sitemap if Firebase unavailable
    }
  }

  const xml = buildSitemapXml(blogEntries);
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200');
  res.write(xml);
  res.end();

  return { props: {} };
};
