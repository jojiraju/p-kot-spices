'use client';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedTitle from './AnimatedTitle';
import styles from '../app/page.module.css';
import { useCurrency } from '@/context/CurrencyContext';

export default function Hero({ 
  heroRef, 
  heroContentRef, 
  titleRef, 
  subtitleRef, 
  ctaRef, 
  scrollIndRef,
  heroCenterImgRef,
  parallaxLayersRef
}) {
  const { currency } = useCurrency();
  const [isFlash, setIsFlash] = useState(false);

  useEffect(() => {
    setIsFlash(true);
    const timer = setTimeout(() => setIsFlash(false), 600);
    return () => clearTimeout(timer);
  }, [currency]);

  const subtitle = currency === 'INR' 
    ? 'PREMIUM SPICES FOR THE AUTHENTIC INDIAN KITCHEN'
    : 'EXQUISITE SPICES DELIVERED GLOBALLY FROM THE HEART OF INDIA';
  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroScene}>
        <div className={`${styles.parallaxLayer} ${styles.layer1}`} ref={el => parallaxLayersRef.current[0] = el}>
          <img src="/products/black-pepper.png" alt="Black Pepper" />
        </div>
        <div className={`${styles.parallaxLayer} ${styles.layer2}`} ref={el => parallaxLayersRef.current[1] = el}>
          <img src="/products/cardamom.png" alt="Green Cardamom" />
        </div>
        <div className={`${styles.parallaxLayer} ${styles.layer3}`} ref={el => parallaxLayersRef.current[2] = el}>
          <img src="/products/star-anise.png" alt="Star Anise" />
        </div>
        <div className={`${styles.parallaxLayer} ${styles.layer4}`} ref={el => parallaxLayersRef.current[3] = el}>
          <img src="/products/cinnamon.png" alt="Cinnamon" />
        </div>
        
        <div className={styles.heroCenterImg} ref={heroCenterImgRef}>
          <img src="/products/cumin-packed.png" alt="P-KOT Cumin Pouch" />
          <div className={styles.centerGlow}></div>
        </div>
      </div>

      <div className={styles.heroOverlay}></div>
      <div className={styles.heroBottomGradient}></div>
      <div className={styles.grain}></div>

      <div className={`${styles.heroContent} ${isFlash ? 'currencyFlash' : ''}`} ref={heroContentRef}>
        <div ref={titleRef}>
          <AnimatedTitle />
        </div>
        <p className={styles.heroSubtitle} ref={subtitleRef}>
          {subtitle}
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
