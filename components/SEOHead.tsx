import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { buildHreflangTags } from '../lib/hreflangMap';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface HreflangTag {
  hreflang: string;
  href: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
  noIndex?: boolean;
  lang?: string;
  breadcrumbs?: BreadcrumbItem[];
  hreflang?: HreflangTag[];
}

export default function SEOHead({
  title,
  description,
  keywords = 'oil painting, original art, Lithuanian artist, Paula Pango, Kaunas, canvas painting, buy art online',
  canonicalUrl,
  ogImage = 'https://www.paulapango.com/paula_assets/wetransfer_image_before_optimization/image00001.jpeg',
  structuredData,
  noIndex = false,
  lang = 'en',
  breadcrumbs,
  hreflang,
}: SEOHeadProps) {
  const { t } = useTranslation('common');
  const baseUrl = 'https://www.paulapango.com';
  // Normalize title to "Page Title | Paula Pango"
  const normalizeSite = (value: string) => {
    const parts = value
      .split('|')
      .map((p) => p.trim())
      .filter(
        (p) =>
          p.length > 0 &&
          !/^paula\s*pango$/i.test(p)
      );
    const base = parts[0] || 'Paula Pango';
    return `${base} | Paula Pango`;
  };
  const normalizedTitle = normalizeSite(title);
  // Only compute canonical when explicitly provided.
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : undefined;
  // Keep an absolute URL for social previews even when canonicalUrl is not passed.
  const ogUrl = fullCanonicalUrl || baseUrl;
  // Ensure og:image is always absolute for Facebook/social previews
  const absoluteOgImage =
    typeof ogImage === 'string' && (ogImage.startsWith('http://') || ogImage.startsWith('https://'))
      ? ogImage
      : `${baseUrl}${ogImage && ogImage.startsWith('/') ? '' : '/'}${ogImage || 'logo_paula_example.png'}`;
  const isLithuanian = lang === 'lt';
  
  // Ensure description is never empty for Facebook
  const safeDescription = description || 'Original oil paintings by Lithuanian artist Paula Pango. Browse and purchase unique artworks online.';

  // Auto-generate hreflang from canonicalUrl when not explicitly provided
  // Uses central mapping (lib/hreflangMap) for EN-GB, EN-US, LT-LT with x-default = EN-GB
  const autoHreflang = canonicalUrl ? buildHreflangTags(canonicalUrl) : [];
  const effectiveHreflang = hreflang && hreflang.length > 0 ? hreflang : autoHreflang;

  // Site Navigation Schema - for Sitelinks in Google Search
  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: isLithuanian ? 'Navigacija' : 'Navigation',
    url: baseUrl + (isLithuanian ? '/lt/' : '/'),
    hasPart: isLithuanian
      ? [
          { '@type': 'SiteNavigationElement', name: 'Parduotuvė', url: `${baseUrl}/lt/parduotuve` },
          { '@type': 'SiteNavigationElement', name: 'Paveikslai', url: `${baseUrl}/lt/paveikslai` },
          { '@type': 'SiteNavigationElement', name: 'Apie', url: `${baseUrl}/lt/apie` },
          { '@type': 'SiteNavigationElement', name: 'Kontaktai', url: `${baseUrl}/lt/kontaktai` },
        ]
      : [
          { '@type': 'SiteNavigationElement', name: 'Shop', url: `${baseUrl}/shop` },
          { '@type': 'SiteNavigationElement', name: 'Paintings', url: `${baseUrl}/paintings` },
          { '@type': 'SiteNavigationElement', name: 'About', url: `${baseUrl}/about` },
          { '@type': 'SiteNavigationElement', name: 'Contact', url: `${baseUrl}/contact` },
        ],
  };

  // Breadcrumb Schema - dynamic based on page
  const generateBreadcrumbSchema = (): any => {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      // Default breadcrumb: Home > Current Page
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isLithuanian ? 'Pradžia' : 'Home',
            item: baseUrl + (isLithuanian ? '/lt/' : '/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: normalizedTitle.split(' | ')[0],
            item: fullCanonicalUrl || baseUrl,
          },
        ],
      };
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`,
      })),
    };
  };

  const breadcrumbSchema = generateBreadcrumbSchema();

  // Default structured data for web pages
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: normalizedTitle,
    description: safeDescription,
    url: fullCanonicalUrl || baseUrl,
    inLanguage: isLithuanian ? 'lt' : 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Paula Pango',
      url: baseUrl,
    },
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      <Head>
        <title>{normalizedTitle}</title>
        <meta name='description' content={safeDescription} />
        <meta name='keywords' content={keywords} />
        <meta name='author' content='Paula Pango' />
        <meta
          name='robots'
          content={
            noIndex
              ? 'noindex, nofollow'
              : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          }
        />
        <meta
          name='googlebot'
          content={noIndex ? 'noindex, nofollow' : 'index, follow'}
        />
        <meta
          name='bingbot'
          content={noIndex ? 'noindex, nofollow' : 'index, follow'}
        />

        {/* Open Graph - absolute URLs for Facebook/social previews */}
        <meta property='og:title' content={normalizedTitle} />
        <meta property='og:description' content={safeDescription} />
        <meta property='og:url' content={ogUrl} />
        <meta property='og:image' content={absoluteOgImage} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content={absoluteOgImage.endsWith('.jpg') || absoluteOgImage.endsWith('.jpeg') ? 'image/jpeg' : 'image/png'} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Paula Pango' />
        <meta property='og:locale' content={isLithuanian ? 'lt_LT' : 'en_US'} />
        <meta
          property='og:locale:alternate'
          content={isLithuanian ? 'en_US' : 'lt_LT'}
        />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@paulapango' />
        <meta name='twitter:creator' content='@paulapango' />
        <meta name='twitter:title' content={normalizedTitle} />
        <meta name='twitter:description' content={safeDescription} />
        <meta name='twitter:image' content={absoluteOgImage} />

        {/* Additional SEO */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#7b5d5d' />
        <meta name='msapplication-TileColor' content='#7b5d5d' />
        {fullCanonicalUrl && <link rel='canonical' href={fullCanonicalUrl} />}

        {/* Language alternates - Auto-generated from hreflangMap when canonicalUrl provided */}
        {effectiveHreflang.length > 0 &&
          effectiveHreflang.map((tag) => (
            <link
              key={tag.hreflang}
              rel='alternate'
              hrefLang={tag.hreflang}
              href={tag.href}
            />
          ))}

        {/* Structured Data - WebPage */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(finalStructuredData),
          }}
        />
        
        {/* Structured Data - Site Navigation (for Sitelinks) */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationSchema),
          }}
        />
        
        {/* Structured Data - Breadcrumbs */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Head>

      <DefaultSeo
        title={normalizedTitle}
        description={safeDescription}
        openGraph={{
          type: 'website',
          locale: isLithuanian ? 'lt_LT' : 'en_US',
          url: ogUrl,
          site_name: 'Paula Pango',
          title: normalizedTitle,
          description: safeDescription,
          images: [
            {
              url: absoluteOgImage,
              width: 1200,
              height: 630,
              alt: normalizedTitle,
              type: absoluteOgImage.endsWith('.jpg') || absoluteOgImage.endsWith('.jpeg') ? 'image/jpeg' : 'image/png',
            },
          ],
        }}
        twitter={{
          handle: '@paulapango',
          site: '@paulapango',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords,
          },
          {
            name: 'author',
            content: 'Paula Pango',
          },
        ]}
        additionalLinkTags={
          fullCanonicalUrl
            ? [
                {
                  rel: 'canonical',
                  href: fullCanonicalUrl,
                },
              ]
            : []
        }
      />
    </>
  );
}
