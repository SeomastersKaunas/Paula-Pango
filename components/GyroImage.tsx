import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  useGyroscope,
  isIOSGyro,
  requestIOSGyroPermission,
} from '../lib/useGyroscope';

interface Props {
  src: string;
  alt: string;
  sold?: boolean;
  soldLabel?: string;
  /** Pass true only on the first painting card to show the iOS prompt once per page */
  showPrompt?: boolean;
}

export default function GyroImage({ src, alt, sold, soldLabel = 'Sold', showPrompt = false }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [showIOSPill, setShowIOSPill] = useState(false);
  const { x, y, permission } = useGyroscope(12);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show iOS pill only on first card, only on iOS, only if permission not yet decided
  useEffect(() => {
    if (showPrompt && isMobile && isIOSGyro() && permission === 'unknown') {
      setShowIOSPill(true);
    }
  }, [showPrompt, isMobile, permission]);

  async function handleIOSPrompt() {
    setShowIOSPill(false);
    await requestIOSGyroPermission();
    // permission state updates via localStorage on next hook init — page stays active
    // Force re-mount by reloading gyro: the hook re-reads localStorage on next render
    window.location.reload();
  }

  // Desktop — plain static image
  if (!isMobile) {
    return (
      <div className='absolute inset-0'>
        <Image src={src} alt={alt} fill className='object-cover object-center' sizes='(max-width: 768px) 100vw, 50vw' />
        {sold && (
          <div className='absolute top-3 left-3 bg-[#7b5d5d] text-white text-[10px] uppercase tracking-widest px-2 py-1 font-sans'>
            {soldLabel}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* iOS permission pill — floats at bottom of screen, shown once */}
      {showIOSPill && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'rgba(62,50,50,0.92)',
            color: '#fff',
            borderRadius: '999px',
            padding: '10px 20px',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onClick={handleIOSPrompt}
        >
          <span>✦</span> Enable motion effects
        </div>
      )}

      {/* Gyro image container */}
      <div className='absolute inset-0 overflow-hidden' style={{ willChange: 'transform' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-16px',
            transform: `translate(${x}px, ${y}px)`,
            transition: 'transform 0.05s linear',
            willChange: 'transform',
          }}
        >
          <Image src={src} alt={alt} fill className='object-cover object-center' sizes='100vw' />
        </div>
        {sold && (
          <div className='absolute top-3 left-3 z-10 bg-[#7b5d5d] text-white text-[10px] uppercase tracking-widest px-2 py-1 font-sans'>
            {soldLabel}
          </div>
        )}
      </div>
    </>
  );
}
