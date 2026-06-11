// pages/api/stripe-webhook.ts
import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);
const hasFirebase = Boolean(
  process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
);

const stripe = hasStripe
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2023-10-16',
    })
  : null;

// Firebase Admin init
if (hasFirebase && !getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = hasFirebase ? admin.firestore() : null;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  if (!stripe || !db) {
    return res
      .status(503)
      .json({ message: 'Stripe webhook disabled — credentials not configured.' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    // Webhook error
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;
    const customer = session.customer_details;

    if (!metadata?.clientId || !metadata?.productIds) {
      // Missing metadata
      return res.status(400).json({ error: 'Missing metadata' });
    }

    const productIds: string[] = JSON.parse(metadata.productIds);

    const batch = db.batch();
    for (const id of productIds) {
      const ref = db
        .collection('clients')
        .doc(metadata.clientId)
        .collection('products')
        .doc(id);

      // Decrease quantity by 1
      batch.update(ref, {
        quantity: admin.firestore.FieldValue.increment(-1),
      });
    }

    await batch.commit();

    await db
      .collection('clients')
      .doc(metadata.clientId)
      .collection('orders')
      .add({
        stripeSessionId: session.id,
        email: customer?.email || '',
        amount_total: session.amount_total,
        status: session.payment_status,
        created: new Date(),
        address: customer?.address || {},
        shipping_name: customer?.name || '',
      });
  }

  res.status(200).json({ received: true });
}
