'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import { whatsappUrl } from '@/data/contact';
import Link from 'next/link';
import { ChevronLeft, Scale, Package, Truck, Leaf, MessageCircle } from 'lucide-react';
import { HiShoppingBag } from 'react-icons/hi2';
import styles from './product.module.css';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { useCurrency } from '@/context/CurrencyContext';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';
import Footer from '@/components/common/Footer';
import { isHtml, safeHtml } from '@/lib/richText';
import { Minus, Plus } from 'lucide-react';
import { sellOptions, lowStockNote } from '@/lib/stock';


// CMS text is HTML from the rich-text editor; older plain text is shown as before.
function Rich({ text, className }) {
  if (!text) return null;
  const cls = `${styles.richText} ${className || ''}`;
  return isHtml(text)
    ? <div className={cls} dangerouslySetInnerHTML={{ __html: safeHtml(text) }} />
    : <p className={className}>{text}</p>;
}

export default function ProductDetail() {
  const { currency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const params = useParams();
  const { products, weights: weightOptions, loading } = useProducts();
  const product = products.find((p) => p.id === params.id);
  const containerRef = useRef(null);
  const imageSectionRef = useRef(null);
  const contentSectionRef = useRef(null);
  const router = useRouter();
  const [requestedQty, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      setHeaderActive(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The options come from the CMS; fall back to 1kg (or the first option) when nothing is chosen or the choice was removed.
  const [selectedLabel, setSelectedLabel] = useState(null);
  // Loose items offer the CMS weights at a per-kg price; packed items (pickles) offer their own sizes and prices.
  const options = product ? sellOptions(product, weightOptions, currency) : [];
  const preferredWeight = options.find((o) => o.label === selectedLabel)
    || options.find((o) => o.label === '1kg')
    || options[0];
  // A size that is out of stock gives way to the largest one that is still available.
  const selectedWeight = !preferredWeight || preferredWeight.max >= 1
    ? preferredWeight
    : [...options].reverse().find((o) => o.max >= 1) || preferredWeight;
  const [activeImage, setActiveImage] = useState(product?.image);

  // Initial entrance animation
  useGSAP(() => {
    if (!product || !imageSectionRef.current || !contentSectionRef.current) return;
    
    const isMobile = window.innerWidth <= 1024;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(imageSectionRef.current, 
      { opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : -30 }, 
      { opacity: 1, y: 0, x: 0, duration: 1.2 }
    )
    .fromTo(contentSectionRef.current, 
      { opacity: 0, y: 30, x: isMobile ? 0 : 30 }, 
      { opacity: 1, y: 0, x: 0, duration: 1.2 }, 
      '-=1'
    );
  }, [product]);


  // Handle only image switch animation
  useGSAP(() => {
    if (!activeImage) return;
    
    gsap.fromTo(`.${styles.detailImage}`, 
      { opacity: 0, scale: 1.05 }, 
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
  }, [activeImage]);


  if (!product) {
    if (loading) return <div className={styles.notFound}><h1>Loading…</h1></div>;
    return (
      <div className={styles.notFound}>
        <h1>Product Not Found</h1>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  const soldOut = product.inStock === false || !options.some((o) => o.max >= 1);
  const maxQty = Math.max(1, selectedWeight.max);
  const quantity = Math.min(requestedQty, maxQty);

  const unitPrice = selectedWeight.unitPrice;
  const totalPriceRaw = (unitPrice * quantity).toFixed(currency === 'INR' ? 0 : 2);
  const formattedPrice = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(unitPrice.toFixed(currency === 'INR' ? 0 : 2));
  const formattedTotalPrice = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(totalPriceRaw);

  const symbol = currency === 'INR' ? '₹' : '$';

  const whatsappLink = whatsappUrl(`Hi P-KOT Spices, I want to buy ${product.name}. \nQuantity: ${selectedWeight.label} \nTotal Price: ${symbol}${formattedPrice} \nPlease provide payment details.`);

  const lowNote = !soldOut ? lowStockNote(selectedWeight) : '';
  const hasInfo = product.description || product.details || product.features?.length || product.usage || product.benefits;

  return (
    <main className={styles.productDetailMain} ref={containerRef}>
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header
        headerActive={headerActive}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <div className={styles.pageWrap}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ChevronLeft size={18} /> Back
          </button>
          <span className={styles.crumbTrail}>
            <Link href="/products">Products</Link>
            <span>/</span>
            <span className={styles.crumbCurrent}>{product.name}</span>
          </span>
        </nav>

        <div className={styles.productDetailGrid}>
          {/* Left: Image Gallery */}
          <div className={styles.productImageSection} ref={imageSectionRef}>
            <div className={styles.mainImageContainer}>
              <img
                src={activeImage || product.image}
                alt={product.name}
                className={styles.detailImage}
                key={activeImage} // Key for animation
              />
              {soldOut && <span className={styles.soldBadge}>Sold out</span>}
            </div>

            {product.gallery && product.gallery.length > 0 && (
              <div className={styles.thumbnailGallery}>
                {/* Combine main image and gallery, but remove duplicates */}
                {[product.image, ...product.gallery]
                  .filter((img, idx, self) => self.indexOf(img) === idx)
                  .map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`${styles.thumbnailWrapper} ${activeImage === img || (!activeImage && idx === 0) ? styles.activeThumb : ''}`}
                    onClick={() => setActiveImage(img)}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className={styles.productContentSection} ref={contentSectionRef}>
            <div className={styles.productHeader}>
              <div className={styles.metaRow}>
                {product.category && <span className={styles.categoryTag}>{product.category}</span>}
                <span className={`${styles.stockTag} ${soldOut ? styles.stockOut : ''}`}>
                  <span className={styles.stockDot}></span>{soldOut ? 'Out of stock' : 'In stock'}
                </span>
              </div>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <div className={styles.priceTag}>
                {symbol}{formattedPrice} <span className={styles.unitText}>/ {selectedWeight.label}</span>
              </div>
            </div>

            <div className={styles.buyPanel}>
              <div className={styles.selectorSection}>
                <div className={styles.selectorLabel}>
                  <Scale size={16} /> Select size
                </div>
                <div className={styles.weightPicker}>
                  {options.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      className={`${styles.weightBtn} ${selectedWeight.label === opt.label ? styles.active : ''}`}
                      onClick={() => setSelectedLabel(opt.label)}
                      disabled={opt.max < 1}
                      title={opt.max < 1 ? 'Out of stock in this size' : undefined}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {lowNote && <p className={styles.lowNote}>{lowNote}</p>}
              </div>

              <div className={styles.selectorSection}>
                <div className={styles.selectorLabel}>
                  <HiShoppingBag size={16} /> Number of packets
                </div>
                <div className={styles.quantityCounter}>
                  <button
                    type="button"
                    className={styles.counterBtn}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className={styles.quantityDisplay}>{quantity}</span>
                  <button
                    type="button"
                    className={styles.counterBtn}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= maxQty}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className={styles.totalLine}>
                <span>Total</span>
                <strong>{symbol}{formattedTotalPrice}</strong>
              </div>

              <button
                onClick={() => {
                  setIsBuying(true);
                  router.push(`/checkout/${product.id}?w=${selectedWeight.label}&q=${quantity}`);
                }}
                className={styles.whatsappBtn}
                disabled={isBuying || soldOut}
              >
                {soldOut ? (
                  <>OUT OF STOCK</>
                ) : isBuying ? (
                  <div className={styles.premiumLoader}>
                    <div className={styles.shimmerDot}></div>
                    <span className={styles.loaderText}>PREPARING ORDER</span>
                    <div className={styles.shimmerDot}></div>
                  </div>
                ) : (
                  <>
                    <HiShoppingBag size={20} /> BUY NOW — {symbol}{formattedTotalPrice}
                  </>
                )}
              </button>

              <ul className={styles.trustRow}>
                <li><Truck size={16} /> Free shipping</li>
                <li><Leaf size={16} /> Freshly packed</li>
                <li><MessageCircle size={16} /> Order on WhatsApp</li>
              </ul>
            </div>

            {hasInfo && (
              <div className={styles.productDescription}>
                <Rich className={styles.mainDesc} text={product.description} />

                {product.details && (
                  <div className={styles.detailsBox}>
                    <h3><Package size={18} /> Specifications</h3>
                    <p>{product.details}</p>
                  </div>
                )}

                {product.features?.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3>Key highlights</h3>
                    <ul className={styles.featuresList}>
                      {product.features.map((f, i) => (isHtml(f)
                        ? <li key={i} dangerouslySetInnerHTML={{ __html: safeHtml(f) }} />
                        : <li key={i}>{f}</li>))}
                    </ul>
                  </div>
                )}

                {product.usage && (
                  <div className={styles.infoBlock}>
                    <h3>Culinary usage</h3>
                    <Rich text={product.usage} />
                  </div>
                )}

                {product.benefits && (
                  <div className={styles.infoBlock}>
                    <h3>Health benefits</h3>
                    <Rich text={product.benefits} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
