import { useRouter } from 'next/router';
import { useCallback } from 'react';
import en from '../locales/en/common.json';
import lt from '../locales/lt/common.json';

type Lang = 'en' | 'lt';

const dictionaries: Record<Lang, any> = { en, lt };

function resolveFromDict(dict: any, segments: string[]) {
  let current = dict;
  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return undefined;
    }
  }
  if (typeof current === 'string') return current;
  if (Array.isArray(current)) return current;
  return undefined;
}

function getValue(key: string, lang: Lang): string | string[] {
  const segments = key.split('.');
  const primary = resolveFromDict(dictionaries[lang], segments);
  if (primary !== undefined) return primary;
  const fallback = resolveFromDict(dictionaries.en, segments);
  if (fallback !== undefined) return fallback;
  return key;
}

function detectLang(pathname: string | undefined | null): Lang {
  if (!pathname) return 'en';
  const cleanPath = pathname.split('?')[0].split('#')[0];
  return cleanPath === '/lt' || cleanPath.startsWith('/lt/') ? 'lt' : 'en';
}

export default function useTranslation(_namespace?: string, langOverride?: Lang) {
  const router = useRouter();
  const pathFromRouter =
    router?.asPath ||
    router?.pathname ||
    (typeof window !== 'undefined' ? window.location.pathname : '/');
  const lang = langOverride || detectLang(pathFromRouter);
  const t = useCallback((key: string) => getValue(key, lang), [lang]);

  return { t, lang };
}

export { detectLang };

