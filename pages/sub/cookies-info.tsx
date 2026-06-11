import Head from 'next/head';
import Link from 'next/link';
import { cormorant, jost } from '../../lib/fonts';
import { useLocalePath } from '../../lib/useLocalePath';

export default function CookiesInfo() {
  const { isLithuanian } = useLocalePath();
  const lt = isLithuanian;

  const title = lt ? 'Slapukai — Paula Pango' : 'Cookies — Paula Pango';
  const description = lt
    ? 'Informacija apie slapukus, kuriuos naudoja paulapango.com pagal BDAR reikalavimus.'
    : 'Information about cookies used by paulapango.com in compliance with GDPR.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={`https://www.paulapango.com${lt ? '/lt/sub/slapukai' : '/sub/cookies-info'}`} />
      </Head>

      <div className='max-w-3xl mx-auto px-6 py-20'>
        <h1
          className={`text-4xl md:text-5xl text-primary mb-10 text-center ${cormorant.className}`}
          style={{ fontStyle: 'italic' }}
        >
          {lt ? 'Slapukų politika' : 'Cookies Policy'}
        </h1>

        <div className={`space-y-6 text-text leading-relaxed ${jost.className}`}>
          <p>
            {lt
              ? 'Šis trumpas dokumentas apibendrina, kokie slapukai yra naudojami paulapango.com svetainėje. Detalesnė informacija pateikta '
              : 'This short document summarises which cookies are used on paulapango.com. More detailed information is available in our '}
            <Link href={lt ? '/lt/sub/privatumo-politika' : '/privacy-policy'} className='text-primary underline hover:text-secondary transition-colors'>
              {lt ? 'privatumo politikoje' : 'privacy policy'}
            </Link>
            .
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? 'Būtini slapukai' : 'Essential cookies'}
          </h2>
          <p>
            {lt
              ? 'Naudojami autentifikacijai, krepšeliui ir saugiam atsiskaitymui. Be jų svetainė neveiks tinkamai.'
              : 'Used for authentication, the cart and secure checkout. Without them the site will not function correctly.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? 'Analitiniai slapukai' : 'Analytics cookies'}
          </h2>
          <p>
            {lt
              ? 'Naudojame Google Analytics, kad suprastume, kaip lankytojai naudojasi svetaine. Jie aktyvuojami tik jūsų sutikimui.'
              : 'We use Google Analytics to understand how visitors use the site. These are only activated with your consent.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? 'Kaip valdyti' : 'How to manage'}
          </h2>
          <p>
            {lt
              ? 'Bet kuriuo metu galite atšaukti savo sutikimą per slapukų juostą puslapio apačioje arba savo naršyklės nustatymuose.'
              : 'You can withdraw your consent at any time via the cookie banner at the bottom of the page or in your browser settings.'}
          </p>
        </div>
      </div>
    </>
  );
}
