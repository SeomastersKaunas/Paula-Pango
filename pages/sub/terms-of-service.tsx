import Head from 'next/head';
import Link from 'next/link';
import { cormorant, jost } from '../../lib/fonts';
import { useLocalePath } from '../../lib/useLocalePath';

export default function TermsOfService() {
  const { isLithuanian } = useLocalePath();
  const lt = isLithuanian;

  const title = lt ? 'Naudojimo taisyklės — Paula Pango' : 'Terms of Service — Paula Pango';
  const description = lt
    ? 'Paula Pango svetainės ir parduotuvės naudojimo taisyklės, mokėjimas, pristatymas ir grąžinimai.'
    : 'Terms governing use of the Paula Pango website and shop — payment, shipping and returns.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={`https://www.paulapango.com${lt ? '/lt/sub/naudojimo-taisykles' : '/sub/terms-of-service'}`} />
      </Head>

      <div className='max-w-3xl mx-auto px-6 py-20'>
        <h1
          className={`text-4xl md:text-5xl text-primary mb-10 text-center ${cormorant.className}`}
          style={{ fontStyle: 'italic' }}
        >
          {lt ? 'Naudojimo taisyklės' : 'Terms of Service'}
        </h1>

        <div className={`space-y-6 text-text leading-relaxed ${jost.className}`}>
          <p>
            {lt
              ? 'Šios sąlygos reglamentuoja paulapango.com svetainės ir internetinės parduotuvės naudojimą. Naudodamiesi svetaine ar pateikdami užsakymą sutinkate su šiomis sąlygomis.'
              : 'These terms govern your use of the paulapango.com website and online shop. By using the site or placing an order, you agree to the following.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? '1. Užsakymai ir mokėjimas' : '1. Orders & Payment'}
          </h2>
          <p>
            {lt
              ? 'Visi paveikslai parduodami kaip vieninteliai originalūs darbai. Mokėjimas yra apdorojamas saugiai per „Stripe". Užsakymas patvirtinamas tik gavus pilną apmokėjimą.'
              : 'All artworks are sold as one-of-a-kind originals. Payment is processed securely through Stripe. Orders are confirmed only after full payment is received.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? '2. Pristatymas' : '2. Shipping'}
          </h2>
          <p>
            {lt
              ? 'Siunčiame visame pasaulyje. Pristatymo laikas ir kaina apskaičiuojama atsiskaitymo metu. Pirkėjas atsako už galimus importo mokesčius savo šalyje.'
              : 'We ship worldwide. Delivery time and cost are calculated at checkout. The buyer is responsible for any import duties or taxes in their country.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? '3. Grąžinimai' : '3. Returns'}
          </h2>
          <p>
            {lt
              ? 'Originalų meno darbo grąžinimo politika atitinka ES vartotojų teises. Susisiekite per 14 dienų nuo pristatymo dėl grąžinimo. Pristatymo išlaidas grąžinant padengia pirkėjas. Individualūs užsakymai (komisijos) negrąžinami.'
              : 'Returns of original artworks follow EU consumer rights. Contact us within 14 days of delivery for a return. Return shipping is paid by the buyer. Custom commissioned works are non-returnable.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? '4. Autorinės teisės' : '4. Copyright'}
          </h2>
          <p>
            {lt
              ? 'Visi paveikslai ir vaizdai yra Paulos Pango autorinės nuosavybės. Įsigytas paveikslas neperduoda autoriaus teisės dauginti, reprodukuoti ar komerciškai naudoti darbo atvaizdo.'
              : 'All paintings and images remain the copyright of Paula Pango. Purchase of an artwork does not transfer the right to reproduce, copy or commercially use the image of the work.'}
          </p>

          <h2 className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            {lt ? '5. Kontaktas' : '5. Contact'}
          </h2>
          <p>
            {lt ? 'Klausimams: ' : 'For questions: '}
            <Link href={lt ? '/lt/kontaktai' : '/contact'} className='text-primary underline hover:text-secondary transition-colors'>
              {lt ? 'kontaktai' : 'contact us'}
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
