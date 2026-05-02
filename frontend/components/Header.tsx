'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Must be AFTER all hooks (Rules of Hooks)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: scrolled ? 'rgba(255, 253, 249, 0.75)' : 'rgba(255, 253, 249, 0.4)',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(8px) saturate(1.2)',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(8px) saturate(1.2)',
          borderBottom: scrolled ? '1px solid rgba(26,10,0,0.08)' : '1px solid rgba(26,10,0,0.04)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#1A0A00',
                letterSpacing: '-0.03em',
              }}>
                ChocoLuxe
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  style={{ fontWeight: pathname === link.href ? 700 : 500 }}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/shop?category=Gift%20Hamper" className="nav-link">Gifting</Link>
              <Link href="/shop" className="nav-link">New Launches</Link>

              {user ? (
                <>
                  <Link href="/dashboard" className="nav-link">Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="nav-link">Admin</Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      transition: 'color 0.2s',
                      padding: 0,
                      textTransform: 'uppercase',
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">Login</Link>
                  <Link href="/register" className="btn-gold" style={{ padding: '0.6rem 1.6rem', fontSize: '0.78rem' }}>
                    Register
                  </Link>
                </>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                style={{ position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                aria-label="Shopping cart"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </Link>
            </nav>

            {/* Mobile Hamburger */}
            <button
              type="button"
              id="mobile-menu-btn"
              aria-label="Toggle mobile menu"
              onClick={() => setOpen(!open)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: 'var(--text-primary)',
              }}
              className="mobile-menu-btn"
            >
              <div style={{ width: '24px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ display: 'block', height: '2px', background: 'var(--text-primary)', borderRadius: '0', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }}/>
                <span style={{ display: 'block', height: '2px', background: 'var(--text-primary)', borderRadius: '0', transition: 'all 0.3s', opacity: open ? 0 : 1 }}/>
                <span style={{ display: 'block', height: '2px', background: 'var(--text-primary)', borderRadius: '0', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}/>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          style={{
            overflow: 'hidden',
            maxHeight: open ? '500px' : '0',
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
            background: '#FFFDF9',
            borderTop: open ? '1px solid rgba(26,10,0,0.1)' : 'none',
          }}
        >
          <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '1rem 0',
                  borderBottom: '1px solid rgba(26,10,0,0.08)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/shop?category=Gift" style={{ padding: '1rem 0', borderBottom: '1px solid rgba(26,10,0,0.08)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gifting</Link>
            {user ? (
              <>
                <Link href="/dashboard" style={{ padding: '1rem 0', borderBottom: '1px solid rgba(26,10,0,0.08)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dashboard</Link>
                {user.role === 'admin' && <Link href="/admin" style={{ padding: '1rem 0', borderBottom: '1px solid rgba(26,10,0,0.08)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</Link>}
                <button onClick={handleLogout} style={{ padding: '1rem 0', background: 'none', border: 'none', color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ padding: '1rem 0', borderBottom: '1px solid rgba(26,10,0,0.08)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Login</Link>
                <Link href="/register" style={{ padding: '1rem 0', borderBottom: '1px solid rgba(26,10,0,0.08)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Register</Link>
              </>
            )}
            <Link href="/cart" style={{ padding: '1rem 0', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cart 🛒</Link>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}