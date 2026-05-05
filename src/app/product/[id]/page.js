'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import styles from './page.module.css';

// Mock data database for demonstration
const productsDb = {
  'premium-blend': {
    title: 'Premium Spice Blend',
    price: '$24.00',
    description: 'Hand-pounded and perfectly balanced for an authentic, rich taste. Perfect for curries and traditional marinades. This master blend brings together 15 distinct whole spices roasted to perfection, creating a symphony of warmth and complex flavor notes that will elevate any dish.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
    origin: 'Kerala, India',
    process: 'Stone-Ground',
    tastingNotes: 'Warm, Earthy, Complex',
    weight: '250g'
  },
  'whole-heritage': {
    title: 'Whole Heritage Spices',
    price: '$28.00',
    description: 'Sourced directly from our finest partner plantations, ensuring every pod and seed holds its maximum natural aroma. These whole spices have been carefully hand-selected for their size, oil content, and flawless appearance. Perfect for infusing oils, broths, and slow-cooked masterpieces.',
    image: 'https://images.unsplash.com/photo-1564149504298-00c351fd7f16?q=80&w=1200&auto=format&fit=crop',
    origin: 'Malabar Coast',
    process: 'Sun-Dried',
    tastingNotes: 'Aromatic, Pungent, Fresh',
    weight: '150g'
  }
};

export default function ProductPage({ params }) {
  // Unwrap params using React.use() as required in Next.js 15+ for async segments
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const product = productsDb[productId] || productsDb['premium-blend'];

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backBtn}>
        <ArrowLeft size={18} /> Back to Collection
      </Link>

      <div className={styles.productContainer}>
        <div className={styles.imageCol}>
          <img src={product.image} alt={product.title} className={styles.productImage} />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.productBreadcrumb}>P-KOT Spices Collection</div>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <div className={styles.productPrice}>{product.price}</div>
          
          <p className={styles.productDesc}>{product.description}</p>
          
          <div className={styles.divider}></div>
          
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <h4>Origin</h4>
              <p>{product.origin}</p>
            </div>
            <div className={styles.metaItem}>
              <h4>Process</h4>
              <p>{product.process}</p>
            </div>
            <div className={styles.metaItem}>
              <h4>Tasting Notes</h4>
              <p>{product.tastingNotes}</p>
            </div>
            <div className={styles.metaItem}>
              <h4>Net Weight</h4>
              <p>{product.weight}</p>
            </div>
          </div>
          
          <button className={styles.addToCartBtn}>
            <ShoppingBag size={20} /> Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
