'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (pathname !== '/admin/login') {
      if (!token || user.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  if (!isClient) return null;

  if (pathname === '/admin/login') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      display: 'flex',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
      color: 'var(--text-primary)',
    }}>
      {/* Glass Sidebar */}
      <aside style={{ 
        width: '260px', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        borderRight: '1px solid var(--glass-border)',
      }}>
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(255,253,249,0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 900, 
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
          }}>
            ChocoLuxe
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Admin Panel
          </p>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { href: '/admin', label: 'Dashboard', icon: '◉' },
            { href: '/admin/products', label: 'Products', icon: '◇' },
            { href: '/admin/orders', label: 'Orders', icon: '○' },
            { href: '/admin/users', label: 'Users', icon: '◎' },
          ].map(item => {
            const isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/admin');
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--glass-bg)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--glass-border)' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,253,249,0.4)', backdropFilter: 'blur(8px)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', color: 'var(--text-muted)', transition: 'all 0.2s ease', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>↗</span>
            View Store
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/login');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>⊖</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'rgba(255,253,249,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}