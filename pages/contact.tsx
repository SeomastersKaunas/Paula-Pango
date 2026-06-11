import Head from 'next/head';
import { useState, FormEvent } from 'react';
import { cormorant, jost } from '../lib/fonts';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

export default function Contact() {
  const [form, setForm] = useState({ name: '', clientEmail: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/submitForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'Inquiry from paulapango.com' }),
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
        <title>Contact — Paula Pango</title>
        <meta name='description' content='Get in touch with Paula Pango about purchasing a painting or commissioning new work.' />
        <link rel='canonical' href='https://www.paulapango.com/contact' />
      </Head>

      <div className='max-w-4xl mx-auto px-6 py-20'>
        <div className='text-center mb-14'>
          <h1 className={`text-5xl md:text-6xl text-text mb-4 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
            Contact
          </h1>
          <p className={`text-text-muted text-sm uppercase tracking-[0.2em] ${jost.className}`}>
            Inquiries &amp; Commissions
          </p>
          <div className='mt-5 mx-auto w-16 h-px bg-secondary' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-14 items-start'>
          <div>
            <h2 className={`text-2xl text-text mb-4 ${cormorant.className}`}>Get in touch</h2>
            <p className={`text-text-muted text-sm leading-relaxed mb-8 ${jost.className}`}>
              Interested in purchasing a painting, shipping details, or commissioning something personal?
              Paula is happy to hear from you. She will reply within 1–2 business days.
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
                Paula Pango on Facebook
              </a>
            </div>
          </div>

          <div>
            {status === 'sent' ? (
              <div className={`text-center py-12 ${jost.className}`}>
                <p className='text-primary text-lg mb-2'>Thank you!</p>
                <p className='text-text-muted text-sm'>Your message has been sent. Paula will reply shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Name</label>
                  <input
                    type='text'
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors ${jost.className}`}
                    placeholder='Your name'
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Email</label>
                  <input
                    type='email'
                    required
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors ${jost.className}`}
                    placeholder='your@email.com'
                  />
                </div>
                <div>
                  <label className={`block text-xs uppercase tracking-[0.15em] text-text-muted mb-1.5 ${jost.className}`}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`w-full border border-border bg-transparent px-4 py-3 text-sm text-text focus:outline-none focus:border-primary transition-colors resize-none ${jost.className}`}
                    placeholder='I am interested in...'
                  />
                </div>
                {status === 'error' && (
                  <p className={`text-xs text-red-500 ${jost.className}`}>Something went wrong. Please email directly: paulapango.art@gmail.com</p>
                )}
                <button
                  type='submit'
                  disabled={status === 'sending'}
                  className={`w-full py-3.5 bg-primary text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors disabled:opacity-60 ${jost.className}`}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
