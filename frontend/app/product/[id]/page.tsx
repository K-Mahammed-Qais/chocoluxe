'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products/${params.id}`);
      setProduct(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    setAddingToCart(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddingToCart(false);
    alert('Added to cart!');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFFDF9', paddingTop: '100px', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ height: '600px', background: 'linear-gradient(90deg, #f5f5f5 25%, #ebebeb 50%, #f5f5f5 75%)', backgroundSize: '200% auto', animation: 'shimmer 1.5s linear infinite' }} />
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#FFFDF9', paddingTop: '120px', paddingBottom: '5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <div style={{ color: 'rgba(26,10,0,0.5)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>{error}</div>
      <button onClick={() => router.back()} className="btn-ghost">Go Back</button>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#FFFDF9', paddingTop: '120px', paddingBottom: '5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍫</div>
      <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.5rem', marginBottom: '0.75rem', color: '#1A0A00' }}>Product not found</h3>
      <button onClick={() => router.push('/shop')} className="btn-gold">Return to Shop</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF9', paddingTop: '72px', paddingBottom: '5rem' }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid rgba(26,10,0,0.08)', padding: '1.25rem 2rem', background: '#FFF4E3' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'rgba(26,10,0,0.45)', fontWeight: 500 }}>
          <Link href="/" style={{ color: 'rgba(26,10,0,0.45)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'rgba(26,10,0,0.45)', textDecoration: 'none' }}>Shop</Link>
          <span>/</span>
          <span style={{ color: '#1A0A00', fontWeight: 700 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Image */}
          <div style={{ border: '1px solid rgba(26,10,0,0.1)', height: '520px', position: 'relative', background: '#FFF4E3', overflow: 'hidden' }}>
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', background: '#FFF4E3' }}>
                🍫
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {product.category && (
              <span className="section-tag" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>{product.category}</span>
            )}

            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: '#1A0A00', marginBottom: '1rem', lineHeight: 1.1, textTransform: 'uppercase' }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(26,10,0,0.08)' }}>
              <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '2.5rem', fontWeight: 900, color: '#1A0A00' }}>
                ₹{product.price?.toFixed(0)}
              </span>
            </div>

            <p style={{ color: 'rgba(26,10,0,0.6)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              {product.description}
            </p>

            {/* Availability & Quantity */}
            <div style={{ padding: '1.5rem', border: '1px solid rgba(26,10,0,0.1)', background: '#fff', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: product.stock > 0 ? '1.5rem' : 0 }}>
                <span style={{ color: '#1A0A00', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Availability</span>
                {product.stock > 0 ? (
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
                    Out of Stock
                  </span>
                )}
              </div>

              {product.stock > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#1A0A00', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(26,10,0,0.15)', overflow: 'hidden' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '0.6rem 1.1rem', background: 'none', border: 'none', color: '#1A0A00', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FFF4E3')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      −
                    </button>
                    <span style={{ padding: '0 1.25rem', fontWeight: 700, color: '#1A0A00', borderLeft: '1px solid rgba(26,10,0,0.1)', borderRight: '1px solid rgba(26,10,0,0.1)' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={{ padding: '0.6rem 1.1rem', background: 'none', border: 'none', color: '#1A0A00', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FFF4E3')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={addToCart} disabled={addingToCart} className="btn-ghost" style={{ flex: '1', minWidth: '160px', justifyContent: 'center' }}>
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button onClick={() => { addToCart(); router.push('/cart'); }} className="btn-gold" style={{ flex: '1', minWidth: '160px', justifyContent: 'center' }}>
                  Buy Now
                </button>
              </div>
            )}

            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(26,10,0,0.35)', lineHeight: 1.6 }}>
              🚚 Melt-free delivery across India &nbsp;·&nbsp; 100% Authentic &nbsp;·&nbsp; Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}