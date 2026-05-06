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
            <p className={styles.sequencePara}>Pure heritage, unsealed for the first time. Experience the intense, intoxicating aroma of sun-dried cardamom, hand-picked from the mist-covered high ranges of Idukki. Every seed tells a story of the fertile soil, the tropical rains, and the centuries of tradition that have perfected this timeless flavor.</p>
          </div>
          
          <div className={styles.sequenceTextItem}>
            <h2 className={styles.sequenceTitle}>Stone Ground.</h2>
            <p className={styles.sequencePara}>Preserving essential oils for maximum aroma. Our traditional stone-grinding technique ensures that every grain retains its vital soul. Unlike industrial processing, our cold-grinding method prevents heat from damaging the delicate flavor profiles, delivering the spice in its most potent, natural form.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
