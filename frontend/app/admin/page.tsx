'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchAdminStats(token);
  }, []);

  const fetchAdminStats = async (token: string) => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const totalRevenue = ordersRes.data.reduce((acc: number, order: any) => acc + order.totalPrice, 0);
      const lowStockProducts = productsRes.data.filter((p: any) => p.stock < 5).length;

      setStats({
        totalOrders: ordersRes.data.length,
        totalRevenue,
        totalUsers: usersRes.data.length,
        lowStockProducts,
      });
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
    }}>
      Loading...
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ 
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <h1 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
          fontWeight: 900, 
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
        }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Welcome back. Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: '◉', color: '#D4AF37' },
          { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: '◇', color: '#22c55e' },
          { label: 'Users', value: stats.totalUsers, icon: '◯', color: '#3b82f6' },
          { label: 'Low Stock', value: stats.lowStockProducts, icon: '◐', color: '#ef4444' },
        ].map((stat, idx) => (
          <div 
            key={idx}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
              display: 'flex',
              alignItems: 'space-between',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {stat.value}
              </p>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              color: stat.color,
            }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { href: '/admin/products', label: 'Manage Products', desc: 'Add, edit, and remove products', icon: '◇' },
            { href: '/admin/orders', label: 'Manage Orders', desc: 'View and update order status', icon: '○' },
            { href: '/admin/users', label: 'Manage Users', desc: 'View and block/unblock users', icon: '◎' },
          ].map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="glass-card"
              style={{
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '6px',
                background: 'var(--surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                flexShrink: 0,
              }}>
                {link.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{link.label}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}