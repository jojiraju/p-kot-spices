'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function CurrencySwitcher() {
  const { currency, toggleCurrency } = useCurrency();
  const containerRef = useRef(null);

  const handleSwitch = (type) => {
    if (type === currency) return;
    
    // Switcher pop animation
    gsap.fromTo(containerRef.current, 
      { scale: 0.95 }, 
      { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.5)' }
    );
    
    toggleCurrency(type);
  };

  return (
    <div className="currencyContainer" ref={containerRef}>
      <div className={`currencySlider ${currency === 'USD' ? 'isRight' : ''}`}></div>
      <button 
        className={`currencyBtn ${currency === 'INR' ? 'active' : ''}`}
        onClick={() => handleSwitch('INR')}
      >
        IND
      </button>
      <button 
        className={`currencyBtn ${currency === 'USD' ? 'active' : ''}`}
        onClick={() => handleSwitch('USD')}
      >
        UK
      </button>
    </div>
  );
}

