'use client';

import { useEffect, useRef, useState } from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import { ChevronLeft, MessageCircle, ChevronRight, Sparkles, Filter } from 'lucide-react';
import styles from './products.module.css';
import gsap from 'gsap';

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  useEffect(() => {
    // Animate grid items when category changes
    gsap.fromTo(cardsRef.current, 
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', overwrite: true }
    );
  }, [activeCategory, filteredProducts]);

  return (
    <main className={styles.productsMain}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <Link href="/">
            <img src="/logo.png" alt="P-KOT Spices" className={styles.logoImage} />
          </Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/" className={styles.backHomeBtn}>
            <ChevronLeft size={18} /> BACK
          </Link>
        </div>
      </header>

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
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                    <div className={styles.categoryBadge}>{product.category}</div>
                    <div className={styles.overlay}>
                      <span>VIEW DETAILS</span>
                    </div>
                  </div>
                </Link>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div className={styles.price}>₹{product.price}</div>
                  </div>
                  <p className={styles.productDesc}>{product.description}</p>
                  
                  <div className={styles.cardActions}>
                    <a 
                      href={`https://wa.me/919645067995?text=${encodeURIComponent(`Hi P-KOT Spices, I want to buy ${product.name} (₹${product.price}). Please provide more details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buyBtn}
                    >
                      <MessageCircle size={18} /> BUY NOW
                    </a>
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
