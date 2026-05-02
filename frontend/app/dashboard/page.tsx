'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData(token);
    fetchOrders(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      const { data } = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const fetchOrders = async (token: string) => {
    try {
      const { data } = await axios.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user && !loading) return null;

  return (
    <div className="pt-32 pb-20 min-h-screen relative">
      {/* Background Orbs */}
      <div className="orb top-20 left-10 w-[400px] h-[400px] bg-[rgba(212,175,55,0.03)]"></div>
      <div className="orb bottom-20 right-10 w-[500px] h-[500px] bg-[rgba(212,175,55,0.02)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gold-gradient animate-fade-up">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-up animate-fade-up-delay-1">
          {/* Sidebar */}
          <div className="glass-card p-6 h-fit">
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--gold)]/30 bg-[var(--gold)]/10">
                <span className="text-3xl font-bold text-gold-gradient">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[var(--cream)]">{user?.name}</h2>
              <p className="text-[var(--text-muted)] text-sm mt-1">{user?.email}</p>
            </div>
            
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'orders' 
                    ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold-bright)] font-semibold' 
                    : 'text-[var(--cream)] hover:bg-white/5 border border-transparent'
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'wishlist' 
                    ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold-bright)] font-semibold' 
                    : 'text-[var(--cream)] hover:bg-white/5 border border-transparent'
                }`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === 'addresses' 
                    ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[var(--gold-bright)] font-semibold' 
                    : 'text-[var(--cream)] hover:bg-white/5 border border-transparent'
                }`}
              >
                Saved Addresses
              </button>
              <div className="pt-4 mt-4 border-t border-[var(--gold)]/10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 rounded-xl text-[#ff6b6b] hover:bg-[#ff6b6b]/10 border border-transparent transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="glass-card p-8 min-h-[500px]">
                <h2 className="text-2xl font-bold text-[var(--cream)] mb-8">Order History</h2>
                
                {loading ? (
                  <div className="flex flex-col gap-4">
                    <div className="h-24 w-full rounded-xl shimmer"></div>
                    <div className="h-24 w-full rounded-xl shimmer"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-[var(--text-muted)] mb-6 text-lg">You haven't placed any orders yet.</div>
                    <Link href="/shop" className="btn-gold">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-[var(--gold)]/20 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                          <div>
                            <p className="font-semibold text-[var(--cream)] text-lg">Order #{String(order._id).slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30' :
                            order.status === 'Shipped' ? 'bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/30' :
                            'bg-[var(--gold)]/20 text-[var(--gold-bright)] border border-[var(--gold)]/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-between items-center pt-4 border-t border-[var(--gold)]/10">
                          <span className="text-[var(--text-muted)]">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
                          <span className="text-xl font-bold text-gold-gradient">${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="glass-card p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4 opacity-50">💝</div>
                  <h2 className="text-2xl font-bold text-[var(--cream)] mb-2">Your Wishlist</h2>
                  <p className="text-[var(--text-muted)]">Save your favorite chocolates for later.</p>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="glass-card p-8 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4 opacity-50">📍</div>
                  <h2 className="text-2xl font-bold text-[var(--cream)] mb-2">Saved Addresses</h2>
                  <p className="text-[var(--text-muted)]">Manage your shipping and billing addresses here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}