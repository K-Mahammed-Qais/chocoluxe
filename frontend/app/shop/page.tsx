'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useResponsive } from '@/lib/responsive';

const CATEGORIES = ['All', 'Milk Chocolates', 'Dark Chocolates', 'White Chocolates', 'Assorted', 'Gift Hamper', 'Sugar Free'];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
];

/* ─── Product Card ─────────────────────────────────────── */
function ProductCard({ product, isMobile = false }: { product: any; isMobile?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0, 0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: isMobile ? '180px' : '240px', overflow: 'hidden', background: 'var(--surface-2)' }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
            🍫
          </div>
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {product.isFeatured && (
            <span style={{ padding: '0.25rem 0.7rem', background: '#1A0A00', color: '#FFFDF9', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ★ Featured
            </span>
          )}
          {product.stock === 0 && (
            <span style={{ padding: '0.25rem 0.7rem', background: 'rgba(26,10,0,0.6)', color: 'rgba(255,253,249,0.7)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Category tag */}
        {product.category && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span style={{ padding: '0.25rem 0.7rem', background: '#FFFDF9', border: '1px solid rgba(26,10,0,0.15)', color: '#1A0A00', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ 
        padding: '1.5rem', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(255,253,249,0.5)',
        backdropFilter: 'blur(12px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#1A0A00',
          marginBottom: '0.4rem',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
        </h3>
        <p style={{
          color: 'rgba(26,10,0,0.5)',
          fontSize: '0.825rem',
          lineHeight: 1.6,
          flex: 1,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.4rem', fontWeight: 700, color: '#1A0A00' }}>
              ₹{product.price?.toFixed(0)}
            </div>
            {product.stock > 0 && (
              <div style={{ fontSize: '0.7rem', color: 'rgba(26,10,0,0.4)', marginTop: '0.1rem' }}>
                {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href={`/product/${product._id}`}
              style={{
                padding: '0.55rem 1.1rem',
                border: '1px solid rgba(26,10,0,0.3)',
                background: 'transparent',
                color: '#1A0A00',
                fontSize: '0.775rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              View
            </Link>
            {product.stock > 0 && (
              <button
                onClick={e => { e.stopPropagation(); e.preventDefault(); alert('Added to cart!'); }}
                className="btn-gold"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.775rem' }}
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory && activeCategory !== 'All') params.append('category', activeCategory);
      if (keyword) params.append('keyword', keyword);
      const { data } = await axios.get(`/api/products?${params.toString()}`);
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, keyword]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory);
    if (keyword) params.set('keyword', keyword);
    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [activeCategory, keyword, router]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '72px' }}>

      {/* ─── Page Header */}
      <div style={{ 
        borderBottom: '1px solid var(--glass-border)', 
        padding: '3rem 2rem 2rem', 
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Shop <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Collection</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              {loading ? 'Loading...' : `${sorted.length} products available`}
            </p>
          </div>
          <span className="section-tag" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}>{activeCategory || 'All Products'}</span>
        </div>
      </div>

      {/* ─── Category Nav */}
      <div style={{ 
        borderBottom: '1px solid var(--glass-border)', 
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        overflowX: 'auto' 
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', padding: '0 2rem' }}>
          {CATEGORIES.map((cat, idx) => {
            const active = (cat === 'All' && !activeCategory) || activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === 'All' ? '' : cat)}
                style={{
                  padding: '1.25rem 1.5rem',
                  background: active ? '#1A0A00' : 'transparent',
                  color: active ? '#FFFDF9' : 'rgba(26,10,0,0.6)',
                  borderRight: idx === CATEGORIES.length - 1 ? 'none' : '1px solid rgba(26,10,0,0.08)',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '0.78rem',
                  letterSpacing: '0.07em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {/* ─── Filter/Search Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '340px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              id="shop-search"
              type="text"
              placeholder="Search chocolates…"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />
          </div>

          {/* Sort */}
          <select
            id="shop-sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* ─── States */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isTablet ? 2 : 3}, 1fr)`, gap: isMobile ? '1rem' : '2rem' }}>
            {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
              <div key={i} style={{ height: '380px', background: 'linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%)', backgroundSize: '200% auto', animation: 'shimmer 1.5s linear infinite' }} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ color: 'rgba(26,10,0,0.5)', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={fetchProducts} className="btn-gold">Try Again</button>
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍫</div>
            <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>No Chocolates Found</h3>
            <p style={{ color: 'rgba(26,10,0,0.4)', marginBottom: '1.5rem' }}>Try adjusting your filters or search term.</p>
            <button onClick={() => { setKeyword(''); setActiveCategory(''); }} className="btn-ghost">Clear Filters</button>
          </div>
        )}

        {/* ─── Products Grid */}
        {!loading && !error && sorted.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isTablet ? 2 : 3}, 1fr)`, gap: isMobile ? '1rem' : '2rem' }}>
            {sorted.map(product => (
              <ProductCard key={product._id} product={product} isMobile={isMobile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFFDF9', paddingTop: '200px', textAlign: 'center', fontSize: '1rem', color: 'rgba(26,10,0,0.4)' }}>Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}