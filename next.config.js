/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ik.imagekit.io', 'firebasestorage.googleapis.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      // Long‑lived caching for static assets (safe for fingerprinted files)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/en',   destination: '/', permanent: true },
      { source: '/lt/en', destination: '/lt', permanent: true },
      { source: '/en/lt', destination: '/lt', permanent: true },
      { source: '/sitemap', destination: '/sitemap.xml', permanent: true },
      { source: '/gallery', destination: '/shop', permanent: true },
      { source: '/gallery/:slug', destination: '/shop/:slug', permanent: true },
      { source: '/lt/galerija', destination: '/lt/parduotuve', permanent: true },
      { source: '/lt/galerija/:slug', destination: '/lt/parduotuve/:slug', permanent: true },
    ];
  },
  // Proxy Firebase auth links so /__/auth/* on our domain hits Firebase.
  // The Firebase auth domain comes from NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (e.g. paulapango.firebaseapp.com).
  async rewrites() {
    const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    if (!firebaseAuthDomain) return [];
    return [
      {
        source: '/__/auth/:path*',
        destination: `https://${firebaseAuthDomain}/__/auth/:path*`,
      },
    ];
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Enable source maps in production for Lighthouse and debugging
  productionBrowserSourceMaps: true,
  // Remove console.* calls in production builds only
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
