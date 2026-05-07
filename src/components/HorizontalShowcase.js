'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../app/page.module.css';

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    type: 'video',
    src: '/plantation-view.mp4',
    title: 'THE TERROIR',
    desc: 'High-altitude plantations in the heart of the Western Ghats.'
  },
  {
    type: 'video',
    src: '/sorting-spices.mp4',
    title: 'ARTISANAL SORTING',
    desc: 'Meticulous hand-sorting ensures only premium grade spices reach you.'
  },
  {
    type: 'image',
    src: '/spices-spectrum.png',
    title: 'A SPECTRUM OF FLAVOR',
    desc: 'A vibrant collection of pure, unadulterated spices.'
  },
  {
    type: 'video',
    src: '/quality-check.mp4',
    title: 'RIGOROUS QUALITY',
    desc: 'Every batch undergoes strict sensory and laboratory testing.'
  },
  {
    type: 'image',
    src: '/packaging-01.jpg',
    title: 'PREMIUM PACKAGING',
    desc: 'Sustainable, aroma-lock packaging to preserve essence.'
  }
];

export default function HorizontalShowcase() {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const updateScroll = () => {
        if (!scrollRef.current) return;
        const scrollWidth = scrollRef.current.offsetWidth;
        const amountToScroll = scrollWidth - window.innerWidth;

        const horizontalTween = gsap.to(scrollRef.current, {
          x: -amountToScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${amountToScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            pinSpacing: true,
          }
        });

        // Parallax and entrance for items
        const items = gsap.utils.toArray(`.${styles.horizontalItem}`);
        items.forEach((item) => {
          const media = item.querySelector(`.${styles.horizontalMediaWrapper} img, .${styles.horizontalMediaWrapper} video`);
          
          gsap.fromTo(media, 
            { x: '-15%' },
            { 
              x: '15%',
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                containerAnimation: horizontalTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              }
            }
          );
        });
      };

      // Initial call after a brief delay to ensure content is measured
      setTimeout(updateScroll, 100);
      window.addEventListener('resize', updateScroll);

      return () => {
        window.removeEventListener('resize', updateScroll);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className={styles.horizontalShowcase} ref={containerRef}>
      <div className={styles.horizontalScroll} ref={scrollRef}>
        <div className={styles.horizontalHeader}>
          <h2 className={styles.horizontalTitle}>THE <span>EXPEDITION</span> CONTINUES</h2>
          <p className={styles.horizontalSubtitle}>FOLLOW THE JOURNEY FROM SEED TO SEAL.</p>
        </div>

        {showcaseItems.map((item, index) => (
          <div key={index} className={styles.horizontalItem}>
            <div className={styles.horizontalMediaWrapper}>
              {item.type === 'video' ? (
                <video src={item.src} autoPlay muted loop playsInline />
              ) : (
                <img src={item.src} alt={item.title} />
              )}
              <div className={styles.horizontalMediaContent}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
