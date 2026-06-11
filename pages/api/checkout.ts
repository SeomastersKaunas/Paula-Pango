import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { artworks } from '../../lib/artworks';

const getStripe = (): Stripe | null => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2023-10-16' });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({
      message:
        'Checkout is disabled in preview mode (STRIPE_SECRET_KEY not configured).',
    });
  }

  const { email, name, address, city, country, zip, cartProducts, lang } = req.body;

  if (
    !email ||
    !name ||
    !address ||
    !city ||
    !country ||
    !zip ||
    !Array.isArray(cartProducts)
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const isLithuanian = lang === 'lt';
  const cartPath = isLithuanian ? '/lt/krepselis' : '/cart';

  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cartProducts) {
      if (!item.id || !item.mode) continue;

      // â”€â”€ Artwork one-time purchase (price_data, no Firestore lookup needed) â”€â”€
      const artwork = artworks.find((a) => a.id === item.id);
      if (artwork) {
        if (artwork.sold) continue; // skip sold items
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: artwork.title,
              description: `Oil on canvas Â· ${artwork.widthCm}Ã—${artwork.heightCm}cm Â· ${artwork.year}`,
              images: [`https://www.paulapango.com${artwork.imageUrl}`],
            },
            unit_amount: artwork.price * 100, // cents
          },
          quantity: 1,
        });
        continue;
      }

      // â”€â”€ Legacy Firestore-based product (subscription plans) â”€â”€
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
      if (!clientId || !item.stripePriceId) continue;

      const ref = doc(db, 'clients', clientId, 'products', item.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;

      lineItems.push({
        price: item.stripePriceId,
        quantity: item.quantity || 1,
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ message: 'No valid items for checkout.' });
    }

    // All artwork purchases are one-time payments
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      locale: (isLithuanian ? 'lt' : 'en') as Stripe.Checkout.SessionCreateParams.Locale,
      shipping_address_collection: {
        allowed_countries: [
          'LT','LV','EE','PL','DE','FR','NL','BE','SE','FI','DK','NO','AT','CH','IT','ES','PT','CZ','SK','HU','RO','BG','HR','SI','GR','CY','IE','MT','LU',
        ],
      },
      success_url: `${req.headers.origin}${cartPath}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}${cartPath}?cancelled=true`,
      metadata: {
        name,
        address,
        city,
        country,
        zip,
        lang: isLithuanian ? 'lt' : 'en',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Stripe error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Payment processing failed. Please try again.',
    });
  }
}

