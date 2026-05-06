'use client';
import Link from 'next/link';
import styles from '../app/page.module.css';

export default function MenuOverlay({ menuOpen, setMenuOpen }) {
  return (
    <div className={`${styles.menuOverlay} ${menuOpen ? styles.isOpen : ''}`}>
      <button className={styles.closeMenuBtn} onClick={() => setMenuOpen(false)}>
        <span className={styles.closeLine1}></span>
        <span className={styles.closeLine2}></span>
      </button>
      <nav className={styles.menuLinks}>
        <a href="#" className={styles.menuLink} onClick={() => setMenuOpen(false)}>Home</a>
        <Link href="/products" className={styles.menuLink}>Collection</Link>
        <a href="#mission" className={styles.menuLink} onClick={() => setMenuOpen(false)}>Heritage</a>
      </nav>
    </div>
  );
}
