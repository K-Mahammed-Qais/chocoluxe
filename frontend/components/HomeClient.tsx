'use client';

import Link from 'next/link';
import { useResponsive } from '@/lib/responsive';

const TOP_BRANDS = [
  'Lindt', 'Venchi', 'Neuhaus', 'Toblerone', 'Godiva', 'Whittakers', 'Rhine Valley', 'Mr.Beast', 'Wedel', 'Milka'
];

const CATEGORIES = [
  { href: '/shop?category=Milk%20Chocolates', title: 'Milk Chocolates' },
  { href: '/shop?category=Dark%20Chocolates', title: 'Dark Chocolates' },
  { href: '/shop?category=White%20Chocolates', title: 'White Chocolates' },
  { href: '/shop?category=Assorted', title: 'Assorted Chocolates' },
  { href: '/shop?category=Gift%20Hamper', title: 'Gift Hampers' },
  { href: '/shop?category=Sugar%20Free', title: 'Sugar Free' },
];

const FEATURED_PRODUCTS = [
  { brand: 'Rhine Valley', name: '70% Dark Almond Rocher 100g', price: '₹450', imgUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop' },
  { brand: 'Godiva', name: 'Dark Blood Orange Bar 90g', price: '₹895', imgUrl: 'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?q=80&w=600&auto=format&fit=crop' },
  { brand: 'Venchi', name: 'Gold Caramel Cremino Bar 110g', price: '₹1200', imgUrl: 'https://images.unsplash.com/photo-1511381939415-e440c05230be?q=80&w=600&auto=format&fit=crop' },
  { brand: 'Lindt', name: 'Swiss Classic Milk Hazelnut 100g', price: '₹350', imgUrl: 'https://images.unsplash.com/photo-1548135894-0d9db893ab63?q=80&w=600&auto=format&fit=crop' },
];

export default function HomeClient() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>

      {/* ─── MARQUEE ──────────────────────────────────────────── */}
      <div style={{ 
        borderBottom: '1px solid var(--glass-border)', 
        padding: '0.75rem 0', 
        overflow: 'hidden', 
        background: 'var(--surface-2)', 
        marginTop: '72px',
        backdropFilter: 'blur(12px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
      }}>
        <div className="animate-marquee" style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {[...TOP_BRANDS, ...TOP_BRANDS, ...TOP_BRANDS].map((brand, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
              {brand}
              <span style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── HERO (ASYMMETRIC) ─────────────────────────────────── */}
      <section style={{ 
        minHeight: isMobile ? 'auto' : '85vh', 
        display: 'flex', 
        position: 'relative', 
        borderBottom: '1px solid var(--glass-border)',
        background: 'linear-gradient(180deg, rgba(255,253,249,0.3) 0%, rgba(255,244,227,0.2) 100%)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)', width: '100%' }}>
          
          {/* Left Large Typographic Area (90% Visual Weight) */}
          <div style={{ 
            gridColumn: isMobile ? '1' : '1 / 9', 
            borderRight: isMobile ? 'none' : '1px solid var(--glass-border)', 
            padding: isMobile ? '2rem' : '4rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            position: 'relative',
            background: 'rgba(255,253,249,0.4)',
            backdropFilter: 'blur(8px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(8px) saturate(1.1)',
          }}>
            {/* Massive Bleeding Typography */}
            <h1 style={{
              fontSize: isMobile ? '2.5rem' : 'clamp(4rem, 12vw, 10rem)',
              lineHeight: 0.85,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              margin: '0 0 1rem 0',
              zIndex: 2,
              position: 'relative'
            }}>
              Melt <br/>
              <span style={{ fontStyle: 'italic', color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>Free</span><br/>
              Delivery
            </h1>

            <div style={{ maxWidth: isMobile ? '100%' : '400px', zIndex: 2 }}>
              <p style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', marginBottom: isMobile ? '1rem' : '2rem', lineHeight: 1.6, fontWeight: 500 }}>
                Wholesale imported chocolates curated from the finest global maisons. Delivered across India in temperature-controlled packaging.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/shop" className="btn-gold shadow-brutal">
                  Shop All Brands
                </Link>
              </div>
            </div>

            {/* Absolute Background Accent */}
            <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px', background: 'var(--surface-2)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, opacity: 0.6, pointerEvents: 'none' }} />
          </div>

          {/* Right Thin Vertical Strip (10% Visual Weight) */}
          <div style={{ gridColumn: isMobile ? '1' : '9 / 13', display: 'flex', flexDirection: isMobile ? 'row' : 'column', background: 'rgba(255,253,249,0.3)' }}>
            <div style={{ 
              flex: 1, 
              borderRight: isMobile ? '1px solid var(--glass-border)' : 'none', 
              borderBottom: isMobile ? 'none' : '1px solid var(--glass-border)', 
              padding: '2rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              textAlign: 'center', 
              background: 'var(--surface-2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎁</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Gifting & Bulk</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Curated hampers for every occasion.</p>
              <Link href="/shop?category=Gift" style={{ marginTop: '1rem', textDecoration: 'underline', fontSize: '0.8rem', fontWeight: 600 }}>Explore Gifting</Link>
            </div>
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1614088523011-8e0192d6e38b?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>New Launches</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', position: 'relative', zIndex: 1 }}>Discover the latest arrivals.</p>
              <Link href="/shop" style={{ marginTop: '1rem', textDecoration: 'underline', fontSize: '0.8rem', fontWeight: 600, position: 'relative', zIndex: 1 }}>View All</Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── TYPES NAV (COCOCART DENSITY) ──────────────────────── */}
      <section style={{ 
        borderBottom: '1px solid var(--glass-border)', 
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
      }}>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 2rem', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat, idx) => (
            <Link key={cat.title} href={cat.href} style={{ 
              padding: '1.5rem 2rem', 
              borderRight: idx === CATEGORIES.length - 1 ? 'none' : '1px solid var(--text-primary)',
              whiteSpace: 'nowrap',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'background 0.2s'
            }}
            className="hover-bg-surface-2"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (BRUTALIST GRID) ────────────────── */}
      <section style={{ padding: isMobile ? '3rem 1rem' : '6rem 2rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag" style={{ marginBottom: '1rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)' }}>Bestsellers</span>
              <h2 style={{ fontSize: isMobile ? '1.5rem' : 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase' }}>
                Curated <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Classics</span>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost">View All</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isTablet ? 2 : 2}, 1fr)`, gap: isMobile ? '1rem' : '2rem' }}>
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.name} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Image Placeholder */}
                <div style={{ height: isMobile ? '200px' : '300px', borderBottom: '1px solid var(--text-primary)', position: 'relative', background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <img src={product.imgUrl} alt={product.name} className="hover-scale-105" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg)', border: '1px solid var(--text-primary)', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {product.brand}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>{product.name}</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>{product.price}</p>
                  </div>
                  <button className="btn-gold" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMOTIONAL BANNERS (ASYMMETRIC) ──────────────────── */}
      <section style={{ padding: '0', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
          
          <div style={{ 
            padding: isMobile ? '3rem 2rem' : '6rem 4rem', 
            borderRight: isMobile ? 'none' : '1px solid var(--glass-border)', 
            background: 'var(--surface-2)',
            backdropFilter: 'blur(16px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', lineHeight: 1 }}>Bulk<br/>Orders</h2>
            <p style={{ marginBottom: '2rem', maxWidth: '300px' }}>Corporate gifting and wholesale inquiries available at special rates.</p>
            <Link href="/shop" className="btn-gold shadow-brutal" style={{ width: 'fit-content' }}>Inquire Now</Link>
          </div>

          <div style={{ 
            padding: isMobile ? '3rem 2rem' : '6rem 4rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            position: 'relative', 
            overflow: 'hidden',
            background: 'rgba(255,253,249,0.5)',
            backdropFilter: 'blur(20px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1548135894-0d9db893ab63?q=80&w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', lineHeight: 1, position: 'relative', zIndex: 1 }}>Sugar Free<br/>Collection</h2>
            <p style={{ marginBottom: '2rem', maxWidth: '300px', position: 'relative', zIndex: 1 }}>Indulgence without the guilt. Discover our premium zero-sugar range.</p>
            <Link href="/shop?category=Sugar%20Free" className="btn-ghost shadow-brutal" style={{ width: 'fit-content', background: 'var(--glass-bg)', position: 'relative', zIndex: 1, backdropFilter: 'blur(8px)' }}>Shop Collection</Link>
          </div>

        </div>
      </section>

    </div>
  );
}