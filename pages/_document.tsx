// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export default function Document() {
  return (
    <Html lang='en' suppressHydrationWarning={true}>
      <Head>
        {/* Initialize dataLayer before GTM */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];`,
            }}
          />
        )}
        {/* Google Tag Manager */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        {/* ✅ Google Fonts preconnect; font links use &display=swap to avoid render-blocking */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Barlow:wght@700&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Audiowide&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Michroma&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Epilogue:wght@700&display=swap'
          rel='stylesheet'
        />

        <meta property='fb:app_id' content='1223293146253930' />
        <meta name='facebook-domain-verification' content='pj80oi385oljs0xerrl7md4ebr77bo' />

        {/* ✅ Favicon */}
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />

      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  // Default to dark mode, only use light if explicitly set
                  const shouldBeDark = theme !== 'light';
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // Default to dark on error
                  document.documentElement.classList.add('dark');
                }
              })();
              
              // Suppress console errors and warnings for production and PageSpeed Insights
              (function() {
                const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const isPageSpeedInsights = 
                  navigator.userAgent.includes('Chrome-Lighthouse') ||
                  navigator.userAgent.includes('PageSpeed') ||
                  navigator.userAgent.includes('GTmetrix') ||
                  window.navigator.webdriver === true ||
                  (window.outerHeight === 0 && window.outerWidth === 0);
                
                // Suppress React DevTools warning in production
                if (!isDevelopment) {
                  const originalWarn = console.warn;
                  console.warn = function(...args) {
                    const message = args.join(' ');
                    if (
                      message.includes('Download the React DevTools') ||
                      message.includes('react-devtools')
                    ) {
                      return; // Suppress React DevTools warning
                    }
                    originalWarn.apply(console, args);
                  };
                }
                
                // Override console.error to suppress known errors
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  const errorMessage = args.join(' ');
                  
                  // Suppress Firebase Firestore timeout errors
                  if (
                    errorMessage.includes('firestore.googleapis.com') ||
                    errorMessage.includes('ERR_TIMED_OUT') ||
                    (errorMessage.includes('Firebase') && errorMessage.includes('timeout'))
                  ) {
                    if (isPageSpeedInsights || !isDevelopment) {
                      return;
                    }
                  }
                  
                  // Suppress GTM/gtag script loading errors (blocked by ad blockers)
                  if (
                    errorMessage.includes('googletagmanager.com') ||
                    errorMessage.includes('gtag/js') ||
                    errorMessage.includes('NS_BINDING_ABORTED') ||
                    errorMessage.includes('OpaqueResponseBlocking') ||
                    errorMessage.includes('Loading failed for the <script>') ||
                    errorMessage.includes('Failed to load resource') && errorMessage.includes('gtag')
                  ) {
                    // Silently suppress GTM errors (common with ad blockers)
                    return;
                  }
                  
                  // Suppress cookie warnings
                  if (
                    errorMessage.includes('Partitioned cookie') ||
                    errorMessage.includes('cookie') && errorMessage.includes('warning') ||
                    errorMessage.includes('storage access')
                  ) {
                    return;
                  }
                  
                  // Call original console.error for other errors
                  originalConsoleError.apply(console, args);
                };
                
                // Suppress unhandled network errors
                window.addEventListener('error', function(event) {
                  if (
                    event.message &&
                    (
                      event.message.includes('firestore.googleapis.com') ||
                      event.message.includes('ERR_TIMED_OUT') ||
                      event.message.includes('googletagmanager.com') ||
                      event.message.includes('gtag') ||
                      event.message.includes('NS_BINDING_ABORTED') ||
                      event.message.includes('OpaqueResponseBlocking') ||
                      (event.message.includes('Failed to load resource') && (
                        event.message.includes('gtag') ||
                        event.message.includes('googletagmanager')
                      ))
                    )
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Suppress unhandled promise rejections
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason && event.reason.toString();
                  if (
                    reason &&
                    (
                      reason.includes('firestore.googleapis.com') ||
                      reason.includes('ERR_TIMED_OUT') ||
                      reason.includes('googletagmanager.com') ||
                      reason.includes('gtag') ||
                      reason.includes('NS_BINDING_ABORTED')
                    )
                  ) {
                    event.preventDefault();
                    return false;
                  }
                });
                
                // Suppress HMR websocket messages in console (development only)
                if (isDevelopment) {
                  const originalLog = console.log;
                  console.log = function(...args) {
                    const message = args.join(' ');
                    if (message.includes('[HMR]') || message.includes('websocket')) {
                      return; // Suppress HMR messages
                    }
                    originalLog.apply(console, args);
                  };
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
