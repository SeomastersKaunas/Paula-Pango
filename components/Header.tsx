import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { cormorant, jost } from '../lib/fonts';
import { useCart } from '../lib/CartContext';
import { useLocalePath } from '../lib/useLocalePath';
import LanguageSwitcher from './LanguageSwitcher';
import useTranslation from '../lib/translation';

// Shopping bag icon (inline SVG — no extra dep)
function BagIcon({ count }: { count: number }) {
  return (
    <div className='relative'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='w-5 h-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1.5}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z'
        />
        <line x1='3' y1='6' x2='21' y2='6' strokeLinecap='round' />
        <path strokeLinecap='round' strokeLinejoin='round' d='M16 10a4 4 0 01-8 0' />
      </svg>
      {count > 0 && (
        <span className='absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center leading-none'>
          {count}
        </span>
      )}
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const { cartProducts } = useCart();
  const { prefix } = useLocalePath();
  const { lang } = useTranslation('common');
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  const isLt = lang === 'lt';
  const totalItems = cartProducts.reduce((sum, p) => sum + (p.quantity || 1), 0);

  const navLinks = [
    { href: prefix || '/',                                                    label: isLt ? 'Pradžia'      : 'Home' },
    { href: isLt ? `${prefix}/parduotuve` : `${prefix}/shop`,                label: isLt ? 'Parduotuvė'  : 'Shop' },
    { href: isLt ? `${prefix}/paveikslai` : `${prefix}/paintings`,           label: isLt ? 'Paveikslai'  : 'Paintings' },
    { href: isLt ? `${prefix}/apie` : `${prefix}/about`,                     label: isLt ? 'Apie'        : 'About' },
    { href: isLt ? `${prefix}/kontaktai` : `${prefix}/contact`,              label: isLt ? 'Kontaktai'   : 'Contact' },
  ];

  // Close mobile nav on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [router.asPath]);

  return (
    <header ref={mobileRef} className='w-full bg-background border-b border-border sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-6'>

        {/* Desktop layout: logo left, name+nav centered, cart/auth right */}
        <div className='hidden md:flex items-center justify-between py-4 gap-4'>

          {/* Left — logo */}
          <Link href={prefix || '/'} className='hover:opacity-80 transition-opacity duration-200 shrink-0'>
            <Image src='/paula_assets/logo_example.png' alt='Paula Pango' width={240} height={56} className='object-contain max-h-14' priority />
          </Link>

          {/* Center — name + nav */}
          <div className='flex flex-col items-center gap-2 flex-1'>
            <Link href={prefix || '/'} className={`text-3xl text-text tracking-wide hover:opacity-80 transition-opacity ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
              Paula Pango
            </Link>
            <nav className='flex items-center gap-7'>
              {navLinks.map(({ href, label }) => {
                const active = router.asPath === href || router.asPath.startsWith(href + '/');
                return (
                  <Link key={href} href={href}
                    className={`text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 ${jost.className} ${active ? 'text-primary' : 'text-text hover:text-primary'}`}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right — divider + lang + cart */}
          <div className='flex items-center gap-4 shrink-0'>
            <span className='w-px h-4 bg-border' aria-hidden />
            <LanguageSwitcher initialLocale={isLt ? 'lt' : 'en'} />
            <Link href={`${prefix}/cart`} aria-label='Cart' className='text-text hover:text-primary transition-colors duration-200'>
              <BagIcon count={totalItems} />
            </Link>
          </div>
        </div>

        {/* Mobile layout: hamburger left, logo center, cart right */}
        <div className='flex md:hidden items-center justify-between py-4'>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label='Toggle menu'
            className='text-text hover:text-primary transition-colors p-1'
          >
            {mobileOpen ? (
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            ) : (
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            )}
          </button>

          <Link
            href={prefix || '/'}
            className='hover:opacity-80 transition-opacity duration-200'
          >
            <Image
              src='/paula_assets/logo_example.png'
              alt='Paula Pango'
              width={160}
              height={40}
              className='object-contain max-h-10'
            />
          </Link>

          <Link href={`${prefix}/cart`} aria-label='Cart' className='text-text hover:text-primary transition-colors'>
            <BagIcon count={totalItems} />
          </Link>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className='md:hidden border-t border-border bg-background px-6 py-6 flex flex-col gap-5'>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm uppercase tracking-[0.15em] text-text hover:text-primary transition-colors ${jost.className}`}
            >
              {label}
            </Link>
          ))}
          <div className='flex items-center gap-4 pt-2 border-t border-border'>
            <LanguageSwitcher initialLocale={isLt ? 'lt' : 'en'} />
          </div>
        </div>
      )}
    </header>
  );
}
