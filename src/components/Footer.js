'use client';
import styles from '../app/page.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerBrand}>P-KOT SPICES</div>
        <p>&copy; {new Date().getFullYear()} Tradition in Every Grain.</p>
      </div>
    </footer>
  );
}
