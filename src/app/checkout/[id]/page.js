'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { IoLocationOutline, IoPersonOutline, IoCallOutline, IoChevronBack } from 'react-icons/io5';
import { HiArrowLongRight } from 'react-icons/hi2';
import { Minus, Plus } from 'lucide-react';
import styles from '../checkout.module.css';
import { useCurrency } from '@/context/CurrencyContext';
import Header from '@/components/common/Header';
import MenuOverlay from '@/components/common/MenuOverlay';

import { Suspense } from 'react';

function CheckoutContent() {
  const { currency } = useCurrency();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const product = products.find((p) => p.id === params.id);

  const weight = searchParams.get('w') || '1kg';
  const [quantity, setQuantity] = useState(parseInt(searchParams.get('q') || '1'));

  const [menuOpen, setMenuOpen] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    const handleScroll = () => setHeaderActive(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return <div className={styles.checkoutMain}>Product not found</div>;
  }

  const basePrice = currency === 'INR' ? product.priceINR : product.priceUSD;
  const weightFactor = weight === '100g' ? 0.1 :
    weight === '250g' ? 0.25 :
      weight === '500g' ? 0.5 :
        weight === '1kg' ? 1 :
          weight === '5kg' ? 5 : 1;

  const unitPrice = parseFloat(basePrice.replace(/,/g, '')) * weightFactor;
  const totalPriceRaw = (unitPrice * quantity).toFixed(currency === 'INR' ? 0 : 2);
  const formattedPrice = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(totalPriceRaw);
  const symbol = currency === 'INR' ? '₹' : '$';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'pincode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const separator = '----------------------------------';
    const messageText =
      `*P-KOT SPICES - NEW ORDER*\n` +
      `${separator}\n\n` +
      `*PRODUCT DETAILS*\n` +
      `*Item:* ${product.name}\n` +
      `*Quantity:* ${quantity} x ${weight}\n` +
      `*Total Price:* ${symbol}${formattedPrice}\n\n` +
      `*DELIVERY DETAILS*\n` +
      `*Customer:* ${formData.name}\n` +
      `*Contact:* ${formData.phone}\n` +
      `*Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n\n` +
      `${separator}\n` +
      `_Please confirm this order and provide payment details._`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/919645067995?text=${encodedMessage}`, '_blank');

    // Reset loading state after a delay or keep it if navigation is expected
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <main className={styles.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Background Decorative Elements */}
      <div className={styles.meshGradient}></div>

      <div className={styles.container}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <IoChevronBack /> BACK TO PRODUCT
        </button>

        <div className={styles.checkoutContainer}>
          <div className={styles.checkoutHeader}>
            <div className={styles.badge}>
              <span className={styles.dot}></span> SECURE CHECKOUT
            </div>
            <h1>Complete Your <span>Order</span></h1>
            <p>Confirm your delivery details to proceed via WhatsApp.</p>
          </div>

          <div className={styles.checkoutGrid}>
            {/* Left: Form */}
            <form className={styles.addressForm} onSubmit={handleSubmit}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <div className={styles.inputWrapper}>
                    <IoPersonOutline className={styles.fieldIcon} />
                    <input type="text" name="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange} spellCheck={false} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <div className={styles.inputWrapper}>
                    <IoCallOutline className={styles.fieldIcon} />
                    <input type="tel" name="phone" placeholder="Phone number" required value={formData.phone} onChange={handleChange} spellCheck={false} />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Delivery Address</label>
                <div className={styles.inputWrapper}>
                  <IoLocationOutline className={styles.fieldIcon} />
                  <textarea name="address" placeholder="Street, locality, house number..." required value={formData.address} onChange={handleChange} spellCheck={false}></textarea>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>City / State</label>
                  <input type="text" name="city" placeholder={currency === 'INR' ? "e.g. Mumbai, MH" : "e.g. London, UK"} required value={formData.city} onChange={handleChange} spellCheck={false} />
                </div>
                <div className={styles.inputGroup}>
                  <label>{currency === 'INR' ? "Pincode" : "Postcode"}</label>
                  <input type="text" name="pincode" placeholder={currency === 'INR' ? "000 000" : "SW1A 1AA"} required value={formData.pincode} onChange={handleChange} spellCheck={false} />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className={styles.premiumLoader}>
                    <div className={styles.shimmerDot}></div>
                    <span className={styles.loaderText}>CONFIRMING ORDER</span>
                    <div className={styles.shimmerDot}></div>
                  </div>
                ) : (
                  <>
                    PROCEED <HiArrowLongRight size={24} />
                  </>
                )}
              </button>
            </form>

            {/* Right: Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.productBrief}>
                <div className={styles.productImgWrapper}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productText}>
                  <h3>{product.name}</h3>
                  <div className={styles.quantityCounter}>
                    <button 
                      type="button"
                      className={styles.counterBtn} 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className={styles.quantityDisplay}>{quantity}</span>
                    <button 
                      type="button"
                      className={styles.counterBtn} 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <span className={styles.weightLabel}>{weight}</span>
                  </div>
                </div>
              </div>

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>{symbol}{formattedPrice}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Shipping</span>
                  <span className={styles.free}>FREE</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.finalPrice}>{symbol}{formattedPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className={styles.checkoutMain}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
