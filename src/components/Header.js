'use client';
import styles from '../app/page.module.css';
import CurrencySwitcher from './CurrencySwitcher';

export default function Header({ headerActive, menuOpen, setMenuOpen }) {
  return (
    <header className={`${styles.header} ${headerActive ? styles.active : ''}`}>
      <div className={styles.headerLogo}>
        <img src="/logo.png" alt="P-KOT" className={styles.logoImage} />
      </div>
      
      <CurrencySwitcher />

      <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
      </button>
    </header>
  );
}
