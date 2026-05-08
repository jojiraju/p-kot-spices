'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import Footer from '@/components/common/Footer';
import styles from './about.module.css';
import { Award, Globe, Heart, Shield } from 'lucide-react';

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHeaderActive(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={styles.aboutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.label}>OUR HERITAGE</span>
            <h1 className={styles.title}>The P-KOT <span>Story</span></h1>
            <p className={styles.subtitle}>
              From the ancient spice routes of Kerala to the modern global stage,
              P-KOT Spices carries forward a legacy of uncompromised purity.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <h2>Authenticity in <span>Every Grain</span></h2>
              <p>
                Founded on the principles of integrity and excellence, P-KOT Spices was born from a desire
                to reconnect the world with the true essence of Indian spices. We don't just sell spices;
                we deliver the soul of our soil.
              </p>
              <p>
                Our journey begins in the high-range plantations of Idukki and the Malabar coast, where we
                partner directly with farmers who have tended these lands for centuries. By bypassing
                multiple middle-layers, we ensure that the spices reach you as fresh as they were when harvested.
              </p>
            </div>
            <div className={styles.storyImage}>
              <img src="/plantation-01.jpg" alt="Spice Plantation" />
              <div className={styles.imageOverlay}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Director Section */}
      <section className={styles.directorSection}>
        <div className="container">
          <div className={styles.directorCard}>
            <div className={styles.directorImageWrapper}>
              {/* Replace with actual image provided by user */}
              <img src="/about/jithu-joseph.png" alt="Jithu Joseph" />
            </div>
            <div className={styles.directorInfo}>
              <span className={styles.directorLabel}>DIRECTOR'S MESSAGE</span>
              <h3>Jithu Joseph, <span>MBA</span></h3>
              <p className={styles.quote}>
                "Our commitment is not just to provide spices, but to uphold a tradition of trust.
                At P-KOT, we believe that quality is a responsibility we owe to every kitchen we touch."
              </p>
              <p className={styles.directorBio}>
                With a background in modern business management and a deep-rooted passion for agriculture,
                Jithu Joseph leads P-KOT Spices with a vision to modernize the spice industry while
                preserving its ancient soul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesHeader}>
            <h2>Our Core <span>Values</span></h2>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <Shield size={40} />
              <h4>Purity First</h4>
              <p>Zero additives, zero preservatives, and zero compromises on natural flavor.</p>
            </div>
            <div className={styles.valueCard}>
              <Heart size={40} />
              <h4>Farmer-Centric</h4>
              <p>Supporting sustainable farming communities through fair-trade practices.</p>
            </div>
            <div className={styles.valueCard}>
              <Globe size={40} />
              <h4>Global Standards</h4>
              <p>Meeting and exceeding international quality certifications for every export.</p>
            </div>
            <div className={styles.valueCard}>
              <Award size={40} />
              <h4>Excellence</h4>
              <p>Meticulous sorting and processing to ensure only the finest grades are packed.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
