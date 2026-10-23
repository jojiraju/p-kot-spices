'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getAuthClient, getDb } from '@/lib/firebase';

const AuthContext = createContext({ user: null, loading: true });

/** Plain-English text for the Firebase Auth errors a customer can run into. */
export function authMessage(e) {
  const map = {
    'auth/invalid-credential': 'That email or password is not correct.',
    'auth/wrong-password': 'That email or password is not correct.',
    'auth/user-not-found': 'That email or password is not correct.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
    'auth/weak-password': 'Please choose a password with at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user': 'The Google window was closed before sign-in finished.',
    'auth/popup-blocked': 'Your browser blocked the Google window. Please allow pop-ups and try again.',
    'auth/network-request-failed': 'Network problem. Please check your connection.',
    'auth/operation-not-allowed': 'This sign-in method is not turned on yet.',
    'auth/expired-action-code': 'This link has expired or was already used.',
    'auth/invalid-action-code': 'This link has expired or was already used.',
    'auth/missing-email': 'Please enter your email address.',
    'auth/configuration-not-found': 'Sign-in is not set up yet. Please try again later.',
    'auth/unauthorized-continue-uri': 'This website address is not allowed to send emails yet.',
  };
  return map[e?.code] || 'Something went wrong. Please try again.';
}

/** Keeps a profile at users/{uid} so the CMS can list every account, even before a first order. */
async function saveProfile(u, name, phone) {
  const db = getDb();
  if (!db || !u) return;
  try {
    await setDoc(doc(db, 'users', u.uid), {
      uid: u.uid,
      name: (name || u.displayName || '').trim(),
      email: u.email || '',
      provider: u.providerData?.[0]?.providerId || 'password',
      createdAt: u.metadata?.creationTime ? new Date(u.metadata.creationTime) : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      // Only written when given (email sign-up), so a later Google sign-in never blanks it.
      ...(phone ? { phone } : {}),
    }, { merge: true });
  } catch {
    // The profile is a convenience for the shop owner; never block sign-in on it.
  }
}

export function AuthProvider({ children }) {
  const auth = useMemo(() => getAuthClient(), []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      saveProfile(u);
    });
  }, [auth]);

  const value = useMemo(() => ({
    user,
    loading,
    configured: Boolean(auth),
    signInGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signInEmail: (email, password) => signInWithEmailAndPassword(auth, email.trim(), password),
    signUpEmail: async (name, email, password, phone) => {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      // onAuthStateChanged ran before the name was set, so refresh the user the pages see.
      setUser({ ...cred.user, displayName: name.trim() });
      saveProfile(cred.user, name, phone);
      return cred;
    },
    resetPassword: (email) => sendPasswordResetEmail(auth, email.trim()),
    verifyResetCode: (code) => verifyPasswordResetCode(auth, code),
    confirmReset: (code, password) => confirmPasswordReset(auth, code, password),
    logout: () => signOut(auth),
  }), [auth, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
