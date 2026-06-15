import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { artworks, Artwork } from '../../lib/artworks';
import { cormorant, jost } from '../../lib/fonts';
import { useCart } from '../../lib/CartContext';
import toast from 'react-hot-toast';

interface Props {
  artwork: Artwork;
  related: Artwork[];
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className='border-t border-border'>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-4 text-left ${jost.className}`}
      >
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

export default function ArtworkDetail({ artwork, related }: Props) {
  const { addProduct, cartProducts } = useCart();
  const [added, setAdded] = useState(false);

  if (!artwork) return null;

  const inCart = cartProducts.some((p) => p.id === artwork.id);

  function handleAddToCart() {
    if (artwork.sold || inCart) return;
    addProduct({
      id: artwork.id,
      title: artwork.title,
      price: String(artwork.price),
      stripePriceId: artwork.id,
      imageUrl: artwork.imageUrl,
      mode: 'payment',
      quantity: 1,
    } as any);
    setAdded(true);
    toast.success(`"${artwork.title}" added to cart`);
  }

  const dimensionLabel = `${artwork.widthCm} × ${artwork.heightCm} cm`;

  return (
    <>
      <Head>
        <title>{artwork.title} — Paula Pango</title>
        <meta name='description' content={artwork.description.slice(0, 155)} />
        <meta property='og:title' content={`${artwork.title} — Paula Pango`} />
        <meta property='og:description' content={artwork.description.slice(0, 155)} />
        <meta property='og:image' content={`https://www.paulapango.com${artwork.imageUrl}`} />
        <link rel='canonical' href={`https://www.paulapango.com/shop/${artwork.slug}`} />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: artwork.title,
              description: artwork.description,
              image: `https://www.paulapango.com${artwork.imageUrl}`,
              offers: {
                '@type': 'Offer',
                price: artwork.price,
                priceCurrency: 'EUR',
                availability: artwork.sold
                  ? 'https://schema.org/SoldOut'
                  : 'https://schema.org/InStock',
              },
            }),
          }}
        />
      </Head>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Breadcrumb */}
        <nav className={`text-xs text-text-muted mb-10 flex items-center gap-2 ${jost.className}`}>
          <Link href='/' className='hover:text-primary transition-colors'>Home</Link>
          <span>/</span>
          <Link href='/shop' className='hover:text-primary transition-colors'>Shop</Link>
          <span>/</span>
          <span className='text-text'>{artwork.title}</span>
        </nav>

        {/* Main layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20'>

          {/* Left — image */}
          <div>
            <div className='relative bg-surface overflow-hidden'
              style={{ paddingBottom: `${(artwork.heightCm / artwork.widthCm) * 100}%` }}>
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                priority
                className='object-cover object-center'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
              {artwork.sold && (
                <div className={`absolute top-4 left-4 bg-primary text-white text-xs uppercase tracking-widest px-3 py-1 ${jost.className}`}>
                  Sold
                </div>
              )}
            </div>
          </div>

          {/* Right — info */}
          <div className='flex flex-col justify-start'>
            <h1 className={`text-4xl md:text-5xl text-text mb-2 ${cormorant.className}`}>
              {artwork.title}
            </h1>

            <p className={`text-text-muted text-sm mb-6 ${jost.className}`}>{artwork.year}</p>

            {/* Price */}
            {!artwork.sold ? (
              <p className={`text-2xl text-text mb-6 ${cormorant.className}`}>
                €{artwork.price.toLocaleString('en-US')}
              </p>
            ) : (
              <p className={`text-lg text-text-muted mb-6 ${jost.className}`}>Sold</p>
            )}

            {/* Description */}
            <p className={`text-text-muted leading-relaxed text-sm mb-8 whitespace-pre-line ${jost.className}`}>
              {artwork.description}
            </p>

            {/* Details */}
            <ul className={`text-sm text-text-muted space-y-1 mb-8 border-t border-border pt-6 ${jost.className}`}>
              <li><span className='text-text'>Medium:</span> {artwork.medium}</li>
              <li><span className='text-text'>Size:</span> {dimensionLabel}</li>
              <li><span className='text-text'>Year:</span> {artwork.year}</li>
            </ul>

            {/* CTA */}
            {artwork.sold ? (
              <button
                disabled
                className={`w-full py-3.5 bg-border text-text-muted text-xs uppercase tracking-[0.2em] cursor-not-allowed ${jost.className}`}
              >
                Sold
              </button>
            ) : inCart || added ? (
              <Link
                href='/cart'
                className={`block w-full text-center py-3.5 border border-primary text-primary text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 ${jost.className}`}
              >
                View Cart
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 bg-primary text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors duration-300 ${jost.className}`}
              >
                Add to Cart
              </button>
            )}

            {/* Shipping note */}
            <p className={`text-xs text-text-muted mt-4 leading-relaxed ${jost.className}`}>
              Shipping within Lithuania and EU. Canvas paintings are carefully packaged and insured. Get in touch for delivery details.
            </p>

            {/* Accordions */}
            <div className='mt-8'>
              <Accordion title='Delivery & Packaging'>
                <p>Paintings are carefully rolled or flat-packed and shipped in rigid protective tubes or wooden crates, depending on size.</p>
                <p>All orders are fully insured in transit. Shipping is available within Lithuania and across the EU.</p>
                <p>Estimated delivery: 3–7 business days within Lithuania, 7–14 days for EU countries.</p>
                <p>For large-format paintings or international shipping outside the EU, please <Link href='/contact' className='underline hover:text-primary transition-colors'>get in touch</Link> for a custom quote.</p>
              </Accordion>
              <Accordion title='Terms & Conditions'>
                <p>All prices include VAT.</p>
                <p>Paintings must be paid for in full before shipping.</p>
                <p>Each painting is shown as it is — either framed or unframed as described.</p>
                <p>All artwork is packaged securely. Any damage in transit must be reported within 24 hours with photographs of both the artwork and the packaging.</p>
                <p>Due to the nature of original artwork, returns and refunds are not accepted.</p>
                <p>Copyright remains with Paula Pango. Artwork may not be reproduced or used commercially without written permission.</p>
                <p>Colours may vary slightly depending on screen settings.</p>
              </Accordion>
              <div className='border-t border-border' />
            </div>
          </div>
        </div>

        {/* ── MORE PAINTINGS ─────────────────────────────────── */}
        {related.length > 0 && (
          <section className='mt-24'>
            <h2 className={`text-3xl text-text text-center mb-10 ${cormorant.className}`}>
              More Paintings
            </h2>
            <div className='flex flex-wrap justify-center gap-5'>
              {related.map((rel) => (
                <Link key={rel.id} href={`/shop/${rel.slug}`} className='group block w-[calc(50%-10px)] md:w-[calc(25%-15px)]'>
                  <div className='relative overflow-hidden bg-surface aspect-square'>
                    <Image
                      src={rel.imageUrl}
                      alt={rel.title}
                      fill
                      className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
                      sizes='25vw'
                    />
                    {rel.sold && (
                      <div className={`absolute top-2 left-2 bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-0.5 ${jost.className}`}>
                        Sold
                      </div>
                    )}
                  </div>
                  <div className='pt-3 flex items-baseline justify-between gap-2'>
                    <p className={`text-text text-base truncate ${cormorant.className}`}>{rel.title}</p>
                    <p className={`text-text-muted text-xs shrink-0 ${jost.className}`}>
                      {rel.sold ? 'Sold' : `€${rel.price.toLocaleString('en-US')}`}
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
  paths: artworks.map((a) => ({ params: { slug: a.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const artwork = artworks.find((a) => a.slug === slug);
  if (!artwork) return { notFound: true };

  const related = artworks
    .filter((a) => a.id !== artwork.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return { props: { artwork, related } };
};
