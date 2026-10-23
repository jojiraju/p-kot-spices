import { doc, getDoc, onSnapshot } from 'firebase/firestore';

/** Same readable order number the CMS shows, taken from the order's document id. */
export const orderNo = (id = '') => `PK-${String(id).slice(0, 8).toUpperCase()}`;

/** UPI deep link; the QR code on the payment page encodes the same string. */
export const upiLink = ({ upiId, name, amount, note }) => {
  const q = new URLSearchParams({ pa: upiId, pn: name, am: String(amount), cu: 'INR', tn: note });
  return `upi://pay?${q.toString()}`;
};

/** The public payment record for an order (amount and item only), or null. */
export async function fetchOrder(db, id) {
  const snap = await getDoc(doc(db, 'payments', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Same record, kept live: calls onOrder with the order (or null) whenever it changes. Returns the unsubscribe function. */
export const watchOrder = (db, id, onOrder, onError) =>
  onSnapshot(doc(db, 'payments', id), (snap) => onOrder(snap.exists() ? { id: snap.id, ...snap.data() } : null), onError);

/** Payment details saved in the CMS (Settings -> Payment), or null until they are set up. */
export async function fetchPaymentSettings(db) {
  const snap = await getDoc(doc(db, 'settings', 'payment'));
  return snap.exists() ? snap.data() : null;
}
