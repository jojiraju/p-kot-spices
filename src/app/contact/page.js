'use client';
import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MenuOverlay from '@/components/common/MenuOverlay';
import { HiArrowLongRight, HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2';
import styles from './contact.module.css';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className={styles.contactPage}>
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header headerActive={true} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="container">
        <section className={styles.contactHero}>
          <h1 className={styles.heroTitle}>LET'S <span>TALK</span> SPICES</h1>
          <p className={styles.heroSubtitle}>WHETHER IT'S A GOURMET INQUIRY OR A HERITAGE STORY, WE'RE HERE.</p>
        </section>

        <div className={styles.contactContainer}>
          <section className={styles.formSection}>
            <h2>SEND A MESSAGE</h2>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your name" 
                  required 
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  required 
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?" 
                  required 
                  value={formState.subject}
                  onChange={(e) => setFormState({...formState, subject: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea 
                  rows="5" 
                  placeholder="Tell us more about your spice expedition..." 
                  required 
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                SEND MESSAGE <HiArrowLongRight size={24} />
              </button>
            </form>
          </section>

          <section className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <h3>LOCATE US</h3>
              <div className={styles.infoContent}>
                <p>P-KOT Spices HQ</p>
                <p>Idukki High Ranges</p>
                <p>Kerala, India 685602</p>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <h3>CONNECT</h3>
              <div className={styles.infoContent}>
                <p><a href="mailto:hello@pkotspices.com">hello@pkotspices.com</a></p>
                <p><a href="tel:+919645067995">+91 96450 67995</a></p>
              </div>
            </div>

            <div className={styles.mapPlaceholder}>
              <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200" alt="Kerala Map" />
              <div className={styles.mapOverlay}>
                <HiOutlineMapPin size={40} color="var(--color-primary)" />
                <p>NESTLED IN THE WESTERN GHATS</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
