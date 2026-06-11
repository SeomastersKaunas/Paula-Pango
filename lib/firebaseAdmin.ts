import * as admin from 'firebase-admin';

const hasCreds = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
);

if (hasCreds && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Safe proxy: importing the module never crashes; only ACTUAL use without
// credentials throws (so static export / sitemap fallbacks keep working).
const notConfigured = (): never => {
  throw new Error(
    'Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.'
  );
};

export const db: admin.firestore.Firestore = hasCreds
  ? admin.firestore()
  : (new Proxy({}, { get: notConfigured }) as unknown as admin.firestore.Firestore);

export const auth: admin.auth.Auth = hasCreds
  ? admin.auth()
  : (new Proxy({}, { get: notConfigured }) as unknown as admin.auth.Auth);

export const isFirebaseAdminConfigured = hasCreds;
