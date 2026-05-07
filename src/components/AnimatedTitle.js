import styles from '../app/page.module.css';
import { useCurrency } from '@/context/CurrencyContext';

export default function AnimatedTitle() {
  const { currency } = useCurrency();
  
  const content = currency === 'INR' ? {
    line1: 'Pure',
    accent: 'in',
    line1End: 'Every',
    line2: 'Heart'
  } : {
    line1: 'Tradition',
    accent: 'in',
    line1End: 'Every',
    line2: 'Grain'
  };

  return (
    <div className={styles.heroTitleLayout}>
      <div className={styles.titleLine1}>
        {content.line1} <span className={styles.italicGold}>{content.accent}</span> {content.line1End}
      </div>
      <div className={styles.titleLine2}>{content.line2}</div>
    </div>
  );
}
