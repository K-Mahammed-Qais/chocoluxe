'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { getSheetProductBySlug, getSheetProducts } from '@/lib/sheetdb';


// Mock data removed - now using SheetDB


const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore(state => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let mappedProduct = null;
        let relatedData = [];

        // Fetch from SheetDB
        const prod = await getSheetProductBySlug(slug);
        if (!prod) throw new Error('Product not found in Google Sheet');

        mappedProduct = {
          id: prod.id,
          slug: prod.slug,
          name: prod.name,
          price: prod.price,
          originalPrice: prod.original_price,
          inStock: prod.in_stock,
          imgUrl: prod.img_url,
          description: prod.description,
          origin: prod.origin || '',
          cacao: prod.cacao || '',
          weight: prod.weight || '',
          category: prod.category,
          tastingNotes: prod.tasting_notes
        };

        // Fetch related products
        const allProds = await getSheetProducts();
        relatedData = allProds
          .filter(p => p.id !== prod.id)
          .slice(0, 3)
          .map(r => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            price: r.price,
            origin: r.origin || '',
            imgUrl: r.img_url
          }));
        
        setProduct(mappedProduct);
        setRelated(relatedData);

      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    setAdding(true);
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imgUrl: product.imgUrl,
      quantity: qty
    });
    setTimeout(() => setAdding(false), 800);
  };

  if (loading) {
    return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="font-serif text-[32px] mb-8">Product Not Found</h1>
      <Link href="/shop" className="btn-primary">Back to Shop</Link>
    </div>;
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: easing }}
      className="bg-[var(--background)] min-h-screen"
    >
      <div className="flex flex-col md:flex-row min-h-screen">
        
          {/* Left Side: Image (60% Desktop, Full height) */}
        <div className="w-full md:w-[60%] h-[50vh] md:h-screen bg-[var(--muted)] relative">
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={product.imgUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => toggleItem({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              imgUrl: product.imgUrl,
              origin: product.origin,
            })}
            className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${
              isInWishlist(product.id)
                ? 'bg-[var(--accent)] text-[var(--background)]'
                : 'bg-[var(--background)]/90 text-[var(--primary-text)] hover:bg-[var(--background)]'
            }`}
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={20} strokeWidth={1} className={isInWishlist(product.id) ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Right Side: Sticky Content Panel (40% Desktop) */}
        <div className="w-full md:w-[40%] bg-[var(--background)] relative">
          <div className="md:sticky md:top-0 md:h-screen md:overflow-y-auto px-8 md:px-16 pt-12 pb-24 md:pt-32 hide-scrollbar">
            
            <Link href="/shop" className="font-sans font-light text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400 mb-8 inline-block">
              ← Back to Shop
            </Link>

            <h1 className="font-serif text-[clamp(48px,5vw,64px)] text-[var(--primary-text)] leading-[0.95] tracking-[-0.03em] mb-4">
              {product.name}
            </h1>
            
            <div className="font-serif text-[32px] text-[var(--primary-text)] mb-8">
              ${product.price}
            </div>

            <p className="font-sans font-light text-[13px] text-[var(--primary-text)] leading-[1.8] uppercase tracking-[0.08em] mb-12">
              {product.description}
            </p>

            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div className="mb-12">
                <span className="block font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-4">
                  Tasting Notes
                </span>
                <ul className="flex flex-col gap-2">
                  {product.tastingNotes.map((note: string) => (
                    <li key={note} className="font-sans font-light text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em]">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Details */}
            <div className="flex flex-wrap gap-8 mb-12">
              {product.origin && (
                <div>
                  <span className="block font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-2">
                    Origin
                  </span>
                  <span className="font-sans font-light text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em]">
                    {product.origin}
                  </span>
                </div>
              )}
              {product.cacao && (
                <div>
                  <span className="block font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-2">
                    Cacao
                  </span>
                  <span className="font-sans font-light text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em]">
                    {product.cacao}
                  </span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="block font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em] mb-2">
                    Weight
                  </span>
                  <span className="font-sans font-light text-[13px] text-[var(--primary-text)] uppercase tracking-[0.08em]">
                    {product.weight}
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Controls */}
            <div className="mt-16">
              <div className="flex items-center gap-6 mb-8">
                <span className="font-sans font-light text-[10px] text-[var(--surface)] uppercase tracking-[0.15em]">
                  Quantity
                </span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="text-[var(--primary-text)] text-[16px] px-2"
                  >
                    —
                  </button>
                  <span className="font-sans font-light text-[13px] text-[var(--primary-text)]">
                    {qty}
                  </span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="text-[var(--primary-text)] text-[16px] px-2"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="btn-primary w-full"
                disabled={!product.inStock || adding}
              >
                {adding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ─── Related Products ──────────────────── */}
      <section className="bg-[var(--primary-text)] py-24 px-8 md:px-16 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="font-serif italic text-[clamp(32px,4vw,48px)] text-[var(--background)] tracking-[-0.02em] mb-16 text-center md:text-left">
            Also consider
          </h2>

          <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-8">
            {related.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easing, delay: idx * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] bg-[var(--background)] flex flex-col cursor-pointer group shrink-0"
              >
                <Link href={`/shop/${product.slug}`} className="flex flex-col h-full text-decoration-none">
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--muted)]">
                    <motion.img 
                      src={product.imgUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.06 }
                      }}
                      transition={{ duration: 0.5, ease: easing }}
                    />
                  </div>
                  <div className="p-6 bg-[var(--background)]">
                    <h3 className="font-serif text-[20px] text-[var(--primary-text)] mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="font-serif text-[16px] text-[var(--primary-text)]">
                      ${product.price}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </motion.div>
  );
}
