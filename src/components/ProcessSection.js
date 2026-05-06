'use client';
import styles from '../app/page.module.css';

const steps = [
  {
    number: '01',
    title: 'Sourcing',
    desc: 'Directly from heritage plantations in Idukki and Malabar.'
  },
  {
    number: '02',
    title: 'Selection',
    desc: 'Only the boldest grains pass our 24-point quality check.'
  },
  {
    number: '03',
    title: 'Grinding',
    desc: 'Stone-ground at low temperatures to preserve essential oils.'
  },
  {
    number: '04',
    title: 'Packaging',
    desc: 'Small-batch sealed to ensure maximum aroma and freshness.'
  }
];

export default function ProcessSection() {
  return (
    <section className={styles.processSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>OUR <span>PURITY</span> PROCESS</h2>
          <p className={styles.sectionSubtitle}>Science meets tradition in our relentless pursuit of flavor.</p>
        </div>

        <div className={styles.processGrid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.processStep}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
