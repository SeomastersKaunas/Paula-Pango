import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { artworks } from '../../lib/artworks';
import { cormorant, jost } from '../../lib/fonts';

export default function Apie() {
  return (
    <>
      <Head>
        <title>Apie — Paula Pango</title>
        <meta name='description' content='Paula Pango — lietuvių dailininkė iš Kauno. Sužinokite apie jos kūrybą ir meninę kelionę.' />
        <link rel='canonical' href='https://www.paulapango.com/lt/apie' />
        <link rel='alternate' hrefLang='en' href='https://www.paulapango.com/about' />
        <link rel='alternate' hrefLang='lt-LT' href='https://www.paulapango.com/lt/apie' />
      </Head>

      <div className='relative w-screen overflow-hidden' style={{ height: '200px', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
        <Image
          src={artworks[9].imageUrl}
          alt='Paula Pango tapyba'
          fill
          priority
          className='object-cover object-center'
          sizes='100vw'
        />
        <div className='absolute inset-0 bg-[#fdfbf9]/40' />
        <div className='absolute inset-0 flex items-end pb-14 justify-center'>
          <h1
            className={`text-6xl md:text-8xl text-white drop-shadow tracking-wide ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            Apie
          </h1>
        </div>
      </div>

      <div className='max-w-3xl mx-auto px-6 py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20'>
          <div className='relative aspect-[3/4] bg-surface overflow-hidden'>
            <Image
              src={artworks[1].imageUrl}
              alt='Paula Pango'
              fill
              className='object-cover object-top'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>

          <div className='flex flex-col justify-center'>
            <h2 className={`text-4xl text-text mb-5 ${cormorant.className}`}>
              Paula Pango
            </h2>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Paula Pango — lietuvių dailininkė iš Kauno. Jos kūryboje dominuoja portretai, peizažai ir vaizduotės kompozicijos — viskas tapoma aliejiniais dažais ant drobės, akcentuojant nuotaiką, charakterį ir emocinį gilumą.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Kiekvienas paveikslas prasideda nuo idėjos — pastebėjimo, atminimo ar jausmo — ir formuojasi per kruopščius dažų sluoksnius. Paula traukia tylinga vieno žvilgsnio jėga, šviesos svoris ant veido ir paprastuose momentuose paslėptos istorijos.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm ${jost.className}`}>
              Jos paveikslai parduodami kaip vieninteliai originalai. Ji taip pat priima užsakymus individualiems portretams.
            </p>
          </div>
        </div>

        <div className='border-t border-border pt-12 text-center'>
          <h3 className={`text-3xl text-text mb-4 ${cormorant.className}`}>
            Susisiekite
          </h3>
          <p className={`text-text-muted text-sm mb-6 ${jost.className}`}>
            Dėl pirkimo užklausų, individualių užsakymų ar kitų klausimų:
          </p>
          <a
            href='mailto:paulapango.art@gmail.com'
            className={`text-primary hover:underline text-sm ${jost.className}`}
          >
            paulapango.art@gmail.com
          </a>

          <div className='flex justify-center gap-6 mt-6'>
            <a href='https://www.instagram.com/paulapango' target='_blank' rel='noopener noreferrer'
              className={`text-xs uppercase tracking-[0.18em] text-text-muted hover:text-primary transition-colors ${jost.className}`}>
              Instagram
            </a>
            <a href='https://www.facebook.com/share/1BY35K5TGQ/?mibextid=wwXIfr' target='_blank' rel='noopener noreferrer'
              className={`text-xs uppercase tracking-[0.18em] text-text-muted hover:text-primary transition-colors ${jost.className}`}>
              Facebook
            </a>
          </div>
        </div>

        <div className='text-center mt-16'>
          <Link
            href='/lt/galerija'
            className={`inline-block px-10 py-3 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 ${jost.className}`}
          >
            Peržiūrėti galeriją
          </Link>
        </div>
      </div>
    </>
  );
}
