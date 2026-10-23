'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { IoCheckmarkCircle, IoCopyOutline, IoLogoWhatsapp, IoAlertCircleOutline } from 'react-icons/io5';
import { getDb } from '@/lib/firebase';
import { watchOrder, fetchPaymentSettings, orderNo, upiLink } from '@/lib/payment';
import { whatsappUrl } from '@/data/contact';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import base from '../../checkout/checkout.module.css';
import styles from './pay.module.css';

const money = (n, currency) =>
  `${currency === 'INR' ? '₹' : '$'}${new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: currency === 'INR' ? 0 : 2 }).format(n)}`;

function CopyRow({ label, value }) {
  if (!value) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy. Please copy it by hand.');
    }
  };
  return (
    <div className={styles.row}>
      <div>
        <small>{label}</small>
        <b>{value}</b>
      </div>
      <button type="button" className={styles.copy} onClick={copy} aria-label={`Copy ${label}`}><IoCopyOutline /></button>
    </div>
  );
}

export default function PayPage() {
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const [state, setState] = useState({ loading: true, order: null, pay: null, error: false });
  const [qr, setQr] = useState('');

  useEffect(() => {
    const onScroll = () => setHeaderActive(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setState({ loading: false, order: null, pay: null, error: true });
      return;
    }
    let pay = null;
    let unwatch = () => {};
    let live = true;
    // Payment details load once; the order is watched, so the page flips to "Payment received" (or "cancelled")
    // by itself when it is marked in the CMS.
    fetchPaymentSettings(db)
      .then((p) => {
        if (!live) return;
        pay = p;
        unwatch = watchOrder(
          db,
          id,
          (order) => setState({ loading: false, order, pay, error: false }),
          () => setState({ loading: false, order: null, pay: null, error: true }),
        );
      })
      .catch(() => live && setState({ loading: false, order: null, pay: null, error: true }));
    return () => { live = false; unwatch(); };
  }, [id]);

  const { loading, order, pay, error } = state;
  const no = orderNo(id);
  const upiOk = order?.currency === 'INR' && pay?.upiId;
  const link = upiOk ? upiLink({ upiId: pay.upiId, name: pay.accountName, amount: Number(order.total), note: no }) : '';

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { width: 480, margin: 1, color: { dark: '#000000', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [link]);

  const shell = (children) => (
    <main className={base.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={base.meshGradient}></div>
      <div className={base.container}>{children}</div>
    </main>
  );

  const message = (title, text) => shell(
    <div className={base.statusCard}>
      <div className={base.statusIcon}><IoAlertCircleOutline /></div>
      <h1>{title}</h1>
      <p>{text}</p>
      <div className={base.statusActions}>
        <Link href="/products" className={base.primaryLink}>Continue shopping</Link>
      </div>
    </div>
  );

  if (loading) return <div className={base.checkoutMain}><p className={base.loadingText}>Loading...</p></div>;
  if (error) return message('Something went wrong', 'We could not load this payment page. Please try again, or message us on WhatsApp.');
  if (!order) return message('Order not found', 'This payment link is not valid. Please check the link we sent you.');
  if (order.status === 'cancelled') return message('Order cancelled', `Order ${no} has been cancelled, so no payment is needed.`);
  if (order.paid) return message('Payment received', `Thank you! We have received the payment for order ${no}.`);
  if (!pay) return message('Payment details coming soon', 'We will share the payment details with you on WhatsApp shortly.');

  const sent = whatsappUrl(`Hi P-KOT Spices, I have paid ${money(order.total, order.currency)} for order ${no}. Sharing the payment screenshot here.`);

  return shell(
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.badge}>Order {no}</span>
        <h1>Pay for your <span>order</span></h1>
        <p>{order.productName} · {order.quantity} × {order.weight}</p>
      </div>

      <div className={styles.amount}>
        <small>Amount to pay</small>
        <b>{money(order.total, order.currency)}</b>
      </div>

      <div className={styles.grid}>
        {upiOk ? (
          <section className={styles.card}>
            <h2>Pay with UPI</h2>
            <p className={styles.hint}>Scan with any UPI app, such as Google Pay, PhonePe or Paytm. The amount is already filled in.</p>
            <div className={styles.qr}>{qr ? <img src={qr} alt={`UPI QR code for ${money(order.total, 'INR')}`} /> : <span>Preparing QR…</span>}</div>
            <a href={link} className={`${base.primaryLink} ${styles.upiBtn}`}>Pay with UPI app</a>
            <CopyRow label="UPI ID" value={pay.upiId} />
          </section>
        ) : (
          <section className={styles.card}>
            <h2>Pay with UPI</h2>
            <p className={styles.hint}>UPI works for payments in rupees. For this order, please message us on WhatsApp and we will arrange payment with you.</p>
          </section>
        )}

        {pay.accountNumber && (
          <section className={styles.card}>
            <h2>Bank transfer</h2>
            <p className={styles.hint}>Use NEFT, IMPS or any bank app. Put {no} in the remarks if you can.</p>
            <CopyRow label="Account name" value={pay.accountName} />
            <CopyRow label="Bank" value={pay.bankName} />
            <CopyRow label="Account number" value={pay.accountNumber} />
            <CopyRow label="IFSC" value={pay.ifsc} />
          </section>
        )}
      </div>

      <div className={styles.after}>
        <p>{pay.note || 'After paying, please send the payment screenshot on WhatsApp so we can confirm your order.'}</p>
        <a href={sent} target="_blank" rel="noopener noreferrer" className={base.primaryLink}><IoLogoWhatsapp /> I have paid, send screenshot</a>
      </div>
    </div>
  );
}
