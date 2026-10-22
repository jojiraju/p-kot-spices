'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useProducts } from '@/context/ProductsContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, Sparkles, Search, X, Check, ArrowUpDown } from 'lucide-react';
import { HiShoppingBag } from 'react-icons/hi2';
import styles from './products.module.css';
import gsap from 'gsap';
import { useCurrency } from '@/context/CurrencyContext';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import Footer from '@/components/common/Footer';
import { plainText } from '@/lib/richText';

const CATEGORY_ORDER = {
  'Ground Spices': 1,
  'Whole Spices': 2,
  'Pickles': 3
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'low', label: 'Price: Low to High' },
  { value: 'high', label: 'Price: High to Low' },
];

const sortProducts = (products) => [...products].sort((a, b) => {
  const orderA = CATEGORY_ORDER[a.category] || 99;
  const orderB = CATEGORY_ORDER[b.category] || 99;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return products.indexOf(a) - products.indexOf(b);
});

export default function ProductsPage() {
  const { currency } = useCurrency();
  const { products, categories: cmsCategories, loading } = useProducts();
  const sortedProducts = useMemo(() => sortProducts(products), [products]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  // Every CMS category is listed (even if empty); categories used by a product are always included.
  const categories = ['All', ...new Set([...cmsCategories, ...sortedProducts.map(p => p.category)].filter(Boolean))]
    .sort((a, b) => (CATEGORY_ORDER[a] || (a === 'All' ? 0 : 99)) - (CATEGORY_ORDER[b] || (b === 'All' ? 0 : 99)));
  const counts = Object.fromEntries(categories.map(c => [c, c === 'All' ? sortedProducts.length : sortedProducts.filter(p => p.category === c).length]));

  const filteredProducts = useMemo(() => {
    const priceOf = (p) => parseFloat(String(currency === 'INR' ? p.priceINR : p.priceUSD).replace(/,/g, '')) || 0;
    const q = query.trim().toLowerCase();
    const list = sortedProducts.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      (!q || `${p.name} ${p.category} ${plainText(p.description)}`.toLowerCase().includes(q))
    );
    if (sort === 'low') return [...list].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'high') return [...list].sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [sortedProducts, activeCategory, query, sort, currency]);

  // Close the sort menu on outside click or Escape.
  useEffect(() => {
    if (!sortOpen) return;
    const onDown = (e) => { if (!sortRef.current?.contains(e.target)) setSortOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);

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
            <p className={styles.subtitle}>Hand-picked from the plantations of Kerala, ground and packed with care.</p>

            <div className={styles.filterBar}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  <span className={styles.filterCount}>{counts[cat]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className="container">
          <div className={styles.toolbar}>
            <label className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search our spices..."
                aria-label="Search products"
              />
              {query && (
                <button type="button" className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>

            <span className={styles.resultCount}>
              {loading ? 'Loading...' : <><b>{filteredProducts.length}</b> {filteredProducts.length === 1 ? 'product' : 'products'}</>}
            </span>

            <div className={styles.sortWrap} ref={sortRef}>
              <button
                type="button"
                className={`${styles.sortBtn} ${sortOpen ? styles.sortBtnOpen : ''}`}
                onClick={() => setSortOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <ArrowUpDown size={15} />
                <span>{SORT_OPTIONS.find((o) => o.value === sort).label}</span>
                <ChevronDown size={16} className={styles.sortChevron} />
              </button>
              {sortOpen && (
                <ul className={styles.sortMenu} role="listbox">
                  {SORT_OPTIONS.map((o) => (
                    <li key={o.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === o.value}
                        className={`${styles.sortItem} ${sort === o.value ? styles.sortItemActive : ''}`}
                        onClick={() => { setSort(o.value); setSortOpen(false); }}
                      >
                        {o.label}
                        {sort === o.value && <Check size={15} />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {loading && (
            <div className={styles.productsGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImg} />
                  <div className={styles.skeletonLine} />
                  <div className={`${styles.skeletonLine} ${styles.short}`} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <p className={styles.emptyState}>
              {query ? `No products match "${query}".` : 'New products in this category are coming soon.'}
            </p>
          )}

          <div className={styles.productsGrid} ref={gridRef}>
            {filteredProducts.map((product, index) => {
              const soldOut = product.inStock === false;
              const extra = product.gallery?.length || 0;
              return (
                <div
                  key={product.id}
                  className={`${styles.productCard} ${soldOut ? styles.soldOut : ''}`}
                  ref={(el) => (cardsRef.current[index] = el)}
                >
                  <Link href={`/product/${product.id}`} className={styles.imageLink}>
                    <div className={styles.imageWrapper}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.productImage}
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to raw spice image if packed image is missing
                            if (product.image.includes('-packed')) {
                              e.target.src = product.image.replace('-packed', '');
                            }
                          }}
                        />
                      ) : (
                        <div className={styles.noImage}>P-KOT</div>
                      )}
                      <div className={styles.categoryBadge}>{product.category}</div>
                      {soldOut ? (
                        <div className={styles.stockBadge}>OUT OF STOCK</div>
                      ) : extra > 0 && (
                        <div className={styles.photoCount}>{extra + 1} photos</div>
                      )}
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
                        <small>per {product.unit || 'kg'}</small>
                      </div>
                    </div>
                    <p className={styles.productDesc}>{plainText(product.description)}</p>

                    <div className={styles.cardActions}>
                      {soldOut ? (
                        <button className={styles.buyBtn} disabled>OUT OF STOCK</button>
                      ) : (
                        <button
                          onClick={() => {
                            setLoadingProductId(product.id);
                            router.push(`/checkout/${product.id}?w=1kg&q=1`);
                          }}
                          className={styles.buyBtn}
                          disabled={loadingProductId === product.id}
                        >
                          {loadingProductId === product.id ? (
                            <div className={styles.premiumLoader}>
                              <div className={styles.shimmerDot}></div>
                              <div className={styles.shimmerDot}></div>
                              <div className={styles.shimmerDot}></div>
                            </div>
                          ) : (
                            <>
                              <HiShoppingBag size={18} /> BUY NOW
                            </>
                          )}
                        </button>
                      )}
                      <Link href={`/product/${product.id}`} className={styles.detailsBtn}>
                        DETAILS <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
