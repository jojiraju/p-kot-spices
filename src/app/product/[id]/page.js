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
  const [activeImage, setActiveImage] = useState(product?.image);

  // Initial entrance animation
  useEffect(() => {
    if (!product) return;
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(`.${styles.productImageSection}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2 })
      .fromTo(`.${styles.productContentSection}`, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.2 }, '-=1')
      .fromTo(`.${styles.backBtn}`, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.8');
  }, [product]);

  // Handle only image switch animation
  useEffect(() => {
    if (!activeImage) return;
    
    gsap.fromTo(`.${styles.detailImage}`, 
      { opacity: 0, scale: 1.05 }, 
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
  }, [activeImage]);

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
        {/* Left: Image Gallery */}
        <div className={styles.productImageSection}>
          <div className={styles.mainImageContainer}>
            <img 
              src={activeImage || product.image} 
              alt={product.name} 
              className={styles.detailImage} 
              key={activeImage} // Key for animation
            />
            <div className={styles.imageOverlay}></div>
          </div>
          
          {product.gallery && product.gallery.length > 0 && (
            <div className={styles.thumbnailGallery}>
              {/* Combine main image and gallery, but remove duplicates */}
              {[product.image, ...product.gallery]
                .filter((img, idx, self) => self.indexOf(img) === idx)
                .map((img, idx) => (
                <div 
                  key={idx}
                  className={`${styles.thumbnailWrapper} ${activeImage === img || (!activeImage && idx === 0) ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${idx}`} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
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
