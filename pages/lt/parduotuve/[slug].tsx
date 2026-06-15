import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { artworks, Artwork, getArtworkBySlugLt } from '../../../lib/artworks';
import { cormorant, jost } from '../../../lib/fonts';
import { useCart } from '../../../lib/CartContext';
import toast from 'react-hot-toast';

interface Props {
  artwork: Artwork;
  related: Artwork[];
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className='border-t border-border'>
      <button onClick={() => setOpen(!open)} className={`w-full flex items-center justify-between py-4 text-left ${jost.className}`}>
        <span className='text-sm text-text uppercase tracking-[0.12em]'>{title}</span>
        <span className='text-text-muted text-lg leading-none'>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className={`pb-5 text-sm text-text-muted leading-relaxed space-y-2 ${jost.className}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ArtworkDetailParduotuveLt({ artwork, related }: Props) {
  const { addProduct, cartProducts } = useCart();
  const [added, setAdded] = useState(false);

  if (!artwork) return null;

  const inCart = cartProducts.some((p) => p.id === artwork.id);

  function handleAddToCart() {
    if (artwork.sold || inCart) return;
    addProduct({
      id: artwork.id,
      title: artwork.titleLt,
      price: String(artwork.price),
      stripePriceId: artwork.id,
      imageUrl: artwork.imageUrl,
      mode: 'payment',
      quantity: 1,
    } as any);
    setAdded(true);
    toast.success(`„${artwork.titleLt}" pridėta į krepšelį`);
  }

  const dimensionLabel = `${artwork.widthCm} × ${artwork.heightCm} cm`;

