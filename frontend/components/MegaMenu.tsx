'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSheetProducts } from '@/lib/sheetdb';

const CATEGORIES = [
  { 
    name: 'Milk Chocolates', 
    slug: 'Milk',
    description: 'Smooth & creamy blends',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop'
  },
  { 
    name: 'Dark Chocolates', 
    slug: 'Dark',
    description: 'Rich & intense flavors',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&auto=format&fit=crop'
  },
  { 
    name: 'White Chocolates', 
    slug: 'White',
    description: 'Delicate & sweet',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&auto=format&fit=crop'
  },
  { 
    name: 'Assorted', 
    slug: 'Assorted',
    description: 'Explore variety packs',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop'
  },
  { 
    name: 'Gift Hampers', 
    slug: 'Gift',
    description: 'Curated gift sets',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&auto=format&fit=crop'
  },
  { 
    name: 'Sugar Free', 
    slug: 'SugarFree',
    description: 'Guilt-free indulgence',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&auto=format&fit=crop'
  },
];

const FEATURED_PRODUCTS_QUERY = ['Milk', 'Dark', 'White'];

export default function MegaMenu({ onClose }: { onClose: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getSheetProducts();
        const featured = data.slice(0, 3);
        setProducts(featured);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute top-full left-0 w-[900px] xl:w-[1100px] bg-[var(--background)] shadow-[var(--card-shadow)] border-t border-[var(--muted)]/20 z-50"
      style={{ animation: 'slideDown 0.3s ease-out' }}
    >
      <div className="flex">
        {/* Categories Column */}
        <div className="w-1/2 border-r border-[var(--muted)]/20 p-8">
          <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] mb-6">
            Shop by Category
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group flex items-center gap-4 p-4 -m-1 hover:bg-[var(--muted)]/20 transition-colors duration-300"
                onClick={onClose}
              >
                <div className="w-16 h-16 relative overflow-hidden bg-[var(--surface)] flex-shrink-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <span className="font-sans text-[13px] text-[var(--primary-text)] tracking-[0.05em] block group-hover:text-[var(--accent)] transition-colors">
                    {cat.name}
                  </span>
                  <span className="font-sans text-[10px] text-[var(--surface)] tracking-[0.05em]">
                    {cat.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products Column */}
        <div className="w-1/2 p-8">
          <h3 className="font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] mb-6">
            Featured
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-[var(--muted)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--muted)] w-3/4" />
                    <div className="h-4 bg-[var(--muted)] w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group flex gap-4 p-2 -m-2 hover:bg-[var(--muted)]/20 transition-colors duration-300"
                  onClick={onClose}
                >
                  <div className="w-20 h-20 relative overflow-hidden bg-[var(--surface)] flex-shrink-0">
                    <Image
                      src={product.img_url || product.imgUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-serif text-[16px] text-[var(--primary-text)] leading-tight group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </span>
                    <span className="font-sans text-[11px] text-[var(--surface)] mt-1">
                      ₹{product.price}
                    </span>
                    <span className="font-sans text-[9px] text-[var(--muted)] uppercase tracking-[0.1em] mt-1">
                      {product.origin}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 pt-6 border-t border-[var(--muted)]/20">
            <Link 
              href="/shop" 
              className="font-sans text-[10px] uppercase tracking-[0.15em] text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors"
              onClick={onClose}
            >
              View All Products →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}