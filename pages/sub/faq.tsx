import Head from 'next/head';
import Link from 'next/link';
import { cormorant, jost } from '../../lib/fonts';
import { useLocalePath } from '../../lib/useLocalePath';

const FAQ_ITEMS_EN = [
  {
    q: 'Are these original paintings?',
    a: 'Yes. Every artwork in the gallery is a one-of-a-kind original oil painting on canvas, hand-painted by Paula Pango.',
  },
  {
    q: 'How is payment handled?',
    a: 'Payment is processed securely through Stripe. We accept all major debit and credit cards. You do not need to create an account to purchase.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. We ship worldwide. Shipping costs and delivery times are calculated at checkout based on your destination.',
  },
  {
    q: 'How are paintings packaged?',
    a: 'Each painting is carefully wrapped in protective material and shipped in a custom cardboard box. Larger works are sent in reinforced wooden crates when necessary.',
  },
  {
    q: 'Can I commission a custom painting?',
    a: 'Yes. Paula accepts a limited number of custom commissions each year. Please get in touch via the contact form to discuss your idea, size and timeline.',
  },
  {
    q: 'What if the artwork I want is sold?',
    a: 'Sold artworks are marked clearly in the gallery. While each piece is unique and cannot be reproduced, you can commission a similar themed work or sign up for updates when new pieces become available.',
  },
];

const FAQ_ITEMS_LT = [
  {
    q: 'Ar tai originalūs paveikslai?',
    a: 'Taip. Kiekvienas paveikslas galerijoje yra unikalus, ranka tapytas aliejinis paveikslas ant drobės, sukurtas Paulos Pango.',
  },
  {
    q: 'Kaip vyksta atsiskaitymas?',
    a: 'Atsiskaitymas vyksta saugiai per „Stripe". Priimame visas pagrindines debeto ir kredito korteles. Norint pirkti paskyros susikurti nereikia.',
  },
  {
    q: 'Ar siunčiate į užsienį?',
    a: 'Taip. Siunčiame visame pasaulyje. Pristatymo kaina ir laikas apskaičiuojami atsiskaitymo metu pagal jūsų vietą.',
  },
  {
    q: 'Kaip pakuojami paveikslai?',
    a: 'Kiekvienas paveikslas kruopščiai įvyniojamas į apsauginę medžiagą ir siunčiamas specialioje kartoninėje dėžėje. Didesni darbai prireikus siunčiami sustiprintose medinėse dėžėse.',
  },
  {
    q: 'Ar galiu užsisakyti individualų paveikslą?',
    a: 'Taip. Paula kasmet priima ribotą skaičių individualių užsakymų. Kreipkitės per kontaktinę formą ir aptarsime jūsų idėją, dydį bei terminus.',
  },
  {
    q: 'O jei paveikslas, kurio noriu, jau parduotas?',
    a: 'Parduoti darbai galerijoje yra aiškiai pažymėti. Kadangi kiekvienas paveikslas yra unikalus ir negali būti pakartotas, galite užsisakyti panašios temos darbą arba užsiprenumeruoti naujienlaiškį.',
  },
];

export default function FAQ() {
  const { isLithuanian } = useLocalePath();
  const lt = isLithuanian;
  const items = lt ? FAQ_ITEMS_LT : FAQ_ITEMS_EN;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  const title = lt ? 'DUK — Paula Pango' : 'FAQ — Paula Pango';
  const description = lt
    ? 'Dažniausiai užduodami klausimai apie Paulos Pango paveikslų pirkimą, pristatymą ir užsakymus.'
    : 'Frequently asked questions about buying, shipping and commissioning paintings from Paula Pango.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={`https://www.paulapango.com${lt ? '/lt/sub/duk' : '/sub/faq'}`} />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className='max-w-3xl mx-auto px-6 py-20'>
        <h1
          className={`text-4xl md:text-5xl text-primary mb-10 text-center ${cormorant.className}`}
          style={{ fontStyle: 'italic' }}
        >
          {lt ? 'Dažniausi klausimai' : 'Frequently Asked Questions'}
        </h1>

        <div className={`space-y-8 text-text leading-relaxed ${jost.className}`}>
          {items.map((it) => (
            <div key={it.q}>
              <h2 className='font-semibold text-primary mb-2'>{it.q}</h2>
              <p>{it.a}</p>
            </div>
          ))}

          <p className='pt-6 text-text-muted text-sm'>
            {lt ? 'Neradote atsakymo? ' : 'Did not find your answer? '}
            <Link
              href={lt ? '/lt/kontaktai' : '/contact'}
              className='text-primary underline hover:text-secondary transition-colors'
            >
              {lt ? 'Susisiekite su mumis' : 'Contact us'}
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
