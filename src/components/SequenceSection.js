'use client';
import styles from '../app/page.module.css';

export default function SequenceSection({ sequenceSectionRef, canvasRef }) {
  return (
    <section className={styles.sequenceSection} ref={sequenceSectionRef}>
      <div className={styles.sequenceLayout}>
        <div className={styles.sequenceCanvasWrapper}>
          <canvas ref={canvasRef} className={styles.sequenceCanvas}></canvas>
          <div className={styles.sequenceCanvasOverlay}></div>
        </div>
        
        <div className={styles.sequenceContentWrapper}>
          <div className={styles.sequenceTextItem}>
            <h2 className={styles.sequenceTitle}>The Awakening.</h2>
            <p className={styles.sequencePara}>Pure heritage, unsealed for the first time. Experience the intense aroma of sun-dried cardamom from the high ranges of Idukki.</p>
          </div>
          
          <div className={styles.sequenceTextItem}>
            <h2 className={styles.sequenceTitle}>Stone Ground.</h2>
            <p className={styles.sequencePara}>Preserving essential oils for maximum aroma. Our traditional cold-grinding technique ensures that every grain retains its soul.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
