// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Use long polling to reduce flaky network errors (e.g. ERR_TIMED_OUT)
// Server-side (API routes) should use default settings, client-side can use long polling
const db = typeof window !== 'undefined'
  ? initializeFirestore(app, {
      experimentalForceLongPolling: true,
    })
  : initializeFirestore(app, {
      // Server-side: use default settings for API routes
      // No need for long polling on server as it's more reliable
    });

const auth = getAuth(app);

export { app, db, auth };
