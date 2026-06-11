import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { cormorant, jost } from '../../lib/fonts';
import { blogPosts } from '../../lib/blogPosts';
import { useLocalePath } from '../../lib/useLocalePath';

export default function Blog() {
  const { isLithuanian, prefix } = useLocalePath();

  return (
    <>
      <Head>
        <title>Blog — Paula Pango</title>
        <meta name='description' content='Thoughts on painting, process, and the art of collecting. Notes from Paula Pango.' />
        <link rel='canonical' href='https://www.paulapango.com/blog' />
      </Head>

      <div className='max-w-5xl mx-auto px-6 py-20'>
        <div className='text-center mb-14'>
          <h1 className={`text-5xl md:text-6xl text-text mb-4 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {isLithuanian ? 'Žurnalas' : 'Journal'}
          </h1>
          <p className={`text-text-muted text-sm uppercase tracking-[0.2em] ${jost.className}`}>
            {isLithuanian ? 'Mintys apie tapybą ir meną' : 'Notes on painting and art'}
          </p>
          <div className='mt-5 mx-auto w-16 h-px bg-secondary' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {blogPosts.map((post) => {
            const href = isLithuanian ? `/lt/blog/${post.slugLt}` : `/blog/${post.slug}`;
            const title = isLithuanian ? post.titleLt : post.title;
            const excerpt = isLithuanian ? post.excerptLt : post.excerpt;
            const dateLabel = new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <Link key={post.id} href={href} className='group block'>
                <div className='relative overflow-hidden bg-surface aspect-[4/3] mb-5'>
                  <Image
                    src={post.imageUrl}
                    alt={title}
                    fill
                    className='object-cover object-center group-hover:scale-105 transition-transform duration-500'
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                </div>
                <p className={`text-text-muted text-xs mb-2 ${jost.className}`}>{dateLabel}</p>
                <h2 className={`text-xl text-text leading-snug mb-2 group-hover:text-primary transition-colors ${cormorant.className}`}>
                  {title}
                </h2>
                <p className={`text-text-muted text-sm leading-relaxed line-clamp-3 ${jost.className}`}>{excerpt}</p>
                <span className={`inline-block mt-3 text-xs uppercase tracking-[0.15em] text-primary ${jost.className}`}>
                  {isLithuanian ? 'Skaityti →' : 'Read more →'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
