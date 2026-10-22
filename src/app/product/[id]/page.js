'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import { whatsappUrl } from '@/data/contact';
import Link from 'next/link';
import { ChevronLeft, Scale, Package } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
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
  const selectedWeight = weightOptions.find((w) => w.label === selectedLabel)
    || weightOptions.find((w) => w.label === '1kg')
    || weightOptions[0];
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

  const basePrice = currency === 'INR' ? product.priceINR : product.priceUSD;
  const unitPrice = parseFloat(basePrice.replace(/,/g, '')) * selectedWeight.value;
  const totalPriceRaw = (unitPrice * quantity).toFixed(currency === 'INR' ? 0 : 2);
  const formattedPrice = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(unitPrice.toFixed(currency === 'INR' ? 0 : 2));
  const formattedTotalPrice = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(totalPriceRaw);

  const symbol = currency === 'INR' ? '₹' : '$';

  const whatsappLink = whatsappUrl(`Hi P-KOT Spices, I want to buy ${product.name}. \nQuantity: ${selectedWeight.label} \nTotal Price: ${symbol}${formattedPrice} \nPlease provide payment details.`);

  return (
    <main className={styles.productDetailMain} ref={containerRef}>
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Header 
        headerActive={headerActive} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
      />

      <button onClick={() => router.back()} className={styles.backBtn}>
        <ChevronLeft size={18} /> BACK TO COLLECTION
      </button>

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
        <div className={styles.productContentSection} ref={contentSectionRef}>

          <div className={styles.productHeader}>
            <span className={styles.productId}>PRODUCT 0{products.indexOf(product) + 1}</span>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <div className={styles.priceTag}>
              {currency === 'INR' ? '₹' : '$'}{formattedPrice} <span className={styles.unitText}>/ {selectedWeight.label}</span>
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
                  onClick={() => setSelectedLabel(opt.label)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selectorSection}>
            <div className={styles.selectorLabel}>
              <HiShoppingBag size={16} /> NUMBER OF PACKETS
            </div>
            <div className={styles.quantityCounter}>
              <button 
                className={styles.counterBtn} 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={18} />
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button 
                className={styles.counterBtn} 
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>


          <div className={styles.productDescription}>
            <Rich className={styles.mainDesc} text={product.description} />
            
            <div className={styles.detailsBox}>
              <h3><Package size={18} /> Specifications</h3>
              <p>{product.details}</p>
            </div>

            {product.features && (
              <div className={styles.featuresSection}>
                <h3>KEY HIGHLIGHTS</h3>
                <ul className={styles.featuresList}>
                  {product.features.map((f, i) => (isHtml(f)
                    ? <li key={i} dangerouslySetInnerHTML={{ __html: safeHtml(f) }} />
                    : <li key={i}>{f}</li>))}
                </ul>
              </div>
            )}

            {product.usage && (
              <div className={styles.infoBlock}>
                <h3>CULINARY USAGE</h3>
                <Rich text={product.usage} />
              </div>
            )}

            {product.benefits && (
              <div className={styles.infoBlock}>
                <h3>HEALTH BENEFITS</h3>
                <Rich text={product.benefits} />
              </div>
            )}
          </div>

          <div className={styles.ctaSection}>
            <button 
              onClick={() => {
                setIsBuying(true);
                router.push(`/checkout/${product.id}?w=${selectedWeight.label}&q=${quantity}`);
              }}
              className={styles.whatsappBtn}
              disabled={isBuying || product.inStock === false}
            >
              {product.inStock === false ? (
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
            <p className={styles.ctaNote}>* Prices are calculated based on your selected weight and quantity.</p>
          </div>

        </div>
      </div>
      <Footer />
    </main>

  );
}
