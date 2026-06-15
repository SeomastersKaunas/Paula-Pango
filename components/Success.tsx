'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { cormorant, jost } from '../lib/fonts';

export default function Success() {
  const router = useRouter();
  const isLithuanian = (router.asPath || '').startsWith('/lt');
  const galleryHref = isLithuanian ? '/lt/parduotuve' : '/shop';

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-[#fdfbf9]'>
      <div className='max-w-md w-full bg-white border border-[#e4d4d4] rounded-2xl p-8 text-center shadow-sm'>
        <div className='flex items-center justify-center mb-6'>
          <div className='rounded-full bg-[#f0e9e9] p-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='2'
              stroke='#7b5d5d'
              className='h-10 w-10'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        </div>
        <h2
          className={`text-3xl text-[#3e3232] mb-3 ${cormorant.className}`}
          style={{ fontStyle: 'italic' }}
        >
          {isLithuanian ? 'Ačiū už užsakymą' : 'Thank you for your order'}
        </h2>
        <p className={`text-sm text-[#9e8080] mb-6 ${jost.className}`}>
          {isLithuanian
            ? 'Atsiųsime el. laišką su patvirtinimu ir pristatymo informacija.'
            : 'You will receive a confirmation email with shipping details shortly.'}
        </p>
        <Link
          href={galleryHref}
          className={`inline-block px-8 py-3 bg-[#7b5d5d] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors ${jost.className}`}
        >
          {isLithuanian ? 'Atgal į parduotuvę' : 'Back to shop'}
        </Link>
      </div>
    </div>
  );
}
