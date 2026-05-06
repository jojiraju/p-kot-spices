'use client';

import { useParams } from 'next/navigation';
import { products } from '@/data/products';
import Link from 'next/link';
import { ChevronLeft, MessageCircle, Scale, Package } from 'lucide-react';
import styles from './product.module.css';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ProductDetail() {
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const containerRef = useRef(null);

  const weightOptions = [
    { label: '100g', value: 0.1 },
    { label: '250g', value: 0.25 },
    { label: '500g', value: 0.5 },
    { label: '1kg', value: 1 },
    { label: '5kg', value: 5 },
  ];

  const [selectedWeight, setSelectedWeight] = useState(weightOptions[3]); // Default 1kg

  useEffect(() => {
    if (!product) return;
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(`.${styles.productImageSection}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1.5 })
      .fromTo(`.${styles.productContentSection}`, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.5 }, '-=1.2')
      .fromTo(`.${styles.backBtn}`, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1 }, '-=1');
  }, [product]);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product Not Found</h1>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  const calculatedPrice = Math.round(parseFloat(product.price.replace(/,/g, '')) * selectedWeight.value);
  const formattedPrice = new Intl.NumberFormat('en-IN').format(calculatedPrice);

  const whatsappLink = `https://wa.me/919645067995?text=${encodeURIComponent(`Hi P-KOT Spices, I want to buy ${product.name}. \nQuantity: ${selectedWeight.label} \nTotal Price: ₹${formattedPrice} \nPlease provide payment details.`)}`;

  return (
    <main className={styles.productDetailMain} ref={containerRef}>
      <Link href="/products" className={styles.backBtn}>
        <ChevronLeft size={20} /> BACK TO COLLECTION
      </Link>

      <div className={styles.productDetailGrid}>
        {/* Left: Image */}
        <div className={styles.productImageSection}>
          <div className={styles.imageContainer}>
            <img src={product.image} alt={product.name} className={styles.detailImage} />
            <div className={styles.imageOverlay}></div>
          </div>
        </div>

        {/* Right: Content */}
        <div className={styles.productContentSection}>
          <div className={styles.productHeader}>
            <span className={styles.productId}>PRODUCT 0{products.indexOf(product) + 1}</span>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.priceTag}>
              ₹{formattedPrice} <span className={styles.unitText}>/ {selectedWeight.label}</span>
            </div>
          </div>

          <div className={styles.selectorSection}>
            <div className={styles.selectorLabel}>
              <Scale size={16} /> SELECT QUANTITY
            </div>
            <div className={styles.weightPicker}>
              {weightOptions.map((opt) => (
                <button
                  key={opt.label}
                  className={`${styles.weightBtn} ${selectedWeight.label === opt.label ? styles.active : ''}`}
                  onClick={() => setSelectedWeight(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.productDescription}>
            <p className={styles.mainDesc}>{product.description}</p>
            <div className={styles.detailsBox}>
              <h3><Package size={18} /> Specifications</h3>
              <p>{product.details}</p>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
              <MessageCircle size={20} /> BUY NOW
            </a>
            <p className={styles.ctaNote}>* Prices are calculated based on your selected weight.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
