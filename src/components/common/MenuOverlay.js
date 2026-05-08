'use client';
import Link from 'next/link';
import styles from './Common.module.css';

export default function MenuOverlay({ menuOpen, setMenuOpen }) {
  return (
    <div className={`${styles.menuOverlay} ${menuOpen ? styles.isOpen : ''}`}>
      <button className={styles.closeMenuBtn} onClick={() => setMenuOpen(false)}>
        <span className={styles.closeLine1}></span>
        <span className={styles.closeLine2}></span>
      </button>
      <nav className={styles.menuLinks}>
        <Link href="/" className={styles.menuLink} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/products" className={styles.menuLink} onClick={() => setMenuOpen(false)}>Collection</Link>
        <Link href="/about" className={styles.menuLink} onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link href="/contact" className={styles.menuLink} onClick={() => setMenuOpen(false)}>Contact</Link>
      </nav>
    </div>
  );
}
