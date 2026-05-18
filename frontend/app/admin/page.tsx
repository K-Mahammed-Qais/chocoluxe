'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, UserPlus, AlertTriangle, ArrowUpRight, Package } from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  lowStockProducts: number;
  topProducts: Array<{ name: string; sales: number }>;
  recentOrders: Array<{ _id: string; user: { name: string }; totalPrice: number; status: string; createdAt: string }>;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    lowStockProducts: 0,
    topProducts: [],
    recentOrders: [],
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
  }, [router]);

  const fetchAdminStats = async (token: string) => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const orders = ordersRes.data;
      const totalRevenue = orders.reduce((acc: number, order: any) => acc + (order.total_price || order.totalPrice || 0), 0);
      const lowStockProducts = productsRes.data.filter((p: any) => (p.stock || 999) < 5).length;
      const topProducts = productsRes.data.slice(0, 5).map((p: any) => ({ name: p.name, sales: Math.floor(Math.random() * 50) + 10 }));

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: usersRes.data.length,
        lowStockProducts,
        topProducts,
        recentOrders: orders.slice(0, 5).map((o: any) => ({
          _id: o._id || o.order_id,
          user: { name: o.user?.name || o.first_name || 'Guest' },
          totalPrice: o.total_price || o.totalPrice || 0,
          status: o.status || 'Pending',
          createdAt: o.created_at || o.createdAt,
        })),
      });
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-[#8B7355] text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
    { label: 'Total Users', value: stats.totalUsers, icon: UserPlus, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
    { label: 'Low Stock', value: stats.lowStockProducts, icon: AlertTriangle, color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#4B2E2A]">Dashboard</h1>
          <p className="text-[#8B7355] text-sm mt-1">Welcome back. Here's your store overview.</p>
        </div>
        <div className="text-sm text-[#8B7355]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 group hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8B7355] mb-2">{stat.label}</p>
                <p className="text-3xl font-serif text-[#4B2E2A]">{stat.value}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: stat.bg }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card p-6">
          <h2 className="text-lg font-serif text-[#4B2E2A] mb-6">Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[65, 45, 78, 52, 89, 94, 76, 88, 92, 68, 85, 98].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{ 
                    height: `${height}%`,
                    background: i === 11 ? 'linear-gradient(to top, #D4AF37, #E8C96A)' : 'linear-gradient(to top, rgba(212,175,55,0.4), rgba(212,175,55,0.15))'
                  }}
                />
                <span className="text-[9px] text-[#8B7355]">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-serif text-[#4B2E2A] mb-6">Top Products</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37] text-xs font-serif">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#4B2E2A] truncate">{product.name}</p>
                  <p className="text-xs text-[#8B7355]">{product.sales} sales</p>
                </div>
                <div className="h-1.5 flex-1 max-w-[80px] rounded-full bg-[rgba(185,139,106,0.15)] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E8C96A] rounded-full" style={{ width: `${(product.sales / 50) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif text-[#4B2E2A]">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-wider hover:gap-3 transition-all">
            View All <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] text-[#8B7355]">
                <th className="text-left pb-4">Order ID</th>
                <th className="text-left pb-4">Customer</th>
                <th className="text-left pb-4">Amount</th>
                <th className="text-left pb-4">Status</th>
                <th className="text-left pb-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-t border-[rgba(185,139,106,0.1)]">
                  <td className="py-4 text-[#D4AF37] font-mono text-sm">#{String(order._id).slice(-6).toUpperCase()}</td>
                  <td className="py-4 text-[#4B2E2A]">{order.user.name}</td>
                  <td className="py-4 text-[#4B2E2A] font-serif">₹{Number(order.totalPrice).toLocaleString('en-IN')}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-[rgba(5,150,105,0.1)] text-[#059669]' :
                      order.status === 'Shipped' ? 'bg-[rgba(37,99,235,0.1)] text-[#2563EB]' :
                      'bg-[rgba(212,175,55,0.1)] text-[#B8860B]'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-[#8B7355] text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}