  return (
    <>
      <Head>
        <title>{artwork.titleLt} — Paula Pango</title>
        <meta name='description' content={artwork.descriptionLt.slice(0, 155)} />
        <meta property='og:title' content={`${artwork.titleLt} — Paula Pango`} />
        <meta property='og:image' content={`https://www.paulapango.com${artwork.imageUrl}`} />
        <link rel='canonical' href={`https://www.paulapango.com/lt/parduotuve/${artwork.slugLt}`} />
        <link rel='alternate' hrefLang='en' href={`https://www.paulapango.com/shop/${artwork.slug}`} />
        <link rel='alternate' hrefLang='lt-LT' href={`https://www.paulapango.com/lt/parduotuve/${artwork.slugLt}`} />
      </Head>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Breadcrumb */}
        <nav className={`text-xs text-text-muted mb-10 flex items-center gap-2 ${jost.className}`}>
          <Link href='/lt' className='hover:text-primary transition-colors'>Pradžia</Link>
          <span>/</span>
          <Link href='/lt/parduotuve' className='hover:text-primary transition-colors'>Parduotuvė</Link>
          <span>/</span>
          <span className='text-text'>{artwork.titleLt}</span>
        </nav>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20'>
          {/* Image */}
          <div>
            <div
              className='relative bg-surface overflow-hidden'
              style={{ paddingBottom: `${(artwork.heightCm / artwork.widthCm) * 100}%` }}
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.titleLt}
                fill
                priority
                className='object-cover object-center'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
              {artwork.sold && (
                <div className={`absolute top-4 left-4 bg-primary text-white text-xs uppercase tracking-widest px-3 py-1 ${jost.className}`}>
                  Parduota
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className='flex flex-col justify-start'>
            <h1 className={`text-4xl md:text-5xl text-text mb-2 ${cormorant.className}`}>
              {artwork.titleLt}
            </h1>

            <p className={`text-text-muted text-sm mb-6 ${jost.className}`}>{artwork.year}</p>

            {!artwork.sold ? (
              <p className={`text-2xl text-text mb-6 ${cormorant.className}`}>
                €{artwork.price.toLocaleString('en-US')}
              </p>
            ) : (
              <p className={`text-lg text-text-muted mb-6 ${jost.className}`}>Parduota</p>
            )}

            <p className={`text-text-muted leading-relaxed text-sm mb-8 whitespace-pre-line ${jost.className}`}>
              {artwork.descriptionLt}
            </p>

            <ul className={`text-sm text-text-muted space-y-1 mb-8 border-t border-border pt-6 ${jost.className}`}>
              <li><span className='text-text'>Technika:</span> {artwork.mediumLt}</li>
              <li><span className='text-text'>Dydis:</span> {dimensionLabel}</li>
              <li><span className='text-text'>Metai:</span> {artwork.year}</li>
            </ul>

            {artwork.sold ? (
              <button
                disabled
                className={`w-full py-3.5 bg-border text-text-muted text-xs uppercase tracking-[0.2em] cursor-not-allowed ${jost.className}`}
              >
                Parduota
              </button>
            ) : inCart || added ? (
              <Link
                href='/lt/krepselis'
                className={`block w-full text-center py-3.5 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 ${jost.className}`}
              >
                Peržiūrėti krepšelį
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 bg-primary text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors duration-300 ${jost.className}`}
              >
                Į krepšelį
              </button>
            )}

            <p className={`text-xs text-text-muted mt-4 leading-relaxed ${jost.className}`}>
              Siuntimas Lietuvoje ir visoje ES. Drobiniai paveikslai supakuojami rūpestingai ir apdraudžiami. Susisiekite dėl pristatymo detalių.
            </p>

            <div className='mt-8'>
              <Accordion title='Pristatymas ir pakuotė'>
                <p>Paveikslai kruopščiai supakuojami ir siunčiami apsauginiais vamzdžiais arba medinėmis dėžėmis, priklausomai nuo dydžio.</p>
                <p>Visi užsakymai apdraudžiami pervežimo metu. Siuntimas galimas Lietuvoje ir visoje ES.</p>
                <p>Pristatymo laikas: 3–7 darbo dienos Lietuvoje, 7–14 dienų ES šalims.</p>
                <p>Didelio formato paveikslams ar pristatymui už ES ribų — <Link href='/lt/kontaktai' className='underline hover:text-primary transition-colors'>susisiekite</Link> dėl individualaus pasiūlymo.</p>
              </Accordion>
              <Accordion title='Sąlygos ir taisyklės'>
                <p>Visos kainos įskaičiuotas PVM.</p>
                <p>Paveikslai apmokomi visiškai prieš išsiunčiant.</p>
                <p>Kiekvienas paveikslas rodomas toks, koks yra — su rėmu arba be jo, kaip aprašyta.</p>
                <p>Visi kūriniai supakuojami saugiai. Bet kokie pervežimo metu patirtas žalas reikia pranešti per 24 valandas su abiejų — kūrinio ir pakuotės — nuotraukomis.</p>
                <p>Dėl originalaus meno pobūdžio grąžinimas ir pinigų grąžinimas negalimas.</p>
                <p>Autorių teisės priklauso Paula Pango. Kūriniai negali būti atgaminami ar naudojami komerciškai be raštiško leidimo.</p>
              </Accordion>
              <div className='border-t border-border' />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className='mt-24'>
            <h2 className={`text-3xl text-text text-center mb-10 ${cormorant.className}`}>
              Daugiau paveikslų
            </h2>
            <div className='flex flex-wrap justify-center gap-5'>
              {related.map((rel) => (
                <Link key={rel.id} href={`/lt/parduotuve/${rel.slugLt}`} className='group block w-[calc(50%-10px)] md:w-[calc(25%-15px)]'>
                  <div className='relative overflow-hidden bg-surface aspect-square'>
                    <Image
                      src={rel.imageUrl}
                      alt={rel.titleLt}
                      fill
                      className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
                      sizes='25vw'
                    />
                    {rel.sold && (
                      <div className={`absolute top-2 left-2 bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-0.5 ${jost.className}`}>
                        Parduota
                      </div>
                    )}
                  </div>
                  <div className='pt-3 flex items-baseline justify-between gap-2'>
                    <p className={`text-text text-base truncate ${cormorant.className}`}>{rel.titleLt}</p>
                    <p className={`text-text-muted text-xs shrink-0 ${jost.className}`}>
                      {rel.sold ? 'Parduota' : `€${rel.price.toLocaleString('en-US')}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: artworks.map((a) => ({ params: { slug: a.slugLt } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const artwork = getArtworkBySlugLt(slug);
  if (!artwork) return { notFound: true };

  const related = artworks
    .filter((a) => a.id !== artwork.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return { props: { artwork, related } };
};
