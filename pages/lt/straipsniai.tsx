import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { DefaultSeo } from 'next-seo';
import * as m from 'framer-motion/m';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

import SEOHead from '../../components/SEOHead';
import Spinner from '../../components/Spinner';
import { db } from '../../lib/firebase';
import useTranslation from '../../lib/translation';

type BlogPost = {
  _id: string;
  slug: string;
  slugLt?: string;
  title: string;
  titleLt?: string;
  description: string;
  descriptionLt?: string;
  tags?: string[];
  mainImage?: string;
  createdAt?: string | { seconds: number; nanoseconds: number };
};

export default function Straipsniai() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    const fetchPosts = async () => {
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
      const ref = collection(db, 'clients', clientId, 'blogPosts');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedPosts: BlogPost[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            slug: data.slug || '',
            ...(data as Omit<BlogPost, '_id' | 'slug'>),
          };
        })
        .filter((post) => post.tags?.includes('LT'));

      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handlePostClick = (slug: string) => {
    router.push(`/lt/straipsniai/${slug}`);
  };

  const getFormattedDate = (date: BlogPost['createdAt']) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return new Date(date).toLocaleDateString('lt-LT');
    if ('seconds' in date) return new Date(date.seconds * 1000).toLocaleDateString('lt-LT');
    return 'N/A';
  };

  const truncateHtml = (html: string, maxLength: number): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <>
      <SEOHead
        title='Straipsniai | Paula Pango'
        description='Naujienos, įžvalgos ir istorijos iš Paulos Pango studijos.'
        canonicalUrl='/lt/straipsniai'
        lang='lt'
      />

      <DefaultSeo
        title='Straipsniai | Paula Pango'
        description='Naujienos, įžvalgos ir istorijos iš Paulos Pango studijos.'
        openGraph={{
          type: 'website',
          locale: 'lt_LT',
          url: 'https://www.paulapango.com/lt/straipsniai',
          site_name: 'Paula Pango',
          title: 'Straipsniai | Paula Pango',
          description: 'Naujienos, įžvalgos ir istorijos iš Paulos Pango studijos.',
          images: [
            {
              url: 'https://www.paulapango.com/logo_paula_example.png',
              width: 1200,
              height: 630,
              alt: 'Paula Pango straipsniai',
            },
          ],
        }}
      />

      <div className='mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl' style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h1
            className='text-2xl sm:text-3xl lg:text-4xl font-light text-gray-600 dark:text-gray-100 mb-4'
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t('blog.relatedPosts')}
          </h1>
          <p
            className='text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light'
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t('blog.subtitle')}
          </p>
        </m.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {loading ? (
            <div className='col-span-full flex justify-center py-12'>
              <Spinner />
            </div>
          ) : posts.length === 0 ? (
            <div className='col-span-full'>
              <p className='text-gray-400 dark:text-gray-500 text-center py-12'>{t('blog.noPosts')}</p>
            </div>
          ) : (
            posts.map((post, index) => {
              const slug = post.slugLt || post.slug;
              const title = post.titleLt || post.title;
              return (
                <m.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handlePostClick(slug)}
                  className='group cursor-pointer bg-white/80 dark:bg-[rgba(48,54,61,0.6)] backdrop-blur-sm border border-white/50 dark:border-[rgba(48,54,61,0.8)] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[520px]'
                >
                  <div className='relative w-full h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex-shrink-0'>
                    {post.mainImage ? (
                      <Image
                        src={post.mainImage}
                        alt={post.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10'>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 opacity-30' />
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>

                  <div className='p-6 flex flex-col flex-grow'>
                    <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3'>
                      <FiCalendar className='w-4 h-4' />
                      <span>{getFormattedDate(post.createdAt)}</span>
                    </div>

                    <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200'>
                      {title}
                    </h2>

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow min-h-[3.6rem]'>
                      {truncateHtml(post.descriptionLt || post.description || '', 180)}
                    </p>

                    <div className='flex items-center justify-between mt-auto pt-2 border-t border-gray-200/50 dark:border-[rgba(48,54,61,0.8)]'>
                      <button
                        type='button'
                        className='inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-200'
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePostClick(slug);
                        }}
                      >
                        {t('blog.readMore')}
                        <FiArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                      </button>
                    </div>
                  </div>
                </m.div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
