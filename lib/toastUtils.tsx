'use client';

import toast from 'react-hot-toast';

// Track the current toast type to detect duplicate clicks
let currentToastType: string | null = null;
let isToastVisible = false;
let shakeTimeout: NodeJS.Timeout | null = null;
let clearTimeout_: NodeJS.Timeout | null = null;

// Trigger shake animation on existing toast
const triggerShake = () => {
  const toastElements = document.querySelectorAll('[data-custom-toast="true"]');
  toastElements.forEach((toastElement) => {
    toastElement.classList.remove('animate-shake');
    toastElement.classList.add('shake-border');
    // Force reflow to restart animation
    void (toastElement as HTMLElement).offsetWidth;
    toastElement.classList.add('animate-shake');
    
    // Remove shake border after animation
    if (shakeTimeout) clearTimeout(shakeTimeout);
    shakeTimeout = setTimeout(() => {
      toastElement.classList.remove('animate-shake', 'shake-border');
    }, 500);
  });
};

// Icons
const CheckIcon = () => (
  <svg
    className='w-6 h-6 text-primary dark:text-gray-300 mr-3 flex-shrink-0'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
  </svg>
);

const InfoIcon = () => (
  <svg
    className='w-6 h-6 text-blue-400 mr-3 flex-shrink-0'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className='w-6 h-6 text-red-500 mr-3 flex-shrink-0'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    viewBox='0 0 24 24'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
  </svg>
);

// Base toast styles
const baseToastClass =
  'max-w-xs w-full backdrop-blur-lg rounded-2xl shadow-2xl border flex items-center px-4 py-3 pointer-events-auto transition-all duration-200';
const lightDarkBg = 'bg-white dark:bg-[rgba(13,17,23,0.95)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-2xl';
const defaultBorder = 'border-gray-200 dark:border-[rgba(48,54,61,0.8)]';

// Clear tracking state
const clearTracking = () => {
  currentToastType = null;
  isToastVisible = false;
};

// Show success toast
export const showSuccessToast = (message: string, toastType: string = 'success') => {
  // If same toast type is already showing, shake it instead
  if (isToastVisible && currentToastType === toastType) {
    triggerShake();
    return;
  }

  // Clear any pending timeout
  if (clearTimeout_) clearTimeout(clearTimeout_);

  // Dismiss all existing toasts
  toast.dismiss();
  
  // Set tracking immediately
  currentToastType = toastType;
  isToastVisible = true;

  toast.custom(
    (t) => (
      <div
        data-custom-toast="true"
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} ${baseToastClass} ${lightDarkBg} ${defaultBorder}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <CheckIcon />
        <span className='font-semibold text-md text-gray-800 dark:text-gray-200'>
          {message}
        </span>
      </div>
    ),
    { duration: 3000, id: 'custom-toast' }
  );

  // Clear tracking after toast disappears
  clearTimeout_ = setTimeout(clearTracking, 3100);
};

// Show info toast (for "already in cart" messages)
export const showInfoToast = (message: string, toastType: string = 'info') => {
  // If same toast type is already showing, shake it instead
  if (isToastVisible && currentToastType === toastType) {
    triggerShake();
    return;
  }

  // Clear any pending timeout
  if (clearTimeout_) clearTimeout(clearTimeout_);

  // Dismiss all existing toasts
  toast.dismiss();

  // Set tracking immediately
  currentToastType = toastType;
  isToastVisible = true;

  toast.custom(
    (t) => (
      <div
        data-custom-toast="true"
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} ${baseToastClass} ${lightDarkBg} ${defaultBorder}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <InfoIcon />
        <span className='font-semibold text-md text-gray-800 dark:text-gray-200'>
          {message}
        </span>
      </div>
    ),
    { duration: 3000, id: 'custom-toast' }
  );

  // Clear tracking after toast disappears
  clearTimeout_ = setTimeout(clearTracking, 3100);
};

// Show error toast
export const showErrorToast = (message: string, toastType: string = 'error') => {
  // If same toast type is already showing, shake it instead
  if (isToastVisible && currentToastType === toastType) {
    triggerShake();
    return;
  }

  // Clear any pending timeout
  if (clearTimeout_) clearTimeout(clearTimeout_);

  // Dismiss all existing toasts
  toast.dismiss();

  // Set tracking immediately
  currentToastType = toastType;
  isToastVisible = true;

  toast.custom(
    (t) => (
      <div
        data-custom-toast="true"
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} ${baseToastClass} ${lightDarkBg} border-red-500/50`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <ErrorIcon />
        <span className='font-semibold text-md text-gray-800 dark:text-gray-200'>
          {message}
        </span>
      </div>
    ),
    { duration: 3000, id: 'custom-toast' }
  );

  // Clear tracking after toast disappears
  clearTimeout_ = setTimeout(clearTracking, 3100);
};

// Utility object for easy imports
const customToast = {
  success: showSuccessToast,
  info: showInfoToast,
  error: showErrorToast,
};

export default customToast;
