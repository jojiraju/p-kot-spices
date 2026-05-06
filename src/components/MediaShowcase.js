'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

const mediaItems = [
  {
    type: 'video',
    src: '/harvesting-video.mp4',
    title: 'The Harvest',
    desc: 'Direct from the lush plantations of Kerala.',
    size: 'large'
  },
  {
    type: 'image',
    src: '/plantation-01.jpg',
    title: 'Selection',
    desc: 'Only the finest grains pass our quality test.',
    size: 'small'
  },
  {
    type: 'image',
    src: '/harvest-01.jpg',
    title: 'Pure Aroma',
    desc: 'Sealed freshness in every packet.',
    size: 'small'
  },
  {
    type: 'video',
    src: '/grinding-process.mp4',
    title: 'Processing',
    desc: 'Stone-ground to preserve natural oils.',
    size: 'wide'
  }
];

export default function MediaShowcase() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(`.${styles.mediaItem}`);
      
      items.forEach((item, i) => {
        gsap.fromTo(item, 
          { 
            opacity: 0, 
            y: 100,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.mediaShowcase} ref={sectionRef}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>BEYOND THE <span>GRAIN</span></h2>
          <p className={styles.sectionSubtitle}>A glimpse into our heritage and the art of spice crafting.</p>
        </div>

        <div className={styles.mediaGrid} ref={gridRef}>
          {mediaItems.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.mediaItem} ${styles[item.size]}`}
            >
              <div className={styles.mediaWrapper}>
                {item.type === 'video' ? (
                  <video 
                    src={item.src} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className={styles.mediaContent}
                  />
                ) : (
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className={styles.mediaContent} 
                  />
                )}
                <div className={styles.mediaOverlay}>
                  <div className={styles.mediaText}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
