'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { DefaultSeo } from 'next-seo';
import SEOHead from '../../../components/SEOHead';
import Head from 'next/head';

type BlogPost = {
  _id?: string;
  title: string;
  titleLt?: string;
  description: string;
  descriptionLt?: string;
  createdAt?: string | { seconds: number; nanoseconds: number };
  mainImage?: string;
  slug?: string;
  slugLt?: string;
};

export default function StraipsnisPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!slug || !router.isReady || !process.env.NEXT_PUBLIC_CLIENT_ID) return;

    const fetchPost = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
        const ref = collection(db, 'clients', clientId, 'blogPosts');
        const q = query(ref, where('slug', '==', slug));
        let snapshot = await getDocs(q);

        if (snapshot.empty) {
          const qLt = query(ref, where('slugLt', '==', slug));
          snapshot = await getDocs(qLt);
        }

        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setPost(docData as BlogPost);
        } else {
          setPost(null);
        }
      } catch (error) {
        setPost(null);
      }
    };

    fetchPost();
  }, [slug, router.isReady]);

  const getFormattedDate = (date: BlogPost['createdAt']) => {
    if (!date) return 'N/A';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('lt-LT', options);
    }

    if ('seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleDateString('lt-LT', options);
    }

    return 'N/A';
  };

  const getISODate = (date: BlogPost['createdAt']) => {
    if (!date) return new Date().toISOString();

    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }

    if ('seconds' in date) {
      return new Date(date.seconds * 1000).toISOString();
    }

    return new Date().toISOString();
  };

  if (!process.env.NEXT_PUBLIC_CLIENT_ID) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-8 py-10 mt-10'>
        <div className='text-center'>
          <p className='text-red-400 dark:text-red-500'>
            Configuration error: Client ID not found
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-8 py-10 mt-10'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-400 dark:text-gray-500'>
            {slug ? 'Kraunama...' : 'Įrašas nerastas'}
          </p>
        </div>
      </div>
    );
  }

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleLt || post.title,
    description: (post.descriptionLt || post.description).substring(0, 200) + '...',
    image: post.mainImage || 'https://www.paulapango.com/logo_paula_example.png',
    datePublished: getISODate(post.createdAt),
    dateModified: getISODate(post.createdAt),
    author: {
      '@type': 'Person',
      name: 'Paula Pango',
      url: 'https://www.paulapango.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paula Pango',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.paulapango.com/logo_paula_example.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.paulapango.com/lt/straipsniai/${post.slugLt || slug}`,
    },
    articleSection: 'Art',
    keywords: [
      'Paula Pango',
      'tapyba',
      'aliejus ant drobės',
      'originalūs paveikslai',
      'lietuvių dailininkė',
    ],
    inLanguage: ['lt'],
    isAccessibleForFree: true,
    wordCount: post.description.split(' ').length,
    articleBody: post.description,
  };

  return (
    <>
      {slug && post && (
        <SEOHead
          title={`${post.titleLt || post.title} | Paula Pango`}
          description={(post.descriptionLt || post.description).substring(0, 150)}
          canonicalUrl={`/lt/straipsniai/${post.slugLt || slug}`}
          lang='lt'
          ogImage={post.mainImage || 'https://www.paulapango.com/logo_paula_example.png'}
        />
      )}
      <Head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      </Head>

      <DefaultSeo
        title={`${post.titleLt || post.title} | Paula Pango`}
        description={(post.descriptionLt || post.description).substring(0, 150) || 'Paula Pango straipsniai apie meną ir tapybą'}
        openGraph={{
          type: 'article',
          locale: 'lt_LT',
          url: `https://www.paulapango.com/lt/straipsniai/${slug}`,
          site_name: 'Paula Pango',
          title: `${post.titleLt || post.title} | Paula Pango`,
          description: (post.descriptionLt || post.description).substring(0, 150) || 'Paula Pango straipsniai apie meną ir tapybą',
          images: [
            {
              url:
                post.mainImage ??
                'https://www.paulapango.com/logo_paula_example.png',
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }}
      />

      <div className='max-w-4xl mx-auto px-4 sm:px-8 py-10 mt-10 backdrop-blur-md bg-white/95 dark:bg-[rgba(13,17,23,0.95)] border border-white/50 dark:border-[rgba(48,54,61,0.8)] rounded-2xl shadow-lg'>
        <h1 className='text-3xl font-bold text-gray-600 dark:text-gray-100 text-center mb-4'>
          {post.title}
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-6'>
          Publikuota {getFormattedDate(post.createdAt)}
        </p>
        <div className='relative w-full h-96 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10'>
          {post.mainImage ? (
            <Image
              src={post.mainImage}
              alt={post.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <div className='w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 opacity-40' />
            </div>
          )}
        </div>
        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <div dangerouslySetInnerHTML={{ __html: post.description }} />
        </div>
      </div>
    </>
  );
}

