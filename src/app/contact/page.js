'use client';
import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MenuOverlay from '@/components/common/MenuOverlay';
import {
  HiArrowLongRight, HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope,
  HiOutlineUser, HiOutlinePencilSquare, HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { CONTACT, mapEmbedUrl, whatsappUrl } from '@/data/contact';
import { saveMessage } from '@/lib/messages';
import styles from './contact.module.css';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setFormState({ ...formState, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await saveMessage(formState);
      toast.success('Thank you for reaching out! We will get back to you soon.');
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Sorry, we could not send your message. Please try again or call us.');
    } finally {
      setSending(false);
    }
  };

  const quickCards = [
    { icon: HiOutlineMapPin, label: 'Visit us', value: CONTACT.addressLines.slice(1).join(', '), href: CONTACT.mapLink, external: true },
    { icon: HiOutlinePhone, label: 'Call us', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
    { icon: HiOutlineEnvelope, label: 'Email us', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: FaWhatsapp, label: 'WhatsApp', value: 'Chat with us', href: whatsappUrl(), external: true },
  ];

  return (
    <main className={styles.contactPage}>
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header headerActive={true} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className={styles.glow} aria-hidden="true" />

      <div className="container">
        <section className={styles.contactHero}>
          <span className={styles.eyebrow}>GET IN TOUCH</span>
          <h1 className={styles.heroTitle}>LET'S <span>TALK</span> SPICES</h1>
          <p className={styles.heroSubtitle}>Whether it's a gourmet inquiry or a heritage story, we're here.</p>
        </section>

        <section className={styles.quickGrid}>
          {quickCards.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              className={styles.quickCard}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className={styles.quickIcon}><Icon size={22} /></span>
              <span className={styles.quickText}>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            </a>
          ))}
        </section>

        <div className={styles.contactContainer}>
          <section className={styles.formCard}>
            <div className={styles.formHead}>
              <h2>Send us a message</h2>
              <p>Fill in the form and we'll get back to you as soon as we can.</p>
            </div>

            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Full name</span>
                  <div className={styles.control}>
                    <HiOutlineUser size={18} />
                    <input type="text" placeholder="Your name" required value={formState.name} onChange={set('name')} />
                  </div>
                </label>
                <label className={styles.field}>
                  <span>Mobile number</span>
                  <div className={styles.control}>
                    <HiOutlinePhone size={18} />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Your mobile number"
                      required
                      minLength={7}
                      maxLength={15}
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                  </div>
                </label>
              </div>

              <label className={styles.field}>
                <span>Email address</span>
                <div className={styles.control}>
                  <HiOutlineEnvelope size={18} />
                  <input type="email" placeholder="email@example.com" required value={formState.email} onChange={set('email')} />
                </div>
              </label>

              <label className={styles.field}>
                <span>Subject</span>
                <div className={styles.control}>
                  <HiOutlinePencilSquare size={18} />
                  <input type="text" placeholder="How can we help?" required value={formState.subject} onChange={set('subject')} />
                </div>
              </label>

              <label className={styles.field}>
                <span>Message</span>
                <div className={`${styles.control} ${styles.areaControl}`}>
                  <HiOutlineChatBubbleLeftEllipsis size={18} />
                  <textarea
                    rows="5"
                    maxLength={2000}
                    placeholder="Tell us more about your spice expedition..."
                    required
                    value={formState.message}
                    onChange={set('message')}
                  ></textarea>
                </div>
              </label>

              <button type="submit" className={styles.submitBtn} disabled={sending}>
                {sending ? 'SENDING...' : <>SEND MESSAGE <HiArrowLongRight size={22} /></>}
              </button>
            </form>
          </section>

          <aside className={styles.mapCard}>
            <div className={styles.mapFrame}>
              <iframe
                src={mapEmbedUrl}
                title="P-KOT Spices location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className={styles.mapInfo}>
              <h3>{CONTACT.name}</h3>
              <address>
                {CONTACT.addressLines.slice(1).map((line) => <span key={line}>{line}</span>)}
              </address>
              <a href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer" className={styles.directionsLink}>
                <HiOutlineMapPin size={18} /> GET DIRECTIONS <HiArrowLongRight size={20} />
              </a>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
