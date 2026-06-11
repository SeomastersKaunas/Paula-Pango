'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type='button'
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-40 w-10 h-10 flex items-center justify-center
                  bg-[#fdfbf9] border border-[#cfb0ae] text-[#7b5d5d]
                  hover:bg-[#7b5d5d] hover:text-white hover:border-[#7b5d5d]
                  transition-all duration-300
                  ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label='Scroll to top'
    >
      <FiArrowUp className='h-4 w-4' />
    </button>
  );
}
