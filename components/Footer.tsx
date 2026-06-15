import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { cormorant } from '../lib/fonts';
import { useLocalePath } from '../lib/useLocalePath';
import useTranslation from '../lib/translation';

const SOCIALS = [
  { href: 'https://www.instagram.com/paulapango', Icon: FaInstagram, label: 'Instagram' },
  { href: 'https://www.facebook.com/share/1BY35K5TGQ/?mibextid=wwXIfr', Icon: FaFacebookF, label: 'Facebook' },
];

export default function Footer() {
  const { prefix } = useLocalePath();
  const { lang } = useTranslation('common');
  const isLt = lang === 'lt';
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  const navLinks = [
    { href: prefix || '/',                                                  label: isLt ? 'Pradžia'     : 'Home' },
    { href: isLt ? `${prefix}/parduotuve` : `${prefix}/shop`,              label: isLt ? 'Parduotuvė' : 'Shop' },
    { href: isLt ? `${prefix}/paveikslai` : `${prefix}/paintings`,         label: isLt ? 'Paveikslai' : 'Paintings' },
    { href: isLt ? `${prefix}/apie` : `${prefix}/about`,                   label: isLt ? 'Apie'       : 'About' },
    { href: isLt ? `${prefix}/kontaktai` : `${prefix}/contact`,            label: isLt ? 'Kontaktai'  : 'Contact' },
    { href: isLt ? `${prefix}/sub/privatumo-politika` : `${prefix}/privacy-policy`, label: isLt ? 'Privatumas' : 'Privacy' },
  ];

  return (
    <footer className='w-full border-t border-border mt-20 py-12 px-6 bg-background'>
      <div className='max-w-4xl mx-auto flex flex-col items-center gap-8'>

        {/* Logo */}
        <Link href={prefix || '/'} className='flex flex-col items-center gap-2 hover:opacity-80 transition-opacity'>
          <Image src='/paula_assets/logo_example.png' alt='Paula Pango' width={260} height={100} className='object-contain w-full max-w-[160px] md:max-w-[260px]' />
        </Link>

        {/* Social icons */}
        <div className='flex items-center gap-5'>
          {SOCIALS.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={label}
              className='w-9 h-9 flex items-center justify-center rounded-full border border-border text-text-muted hover:text-primary hover:border-secondary transition-colors duration-200'
            >
              <Icon className='w-4 h-4' />
            </a>
          ))}
        </div>

        {/* Nav links */}
        <nav className='flex flex-wrap justify-center gap-x-6 gap-y-2'>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className='text-sm text-text-muted hover:text-primary transition-colors duration-200 tracking-wide'
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright + credit */}
        <div className='flex flex-col items-center gap-1'>
          <p className='text-xs text-text-muted tracking-wide'>
            © Paula Pango {year}
          </p>
          <p className='text-xs text-text-muted/60 tracking-wide'>
            IT solution by{' '}
            <a href='https://seomasters.lt' target='_blank' rel='noopener noreferrer' className='hover:text-primary transition-colors'>
              Seomasters.lt
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
