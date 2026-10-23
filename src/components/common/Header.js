'use client';
import Link from 'next/link';
import styles from './Common.module.css';
import CurrencySwitcher from '../CurrencySwitcher';
import { useAuth } from '@/context/AuthContext';

export default function Header({ headerActive, menuOpen, setMenuOpen }) {
  const { user } = useAuth();
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
        <Link href="/about" className={styles.navLink}>ABOUT</Link>
        <Link href="/contact" className={styles.navLink}>CONTACT</Link>
        <Link href={user ? '/account' : '/login'} className={styles.navLink}>{user ? 'MY ORDERS' : 'LOGIN'}</Link>
      </nav>

      <CurrencySwitcher />

      <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
      </button>
    </header>
  );
}
