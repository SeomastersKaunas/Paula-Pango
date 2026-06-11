import Head from 'next/head';
import Link from 'next/link';
import { cormorant, jost } from '../../lib/fonts';
import { useLocalePath } from '../../lib/useLocalePath';

export default function Support() {
  const { isLithuanian } = useLocalePath();
  const lt = isLithuanian;

  const title = lt ? 'Pagalba — Paula Pango' : 'Support — Paula Pango';
  const description = lt
    ? 'Kaip susisiekti su Paula Pango studija dėl užsakymų, pristatymo ar techninių klausimų.'
    : 'How to reach Paula Pango studio for order, shipping or technical inquiries.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={`https://www.paulapango.com${lt ? '/lt/sub/pagalba' : '/sub/support'}`} />
      </Head>

      <div className='max-w-3xl mx-auto px-6 py-20'>
        <h1
          className={`text-4xl md:text-5xl text-primary mb-10 text-center ${cormorant.className}`}
          style={{ fontStyle: 'italic' }}
        >
          {lt ? 'Pagalba ir kontaktai' : 'Help & Contact'}
        </h1>

        <div className={`space-y-6 text-text leading-relaxed ${jost.className}`}>
          <p>
            {lt
              ? 'Jei turite klausimų apie užsakymą, mokėjimą, pristatymą ar individualų paveikslą — su jumis susisieksime per 24 valandas darbo dienomis.'
              : 'If you have questions about an order, payment, shipping or a custom commission — we will get back to you within 24 hours on business days.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? 'Bendri klausimai' : 'General inquiries'}
          </h2>
          <p>
            <a href='mailto:info@paulapango.com' className='text-primary underline hover:text-secondary transition-colors'>
              info@paulapango.com
            </a>
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? 'Užsakymai ir komisijos' : 'Orders & commissions'}
          </h2>
          <p>
            <a href='mailto:studio@paulapango.com' className='text-primary underline hover:text-secondary transition-colors'>
              studio@paulapango.com
            </a>
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? 'Kontaktinė forma' : 'Contact form'}
          </h2>
          <p>
            {lt ? 'Daugiau būdų susisiekti rasite ' : 'Find more ways to reach us on the '}
            <Link href={lt ? '/lt/kontaktai' : '/contact'} className='text-primary underline hover:text-secondary transition-colors'>
              {lt ? 'kontaktų puslapyje' : 'contact page'}
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
