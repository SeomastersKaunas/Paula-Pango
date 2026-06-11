import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { artworks } from '../lib/artworks';
import { cormorant, jost } from '../lib/fonts';

export default function About() {
  return (
    <>
      <Head>
        <title>About — Paula Pango</title>
        <meta name='description' content='Paula Pango is a Lithuanian oil painter based in Kaunas. Learn about her practice and artistic journey.' />
        <link rel='canonical' href='https://www.paulapango.com/about' />
        <link rel='alternate' hrefLang='en' href='https://www.paulapango.com/about' />
        <link rel='alternate' hrefLang='lt-LT' href='https://www.paulapango.com/lt/apie' />
      </Head>

      {/* Hero image */}
      <div className='relative w-screen overflow-hidden' style={{ height: '200px', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
        <Image
          src={artworks[9].imageUrl}
          alt='Paula Pango painting'
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
            About
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-3xl mx-auto px-6 py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20'>
          {/* Portrait */}
          <div className='relative aspect-[3/4] bg-surface overflow-hidden'>
            <Image
              src={artworks[1].imageUrl}
              alt='Paula Pango'
              fill
              className='object-cover object-top'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>

          {/* Bio */}
          <div className='flex flex-col justify-center'>
            <h2 className={`text-4xl text-text mb-5 ${cormorant.className}`}>
              Paula Pango
            </h2>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Paula Pango is a Lithuanian oil painter based in Kaunas. Her work spans portraiture, landscapes, and imaginative compositions — all painted in oil on canvas with a focus on mood, character, and emotional depth.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Each painting begins as an idea — an observation, a memory, or a feeling — and takes shape through careful layers of paint. Paula is drawn to the quiet power of a single gaze, the weight of light on a face, and the stories hidden in ordinary moments.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm ${jost.className}`}>
              Her paintings are available as one-of-a-kind originals. She also accepts commissions for custom portraits.
            </p>
          </div>
        </div>

        {/* Contact strip */}
        <div className='border-t border-border pt-12 text-center'>
          <h3 className={`text-3xl text-text mb-4 ${cormorant.className}`}>
            Get in Touch
          </h3>
          <p className={`text-text-muted text-sm mb-6 ${jost.className}`}>
            For purchase enquiries, commissions, or any questions:
          </p>
          <a
            href='mailto:paulapango.art@gmail.com'
            className={`text-primary hover:underline text-sm ${jost.className}`}
          >
            paulapango.art@gmail.com
          </a>

          <div className='flex justify-center gap-6 mt-6'>
            <a
              href='https://www.instagram.com/paulapango'
              target='_blank'
              rel='noopener noreferrer'
              className={`text-xs uppercase tracking-[0.18em] text-text-muted hover:text-primary transition-colors ${jost.className}`}
            >
              Instagram
            </a>
            <a
              href='https://www.facebook.com/share/1BY35K5TGQ/?mibextid=wwXIfr'
              target='_blank'
              rel='noopener noreferrer'
              className={`text-xs uppercase tracking-[0.18em] text-text-muted hover:text-primary transition-colors ${jost.className}`}
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Gallery CTA */}
        <div className='text-center mt-16'>
          <Link
            href='/gallery'
            className={`inline-block px-10 py-3 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 ${jost.className}`}
          >
            View Gallery
          </Link>
        </div>
      </div>
    </>
  );
}
