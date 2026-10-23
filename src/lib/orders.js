import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

/** Saves an order so it shows up under Orders in the CMS. */
export async function saveOrder({ product, weight, quantity, currency, total, unitPrice, originalTotal, discountPercent, name, phone, address, city, pincode, uid, email }) {
  const db = getDb();
  if (!db) throw new Error('Orders are not configured.');
  const ref = doc(collection(db, 'orders'));
  const batch = writeBatch(db);
  batch.set(ref, {
    uid, // the signed-in customer, so they can see this order in their account
    email: email || null,
    productId: product.id,
    productName: product.name,
    weight,
    quantity: Number(quantity),
    currency,
    total: Number(String(total).replace(/,/g, '')),
    // Discount at the time of ordering; the CMS shows what the customer saved.
    unitPrice: Number(unitPrice) || null,
    originalTotal: Number(originalTotal) || null,
    discountPercent: Number(discountPercent) || 0,
    name: name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    pincode: pincode.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  });
  // The payment page reads this public copy, which carries no personal details.
  batch.set(doc(db, 'payments', ref.id), {
    total: Number(String(total).replace(/,/g, '')),
    currency,
    productName: product.name,
    weight,
    quantity: Number(quantity),
    status: 'new',
    paid: false,
  });
  await batch.commit();
  return ref;
}
