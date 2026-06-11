import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
  measurementIdLt?: string;
}

export default function GoogleAnalytics({
  measurementId,
  measurementIdLt,
}: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy='lazyOnload'
      />
      {measurementIdLt && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementIdLt}`}
          strategy='lazyOnload'
        />
      )}
      <Script id='google-analytics' strategy='lazyOnload'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Configure English tracking
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
              'custom_parameter_1': 'language',
              'custom_parameter_2': 'page_type'
            }
          });
          
          ${
            measurementIdLt
              ? `
          // Configure Lithuanian tracking
          gtag('config', '${measurementIdLt}', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
              'custom_parameter_1': 'language',
              'custom_parameter_2': 'page_type'
            }
          });
          
          // Track language changes
          const isLithuanian = window.location.pathname.startsWith('/lt');
          const activeId = isLithuanian ? '${measurementIdLt}' : '${measurementId}';
          
          gtag('config', activeId, {
            custom_parameter_1: isLithuanian ? 'lt' : 'en'
          });
          `
              : ''
          }
        `}
      </Script>
    </>
  );
}
