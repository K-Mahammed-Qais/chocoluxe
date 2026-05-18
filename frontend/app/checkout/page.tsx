'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { submitSheetOrder } from '@/lib/sheetdb';
import { showToast } from '@/lib/toast';

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [guestMode, setGuestMode] = useState<'guest' | 'account' | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const { items, getCartTotal, clearCart } = useCartStore();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  const total = getCartTotal();
  const grandTotal = total + (deliveryMethod === 'express' ? 15 : 0);

  // Validation
  const isStep1Valid = email.trim() !== '' && (guestMode === 'guest' || password.trim() !== '');
  const isStep2Valid = 
    firstName.trim() !== '' && 
    lastName.trim() !== '' && 
    streetAddress.trim() !== '' && 
    city.trim() !== '' && 
    postalCode.trim() !== '';

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsSubmitting(true);
    const orderId = `CHOC-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create a compact text representation of cart items
    const itemsDescription = items
      .map(item => `${item.name} (${item.quantity}x @ ₹${item.price})`)
      .join(', ');

    const orderData = {
      order_id: orderId,
      email,
      first_name: firstName,
      last_name: lastName,
      street_address: streetAddress,
      apartment: apartment || '',
      city,
      postal_code: postalCode,
      delivery_method: deliveryMethod,
      items: itemsDescription,
      total_price: grandTotal,
      status: 'PENDING' as const
    };

    try {
      const success = await submitSheetOrder(orderData);
      if (success) {
        setGeneratedOrderId(orderId);
        setOrderSuccess(true);
        clearCart();
        showToast('Order placed successfully!', 'success');
      } else {
        showToast('Failed to place order. Is SheetDB URL configured?', 'error');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-32 pb-32 flex items-center">
        <div className="max-w-[800px] mx-auto px-8 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easing }}
          >
            <span className="font-sans font-light text-[10px] text-[var(--accent)] uppercase tracking-[0.2em] mb-6 block">
              — Order Confirmed
            </span>
            <h1 className="font-serif text-[clamp(48px,6vw,96px)] text-[var(--primary-text)] leading-[0.95] tracking-[-0.03em] mb-8">
              Thank <span className="italic">You</span>
            </h1>
            <p className="font-sans font-light text-[14px] text-[var(--surface)] uppercase tracking-[0.1em] mb-12 max-w-lg mx-auto leading-relaxed">
              Your order <span className="text-[var(--primary-text)] font-normal">{generatedOrderId}</span> has been received and added to our production queue.
            </p>
            <div className="border border-[var(--muted)] p-8 mb-16 text-left inline-block w-full max-w-md">
              <span className="block font-sans text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-4">Summary</span>
              <div className="flex justify-between font-sans text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em] mb-2">
                <span>Ship to:</span>
                <span className="font-light">{firstName} {lastName}</span>
              </div>
              <div className="flex justify-between font-sans text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em] mb-2">
                <span>Method:</span>
                <span className="font-light">{deliveryMethod}</span>
              </div>
              <div className="flex justify-between font-serif text-[18px] text-[var(--primary-text)] mt-6 pt-4 border-t border-[var(--muted)]">
                <span>Total Paid:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <Link href="/shop" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-32">
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 flex flex-col md:flex-row gap-16 md:gap-32">
        
        {/* Left Side: Steps (60%) */}
        <div className="w-full md:w-3/5">
          
          {/* Step Indicator (3 small dots) */}
          <div className="flex gap-4 mb-16">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-400 ${
                  step >= i ? 'bg-[var(--primary-text)]' : 'bg-[var(--muted)]'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: easing }}
              >
                <h2 className="font-serif text-[40px] text-[var(--primary-text)] tracking-[-0.02em] mb-12">
                  Review & Identify
                </h2>
                
                {/* Items as serif text list */}
                <div className="flex flex-col gap-6 mb-16 border-b border-[var(--muted)] pb-12">
                  {items.length === 0 ? (
                    <p className="font-sans font-light text-[13px] text-[var(--surface)] uppercase tracking-[0.08em]">
                      Your cart is empty.
                    </p>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex justify-between items-baseline">
                        <span className="font-serif text-[24px] text-[var(--primary-text)]">
                          {item.name} <span className="font-sans text-[13px] text-[var(--surface)] ml-2">x{item.quantity}</span>
                        </span>
                        <span className="font-serif text-[24px] text-[var(--primary-text)]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Entry Choice */}
                <div className="flex gap-12">
                  <button 
                    onClick={() => setGuestMode('guest')}
                    className={`font-sans font-light text-[13px] uppercase tracking-[0.15em] transition-all duration-400 pb-1 ${
                      guestMode === 'guest' 
                        ? 'text-[var(--primary-text)] border-b border-[var(--accent)]' 
                        : 'text-[var(--surface)] border-b border-transparent hover:border-[var(--accent)]'
                    }`}
                  >
                    Guest
                  </button>
                  <button 
                    onClick={() => setGuestMode('account')}
                    className={`font-sans font-light text-[13px] uppercase tracking-[0.15em] transition-all duration-400 pb-1 ${
                      guestMode === 'account' 
                        ? 'text-[var(--primary-text)] border-b border-[var(--accent)]' 
                        : 'text-[var(--surface)] border-b border-transparent hover:border-[var(--accent)]'
                    }`}
                  >
                    Account
                  </button>
                </div>

                {guestMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-12 flex flex-col gap-8"
                  >
                    <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS" 
                      className="input-underline"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {guestMode === 'account' && (
                      <input 
                        type="password" 
                        placeholder="PASSWORD" 
                        className="input-underline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    )}
                    <button 
                      onClick={() => setStep(2)}
                      className="btn-primary w-fit mt-8"
                      disabled={items.length === 0 || !isStep1Valid}
                    >
                      Continue to Shipping
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: easing }}
              >
                <h2 className="font-serif text-[40px] text-[var(--primary-text)] tracking-[-0.02em] mb-12">
                  Destination
                </h2>
                
                {/* Underline address inputs */}
                <div className="flex flex-col gap-8 mb-16">
                  <div className="flex gap-8">
                    <input 
                      type="text" 
                      placeholder="FIRST NAME" 
                      className="input-underline w-full" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="LAST NAME" 
                      className="input-underline w-full" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="STREET ADDRESS" 
                    className="input-underline" 
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)" 
                    className="input-underline" 
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />
                  <div className="flex gap-8">
                    <input 
                      type="text" 
                      placeholder="CITY" 
                      className="input-underline w-full" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="POSTAL CODE" 
                      className="input-underline w-full" 
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="mb-16">
                  <h3 className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-6">
                    Delivery Method
                  </h3>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setDeliveryMethod('standard')}
                      className={`text-left font-serif text-[24px] transition-colors duration-400 ${
                        deliveryMethod === 'standard' ? 'text-[var(--primary-text)]' : 'text-[var(--muted)] hover:text-[var(--surface)]'
                      }`}
                    >
                      Standard (3-5 Days) — Free
                    </button>
                    <button 
                      onClick={() => setDeliveryMethod('express')}
                      className={`text-left font-serif text-[24px] transition-colors duration-400 ${
                        deliveryMethod === 'express' ? 'text-[var(--primary-text)]' : 'text-[var(--muted)] hover:text-[var(--surface)]'
                      }`}
                    >
                      Express (Overnight) — ₹1500.00
                    </button>
                  </div>
                </div>

                <div className="flex gap-8 items-center">
                  <button 
                    onClick={() => setStep(3)}
                    className="btn-primary"
                    disabled={!isStep2Valid}
                  >
                    Continue to Payment
                  </button>
                  <button 
                    onClick={() => setStep(1)}
                    className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] hover:text-[var(--primary-text)] transition-colors duration-400"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: easing }}
              >
                <h2 className="font-serif text-[40px] text-[var(--primary-text)] tracking-[-0.02em] mb-12">
                  Payment
                </h2>
                
                {/* Mock Stripe Elements */}
                <div className="flex flex-col gap-8 mb-16">
                  <input type="text" placeholder="CARD NUMBER" className="input-underline" />
                  <div className="flex gap-8">
                    <input type="text" placeholder="EXPIRATION (MM/YY)" className="input-underline w-full" />
                    <input type="text" placeholder="CVC" className="input-underline w-full" />
                  </div>
                  <input type="text" placeholder="NAME ON CARD" className="input-underline" />
                </div>

                <div className="flex gap-8 items-center">
                  <button 
                    onClick={handlePlaceOrder}
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] hover:text-[var(--primary-text)] transition-colors duration-400"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Total Panel (40%) */}
        <div className="w-full md:w-2/5">
          <div className="sticky top-32">
            <h3 className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-6">
              Total
            </h3>
            <div className="font-serif text-[clamp(64px,8vw,120px)] text-[var(--primary-text)] leading-[0.9]">
              ₹{(total + (deliveryMethod === 'express' ? 1500 : 0)).toFixed(2)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}