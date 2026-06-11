'use client';

import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebaseAuth';
import { useAuth } from '../../lib/AuthContext';
import SEOHead from '../../components/SEOHead';
import Spinner from '../../components/Spinner';
import { cormorant, jost } from '../../lib/fonts';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    await fetch('/api/login-session', { method: 'DELETE' }).catch(() => {});
    router.replace('/admin/login');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null; // middleware + AuthGate will redirect
  }

  return (
    <>
      <SEOHead
        title='Admin Dashboard — Paula Pango'
        description='Paula Pango admin panel'
        noIndex
      />
      <div className='min-h-screen bg-[#fdfbf9] px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-between mb-12'>
            <h1
              className={`text-4xl text-[#3e3232] ${cormorant.className}`}
              style={{ fontStyle: 'italic' }}
            >
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border border-[#e4d4d4] text-[#3e3232] hover:bg-[#f0e9e9] transition-colors ${jost.className}`}
            >
              Logout
            </button>
          </div>

          <p className={`text-sm text-[#9e8080] mb-10 ${jost.className}`}>
            Signed in as {user.email}
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white border border-[#e4d4d4] rounded-2xl p-8'>
              <h2
                className={`text-2xl text-[#3e3232] mb-3 ${cormorant.className}`}
                style={{ fontStyle: 'italic' }}
              >
                Artworks
              </h2>
              <p className={`text-sm text-[#9e8080] mb-6 ${jost.className}`}>
                Manage paintings, prices, and sold status.
              </p>
              <p className={`text-xs text-[#9e8080] ${jost.className}`}>
                Coming soon — currently edited in <code>lib/artworks.ts</code>.
              </p>
            </div>

            <div className='bg-white border border-[#e4d4d4] rounded-2xl p-8'>
              <h2
                className={`text-2xl text-[#3e3232] mb-3 ${cormorant.className}`}
                style={{ fontStyle: 'italic' }}
              >
                Articles
              </h2>
              <p className={`text-sm text-[#9e8080] mb-6 ${jost.className}`}>
                Manage blog posts.
              </p>
              <p className={`text-xs text-[#9e8080] ${jost.className}`}>
                Coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
