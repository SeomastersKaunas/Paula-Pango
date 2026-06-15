import Head from 'next/head';
import GyroImage from '../../components/GyroImage';
import { artworks } from '../../lib/artworks';
import { cormorant, jost } from '../../lib/fonts';

export default function Paintings() {
  return (
    <>
      <Head>
        <title>Paintings — Paula Pango</title>
        <meta name='description' content='Portfolio of original oil paintings by Paula Pango — portraiture, figurative works, still life, and studies from nature.' />
        <link rel='canonical' href='https://www.paulapango.com/paintings' />
        <link rel='alternate' hrefLang='en' href='https://www.paulapango.com/paintings' />
        <link rel='alternate' hrefLang='lt-LT' href='https://www.paulapango.com/lt/paveikslai' />
        <meta property='og:title' content='Paintings — Paula Pango' />
        <meta property='og:description' content='Portfolio of original oil paintings by Paula Pango.' />
      </Head>

      <div className='max-w-5xl mx-auto px-6 py-16'>
        {/* Page heading */}
        <div className='text-center mb-16'>
          <h1 className={`text-5xl md:text-6xl text-text mb-4 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            Paintings
          </h1>
          <p className={`text-text-muted text-sm uppercase tracking-[0.2em] ${jost.className}`}>
            Portfolio — Original oil paintings
          </p>
          <div className='mt-5 mx-auto w-16 h-px bg-secondary' />
        </div>

        {/* Alternating layout */}
        <div className='flex flex-col gap-24'>
          {artworks.map((artwork, index) => {
            const isEven = index % 2 === 0;
            const dimensionLabel = `${artwork.widthCm} × ${artwork.heightCm} cm`;

            return (
              <article
                key={artwork.id}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center`}
              >
                {/* Image */}
                <div className='relative overflow-hidden bg-surface w-full md:w-1/2 shrink-0'
                  style={{ paddingBottom: `min(${(artwork.heightCm / artwork.widthCm) * 100}%, 60vh)` }}>
                  <GyroImage
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    sold={artwork.sold}
                    soldLabel='Sold'
                    showPrompt={index === 0}
                  />
                </div>

                {/* Text */}
                <div className='flex flex-col justify-center w-full md:w-1/2'>
                  <p className={`text-xs uppercase tracking-[0.2em] text-text-muted mb-2 ${jost.className}`}>
                    {artwork.year} · {artwork.medium}
                  </p>
                  <h2 className={`text-3xl md:text-4xl text-text mb-4 ${cormorant.className}`}>
                    {artwork.title}
                  </h2>
                  <p className={`text-text-muted leading-relaxed text-sm mb-4 whitespace-pre-line ${jost.className}`}>
                    {artwork.description}
                  </p>
                  <p className={`text-xs text-text-muted ${jost.className}`}>
                    {dimensionLabel}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
