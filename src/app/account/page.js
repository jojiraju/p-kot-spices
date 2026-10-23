'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { IoCheckmark, IoClipboardOutline, IoThumbsUpOutline, IoCarOutline, IoCubeOutline } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { getDb } from '@/lib/firebase';
import { orderNo } from '@/lib/payment';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import base from '../checkout/checkout.module.css';
import styles from './account.module.css';

const STEPS = ['new', 'confirmed', 'shipped', 'delivered'];
const STEP_LABEL = { new: 'Placed', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered' };
const STEP_ICON = { new: IoClipboardOutline, confirmed: IoThumbsUpOutline, shipped: IoCarOutline, delivered: IoCubeOutline };

const money = (n, currency) =>
  `${currency === 'INR' ? '₹' : '$'}${new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: currency === 'INR' ? 0 : 2 }).format(n)}`;
const when = (ts) =>
  (ts?.toDate ? ts.toDate() : null)?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '';

function Tracker({ status }) {
  if (status === 'cancelled') return <div className={styles.cancelled}>This order was cancelled.</div>;
  const at = STEPS.indexOf(status);
  return (
    <div className={styles.steps}>
      {STEPS.map((s, i) => {
        const Icon = STEP_ICON[s];
        const state = i < at ? styles.done : i === at ? styles.current : '';
        return (
          <div key={s} className={`${styles.step} ${state}`}>
            <span className={styles.dot}>{i < at ? <IoCheckmark /> : <Icon />}</span>
            <span>{STEP_LABEL[s]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState(null); // null = loading
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderActive(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/account');
  }, [loading, user, router]);

  useEffect(() => {
    const db = getDb();
    if (!user || !db) return;
    // Live, so a status change in the CMS shows up here without a reload. Newest first is done in the browser.
    return onSnapshot(
      query(collection(db, 'orders'), where('uid', '==', user.uid)),
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        setError(false);
      },
      () => setError(true),
    );
  }, [user]);

  const list = useMemo(() => orders || [], [orders]);

  if (loading || !user) return <div className={base.checkoutMain}><p className={base.loadingText}>Loading...</p></div>;

  return (
    <main className={base.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={base.meshGradient}></div>
      <div className={base.container}>
        <div className={styles.top}>
          <div>
            <h1>My <span>orders</span></h1>
            <p>{user.displayName || user.email}{user.displayName && user.email ? ` · ${user.email}` : ''}</p>
          </div>
          <button type="button" className={base.ghostLink} onClick={() => logout().then(() => router.push('/'))}>Sign out</button>
        </div>

        {error && <p className={styles.note}>We could not load your orders. Please try again in a moment.</p>}
        {!error && orders === null && <p className={base.loadingText}>Loading your orders…</p>}
        {!error && orders !== null && list.length === 0 && (
          <div className={styles.empty}>
            <p>You have not placed any orders yet.</p>
            <Link href="/products" className={base.primaryLink}>Browse products</Link>
          </div>
        )}

        <div className={styles.list}>
          {list.map((o) => (
            <section key={o.id} className={styles.order}>
              <div className={styles.head}>
                <div>
                  <b>{orderNo(o.id)}</b>
                  <small>Placed {when(o.createdAt)}</small>
                </div>
                <span className={`${styles.paid} ${o.paid ? styles.paidYes : ''}`}>{o.status === 'cancelled' ? 'Cancelled' : o.paid ? 'Paid' : 'Payment pending'}</span>
              </div>

              <Tracker status={o.status} />

              <div className={styles.item}>
                <div>
                  <strong>{o.productName}</strong>
                  <small>{o.quantity} × {o.weight}</small>
                </div>
                <div className={styles.price}>
                  {o.originalTotal > o.total && <s>{money(o.originalTotal, o.currency)}</s>}
                  <b>{money(o.total, o.currency)}</b>
                </div>
              </div>

              <div className={styles.foot}>
                <small>Deliver to: {[o.address, o.city, o.pincode].filter(Boolean).join(', ')}</small>
                {!o.paid && o.status !== 'cancelled' && <Link href={`/pay/${o.id}`} className={base.primaryLink}>Pay now</Link>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
