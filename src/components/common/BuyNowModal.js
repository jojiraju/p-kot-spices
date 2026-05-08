'use client';
import { useState, useEffect, useRef } from 'react';
import { IoClose, IoLocationOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { HiArrowLongRight } from 'react-icons/hi2';
import styles from './BuyNowModal.module.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useCurrency } from '@/context/CurrencyContext';



export default function BuyNowModal({ isOpen, onClose, product, selectedWeight, quantity, totalPrice, currencySymbol }) {
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({

    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Clear form when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
      });
    }
  }, [isOpen]);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyStyle = window.getComputedStyle(document.body).overflow;
      const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalBodyStyle;
        document.documentElement.style.overflow = originalHtmlStyle;
      };
    }
  }, [isOpen]);


  useGSAP(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 });
    }
  }, [isOpen]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone and pincode, allow only numbers
    if (name === 'phone' || name === 'pincode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const separator = '----------------------------------';

    const messageText = 
      `*P-KOT SPICES - NEW ORDER*\n` +
      `${separator}\n\n` +
      `*PRODUCT DETAILS*\n` +
      `*Item:* ${product.name}\n` +
      `*Quantity:* ${quantity} x ${selectedWeight.label}\n` +
      `*Total Price:* ${currencySymbol}${totalPrice}\n\n` +
      `*DELIVERY DETAILS*\n` +
      `*Customer:* ${formData.name}\n` +
      `*Contact:* ${formData.phone}\n` +
      `*Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n\n` +
      `${separator}\n` +
      `_Please confirm this order and provide payment details._`;


    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/919645067995?text=${encodedMessage}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} ref={overlayRef}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} ref={modalRef}>

        <button className={styles.closeBtn} onClick={onClose}>
          <IoClose size={24} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.badge}>
            <span className={styles.dot}></span> SECURE CHECKOUT
          </div>
          <h2>Complete Your <span>Order</span></h2>
          <p>Confirm your delivery details to proceed via WhatsApp.</p>
        </div>


        <div className={styles.modalGrid}>
          {/* Summary Section */}
          <div className={styles.summaryCard}>
            <div className={styles.productBrief}>
              <div className={styles.productImgWrapper}>
                <img src={product.image} alt={product.name} />
              </div>
              <div className={styles.productText}>
                <h3>{product.name}</h3>
                <p>{quantity} x {selectedWeight.label}</p>
              </div>
            </div>
            
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span>Subtotal</span>
                <span>{currencySymbol}{totalPrice}</span>
              </div>
              <div className={styles.priceRow}>
                <span>Shipping</span>
                <span className={styles.free}>FREE</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span className={styles.finalPrice}>{currencySymbol}{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form className={styles.addressForm} onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrapper}>
                  <IoPersonOutline className={styles.fieldIcon} />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter your name" 
                    required 
                    spellCheck={false}
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <div className={styles.inputWrapper}>
                  <IoCallOutline className={styles.fieldIcon} />
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="WhatsApp number" 
                    required 
                    spellCheck={false}
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Delivery Address</label>
              <div className={styles.inputWrapper}>
                <IoLocationOutline className={styles.fieldIcon} />
                <textarea 
                  name="address" 
                  placeholder="Street, locality, house number..." 
                  required 
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>City / State</label>
                <input 
                  type="text" 
                  name="city" 
                  placeholder={currency === 'INR' ? "e.g. Mumbai, MH" : "e.g. London, UK"} 
                  required 
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>{currency === 'INR' ? "Pincode" : "Postcode"}</label>
                <input 
                  type="text" 
                  name="pincode" 
                  placeholder={currency === 'INR' ? "000 000" : "SW1A 1AA"} 
                  required 
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>


            <button type="submit" className={styles.submitBtn}>
              PROCEED <HiArrowLongRight size={24} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
