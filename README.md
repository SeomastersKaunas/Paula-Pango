# Paula Pango

Online art shop showcasing original oil paintings by Paula Pango.

## Stack

- Next.js 14 (Pages Router) + TypeScript
- Tailwind CSS
- Firebase Auth (admin only) + Firebase Admin SDK (server-side sessions)
- Stripe Checkout (Hosted, one-step)
- next-translate (en + lt)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

The app runs on http://localhost:3000.

## Environment

See [.env.example](.env.example) for the complete list of required variables.

Required to boot:
- `NEXT_PUBLIC_FIREBASE_*` (client SDK)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (admin SDK)
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

Optional:
- Google Analytics / Tag Manager / Google Ads
- Zoho or Postmark for transactional email

## Catalog

Paintings are hardcoded in [lib/artworks.ts](lib/artworks.ts). To mark an item sold:

```ts
sold: true
```

…then redeploy. SSG pages regenerate automatically (24h ISR on the sitemap).

## Admin

- `/admin/login` — Firebase email/password sign-in
- `/admin` — dashboard (gated by middleware + AuthGate)

Create the first admin user manually in Firebase Console → Authentication.

## Deploy

Vercel — connect this repo and add the env vars from `.env.example` to the project settings.
