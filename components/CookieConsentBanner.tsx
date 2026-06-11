'use client';

import CookieConsent, { Cookies } from 'react-cookie-consent';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import { FiArrowRight } from 'react-icons/fi';
import { useLocalePath } from '../lib/useLocalePath';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

interface CookieConsentBannerProps {
  onRequiredConsent: (accepted: boolean) => void;
}

const CookieConsentBanner = ({
  onRequiredConsent,
}: CookieConsentBannerProps) => {
  const { t } = useTranslation('common');
  const { prefix } = useLocalePath();
  const privacyHref = prefix ? `${prefix}/privacy-policy` : '/privacy-policy';
  const [gaAllowed, setGaAllowed] = useState(false);
  const [requiredAccepted, setRequiredAccepted] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true); // Default to ON

  useEffect(() => {
    const accepted = Cookies.get('userCookieConsentRequired');
    const analytics = Cookies.get('userCookieConsentAnalytics');
    if (accepted === 'true') {
      setRequiredAccepted(true);
      onRequiredConsent(true);
    }
    // If analytics consent exists, use it; otherwise default to true (opt-in by default)
    if (analytics !== undefined) {
      setAnalyticsOptIn(analytics === 'true');
      setGaAllowed(analytics === 'true');
    } else {
      // First time - default to enabled
      setAnalyticsOptIn(true);
    }
  }, [onRequiredConsent]);

  useEffect(() => {
    if (requiredAccepted) {
      Cookies.set('userCookieConsentRequired', 'true', { expires: 365 });
      onRequiredConsent(true);
    }
    if (analyticsOptIn) {
      Cookies.set('userCookieConsentAnalytics', 'true', { expires: 365 });
      setGaAllowed(true);
    } else {
      Cookies.set('userCookieConsentAnalytics', 'false', { expires: 365 });
      setGaAllowed(false);
    }
  }, [requiredAccepted, analyticsOptIn, onRequiredConsent]);

  return (
    <>
      {gaAllowed && GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy='lazyOnload'
          />
          <Script id='ga-init' strategy='lazyOnload'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {!requiredAccepted && (
        <div className='fixed bottom-5 left-1/2 -translate-x-1/2 w-[95vw] max-w-2xl bg-[#fdfbf9] shadow-lg p-5 flex flex-col sm:flex-row items-center gap-5 border border-[#e4d4d4] z-50'
          style={{ fontFamily: 'var(--font-jost)' }}>
          <div className='flex-1 text-[#3e3232] text-xs leading-relaxed text-center sm:text-left'>
            {t('cookieConsent.message')}{' '}
            <Link
              href={privacyHref}
              className='underline text-[#7b5d5d] hover:text-[#6a4f4f] ml-1 transition-colors'
            >
              {t('cookieConsent.learnMore')}
            </Link>
          </div>
          <div className='flex flex-col items-center gap-3 w-full sm:w-auto shrink-0'>
            <button
              className='inline-flex items-center gap-2 px-7 py-2.5 bg-[#7b5d5d] text-white text-xs uppercase tracking-[0.15em] hover:bg-[#6a4f4f] transition-colors w-full sm:w-auto justify-center'
              onClick={() => setRequiredAccepted(true)}
            >
              {t('cookieConsent.acceptRequired')}
              <FiArrowRight className='w-3.5 h-3.5' />
            </button>
            <div className='flex items-center gap-2.5'>
              <Switch
                checked={analyticsOptIn}
                onChange={setAnalyticsOptIn}
                aria-label={t('cookieConsent.enableAnalytics') as string}
                className={`${
                  analyticsOptIn ? 'bg-[#7b5d5d]' : 'bg-[#cfb0ae]'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className='sr-only'>{t('cookieConsent.enableAnalytics')}</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    analyticsOptIn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </Switch>
              <span className='text-xs text-[#9e8080]'>
                {t('cookieConsent.enableAnalytics')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentBanner;
