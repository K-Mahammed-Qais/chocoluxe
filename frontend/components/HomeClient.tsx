'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSheetProducts } from '@/lib/sheetdb';



const CATEGORIES = [
  { href: '/shop?category=Milk', title: 'Milk Chocolates' },
  { href: '/shop?category=Dark', title: 'Dark Chocolates' },
  { href: '/shop?category=White', title: 'White Chocolates' },
  { href: '/shop?category=Assorted', title: 'Assorted Chocolates' },
  { href: '/shop?category=Gift', title: 'Gift Hampers' },
  { href: '/shop?category=SugarFree', title: 'Sugar Free' },
];

// Mock data removed - now using SheetDB


const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HomeClient() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const data = await getSheetProducts();

        // Take first 3 products
        const featured = data.slice(0, 3).map((p: any, idx: number) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          origin: p.origin || '',
          imgUrl: p.img_url || p.imgUrl,
          slug: p.slug,
          large: idx === 0
        }));

        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: easing, staggerChildren: 0.1 }}
      className="bg-[var(--background)] min-h-screen"
    >
      {/* --- HERO (Full-bleed product photo) ---------------------------------── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing }}
        className="relative w-full h-[92vh] min-h-[600px]"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1614088523011-8e0192d6e38b?q=80&w=2000&auto=format&fit=crop" 
            alt="Premium Chocolate" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Giant Bodoni headline overlaps the image bottom-left */}
        <div className="absolute bottom-[12%] left-[6%] z-10 pointer-events-none">
          <h1 className="font-serif text-[clamp(72px,14vw,160px)] leading-[0.92] tracking-[-0.03em] text-[var(--primary-text)]">
            Pure <br />
            <span className="italic">Decadence</span>
          </h1>
        </div>

        {/* Single BtnPrimary floats bottom-right */}
        <div className="absolute bottom-[14%] right-[8%] z-10">
          <Link href="/shop" className="btn-primary">
            Shop Collection
          </Link>
        </div>
      </motion.section>

      {/* --- CATEGORY ROW ------------------------ */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easing }}
        className="py-20 md:py-28 px-8 md:px-16 lg:px-24 xl:px-32 overflow-x-auto hide-scrollbar border-b border-[var(--muted)]/20"
      >
        <div className="flex justify-between items-center gap-16 md:gap-24 min-w-max mx-auto max-w-[1800px]">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.title} 
              href={cat.href} 
              className="text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400 text-[11px] uppercase tracking-[0.12em] font-sans font-light whitespace-nowrap"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </motion.section>

      {/* --- FEATURED PRODUCTS (3-col asymmetric grid) ------------------ */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: easing }}
        className="px-8 md:px-16 lg:px-24 xl:px-32 py-24 md:py-36 max-w-[1800px] mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {!loading && featuredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial="initial"
              whileHover="hover"
              className={`group bg-[var(--primary-text)] shadow-[var(--card-shadow)] flex flex-col ${product.large ? 'md:col-span-6' : 'md:col-span-3'}`}
            >
              <Link href={`/shop/${product.slug}`} className="flex flex-col h-full">

              <div className="relative w-full overflow-hidden bg-[var(--surface)]" style={{ aspectRatio: '4/5' }}>
                <img 
                  src={product.imgUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col flex-grow justify-between relative bg-[var(--primary-text)] min-h-[180px]">
                <div>
                  <div className="mb-6">
                    <span className="uppercase font-sans text-[10px] text-[var(--surface)] tracking-[0.1em]">
                      {product.origin}
                    </span>
                  </div>
                  <h3 className="font-serif text-[26px] text-[var(--background)] mb-3 leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-serif text-[20px] text-[var(--background)]">
                    ₹{product.price}
                  </p>
                </div>
                
                {/* Hover text fades in bottom-left */}
                <motion.span 
                  className="absolute bottom-8 left-8 lg:left-12 text-[var(--accent)] font-sans text-[10px] uppercase tracking-[0.15em]"
                  variants={{
                    initial: { opacity: 0 },
                    hover: { opacity: 1 }
                  }}
                  transition={{ duration: 0.4 }}
                >
                </motion.span>
              </div>
              </Link>
            </motion.div>
          ))}
          {loading && (
            <div className="col-span-12 text-center font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
              Loading featured collection...
            </div>
          )}
        </div>

      </motion.section>

      {/* --- "THE CRAFT" SECTION ------------------── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: easing }}
        className="bg-[var(--primary-text)] py-32 md:py-48 px-8 md:px-16 lg:px-24 xl:px-32"
      >
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 lg:gap-32">
          <div className="w-full md:w-3/5">
            <h2 className="font-serif italic text-[clamp(36px,5vw,72px)] text-[var(--background)] leading-[1.15] tracking-[-0.02em]">
              "We strip away the excess to reveal the uncompromised truth of the cacao bean."
            </h2>
          </div>
          <div className="w-full md:w-1/3">
            <p className="font-sans font-light text-[13px] text-[var(--surface)] leading-[2] uppercase tracking-[0.08em]">
              Sourced from single-origin farms across the globe. Each harvest is roasted, conched, and tempered to perfection. No artificial additives. No shortcuts. Just the raw, untamed essence of luxury chocolate.
            </p>
            <div className="mt-12">
              <Link href="/about" className="btn-ghost !text-[var(--background)]">
                Discover our process
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- NEWSLETTER ------------------── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: easing }}
        className="bg-[var(--background)] py-24 md:py-32 px-8 md:px-16 lg:px-24 flex justify-center text-center"
      >
        <div className="w-full max-w-2xl">
          <form className="flex flex-col md:flex-row items-end gap-10" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-grow w-full relative">
              <input 
                type="email" 
                placeholder="SUBSCRIBE TO NEWSLETTER" 
                className="input-underline text-center md:text-left"
                required
              />
            </div>
            <button type="submit" className="btn-primary whitespace-nowrap mt-4 md:mt-0">
              Submit
            </button>
          </form>
        </div>
      </motion.section>

    </motion.div>
  );
}