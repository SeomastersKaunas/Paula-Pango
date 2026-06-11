export default async function handler(req, res) {
  // Set proper headers
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  const BASE_URL = 'https://www.paulapango.com';
  const lastmod = new Date().toISOString();

  // Generate dynamic sitemap content
  const dynamicUrls = [
    // Add any dynamic content here (blog posts, projects, etc.)
    // For now, we'll return an empty sitemap since you don't have dynamic content
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dynamicUrls.join('')}
</urlset>`;

  res.write(sitemap);
  res.end();
}
