// pages/contact-success.tsx
import { DefaultSeo } from 'next-seo';
import SEOHead from '../components/SEOHead';
import * as m from 'framer-motion/m';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { reportContactConversion } from '../lib/gtag';

const CONTACT_CONVERSION_STORAGE_KEY = 'paulapango_contact_conversion_fired';

export default function ContactSuccessPage() {
  const router = useRouter();
  const hasFired = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasFired.current) return;
    if (sessionStorage.getItem(CONTACT_CONVERSION_STORAGE_KEY) === '1') return;

    const path = router.asPath ?? window.location.pathname;
    const isSuccessPath =
      path === '/contact-success' ||
      path === '/us/contact-success' ||
      path.startsWith('/lt/kontaktai-sekmingai');
    if (!isSuccessPath) return;

    const tryFire = () => {
      if (typeof window === 'undefined' || !window.gtag) return;
      if (reportContactConversion()) {
        hasFired.current = true;
        sessionStorage.setItem(CONTACT_CONVERSION_STORAGE_KEY, '1');
      }
    };

    tryFire();
    if (!hasFired.current) {
      const t = window.setTimeout(tryFire, 500);
      return () => window.clearTimeout(t);
    }
  }, [router.asPath]);

  return (
    <>
      <SEOHead
        title='Contact Success | Paula Pango'
        description='Thank you for contacting Paula Pango'
        noIndex
      />
      <DefaultSeo
        title='Success | Paula Pango'
        description='Form submitted successfully'
      />
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className='min-h-screen flex flex-col justify-center items-center px-4'
      >
        <h1 className='text-3xl font-bold text-primary mb-4'>Thank You!</h1>
        <p className='text-md text-gray-700 mb-2'>We received your message.</p>
        <p className='text-md text-gray-600'>
          We’ll contact you shortly with answers and a customized offer.
        </p>
      </m.div>
    </>
  );
}
