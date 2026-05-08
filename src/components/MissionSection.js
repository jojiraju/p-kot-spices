'use client';
import { Target, Eye, Leaf, ShieldCheck } from 'lucide-react';
import styles from './MissionVision.module.css';

export default function MissionSection() {
  return (
    <section className={styles.mvSection} id="mission">
      <div className="container">
        <div className={styles.mvGrid}>
          {/* Mission Card */}
          <div className={styles.mvCard}>
            <div className={styles.iconBox}>
              <Target size={32} />
            </div>
            <h2 className={styles.mvTitle}>Our <span>Mission</span></h2>
            <p className={styles.mvPara}>
              To bring the authentic, unadulterated flavors of India's spice heartlands directly to global kitchens, 
              ensuring that every grain tells a story of heritage, quality, and purity.
            </p>
            <ul className={styles.mvList}>
              <li><Leaf size={16} /> Ethically Sourced</li>
              <li><ShieldCheck size={16} /> Lab Tested Purity</li>
            </ul>
          </div>

          {/* Vision Card */}
          <div className={styles.mvCard}>
            <div className={styles.iconBox}>
              <Eye size={32} />
            </div>
            <h2 className={styles.mvTitle}>Our <span>Vision</span></h2>
            <p className={styles.mvPara}>
              To become the global gold standard for premium spices, recognized for our commitment 
              to sustainable farming practices and the preservation of traditional spice-processing legacies.
            </p>
            <div className={styles.visionQuote}>
              "Quality is not an act, it is a habit."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
