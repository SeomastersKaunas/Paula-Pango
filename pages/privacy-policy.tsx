import Head from 'next/head';
import Link from 'next/link';
import { cormorant, jost } from '../lib/fonts';
import { useLocalePath } from '../lib/useLocalePath';

export default function PrivacyPolicy() {
  const { isLithuanian } = useLocalePath();
  const lt = isLithuanian;

  const title = lt ? 'Privatumo politika — Paula Pango' : 'Privacy Policy — Paula Pango';
  const description = lt
    ? 'Sužinokite, kaip Paula Pango tvarko jūsų asmens duomenis ir slapukus, laikydamasi BDAR (GDPR) reikalavimų.'
    : 'Learn how Paula Pango handles your personal data and cookies in compliance with GDPR.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link
          rel='canonical'
          href={`https://www.paulapango.com${lt ? '/lt/privacy-policy' : '/privacy-policy'}`}
        />
      </Head>

      <div className='max-w-3xl mx-auto px-6 py-20'>
        <h1
          className={`text-4xl md:text-5xl text-primary mb-10 text-center ${cormorant.className}`}
          style={{ fontStyle: 'italic' }}
        >
          {lt ? 'Privatumo politika' : 'Privacy & Cookie Policy'}
        </h1>

        <div className={`space-y-6 text-text leading-relaxed ${jost.className}`}>
          <p>
            {lt
              ? 'Paula Pango gerbia jūsų privatumą ir įsipareigoja saugoti jūsų asmeninę informaciją. Ši politika paaiškina, kaip mes renkame, naudojame ir saugome jūsų duomenis, ypač atsižvelgiant į slapukų naudojimą bei BDAR reikalavimus.'
              : 'Paula Pango respects your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data — especially regarding cookie usage and GDPR compliance.'}
          </p>

          <h2
            className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            {lt ? 'Kas yra slapukai?' : 'What Are Cookies?'}
          </h2>
          <p>
            {lt
              ? 'Slapukai – tai maži teksto failai, saugomi jūsų įrenginyje. Jie padeda gerinti jūsų patirtį, įsimena jūsų pasirinkimus ir teikia naudojimo analizę.'
              : 'Cookies are small text files stored on your device. They help us improve your experience by remembering preferences and providing usage analytics.'}
          </p>

          <h2
            className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            {lt ? 'Kokius slapukus naudojame' : 'Types of Cookies We Use'}
          </h2>
          <ul className='list-disc pl-6 space-y-3'>
            <li>
              <strong className='text-primary'>
                {lt ? 'Būtini slapukai: ' : 'Essential Cookies: '}
              </strong>
              {lt
                ? 'reikalingi pagrindiniam svetainės veikimui ir autentifikacijai.'
                : 'required for basic site functionality and authentication.'}
            </li>
            <li>
              <strong className='text-primary'>
                {lt ? 'Pasirinkimų slapukai: ' : 'Preference Cookies: '}
              </strong>
              {lt
                ? 'įsimena jūsų kalbos ir išdėstymo pasirinkimus.'
                : 'remember your language and layout preferences.'}
            </li>
            <li>
              <strong className='text-primary'>
                {lt ? 'Analitiniai slapukai: ' : 'Analytics Cookies: '}
              </strong>
              {lt
                ? 'padeda suprasti, kaip lankytojai naudojasi mūsų svetaine (Google Analytics, jei sutinkate).'
                : 'help us understand how visitors interact with our website (Google Analytics, if accepted).'}
            </li>
          </ul>

          <h2
            className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            {lt ? 'Kaip valdyti slapukus' : 'How You Can Manage Cookies'}
          </h2>
          <p>
            {lt
              ? 'Bet kuriuo metu galite valdyti ar atšaukti savo sutikimą dėl slapukų naudodami slapukų juostą arba savo naršyklės nustatymus. Atsisakę slapukų galite prarasti dalį svetainės funkcionalumo.'
              : 'You can manage or withdraw your cookie consent at any time using our cookie banner or your browser settings. Refusing cookies may limit some functionality.'}
          </p>

          <h2
            className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            {lt ? 'Jūsų teisės pagal BDAR' : 'Your Rights Under GDPR'}
          </h2>
          <p>
            {lt
              ? 'Turite teisę prašyti prieigos prie savo duomenų, juos ištaisyti ar ištrinti, taip pat prieštarauti jų tvarkymui. Norėdami pasinaudoti šiomis teisėmis, susisiekite su mumis.'
              : 'You have the right to request access to, correction of, or deletion of your personal data, as well as to object to its processing. To exercise these rights, please contact us.'}
          </p>

          <h2
            className={`text-2xl md:text-3xl text-primary pt-6 ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            {lt ? 'Susisiekite su mumis' : 'Contact'}
          </h2>
          <p>
            {lt ? 'Klausimams dėl privatumo: ' : 'For privacy inquiries: '}
            <Link
              href={lt ? '/lt/kontaktai' : '/contact'}
              className='text-primary underline hover:text-secondary transition-colors'
            >
              {lt ? 'kontaktai' : 'contact us'}
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
