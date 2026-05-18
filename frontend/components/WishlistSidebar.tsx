'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function WishlistSidebar() {
  const { items, isOpen, setIsOpen, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      imgUrl: item.imgUrl,
      quantity: 1,
    });
    removeItem(item.id);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[var(--primary-text)]/30 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-[var(--background)] shadow-[var(--card-shadow)] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--muted)]/20">
              <div className="flex items-center gap-3">
                <Heart size={20} strokeWidth={1} className="text-[var(--accent)]" />
                <h2 className="font-serif text-[24px] text-[var(--primary-text)]">
                  Wishlist
                </h2>
                <span className="font-sans text-[10px] text-[var(--surface)] uppercase tracking-[0.1em] ml-2">
                  ({items.length})
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors"
              >
                <X size={20} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Heart size={48} strokeWidth={0.5} className="text-[var(--muted)] mb-6" />
                  <p className="font-serif text-[20px] text-[var(--primary-text)] mb-2">
                    Your wishlist is empty
                  </p>
                  <p className="font-sans text-[11px] text-[var(--surface)] uppercase tracking-[0.08em] mb-8">
                    Save your favorite chocolates for later
                  </p>
                  <Link href="/shop" onClick={handleClose} className="btn-primary">
                    Browse Collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--muted)]/20">
                  {items.map((item) => (
                    <li key={item.id} className="p-6 hover:bg-[var(--muted)]/10 transition-colors">
                      <div className="flex gap-4">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={handleClose}
                          className="w-24 h-24 relative overflow-hidden bg-[var(--surface)] flex-shrink-0 group"
                        >
                          <Image
                            src={item.imgUrl}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="96px"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link
                                href={`/shop/${item.slug}`}
                                onClick={handleClose}
                                className="font-serif text-[18px] text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors leading-tight block"
                              >
                                {item.name}
                              </Link>
                              {item.origin && (
                                <span className="font-sans text-[9px] text-[var(--surface)] uppercase tracking-[0.1em] mt-1 block">
                                  {item.origin}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[var(--muted)] hover:text-[var(--error)] transition-colors p-1"
                              title="Remove from wishlist"
                            >
                              <Trash2 size={14} strokeWidth={1} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <span className="font-serif text-[16px] text-[var(--primary-text)]">
                              ₹{item.price}
                            </span>
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.1em] text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors"
                            >
                              <ShoppingBag size={12} strokeWidth={1} />
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--muted)]/20">
                <Link
                  href="/dashboard?tab=wishlist"
                  onClick={handleClose}
                  className="block w-full text-center font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors py-2"
                >
                  View Full Wishlist
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}