'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoCallOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { useAuth, authMessage } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import base from '../checkout/checkout.module.css';
import styles from './auth.module.css';

// Only follow same-site paths, so a crafted ?next= cannot send a customer to another website.
const safeNext = (n) => (n && n.startsWith('/') && !n.startsWith('//') ? n : '/account');

function LoginContent() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const { user, loading, configured, signInGoogle, signInEmail, signUpEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderActive(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Already signed in (or just signed in): carry on to where the customer was going.
  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  // The "reset link sent" note clears itself after 5 seconds.
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const run = async (fn) => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(authMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Please enter your name.');
      if (!/^\d{10,15}$/.test(form.phone)) return setError('Please enter a valid mobile number (10 to 15 digits).');
    }
    run(() => (mode === 'signup' ? signUpEmail(form.name, form.email, form.password, form.phone) : signInEmail(form.email, form.password)));
  };

  const forgot = () => {
    if (!form.email.trim()) return setError('Enter your email above first, then press "Forgot password".');
    run(async () => {
      await resetPassword(form.email);
      toast.success('Password reset email sent.');
      setNotice(`If ${form.email.trim()} has an account with a password, we have sent a reset link to it. Check your inbox and spam folder. If you signed up with Google, there is no password to reset: use Continue with Google.`);
    });
  };

  return (
    <main className={base.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={base.meshGradient}></div>
      <div className={base.container}>
        <div className={styles.card}>
          <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
          <p className={styles.sub}>
            {next.startsWith('/checkout') ? 'Sign in to place your order. You can then follow it from your account.' : 'Sign in to see your orders and their status.'}
          </p>

          {!configured && !loading && <p className={styles.error}>Accounts are not available right now.</p>}

          <button type="button" className={styles.google} disabled={busy || !configured} onClick={() => run(signInGoogle)}>
            <FcGoogle size={22} /> Continue with Google
          </button>
          <div className={styles.or}><span>or</span></div>

          <form onSubmit={submit} noValidate className={styles.form}>
            {mode === 'signup' && (
              <div className={base.inputGroup}>
                <label htmlFor="name">Full name</label>
                <div className={base.inputWrapper}>
                  <IoPersonOutline className={base.fieldIcon} />
                  <input id="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" />
                </div>
              </div>
            )}
            {mode === 'signup' && (
              <div className={base.inputGroup}>
                <label htmlFor="phone">Mobile number</label>
                <div className={base.inputWrapper}>
                  <IoCallOutline className={base.fieldIcon} />
                  <input id="phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/[^0-9]/g, '') }))} placeholder="e.g. 9876543210" maxLength={15} />
                </div>
              </div>
            )}
            <div className={base.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={base.inputWrapper}>
                <IoMailOutline className={base.fieldIcon} />
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </div>
            </div>
            <div className={base.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={base.inputWrapper}>
                <IoLockClosedOutline className={base.fieldIcon} />
                <input id="password" type={showPw ? 'text' : 'password'} className={styles.pwInput} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} />
                <button type="button" className={styles.eye} onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'} aria-pressed={showPw}>
                  {showPw ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            {error && <p className={styles.error} role="alert">{error}</p>}
            {notice && <p className={styles.notice} role="status">{notice}</p>}

            <button type="submit" className={base.primaryLink} disabled={busy || !configured}>
              {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
            {mode === 'signin' && <button type="button" className={styles.linkBtn} onClick={forgot} disabled={busy}>Forgot password?</button>}
          </form>

          <p className={styles.switch}>
            {mode === 'signup' ? 'Already have an account?' : 'New to P-KOT Spices?'}{' '}
            <button type="button" className={styles.linkBtn} onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}>
              {mode === 'signup' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
