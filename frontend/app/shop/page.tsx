'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getSheetProducts } from '@/lib/sheetdb';
import { useWishlistStore } from '@/lib/store';


const CATEGORIES = ['All', 'Milk Chocolates', 'Dark Chocolates', 'White Chocolates', 'Assorted', 'Gift Hamper', 'Sugar Free'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
];

// Initial mock data removed - now using SheetDB


const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ShopContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const { toggleItem, isInWishlist } = useWishlistStore();

  // Fetch and sort from SheetDB
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let mappedData: any[] = [];

        const sheetProds = await getSheetProducts();
        
        mappedData = sheetProds.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          inStock: p.in_stock,
          imgUrl: p.img_url,
          description: p.description,
          origin: p.origin || '',
          category: p.category,
          height: 300 + Math.floor(Math.random() * 200)
        }));

        // Filter by category
        if (activeCategory !== 'All') {
          mappedData = mappedData.filter(p => p.category === activeCategory);
        }

        // Apply sorting
        if (sortBy === 'price_asc') {
          mappedData.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
          mappedData.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
          mappedData.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        }

        setProducts(mappedData);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, sortBy]);


  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: easing }}
      className="bg-[var(--background)] min-h-screen pt-32 pb-32"
    >
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32">
        
        {/* Page Title & Sort Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <h1 className="font-serif text-[clamp(40px,6vw,80px)] text-[var(--primary-text)] leading-[0.95] tracking-[-0.03em]">
            The <span className="italic">Collection</span>
          </h1>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent border-none text-[var(--primary-text)] font-sans font-light text-[10px] uppercase tracking-[0.15em] outline-none cursor-pointer pb-1 pr-4"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--primary-text)] text-[10px]">▼</span>
          </div>
        </div>

        {/* Filters floating above grid */}
        <div className="flex flex-wrap gap-8 mb-16">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans font-light text-[11px] uppercase tracking-[0.1em] transition-colors duration-400 pb-2 ${
                  isActive 
                    ? 'text-[var(--primary-text)] border-b border-[var(--accent)]' 
                    : 'text-[var(--muted)] border-b border-transparent hover:text-[var(--surface)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Products Grid (CSS columns for masonry effect) */}
        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="skeleton w-full break-inside-avoid"
                style={{ height: `${300 + (i % 3) * 100}px` }}
              />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence>
              {products.map((product, idx) => (

                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: easing, delay: idx * 0.05 }}
                  className="group bg-[var(--primary-text)] shadow-[var(--card-shadow)] flex flex-col break-inside-avoid w-full"
                >
                  <Link href={`/shop/${product.slug}`} className="flex flex-col h-full cursor-pointer text-decoration-none">
                    {/* Image fills top ~70% */}
                    <div 
                      className="relative w-full overflow-hidden bg-[var(--surface)] group-hover:scale-105 transition-transform duration-500 ease-out"
                      style={{ height: `${product.height * 0.65}px` }}
                    >
                      <img 
                        src={product.imgUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleItem({
                            id: product.id,
                            slug: product.slug,
                            name: product.name,
                            price: product.price,
                            imgUrl: product.imgUrl,
                            origin: product.origin,
                          });
                        }}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                          isInWishlist(product.id)
                            ? 'bg-[var(--accent)] text-[var(--background)]'
                            : 'bg-[var(--background)]/80 text-[var(--primary-text)] hover:bg-[var(--background)]'
                        }`}
                      >
                        <Heart 
                          size={16} 
                          strokeWidth={1} 
                          className={isInWishlist(product.id) ? 'fill-current' : ''} 
                        />
                      </button>
                      {!product.inStock && (
                        <div className="absolute top-4 left-4 bg-[var(--error)] text-[var(--background)] font-sans text-[10px] uppercase tracking-[0.15em] px-2 py-1">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-10 flex flex-col flex-grow justify-between relative bg-[var(--primary-text)] min-h-[160px]">
                      <div>
                        <div className="mb-4 flex justify-between items-center">
                          <span className="uppercase font-sans text-[10px] text-[var(--surface)] tracking-[0.1em]">
                            {product.origin}
                          </span>
                        </div>
                        <h3 className="font-serif text-[20px] text-[var(--background)] mb-2 leading-tight">
                          {product.name}
                        </h3>
                        <p className="font-serif text-[16px] text-[var(--background)]">
                          ₹{product.price}
                          {product.originalPrice && (
                            <span className="text-[var(--muted)] text-[13px] line-through ml-3">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Hover text fades in bottom-left */}
                      <motion.span 
                        className="absolute bottom-8 left-8 text-[var(--accent)] font-sans text-[10px] uppercase tracking-[0.15em]"
                        variants={{
                          initial: { opacity: 0 },
                          hover: { opacity: 1 }
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        — Add
                      </motion.span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] pt-32 text-center text-[var(--muted)] font-sans uppercase text-[10px] tracking-[0.15em]">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}