import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Same Firebase project as the CMS (p-kot-spices-cms). Set the NEXT_PUBLIC_FIREBASE_* vars in .env.local.
export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

export function getDb() {
  if (!isFirebaseConfigured) return null;
  const app = getApps()[0] || initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  return getFirestore(app);
}

/** Firebase Auth for customer accounts (same project as the CMS; the CMS only admits users with an admins/ doc). */
export function getAuthClient() {
  if (!isFirebaseConfigured) return null;
  getDb(); // makes sure the app is initialised
  return getAuth(getApps()[0]);
}
