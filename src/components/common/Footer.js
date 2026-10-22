'use client';
import { CONTACT, whatsappUrl } from '@/data/contact';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { HiArrowLongRight } from 'react-icons/hi2';
import Link from 'next/link';
import styles from './Common.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerCta}>
          <div>
            <h2>Fresh spices, <span>straight from Kerala.</span></h2>
            <p>Order on WhatsApp and we&apos;ll pack and ship it to your door.</p>
          </div>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={styles.footerCtaBtn}>
            <FaWhatsapp size={20} /> Chat with us <HiArrowLongRight size={22} />
          </a>
        </div>

        <div className={styles.footerMain}>
          <div className={styles.footerBrandSection}>
            <div className={styles.footerLogoContainer}>
              <img src="/logo.png" alt="P-KOT" className={styles.footerLogoImage} />
            </div>
            <p className={styles.footerTagline}>TRADITION IN EVERY GRAIN</p>
            <p className={styles.footerAbout}>
              Hand-picked spices and home-style pickles, packed fresh in Edakkara, Keralam.
            </p>
            <div className={styles.socialGrid}>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                <FaWhatsapp size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <FaFacebookF size={20} />
              </a>
            </div>
          </div>

          <div className={styles.navColumn}>
            <h3>EXPLORE</h3>
            <Link href="/">Home</Link>
            <Link href="/products">Collection</Link>
            <a href="#mission">Our Heritage</a>
          </div>

          <div className={styles.navColumn}>
            <h3>SUPPORT</h3>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <Link href="/contact">Contact</Link>
          </div>

          <div className={styles.navColumn}>
            <h3>GET IN TOUCH</h3>
            <a href={`tel:${CONTACT.phoneTel}`} className={styles.contactItem}>
              <FaPhoneAlt /> {CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className={styles.contactItem}>
              <FaEnvelope /> {CONTACT.email}
            </a>
            <a href={CONTACT.mapLink} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <FaMapMarkerAlt /> <span>{CONTACT.addressLines.slice(1).join(', ')}</span>
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} P-KOT SPICES. ALL RIGHTS RESERVED.
          </p>
          <div className={styles.legalLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
