import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { artworks } from '../../lib/artworks';
import { cormorant, jost } from '../../lib/fonts';
import { useLocalePath } from '../../lib/useLocalePath';

export default function Gallery() {
  const { prefix, isLithuanian } = useLocalePath();

  return (
    <>
      <Head>
        <title>Gallery — Paula Pango</title>
        <meta name='description' content='Browse original oil paintings by Paula Pango. Each piece is unique and available for purchase.' />
        <link rel='canonical' href='https://www.paulapango.com/gallery' />
        <meta property='og:title' content='Gallery — Paula Pango' />
        <meta property='og:description' content='Browse original oil paintings by Paula Pango.' />
      </Head>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Page heading */}
        <div className='text-center mb-14'>
          <h1 className={`text-5xl md:text-6xl text-text mb-4 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {isLithuanian ? 'Galerija' : 'Gallery'}
          </h1>
          <p className={`text-text-muted text-sm uppercase tracking-[0.2em] ${jost.className}`}>
            {isLithuanian ? 'Originalūs aliejiniai paveikslai' : 'Original oil paintings'}
          </p>
          <div className='mt-5 mx-auto w-16 h-px bg-secondary' />
        </div>

        {/* Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {artworks.map((artwork) => {
            const href = isLithuanian
              ? `${prefix}/galerija/${artwork.slugLt}`
              : `/gallery/${artwork.slug}`;
            const label = isLithuanian ? artwork.titleLt : artwork.title;

            return (
              <Link key={artwork.id} href={href} className='group block'>
                {/* Uniform aspect ratio — images fill via object-cover */}
                <div className='relative overflow-hidden bg-surface aspect-[3/4]'>
                  <Image
                    src={artwork.imageUrl}
                    alt={label}
                    fill
                    className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                  />
                  {artwork.sold && (
                    <div className={`absolute top-2 left-2 bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-0.5 ${jost.className}`}>
                      {isLithuanian ? 'Parduota' : 'Sold'}
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className='pt-3 pb-2 text-center px-1'>
                  <p className={`text-text text-base leading-snug ${cormorant.className}`}>{label}</p>
                  <p className={`text-text-muted text-xs mt-1 ${jost.className}`}>
                    {artwork.sold
                      ? (isLithuanian ? 'Parduota' : 'Sold')
                      : `€${artwork.price.toLocaleString('en-US')}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
