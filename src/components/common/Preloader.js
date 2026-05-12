'use client';

import { useState, useEffect } from 'react';
import styles from './Preloader.module.css';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = 'hidden';

    // Ease-out progress simulation
    let currentProgress = 0;
    const targetProgress = 100;
    
    // Animate progress with requestAnimationFrame for smoother update
    let animationFrame;
    let startTime;
    const duration = 2000; // 2 seconds total loading time

    const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      currentProgress = Math.round(easeOutQuart(t) * targetProgress);
      setProgress(currentProgress);

      if (t < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        // Complete
        setIsHiding(true);
        setTimeout(() => {
          setIsUnmounted(true);
          document.body.style.overflow = '';
        }, 800); // Wait for fade out animation
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = '';
    };
  }, []);

  if (isUnmounted) return null;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`${styles.preloader} ${isHiding ? styles.hide : ''}`}>
      <div className={styles.progressContainer}>
        <svg className={styles.progressRing} width="160" height="160">
          <circle
            className={styles.progressRingBackground}
            strokeWidth="2"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <circle
            className={styles.progressRingCircle}
            strokeWidth="2"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className={styles.progressText}>
          {progress}%
        </div>
      </div>
    </div>
  );
}
