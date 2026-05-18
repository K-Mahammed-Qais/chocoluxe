'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

export default function CartSidebar() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[var(--primary-text)]/40 z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-[var(--background)] z-[110] flex flex-col"
            style={{ boxShadow: '-24px 0 80px rgba(75,46,42,0.25)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 md:p-12 pb-4">
              <h2 className="font-serif text-[32px] text-[var(--primary-text)] tracking-[-0.02em]">
                Your Cart
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--primary-text)] hover:opacity-70 transition-opacity"
              >
                <X strokeWidth={1} size={28} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 hide-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="font-sans font-light text-[13px] text-[var(--surface)] uppercase tracking-[0.08em] mb-6">
                    Your cart is empty
                  </p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="btn-ghost"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-12 py-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      {/* Note: the spec says "no images" for the checkout step 1, but for the cart sidebar, it doesn't specify. I'll include a small thumbnail or just text if preferred. It says "NO internal dividers — vertical spacing only. item names: serif 300 #4B2E2A. prices: serif 300 #7A4A3A." */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <Link 
                            href={`/shop/${item.slug}`} 
                            onClick={() => setIsOpen(false)}
                            className="font-serif text-[24px] text-[var(--primary-text)] leading-[1.1] text-decoration-none"
                          >
                            {item.name}
                          </Link>
                          <span className="font-serif text-[20px] text-[var(--accent)] ml-4">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-[var(--primary-text)] text-[16px] px-2"
                            >
                              —
                            </button>
                            <span className="font-sans font-light text-[13px] text-[var(--primary-text)] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-[var(--primary-text)] text-[16px] px-2"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] hover:text-[var(--primary-text)] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 md:p-12 pt-8 mt-auto bg-[var(--background)]">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-sans font-light text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em]">
                    Subtotal
                  </span>
                  <span className="font-serif text-[28px] text-[var(--primary-text)]">
                    ₹{getCartTotal().toFixed(2)}
                  </span>
                </div>
                
                <Link 
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Proceed to Checkout
                </Link>
                <div className="text-center mt-6">
                  <span className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.08em]">
                    Shipping & taxes calculated at checkout
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
