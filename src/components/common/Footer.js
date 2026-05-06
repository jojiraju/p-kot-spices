'use client';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { HiArrowLongRight } from 'react-icons/hi2';
import Link from 'next/link';
import styles from './Common.module.css';

export default function Footer() {
  const whatsappNumber = '+919645067995';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerMain}>
          <div className={styles.footerBrandSection}>
            <div className={styles.footerLogoContainer}>
              <img src="/logo.png" alt="P-KOT" className={styles.footerLogoImage} />
            </div>
            <p className={styles.footerTagline}>TRADITION IN EVERY GRAIN</p>
            <div className={styles.socialGrid}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                <FaWhatsapp size={22} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <FaInstagram size={22} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <FaFacebookF size={22} />
              </a>
            </div>
          </div>

          <div className={styles.footerNavSection}>
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
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.legalLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} P-KOT SPICES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
