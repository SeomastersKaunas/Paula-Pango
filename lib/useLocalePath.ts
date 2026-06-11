/**
 * Hook to detect current locale from path and get the correct path prefix.
 * Use this for Footer, Plans, and any component that needs locale-aware links.
 */
import { useRouter } from 'next/router';

export type LocalePath = {
  isUS: boolean;
  isLithuanian: boolean;
  /** Prefix for internal links: '/us' | '/lt' | '' */
  prefix: string;
};

export function useLocalePath(): LocalePath {
  const router = useRouter();
  const asPath = router?.asPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const isUS = asPath === '/us' || asPath.startsWith('/us/');
  const isLithuanian = asPath === '/lt' || asPath.startsWith('/lt/');
  const prefix = isUS ? '/us' : isLithuanian ? '/lt' : '';
  return { isUS, isLithuanian, prefix };
}
