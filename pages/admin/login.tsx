'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseAuth';
import SEOHead from '../../components/SEOHead';
import { cormorant, jost } from '../../lib/fonts';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch('/api/login-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        throw new Error('Session creation failed');
      }
      const redirect =
        typeof router.query.redirect === 'string' ? router.query.redirect : '/admin';
      router.replace(redirect);
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title='Admin — Paula Pango'
        description='Paula Pango admin panel'
        noIndex
      />
      <div className='min-h-screen flex items-center justify-center px-4 bg-[#fdfbf9]'>
        <div className='w-full max-w-md bg-white border border-[#e4d4d4] rounded-2xl shadow-sm p-8'>
          <h1
            className={`text-3xl text-[#3e3232] mb-6 text-center ${cormorant.className}`}
            style={{ fontStyle: 'italic' }}
          >
            Admin Login
          </h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className={`block text-xs uppercase tracking-[0.2em] text-[#9e8080] mb-2 ${jost.className}`}
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='email'
                className={`w-full border border-[#e4d4d4] rounded-md px-3 py-2 text-sm text-[#3e3232] focus:outline-none focus:border-[#7b5d5d] ${jost.className}`}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className={`block text-xs uppercase tracking-[0.2em] text-[#9e8080] mb-2 ${jost.className}`}
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='current-password'
                className={`w-full border border-[#e4d4d4] rounded-md px-3 py-2 text-sm text-[#3e3232] focus:outline-none focus:border-[#7b5d5d] ${jost.className}`}
              />
            </div>
            {error && (
              <p className={`text-sm text-red-600 ${jost.className}`}>{error}</p>
            )}
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-3 bg-[#7b5d5d] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors disabled:opacity-50 ${jost.className}`}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
