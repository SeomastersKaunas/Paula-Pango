'use client';

import { CircleNotch } from '@phosphor-icons/react';

const Spinner = () => {
  return <CircleNotch size={42} weight='thin' className='text-primary animate-spin' aria-label='Loading' />;
};

export default Spinner;
