'use client';
import Link from 'next/link';
import styles from './Common.module.css';

export default function Header({ headerActive, menuOpen, setMenuOpen }) {
  return (
    <header className={`${styles.header} ${headerActive ? styles.active : ''}`}>
      <div className={styles.headerLogo}>
        <Link href="/">
          <img src="/logo.png" alt="P-KOT" className={styles.logoImage} />
        </Link>
      </div>
      
      <nav className={styles.desktopNav}>
        <Link href="/" className={styles.navLink}>HOME</Link>
        <Link href="/products" className={styles.navLink}>COLLECTION</Link>
        <a href="#mission" className={styles.navLink}>HERITAGE</a>
        <Link href="/contact" className={styles.navLink}>CONTACT</Link>
      </nav>

      <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
      </button>
    </header>
  );
}
