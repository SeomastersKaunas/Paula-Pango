// pages/_app.tsx
import '../styles/globals.css';
import Header from '../components/Header';
import { CartContextProvider } from '../lib/CartContext';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as gtag from '../lib/gtag';
import { cormorant, jost } from '../lib/fonts';

const GOOGLE_ADS_ID = gtag.GOOGLE_ADS_ID;
import Head from 'next/head';
import Script from 'next/script';
import GoogleAnalytics from '../components/GoogleAnalytics';
import Spinner from '../components/Spinner';
import { LazyMotion, domMax } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CookieConsentBanner = dynamic(
  () => import('../components/CookieConsentBanner'),
  { ssr: false }
);

const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const ScrollToTopButton = dynamic(
  () => import('../components/ScrollToTopButton').then((m) => m.ScrollToTopButton),
  { ssr: false }
);

const protectedPaths = ['/admin'];

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const pathOnly = (router.asPath || router.pathname || '')
    .split('?')[0]
    .split('#')[0];
  const isProtected =
    protectedPaths.some((path) => pathOnly.startsWith(path)) &&
    pathOnly !== '/admin/login';

  useEffect(() => {
    if (!loading) {
      if (!user && isProtected) {
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathOnly)}`);
      }
    }
  }, [user, loading, router, isProtected, pathOnly]);

  if (!isProtected) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}

function App(props: any) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [hasConsent, setHasConsent] = useState(false);
  const { t } = useTranslation('common');

  const showNavbar = !['/admin/login'].includes(
    router.pathname
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookieConsent');
      if (consent === 'true') {
        setHasConsent(true);
      }
    }
  }, []);

  const handleRequiredConsent = (accepted: boolean) => {
    if (accepted) {
      localStorage.setItem('cookieConsent', 'true');
    }
  };

  useEffect(() => {
    if (!hasConsent) return;
    const handleRouteChange = (url: string) => gtag.pageview(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [hasConsent, router.events]);

  return (
    <AuthProvider>
      <CartContextProvider>
        <LazyMotion features={domMax} strict={false}>
        {/* Google Ads Global Site Tag (gtag.js) - loads on all pages for conversion tracking */}
        {GOOGLE_ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `}
            </Script>
          </>
        )}

        <div className={`relative min-h-screen ${cormorant.variable} ${jost.variable}`}>
          <div className='absolute inset-0 -z-10 bg-[#fdfbf9]' aria-hidden='true' />

          <div className='relative z-10'>
            {showNavbar && <Header />}
            <Toaster 
              position='top-center' 
              containerStyle={{
                top: '80px', // Position below navbar (navbar is ~56px + padding)
              }}
              toastOptions={{
                style: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
              }}
            />
            <main className='min-h-screen relative'>
              <AuthGate>
                <Component {...pageProps} />
              </AuthGate>
            </main>
            {showNavbar && <Footer />}
            <CookieConsentBanner onRequiredConsent={handleRequiredConsent} />
          </div>

          <ScrollToTopButton />
        </div>

        {hasConsent && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics
            measurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
            measurementIdLt={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID_LT}
          />
        )}
        </LazyMotion>
        </CartContextProvider>
    </AuthProvider>
  );
}

export default App;
