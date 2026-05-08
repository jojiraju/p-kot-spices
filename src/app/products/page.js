'use client';

import { useEffect, useRef, useState } from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { HiShoppingBag } from 'react-icons/hi2';
import styles from './products.module.css';
import gsap from 'gsap';
import { useCurrency } from '@/context/CurrencyContext';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';

export default function ProductsPage() {
  const { currency } = useCurrency();
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderActive(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate grid items when category changes
    const validCards = cardsRef.current.filter(el => el !== null);
    if (validCards.length > 0) {
      gsap.fromTo(validCards, 
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', overwrite: true }
      );
    }
  }, [activeCategory, filteredProducts]);

  return (
    <main className={styles.productsMain}>
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header 
        headerActive={headerActive} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
      />

      <section className={styles.collectionHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.label}><Sparkles size={14} /> THE HERITAGE COLLECTION</span>
            <h1 className={styles.title}>Nature's Finest <span>Spices</span></h1>
            
            <div className={styles.filterBar}>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className="container">
          <div className={styles.productsGrid} ref={gridRef}>
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={styles.productCard}
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <Link href={`/product/${product.id}`} className={styles.imageLink}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={styles.productImage} 
                      onError={(e) => {
                        // Fallback to raw spice image if packed image is missing
                        if (product.image.includes('-packed')) {
                          e.target.src = product.image.replace('-packed', '');
                        }
                      }}
                    />
                    <div className={styles.categoryBadge}>{product.category}</div>
                    <div className={styles.packagingBadge}>
                      <Sparkles size={10} /> PREMIUM PACK
                    </div>
                    <div className={styles.overlay}>
                      <span>VIEW DETAILS</span>
                    </div>
                  </div>
                </Link>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div className={styles.price}>
                      {currency === 'INR' ? `₹${product.priceINR}` : `$${product.priceUSD}`}
                    </div>
                  </div>
                  <p className={styles.productDesc}>{product.description}</p>
                  
                  <div className={styles.cardActions}>
                    <Link 
                      href={`/checkout/${product.id}?w=1kg&q=1`}
                      className={styles.buyBtn}
                    >
                      <HiShoppingBag size={18} /> BUY NOW
                    </Link>
                    <Link href={`/product/${product.id}`} className={styles.detailsBtn}>
                      DETAILS <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} P-KOT Spices. Authenticity in every grain.</p>
        </div>
      </footer>

    </main>
  );
}
