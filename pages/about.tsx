import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
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
          src='/paula_assets/about Paula Pango.jpeg'
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
              src='/paula_assets/about Paula Pango.jpeg'
              alt='Paula Pango – artist photo'
              fill
              className='object-cover object-top'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>

          {/* Bio */}
          <div className='flex flex-col justify-center'>
            <h2 className={`text-4xl text-text mb-5 ${cormorant.className}`}>
              About
            </h2>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Paula is a contemporary oil painter born and raised in Kaunas, Lithuania, where she completed her secondary education at an arts-focused school. Much of her artistic foundation was developed through years of independent practice, observation, and exploration in oil painting.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Working primarily in oil, she explores the relationship between realism, emotion, and visual storytelling through portraiture, figurative painting, still life, and studies from nature. Drawn to the richness and versatility of the medium, Paula seeks to balance technical precision with atmosphere and feeling, creating works that encourage reflection and connection.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              Inspired by both classical masters and contemporary art, she is particularly interested in the expressive potential of light, form, and the human gaze. Her paintings range from carefully observed realistic works to more symbolic and conceptual compositions, united by a fascination with presence, character, and atmosphere.
            </p>
            <p className={`text-text-muted leading-relaxed text-sm ${jost.className}`}>
              Approaching painting as both a technical discipline and a means of exploration, Paula employs careful observation and layered techniques to create works that invite viewers to pause, reflect, and engage with the subject beyond its outward appearance.
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

        {/* Paintings CTA */}
        <div className='text-center mt-16'>
          <Link
            href='/paintings'
            className={`inline-block px-10 py-3 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 ${jost.className}`}
          >
            View Paintings
          </Link>
        </div>
      </div>
    </>
  );
}
