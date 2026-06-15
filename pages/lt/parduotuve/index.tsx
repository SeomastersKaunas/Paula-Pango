import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { artworks } from '../../../lib/artworks';
import { cormorant, jost } from '../../../lib/fonts';

export default function ParduotuveLt() {
  return (
    <>
      <Head>
        <title>Parduotuvė — Paula Pango</title>
        <meta name='description' content='Naršykite ir įsigykite originalius aliejinės tapybos kūrinius. Kiekvienas paveikslas yra unikalus.' />
        <link rel='canonical' href='https://www.paulapango.com/lt/parduotuve' />
        <link rel='alternate' hrefLang='en' href='https://www.paulapango.com/shop' />
        <link rel='alternate' hrefLang='lt-LT' href='https://www.paulapango.com/lt/parduotuve' />
      </Head>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        <div className='text-center mb-14'>
          <h1 className={`text-5xl md:text-6xl text-text mb-4 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            Parduotuvė
          </h1>
          <p className={`text-text-muted text-sm uppercase tracking-[0.2em] ${jost.className}`}>
            Originalūs aliejiniai paveikslai
          </p>
          <div className='mt-5 mx-auto w-16 h-px bg-secondary' />
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {artworks.map((artwork) => (
            <Link key={artwork.id} href={`/lt/parduotuve/${artwork.slugLt}`} className='group block'>
              <div className='relative overflow-hidden bg-surface aspect-[3/4]'>
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.titleLt}
                  fill
                  className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
                  sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                />
                {artwork.sold && (
                  <div className={`absolute top-2 left-2 bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-0.5 ${jost.className}`}>
                    Parduota
                  </div>
                )}
              </div>
              <div className='pt-3 pb-2 text-center px-1'>
                <p className={`text-text text-base leading-snug ${cormorant.className}`}>{artwork.titleLt}</p>
                <p className={`text-text-muted text-xs mt-1 ${jost.className}`}>
                  {artwork.sold ? 'Parduota' : `€${artwork.price.toLocaleString('en-US')}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
