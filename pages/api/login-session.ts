import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookies, removeCookies } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers.host || '';
  const isProduction = host.includes('paulapango.com');
  const cookieDomain = isProduction ? { domain: '.paulapango.com' } : {};

  if (req.method === 'POST') {
    const { idToken, token } = req.body || {};
    const value = idToken || token;
    if (!value) return res.status(400).json({ error: 'Missing token' });

    setCookies('__session', value, {
      req,
      res,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      ...cookieDomain,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    removeCookies('__session', { req, res, path: '/', ...cookieDomain });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
