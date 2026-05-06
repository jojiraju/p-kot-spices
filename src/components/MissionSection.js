'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from '../app/page.module.css';

export default function MissionSection() {
  return (
    <section className={styles.missionSection} id="mission">
      <div className="container">
        <div className={styles.missionContent}>
          <h2 className={styles.missionTitle}>Crafted by Nature, <br/><span>Perfected by Time.</span></h2>
          <p className={styles.missionPara}>
            From the lush hills of Idukki to your kitchen, our spices represent 
            generations of dedication to purity.
          </p>
          <Link href="/products" className={styles.mainCtaBtn}>
            VIEW ALL PRODUCTS <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
