'use client';
import { useProducts } from '@/context/ProductsContext';
import Link from 'next/link';
import { HiArrowLongRight } from 'react-icons/hi2';
import styles from '../app/page.module.css';
import { useCurrency } from '@/context/CurrencyContext';
import { cardPrice } from '@/lib/stock';

export default function FeaturedProducts() {
  const { currency } = useCurrency();
  const { products } = useProducts();
  const featured = products.filter((p) => p.inStock !== false).slice(0, 4);

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>THE <span>COLLECTION</span></h2>
          <p className={styles.sectionSubtitle}>Hand-picked gems from our treasure trove of spices.</p>
        </div>

        <div className={styles.productGrid}>
          {featured.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
              <div className={styles.productImageWrapper}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <div className={styles.productOverlay}>
                  <span className={styles.viewDetails}>VIEW DETAILS</span>
                </div>
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productCategory}>{product.category}</span>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>
                  {(() => {
                    const { price, original, percent } = cardPrice(product, currency);
                    const sym = currency === 'INR' ? '₹' : '$';
                    return (
                      <>
                        {sym}{price} / {product.unit}
                        {original !== null && (
                          <>
                            {' '}<s style={{ opacity: 0.55, fontSize: '0.85em' }}>{sym}{original}</s>{' '}
                            <span style={{ color: '#2e7d32', fontSize: '0.8em', fontWeight: 600 }}>{percent}% off</span>
                          </>
                        )}
                      </>
                    );
                  })()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAllWrapper}>
          <Link href="/products" className={styles.viewAllBtn}>
            LIST ALL PRODUCTS <HiArrowLongRight size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}
