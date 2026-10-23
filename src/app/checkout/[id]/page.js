'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { useProducts } from '@/context/ProductsContext';
import { whatsappUrl } from '@/data/contact';
import { saveOrder } from '@/lib/orders';
import toast from 'react-hot-toast';
import { IoLocationOutline, IoPersonOutline, IoCallOutline, IoChevronBack, IoBusinessOutline, IoMapOutline, IoShieldCheckmarkOutline, IoAlertCircleOutline, IoLogoWhatsapp, IoCubeOutline } from 'react-icons/io5';
import { HiArrowLongRight } from 'react-icons/hi2';
import { Minus, Plus } from 'lucide-react';
import { sellOptions, lowStockNote, discountPercent } from '@/lib/stock';
import { buildOrderMessage } from '@/lib/orderMessage';
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
  const { products, weights, loading } = useProducts();
  const product = products.find((p) => p.id === params.id);
  // Declared before the early return below so hook order stays stable when a CMS product arrives late.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedMessage, setPlacedMessage] = useState('');

  const weight = searchParams.get('w') || '1kg';
  const [requestedQty, setQuantity] = useState(parseInt(searchParams.get('q') || '1') || 1);

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

  // Orders belong to a customer account, so they can follow them under My Orders.
  const { user, loading: authLoading, configured: authOn } = useAuth();
  const pathname = usePathname();
  const here = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  useEffect(() => {
    if (!user) return;
    if (user.displayName) setFormData((f) => (f.name ? f : { ...f, name: user.displayName }));
    // The mobile number given at sign-up (email accounts) fills the phone field.
    const db = getDb();
    if (db) {
      getDoc(doc(db, 'users', user.uid))
        .then((s) => s.exists() && s.data().phone && setFormData((f) => (f.phone ? f : { ...f, phone: s.data().phone })))
        .catch(() => {});
    }
  }, [user]);

  const statusScreen = (title, message) => (
    <main className={styles.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={styles.meshGradient}></div>
      <div className={styles.container}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}><IoAlertCircleOutline /></div>
          <h1>{title}</h1>
          <p>{message}</p>
          <div className={styles.statusActions}>
            <Link href="/products" className={styles.primaryLink}>Browse products</Link>
            <button type="button" onClick={() => router.back()} className={styles.ghostLink}>Go back</button>
          </div>
        </div>
      </div>
    </main>
  );

  if (authOn && authLoading) return <div className={styles.checkoutMain}><p className={styles.loadingText}>Loading...</p></div>;
  if (authOn && !user) {
    return (
      <main className={styles.checkoutMain}>
        <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.meshGradient}></div>
        <div className={styles.container}>
          <div className={styles.statusCard}>
            <div className={styles.statusIcon}><IoPersonOutline /></div>
            <h1>Sign in to order</h1>
            <p>Create a free account or sign in so you can follow your order and its status any time.</p>
            <div className={styles.statusActions}>
              <Link href={`/login?next=${encodeURIComponent(here)}`} className={styles.primaryLink}>Sign in or create account</Link>
              <button type="button" onClick={() => router.back()} className={styles.ghostLink}>Go back</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Order sent: replace the form with a confirmation so it can't be submitted twice.
  if (placedMessage) {
    return (
      <main className={styles.checkoutMain}>
        <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={styles.meshGradient}></div>
        <div className={styles.container}>
          <div className={styles.statusCard}>
            <div className={styles.statusIcon}><IoShieldCheckmarkOutline /></div>
            <h1>Thank you, {formData.name.split(' ')[0] || 'friend'}!</h1>
            <p>Your order has been placed. Please confirm it on WhatsApp and we&apos;ll share the payment details and delivery update there.</p>
            <div className={styles.statusActions}>
              <Link href="/products" className={styles.primaryLink}>Continue shopping</Link>
              <a href={whatsappUrl(placedMessage)} target="_blank" rel="noopener noreferrer" className={styles.ghostLink}>Open WhatsApp again</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return loading
      ? <div className={styles.checkoutMain}><p className={styles.loadingText}>Loading...</p></div>
      : statusScreen('Product not found', 'We could not find the product you are looking for. It may have been removed.');
  }
  if (product.inStock === false) {
    return statusScreen(`${product.name} is out of stock`, 'This item is currently unavailable. Please check back soon, or explore our other spices and pickles.');
  }

  const option = sellOptions(product, weights, currency).find((o) => o.label === weight);
  // The CMS re-checks stock when the order is confirmed.
  if (!option || option.max < 1) {
    return statusScreen('Size not available', `${product.name} (${weight}) is not available right now. Please go back and choose another size.`);
  }
  const maxQty = Math.max(1, option.max);
  const quantity = Math.min(requestedQty, maxQty);

  const unitPrice = option.unitPrice;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const messageText = buildOrderMessage({
      product,
      label: weight,
      quantity,
      unitPrice,
      originalPrice: option.originalPrice,
      percent: discountPercent(product),
      currency,
      customer: formData,
    });

    // Start saving to the CMS and open WhatsApp straight away (a popup opened after an await can be blocked).
    const saving = saveOrder({ product, weight, quantity, currency, total: totalPriceRaw, unitPrice, originalTotal: option.originalPrice * quantity, discountPercent: discountPercent(product), uid: user?.uid, email: user?.email, ...formData });
    window.open(whatsappUrl(messageText), '_blank');

    let paymentPath = '';
    try {
      const saved = await saving;
      toast.success('Order placed! Please confirm it on WhatsApp.');
      paymentPath = `/pay/${saved.id}`;
    } catch (err) {
      console.error(err);
      toast.error('Your order could not be recorded, but you can still send it on WhatsApp.');
    } finally {
      setIsSubmitting(false);
      if (paymentPath) {
        // Show the QR code and bank details for this order right away.
        router.push(paymentPath);
      } else {
        // WhatsApp is already open either way, so don't leave the form on screen.
        setPlacedMessage(messageText);
        window.scrollTo({ top: 0 });
      }
    }
  };

  const unitFormatted = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { maximumFractionDigits: currency === 'INR' ? 0 : 2 }).format(unitPrice);

  return (
    <main className={styles.checkoutMain}>
      <Header headerActive={headerActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuOverlay menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className={styles.meshGradient}></div>

      <div className={styles.container}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <IoChevronBack /> Back to product
        </button>

        <div className={styles.checkoutHeader}>
          <div className={styles.badge}>
            <IoShieldCheckmarkOutline /> Secure checkout
          </div>
          <h1>Complete your <span>order</span></h1>
          <p>Share your delivery details and we&apos;ll confirm everything with you on WhatsApp.</p>
        </div>

        <div className={styles.checkoutGrid}>
          {/* Left: Form */}
          <form className={styles.addressForm} onSubmit={handleSubmit}>
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}><span className={styles.step}>1</span> Contact details</h2>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full name</label>
                  <div className={styles.inputWrapper}>
                    <IoPersonOutline className={styles.fieldIcon} />
                    <input id="name" type="text" name="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange} spellCheck={false} autoComplete="name" />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone number</label>
                  <div className={styles.inputWrapper}>
                    <IoCallOutline className={styles.fieldIcon} />
                    <input id="phone" type="tel" name="phone" placeholder="Phone number" required value={formData.phone} onChange={handleChange} spellCheck={false} autoComplete="tel" />
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}><span className={styles.step}>2</span> Delivery address</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="address">Address</label>
                <div className={styles.inputWrapper}>
                  <IoLocationOutline className={styles.fieldIcon} />
                  <textarea id="address" name="address" placeholder="Street, locality, house number..." required value={formData.address} onChange={handleChange} spellCheck={false}></textarea>
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="city">City / State</label>
                  <div className={styles.inputWrapper}>
                    <IoBusinessOutline className={styles.fieldIcon} />
                    <input id="city" type="text" name="city" placeholder={currency === 'INR' ? 'e.g. Mumbai, MH' : 'e.g. London, UK'} required value={formData.city} onChange={handleChange} spellCheck={false} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="pincode">{currency === 'INR' ? 'Pincode' : 'Postcode'}</label>
                  <div className={styles.inputWrapper}>
                    <IoMapOutline className={styles.fieldIcon} />
                    <input id="pincode" type="text" name="pincode" placeholder={currency === 'INR' ? '000 000' : 'SW1A 1AA'} required value={formData.pincode} onChange={handleChange} spellCheck={false} autoComplete="postal-code" />
                  </div>
                </div>
              </div>
            </section>

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
          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order summary</h2>

            <div className={styles.productBrief}>
              <div className={styles.productImgWrapper}>
                <img src={product.image} alt={product.name} />
              </div>
              <div className={styles.productText}>
                <h3>{product.name}</h3>
                <p>{symbol}{unitFormatted} per {weight}</p>
                {lowStockNote(option) && <small className={styles.stockNote}>{lowStockNote(option)}</small>}
              </div>
            </div>

            <div className={styles.qtyRow}>
              <span>Quantity</span>
              <div className={styles.quantityCounter}>
                <button type="button" className={styles.counterBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span className={styles.quantityDisplay}>{quantity}</span>
                <button type="button" className={styles.counterBtn} onClick={() => setQuantity(quantity + 1)} disabled={quantity >= maxQty} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Subtotal ({quantity} &times; {weight})</span>
                <span>{symbol}{new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format((option.originalPrice * quantity).toFixed(currency === 'INR' ? 0 : 2))}</span>
              </div>
              {option.originalPrice > unitPrice && (
                <div className={styles.priceRow}>
                  <span>Discount applied</span>
                  <span className={styles.free}>-{symbol}{new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(((option.originalPrice - unitPrice) * quantity).toFixed(currency === 'INR' ? 0 : 2))}</span>
                </div>
              )}
              <div className={styles.priceRow}>
                <span>Shipping</span>
                <span className={styles.free}>FREE</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.finalPrice}>{symbol}{formattedPrice}</span>
              </div>
            </div>

            <ul className={styles.trustList}>
              <li><IoCubeOutline /> Freshly packed after you confirm</li>
              <li><IoLogoWhatsapp /> Payment details shared on WhatsApp</li>
            </ul>
          </aside>
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
