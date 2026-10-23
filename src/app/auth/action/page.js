'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from 'react-icons/io5';
import { useAuth, authMessage } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import base from '../../checkout/checkout.module.css';
import styles from '../../login/auth.module.css';

// Firebase's email links open here (set as the action URL in Firebase -> Authentication -> Templates),
// so customers see this site instead of the plain Firebase page.
function ActionContent() {
  const params = useSearchParams();
  const mode = params.get('mode');
  const code = params.get('oobCode');
  const { verifyResetCode, confirmReset, configured } = useAuth();

  const [stage, setStage] = useState('checking'); // checking | form | done | invalid
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderActive(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Check the link first, so an expired or used one is explained before the customer types a password.
  useEffect(() => {
    if (mode !== 'resetPassword' || !code) return setStage('invalid');
    if (!configured) return;
    let live = true;
    verifyResetCode(code)
      .then((e) => { if (live) { setEmail(e); setStage('form'); } })
      .catch(() => live && setStage('invalid'));
    return () => { live = false; };
  }, [mode, code, configured]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Please choose a password with at least 6 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setBusy(true);
    try {
      await confirmReset(code, password);
      setStage('done');
    } catch (err) {
      if (err?.code === 'auth/expired-action-code' || err?.code === 'auth/invalid-action-code') setStage('invalid');
      else setError(authMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const shell = (children) => (
    <main className={base.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={base.meshGradient}></div>
      <div className={base.container}>{children}</div>
    </main>
  );

  if (stage === 'checking') return shell(<p className={base.loadingText}>Checking your link…</p>);

  if (stage === 'invalid') {
    return shell(
      <div className={base.statusCard}>
        <div className={base.statusIcon}><IoAlertCircleOutline /></div>
        <h1>This link no longer works</h1>
        <p>Password reset links can be used once and expire after a short time. Some email apps also open the link in the background, which uses it up. Please ask for a new one.</p>
        <div className={base.statusActions}>
          <Link href="/login" className={base.primaryLink}>Request a new link</Link>
          <Link href="/" className={base.ghostLink}>Back to home</Link>
        </div>
      </div>,
    );
  }

  if (stage === 'done') {
    return shell(
      <div className={base.statusCard}>
        <div className={base.statusIcon}><IoCheckmarkCircleOutline /></div>
        <h1>Password updated</h1>
        <p>Your password has been changed. You can now sign in with your new password.</p>
        <div className={base.statusActions}>
          <Link href="/login" className={base.primaryLink}>Sign in</Link>
        </div>
      </div>,
    );
  }

  return shell(
    <div className={styles.card}>
      <h1>Choose a new password</h1>
      <p className={styles.sub}>for <b>{email}</b></p>
      <form onSubmit={submit} noValidate className={styles.form}>
        <div className={base.inputGroup}>
          <label htmlFor="pw">New password</label>
          <div className={base.inputWrapper}>
            <IoLockClosedOutline className={base.fieldIcon} />
            <input id="pw" type={show ? 'text' : 'password'} className={styles.pwInput} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            <button type="button" className={styles.eye} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
              {show ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
        </div>
        <div className={base.inputGroup}>
          <label htmlFor="pw2">Confirm password</label>
          <div className={base.inputWrapper}>
            <IoLockClosedOutline className={base.fieldIcon} />
            <input id="pw2" type={show ? 'text' : 'password'} className={styles.pwInput} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Type it again" />
          </div>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" className={base.primaryLink} disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
      </form>
    </div>,
  );
}

export default function ActionPage() {
  return (
    <Suspense fallback={null}>
      <ActionContent />
    </Suspense>
  );
}
