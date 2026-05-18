'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ShoppingCart, Eye, Search, Package, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchOrders(token);
  }, [router]);

  const fetchOrders = async (token: string) => {
    try {
      const { data } = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      setOrders(data);
    } catch { setError('Failed to fetch orders'); } finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem('token') || '';
    try {
      if (status === 'Delivered') {
        await axios.put(`/api/orders/${orderId}/deliver`, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.put(`/api/orders/${orderId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchOrders(token);
    } catch { setError('Failed to update order status'); }
  };

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (order.order_id || order._id || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name || order.first_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-600';
      case 'Shipped': return 'bg-blue-100 text-blue-600';
      case 'Processing': return 'bg-purple-100 text-purple-600';
      case 'Cancelled': return 'bg-red-100 text-red-500';
      default: return 'bg-[rgba(212,175,55,0.1)] text-[#B8860B]';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto mb-4" /></div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-serif text-[#4B2E2A]">Orders</h1><p className="text-[#8B7355] text-sm mt-1">{orders.length} total orders</p></div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
          <input type="text" placeholder="Search by order ID, customer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="glass-input w-full pl-12 pr-4 py-3 bg-white/80" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input appearance-none pr-10 py-3 bg-white/80 cursor-pointer">
          <option value="All">All Status</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id || order.order_id} className="glass-card overflow-hidden">
            <div className="p-6 cursor-pointer hover:bg-[rgba(185,139,106,0.03)] transition-colors" onClick={() => setExpandedOrder(expandedOrder === (order._id || order.order_id) ? null : (order._id || order.order_id))}>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center"><ShoppingCart size={18} className="text-[#D4AF37]" /></div>
                  <div>
                    <p className="text-[#D4AF37] font-mono text-sm">#{String(order._id || order.order_id).slice(-6).toUpperCase()}</p>
                    <p className="text-[#4B2E2A] font-serif mt-1">{order.user?.name || order.first_name || 'Guest'}</p>
                    <p className="text-[#8B7355] text-xs">{order.email || order.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-serif text-[#4B2E2A]">₹{Number(order.total_price || order.totalPrice || 0).toLocaleString('en-IN')}</p>
                  <p className="text-[#8B7355] text-xs mt-1">{new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[rgba(185,139,106,0.1)]">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider ${getStatusColor(order.status)}`}>{order.status}</span>
                  <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span>
                </div>
                <select value={order.status} onChange={(e) => { e.stopPropagation(); updateStatus(order._id || order.order_id, e.target.value); }} onClick={(e) => e.stopPropagation()} className="glass-input text-[10px] uppercase tracking-wider py-2 px-3 bg-white/80 appearance-none cursor-pointer">
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {expandedOrder === (order._id || order.order_id) && (
              <div className="px-6 pb-6 border-t border-[rgba(185,139,106,0.1)]">
                <div className="mt-4 pt-4"><h4 className="text-[10px] uppercase tracking-wider text-[#8B7355] mb-3">Shipping Address</h4><p className="text-[#4B2E2A]">{order.street_address || order.shippingAddress?.street}</p><p className="text-[#8B7355] text-sm">{order.city || order.shippingAddress?.city}, {order.state || order.shippingAddress?.state} {order.postal_code || order.shippingAddress?.zipCode}</p></div>
                <div className="mt-4 pt-4"><h4 className="text-[10px] uppercase tracking-wider text-[#8B7355] mb-3">Order Items</h4><div className="space-y-2">{order.orderItems?.map((item: any, idx: number) => (<div key={idx} className="flex justify-between py-2 border-b border-[rgba(185,139,106,0.05)]"><span className="text-[#4B2E2A]">{item.product?.name || item.name || 'Product'} x{item.quantity}</span><span className="text-[#8B7355]">₹{item.price || 0}</span></div>))}</div></div>
              </div>
            )}
          </div>
        ))}
        {filteredOrders.length === 0 && <div className="glass-card text-center py-16"><ShoppingCart size={48} strokeWidth={0.5} className="mx-auto mb-4 text-[#8B7355]" /><p className="text-[#8B7355]">No orders found</p></div>}
      </div>
    </div>
  );
}