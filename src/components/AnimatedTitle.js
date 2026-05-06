'use client';
import styles from '../app/page.module.css';

export default function AnimatedTitle() {
  return (
    <div className={styles.heroTitleLayout}>
      <div className={styles.titleLine1}>
        Tradition <span className={styles.italicGold}>in</span> Every
      </div>
      <div className={styles.titleLine2}>Grain</div>
    </div>
  );
}
