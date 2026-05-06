'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedTitle from './AnimatedTitle';
import styles from '../app/page.module.css';

export default function Hero({ 
  heroRef, 
  heroContentRef, 
  titleRef, 
  subtitleRef, 
  ctaRef, 
  scrollIndRef 
}) {
  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroScene}>
        <div className={`${styles.parallaxLayer} ${styles.layer1}`}>
          <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800" alt="Black Pepper" />
        </div>
        <div className={`${styles.parallaxLayer} ${styles.layer2}`}>
          <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800" alt="Chili Powder" />
        </div>
        <div className={`${styles.parallaxLayer} ${styles.layer3}`}>
          <img src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=800" alt="Cinnamon and Star Anise" />
        </div>
        <div className={`${styles.parallaxLayer} ${styles.layer4}`}>
          <img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800" alt="Turmeric" />
        </div>
        
        <div className={styles.heroCenterImg}>
          <img src="/sequence/packet_00.jpg" alt="P-KOT Pouch" />
          <div className={styles.centerGlow}></div>
        </div>
      </div>

      <div className={styles.heroOverlay}></div>
      <div className={styles.heroBottomGradient}></div>
      <div className={styles.grain}></div>

      <div className={styles.heroContent} ref={heroContentRef}>
        <div ref={titleRef}>
          <AnimatedTitle />
        </div>
        <p className={styles.heroSubtitle} ref={subtitleRef}>
          PREMIUM QUALITY • AUTHENTIC FLAVORS
        </p>
        <div className={styles.ctaWrapper} ref={ctaRef}>
          <Link href="/products" className={styles.heroCta}>
            EXPLORE COLLECTION <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className={styles.scrollIndicator} ref={scrollIndRef}>
        <span className={styles.discoverText}>DISCOVER</span>
        <div className={styles.scrollDot}></div>
      </div>
    </section>
  );
}
