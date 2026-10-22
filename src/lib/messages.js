import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

/** Saves a contact-us enquiry so it shows up under Messages in the CMS. */
export async function saveMessage({ name, email, phone, subject, message }) {
  const db = getDb();
  if (!db) throw new Error('Messaging is not configured.');
  return addDoc(collection(db, 'messages'), {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
