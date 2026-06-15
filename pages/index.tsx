import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { artworks } from '../lib/artworks';
import { cormorant, jost } from '../lib/fonts';
import { useLocalePath } from '../lib/useLocalePath';

// Feature 3 paintings on the homepage
const FEATURED_IDS = ['lady-with-an-ermine', 'soul-mask', 'anastasija'];

export default function Home() {
  const { prefix, isLithuanian } = useLocalePath();

  const featured = FEATURED_IDS.map((id) => artworks.find((a) => a.id === id)!).filter(Boolean);
  const galleryHref = isLithuanian ? `${prefix}/parduotuve` : `${prefix}/shop`;
  const contactHref = isLithuanian ? `${prefix}/kontaktai` : `${prefix}/contact`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtist',
    name: 'Paula Pango',
    url: 'https://www.paulapango.com',
    description: 'Lithuanian oil painter based in Kaunas. Original paintings available to purchase.',
    sameAs: [
      'https://www.instagram.com/paulapango',
      'https://www.facebook.com/share/1BY35K5TGQ/',
    ],
  };

  return (
    <>
      <Head>
        <title>Paula Pango — Original Oil Paintings</title>
        <meta name='description' content='Original oil paintings by Lithuanian artist Paula Pango. Browse the gallery and purchase unique artworks online.' />
        <meta property='og:title' content='Paula Pango — Original Oil Paintings' />
        <meta property='og:description' content='Original oil paintings by Lithuanian artist Paula Pango. Browse the gallery and purchase unique artworks online.' />
        <meta property='og:url' content='https://www.paulapango.com' />
        <link rel='canonical' href='https://www.paulapango.com' />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        className='relative w-screen overflow-hidden h-[70vh] md:h-[75vh] lg:h-[80vh] max-h-[760px]'
        style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', marginTop: '-1px' }}
      >
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className='absolute inset-0 w-full h-full object-cover'
        >
          <source src='/paula_assets/video.mp4' type='video/mp4' />
        </video>

        {/* Overlay */}
        <div className='absolute inset-0 bg-[#3e3232]/30 z-10' />

        {/* Hero text */}
        <div className='absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center' style={{ paddingBottom: '8vh' }}>
          <h1
            className={`text-6xl md:text-8xl text-white drop-shadow-md tracking-wide mb-4 ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            Paula Pango
          </h1>
          <p className={`text-sm uppercase tracking-[0.25em] text-white/80 mb-8 ${jost.className}`}>
            {isLithuanian ? 'Originali tapyba · Aliejus ant drobės' : 'Original paintings · Oil on canvas'}
          </p>
          <Link
            href={galleryHref}
            className={`px-8 py-3 border border-white text-white text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-300 ${jost.className}`}
          >
            {isLithuanian ? 'Peržiūrėti parduotuvę' : 'View Shop'}
          </Link>
        </div>
      </section>

      {/* ── INTRO ──────────────────────────────────────────── */}
      <section className='max-w-2xl mx-auto px-6 py-20 text-center'>
        <h2 className={`text-4xl md:text-5xl text-text mb-6 ${cormorant.className}`}>
          {isLithuanian ? 'Sveiki atvykę į Paula Pango studiją' : "Welcome to Paula Pango's Studio"}
        </h2>
        <p className={`text-text-muted leading-relaxed text-base ${jost.className}`}>
          {isLithuanian
            ? 'Čia Paula dalijasi savo aliejinės tapybos kelione. Jos kūryba grindžiama realizmu, kruopščiu stebėjimu ir žavesiu subtiliomis emocijomis bei istorijomis, kurios atsiskleidžia per šviesą, formą ir išraišką.'
            : 'This is where Paula shares her journey through oil painting. Her work is rooted in realism, careful observation, and a fascination with the subtle emotions and stories that emerge through light, form, and expression.'}
        </p>
      </section>

      {/* ── FEATURED GRID ──────────────────────────────────── */}
      <section className='max-w-6xl mx-auto px-6 pb-24'>
        <h2 className={`text-2xl text-text text-center mb-10 tracking-wide ${cormorant.className}`}>
          {isLithuanian ? 'Rinktiniai darbai' : 'Featured Works'}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {featured.map((artwork) => {
            const href = isLithuanian
              ? `${prefix}/parduotuve/${artwork.slugLt}`
              : `${prefix}/shop/${artwork.slug}`;
            return (
              <Link key={artwork.id} href={href} className='group block'>
                <div className='overflow-hidden bg-surface aspect-[3/4] relative'>
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                  {artwork.sold && (
                    <div className={`absolute top-3 left-3 bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-1 ${jost.className}`}>
                      {isLithuanian ? 'Parduota' : 'Sold'}
                    </div>
                  )}
                </div>
                <div className='pt-3 text-center'>
                  <p className={`text-text text-lg ${cormorant.className}`}>{artwork.title}</p>
                  <p className={`text-text-muted text-sm mt-0.5 ${jost.className}`}>
                    {artwork.sold
                      ? (isLithuanian ? 'Parduota' : 'Sold')
                      : `€${artwork.price.toLocaleString('en-US')}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className='text-center mt-12'>
          <Link
            href={galleryHref}
            className={`inline-block px-10 py-3 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 ${jost.className}`}
          >
            {isLithuanian ? 'Visi paveikslai' : 'All Paintings'}
          </Link>
        </div>
      </section>

      {/* ── ARTIST STRIP ───────────────────────────────────── */}
      <section className='bg-surface py-16 px-6'>
        <div className='max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-10 text-center md:text-left'>
          <div
            className='shrink-0 w-44 h-44 relative overflow-hidden rounded-2xl border border-secondary'
            style={{
              transform: 'perspective(600px) rotateY(12deg) rotateX(4deg)',
              boxShadow: '6px 16px 40px rgba(62,50,50,0.22)',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'perspective(600px) rotateY(4deg) rotateX(2deg)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'perspective(600px) rotateY(12deg) rotateX(4deg)')}
          >
            <Image
              src='/paula_assets/about Paula Pango.jpeg'
              alt='Paula Pango'
              fill
              className='object-cover object-top'
              sizes='176px'
            />
          </div>
          <div>
            <h3 className={`text-3xl text-text mb-3 ${cormorant.className}`}>
              {isLithuanian ? 'Apie menininką' : 'About the Artist'}
            </h3>
            <p className={`text-text-muted leading-relaxed text-sm mb-4 ${jost.className}`}>
              {isLithuanian
                ? 'Paula Pango — lietuvių dailininkė iš Kauno. Ji tapė portretinus, peizažus ir natiurmortus, naudodama aliejinę tapybą ant drobės.'
                : 'Paula Pango is a Lithuanian artist based in Kaunas. Her work spans portraits, landscapes, and still lifes — all painted in oil on canvas with a focus on mood and character.'}
            </p>
            <Link
              href={isLithuanian ? `${prefix}/apie` : `${prefix}/about`}
              className={`text-xs uppercase tracking-[0.18em] text-primary hover:underline ${jost.className}`}
            >
              {isLithuanian ? 'Skaityti daugiau' : 'Read More'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ────────────────────────────────────── */}
      <section className='py-20 px-6 text-center'>
        <h2 className={`text-4xl text-text mb-4 ${cormorant.className}`}>
          {isLithuanian ? 'Domina konkretus kūrinys?' : 'Interested in a piece?'}
        </h2>
        <p className={`text-text-muted text-sm mb-8 ${jost.className}`}>
          {isLithuanian
            ? 'Susisiekite su Paula dėl galimybės įsigyti kūrinį ar individualaus užsakymo.'
            : 'Get in touch with Paula about purchasing a painting or commissioning something new.'}
        </p>
        <Link
          href={contactHref}
          className={`inline-block px-10 py-3 bg-primary text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors duration-300 ${jost.className}`}
        >
          {isLithuanian ? 'Susisiekti' : 'Get in Touch'}
        </Link>
      </section>
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
