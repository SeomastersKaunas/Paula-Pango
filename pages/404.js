import Link from 'next/link';
import * as m from 'framer-motion/m';

export default function ErrorPage() {
  return (
    <>
      <div className='grid h-screen px-4  place-content-center'>
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className='min-h-screen flex flex-col items-center justify-center px-6 text-center'
        >
          <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
            Page Not Found.
          </h2>
          <p className='text-md text-gray-600'>
            Sorry, the page you are looking for does not exist.
          </p>
        </m.div>
      </div>
    </>
  );
}
