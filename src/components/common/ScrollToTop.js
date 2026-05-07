'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import styles from './Common.module.css';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const CIRCUMFERENCE = 188.5; // 2 * PI * 30

  useEffect(() => {
    let requestRef;

    const updateProgress = () => {
      const scrolled = window.scrollY;
      const threshold = 300;
      
      // Handle visibility state
      if (scrolled > threshold && !isVisible) {
        setIsVisible(true);
      } else if (scrolled <= threshold && isVisible) {
        setIsVisible(false);
      }

      // Calculate progress
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - winHeight;
      
      if (totalScrollable > 0 && progressRef.current) {
        const percentage = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        const offset = CIRCUMFERENCE - (percentage * CIRCUMFERENCE);
        progressRef.current.style.strokeDashoffset = offset;
      }

      requestRef = requestAnimationFrame(updateProgress);
    };

    requestRef = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(requestRef);
  }, [isVisible]);

  // GSAP Entrance/Exit Animation
  useEffect(() => {
    if (isVisible) {
      gsap.to(containerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        pointerEvents: 'all'
      });
    } else {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.8,
        duration: 0.4,
        ease: 'power2.in',
        pointerEvents: 'none'
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.scrollTopContainer} ref={containerRef} style={{ opacity: 0, transform: 'translateY(20px) scale(0.8)' }}>
      <button 
        className={styles.scrollTopBtn} 
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg className={styles.scrollProgress} viewBox="0 0 64 64">
          <circle 
            ref={progressRef}
            className={styles.progressCircle} 
            cx="32" 
            cy="32" 
            r="30"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>
        <ArrowUp className={styles.arrowIcon} size={24} />
      </button>
    </div>
  );
}
