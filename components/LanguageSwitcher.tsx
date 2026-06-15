import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

export const flags = {
  en: (
    <svg width='28' height='20' viewBox='0 0 28 20' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <rect width='28' height='20' rx='3' fill='#012169' />
      <path d='M0 0L28 20M28 0L0 20' stroke='#fff' strokeWidth='3' />
      <path d='M0 0L28 20M28 0L0 20' stroke='#C8102E' strokeWidth='2' />
      <rect x='11.2' width='5.6' height='20' fill='#fff' />
      <rect y='7.2' width='28' height='5.6' fill='#fff' />
      <rect x='12.4' width='3.2' height='20' fill='#C8102E' />
      <rect y='8.4' width='28' height='3.2' fill='#C8102E' />
    </svg>
  ),
  lt: (
    <svg width='28' height='20' viewBox='0 0 28 20' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <rect width='28' height='20' rx='3' fill='#FDB913' />
      <rect y='6.67' width='28' height='6.66' fill='#006A44' />
      <rect y='13.33' width='28' height='6.67' fill='#C1272D' />
    </svg>
  ),
};

export type LocaleOption = 'en' | 'lt';

// Paula Pango — minimal route map (en ↔ lt)
const urlMapping: Record<string, { en: string; lt: string }> = {
  '/': { en: '/', lt: '/lt/' },
  '/lt': { en: '/', lt: '/lt/' },
  '/lt/': { en: '/', lt: '/lt/' },
  '/about': { en: '/about', lt: '/lt/apie' },
  '/lt/apie': { en: '/about', lt: '/lt/apie' },
  '/shop': { en: '/shop', lt: '/lt/parduotuve' },
  '/lt/parduotuve': { en: '/shop', lt: '/lt/parduotuve' },
  '/paintings': { en: '/paintings', lt: '/lt/paveikslai' },
  '/lt/paveikslai': { en: '/paintings', lt: '/lt/paveikslai' },
  '/contact': { en: '/contact', lt: '/lt/kontaktai' },
  '/lt/kontaktai': { en: '/contact', lt: '/lt/kontaktai' },
  '/contact-success': { en: '/contact-success', lt: '/lt/kontaktai-sekmingai' },
  '/lt/kontaktai-sekmingai': { en: '/contact-success', lt: '/lt/kontaktai-sekmingai' },
  '/cart': { en: '/cart', lt: '/lt/krepselis' },
  '/lt/krepselis': { en: '/cart', lt: '/lt/krepselis' },
  '/privacy-policy': { en: '/privacy-policy', lt: '/lt/sub/privatumo-politika' },
  '/lt/sub/privatumo-politika': { en: '/privacy-policy', lt: '/lt/sub/privatumo-politika' },
  '/sub/faq': { en: '/sub/faq', lt: '/lt/sub/duk' },
  '/lt/sub/duk': { en: '/sub/faq', lt: '/lt/sub/duk' },
  '/sub/support': { en: '/sub/support', lt: '/lt/sub/pagalba' },
  '/lt/sub/pagalba': { en: '/sub/support', lt: '/lt/sub/pagalba' },
  '/sub/terms-of-service': { en: '/sub/terms-of-service', lt: '/lt/sub/naudojimo-taisykles' },
  '/lt/sub/naudojimo-taisykles': { en: '/sub/terms-of-service', lt: '/lt/sub/naudojimo-taisykles' },
  '/sub/cookies-info': { en: '/sub/cookies-info', lt: '/lt/sub/slapukai' },
  '/lt/sub/slapukai': { en: '/sub/cookies-info', lt: '/lt/sub/slapukai' },
};

export function getAlternateUrl(currentPath: string, targetLocale: LocaleOption): string {
  let normalized = (currentPath || '/').split('?')[0].split('#')[0];
  if (normalized.endsWith('/') && normalized !== '/') normalized = normalized.slice(0, -1);
  if (normalized === '/lt') normalized = '/lt';

  const mapping = urlMapping[normalized];
  if (mapping) {
    return mapping[targetLocale];
  }

  // Dynamic shop slugs: /shop/[slug] <-> /lt/parduotuve/[slug]
  if (normalized.startsWith('/lt/parduotuve/')) {
    const slug = normalized.replace('/lt/parduotuve', '');
    return targetLocale === 'en' ? `/shop${slug}` : `/lt/parduotuve${slug}`;
  }
  if (normalized.startsWith('/shop/')) {
    const slug = normalized.replace('/shop', '');
    return targetLocale === 'lt' ? `/lt/parduotuve${slug}` : `/shop${slug}`;
  }

  // Legacy gallery redirects (in case someone lands on old URL before redirect fires)
  if (normalized.startsWith('/lt/galerija/')) {
    const slug = normalized.replace('/lt/galerija', '');
    return targetLocale === 'en' ? `/shop${slug}` : `/lt/parduotuve${slug}`;
  }
  if (normalized.startsWith('/gallery/')) {
    const slug = normalized.replace('/gallery', '');
    return targetLocale === 'lt' ? `/lt/parduotuve${slug}` : `/shop${slug}`;
  }

  // Fallback: strip /lt prefix or add it
  if (normalized.startsWith('/lt/')) {
    const enPath = normalized.replace(/^\/lt/, '') || '/';
    return targetLocale === 'lt' ? normalized : enPath;
  }
  if (targetLocale === 'lt') {
    return normalized === '/' ? '/lt/' : `/lt${normalized}`;
  }
  return normalized;
}

export default function LanguageSwitcher({
  initialLocale,
}: {
  initialLocale?: LocaleOption;
}) {
  const router = useRouter();
  const { asPath, pathname } = router;
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentLocale = useCallback((): LocaleOption => {
    if (initialLocale) return initialLocale;
    let path = asPath || pathname || '/';
    if (!path && typeof window !== 'undefined') path = window.location.pathname || '/';
    path = path.split('?')[0].split('#')[0];
    if (path.endsWith('/') && path !== '/') path = path.slice(0, -1);
    if (path === '/lt' || path.startsWith('/lt/')) return 'lt';
    return 'en';
  }, [initialLocale, asPath, pathname]);

  const [currentLocale, setCurrentLocale] = useState<LocaleOption>(getCurrentLocale());

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
  }, [getCurrentLocale]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-language-switcher]')) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [isOpen]);

  const locales: LocaleOption[] = ['en', 'lt'];
  const targetPath = (loc: LocaleOption) => getAlternateUrl(asPath || '/', loc);

  return (
    <div className='relative inline-block text-left' data-language-switcher>
      <button
        type='button'
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup='true'
        aria-expanded={isOpen}
        aria-label='Change language'
        className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#f0e9e9] transition-colors'
      >
        {flags[currentLocale]}
        <span className='text-xs uppercase tracking-wider text-[#3e3232]'>
          {currentLocale}
        </span>
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white border border-[#e4d4d4] shadow-lg z-50'>
          {locales.map((loc) => (
            <Link
              key={loc}
              href={targetPath(loc)}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider hover:bg-[#f0e9e9] transition-colors ${
                loc === currentLocale ? 'text-[#7b5d5d] font-semibold' : 'text-[#3e3232]'
              }`}
            >
              {flags[loc]}
              <span>{loc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
