import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

/** Saves an order so it shows up under Orders in the CMS. */
export async function saveOrder({ product, weight, quantity, currency, total, name, phone, address, city, pincode }) {
  const db = getDb();
  if (!db) throw new Error('Orders are not configured.');
  return addDoc(collection(db, 'orders'), {
    productId: product.id,
    productName: product.name,
    weight,
    quantity: Number(quantity),
    currency,
    total: Number(String(total).replace(/,/g, '')),
    name: name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    pincode: pincode.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  });
}
