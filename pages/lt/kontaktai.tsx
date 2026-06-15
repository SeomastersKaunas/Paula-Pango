import Head from 'next/head';
import { useState, FormEvent } from 'react';
import { cormorant, jost } from '../../lib/fonts';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

export default function Kontaktai() {
  const [form, setForm] = useState({ name: '', clientEmail: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/submitForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: form.subject || 'Užklausa iš paulapango.com' }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Head>
        <title>Kontaktai — Paula Pango</title>
        <meta name='description' content='Susisiekite su Paula Pango dėl paveikslų įsigijimo ar individualaus užsakymo.' />
        <link rel='canonical' href='https://www.paulapango.com/lt/kontaktai' />
      </Head>

      <div className='max-w-4xl mx-auto px-6 py-20'>
        <div className='text-center mb-14'>
          <h1 className={`text-5xl md:text-6xl text-text mb-4 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            Kontaktai
          </h1>
          <p className={`text-text-muted text-sm uppercase tracking-[0.2em] ${jost.className}`}>
            Užklausos ir individualūs užsakymai
          </p>
          <div className='mt-5 mx-auto w-16 h-px bg-secondary' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-14 items-start'>
          <div>
            <h2 className={`text-2xl text-text mb-4 ${cormorant.className}`}>Susisiekite</h2>
            <p className={`text-text-muted text-sm leading-relaxed mb-8 ${jost.className}`}>
              Domina paveikslų pirkimas, pristatymo detalės ar individualus užsakymas?
              Paula mielai atsakys. Ji atsilieps per 1–2 darbo dienas.
            </p>
            <div className={`space-y-4 text-sm text-text-muted ${jost.className}`}>
              <a href='mailto:paulapango.art@gmail.com' className='flex items-center gap-3 hover:text-primary transition-colors'>
                <FiMail className='w-4 h-4 shrink-0 text-primary' />
                paulapango.art@gmail.com
              </a>
              <a href='https://www.instagram.com/paulapango' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 hover:text-primary transition-colors'>
                <FaInstagram className='w-4 h-4 shrink-0 text-primary' />
                @paulapango
              </a>
              <a href='https://www.facebook.com/share/1BY35K5TGQ/' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 hover:text-primary transition-colors'>
                <FaFacebookF className='w-4 h-4 shrink-0 text-primary' />
                Paula Pango Facebook
              </a>
            </div>
          </div>

          <div>
            {status === 'sent' ? (
              <div className={`text-center py-12 ${jost.className}`}>
                <p className='text-primary text-lg mb-2'>Ačiū!</p>
                <p className='text-text-muted text-sm'>Jūsų žinutė išsiųsta. Paula atsakys netrukus.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div>
                    <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Vardas *</label>
                    <input type='text' required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors ${jost.className}`} placeholder='Jūsų vardas' />
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Telefonas</label>
                    <input type='tel' value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors ${jost.className}`} placeholder='+370 600 00000' />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>El. paštas *</label>
                  <input type='email' required value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors ${jost.className}`} placeholder='jusu@epastas.lt' />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Užklausos tema</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={`w-full border border-border bg-background px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors ${jost.className}`}>
                    <option value=''>Pasirinkite temą...</option>
                    <option value='Pirkimo užklausa'>Pirkimo užklausa</option>
                    <option value='Individualus užsakymas'>Individualus užsakymas</option>
                    <option value='Pristatymas'>Pristatymas</option>
                    <option value='Kitas klausimas'>Kitas klausimas</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Žinutė *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors resize-none ${jost.className}`} placeholder='Mane domina...' />
                </div>
                {status === 'error' && (
                  <p className={`text-xs text-red-500 ${jost.className}`}>Klaida. Parašykite tiesiogiai: paulapango.art@gmail.com</p>
                )}
                <button type='submit' disabled={status === 'sending'}
                  className={`w-full py-3.5 bg-primary text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors disabled:opacity-60 ${jost.className}`}>
                  {status === 'sending' ? 'Siunčiama...' : 'Siųsti žinutę'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
