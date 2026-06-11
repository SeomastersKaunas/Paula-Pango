// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

const notConfigured = (): never => {
  throw new Error(
    'Firebase client SDK is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.'
  );
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

if (isFirebaseConfigured) {
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
  _db = typeof window !== 'undefined'
    ? initializeFirestore(_app, { experimentalForceLongPolling: true })
    : initializeFirestore(_app, {});
  _auth = getAuth(_app);
}

// Safe proxies: importing this module never crashes; only ACTUAL use without
// credentials throws (so the app still builds and the gallery pages render).
export const app: FirebaseApp =
  _app ?? (new Proxy({}, { get: notConfigured }) as unknown as FirebaseApp);
export const db: Firestore =
  _db ?? (new Proxy({}, { get: notConfigured }) as unknown as Firestore);
export const auth: Auth =
  _auth ?? (new Proxy({}, { get: notConfigured }) as unknown as Auth);
