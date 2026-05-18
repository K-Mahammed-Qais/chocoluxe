'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, MapPin, Settings, LogOut, Package, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useWishlistStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';

interface Address {
  _id?: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({ type: 'shipping', street: '', city: '', state: '', zipCode: '', country: 'India' });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const { items: wishlistItems, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchUserData(token);
    fetchOrders(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      const { data } = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
      setUser(data);
    } catch { localStorage.removeItem('token'); router.push('/login'); }
  };

  const fetchOrders = async (token: string) => {
    try {
      const { data } = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const myOrders = data.filter((o: any) => o.email === user?.email || o.user?.email === user?.email);
      setOrders(myOrders.length ? myOrders : data.slice(0, 3));
    } catch {} finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); };

  const handleMoveToCart = (item: any) => {
    addToCart({ id: item.id, slug: item.slug, name: item.name, price: item.price, imgUrl: item.imgUrl, quantity: 1 });
    removeItem(item.id);
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user && !loading) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F7F2EC] via-[#EDE4DA] to-[#F7F2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center">
            <span className="text-2xl font-serif gold-gradient">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#4B2E2A]">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-[#8B7355] text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="glass-card p-4 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id ? 'bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)] text-[#4B2E2A]' : 'text-[#8B7355] hover:bg-[rgba(185,139,106,0.08)] border border-transparent'}`}>
                    <tab.icon size={18} strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                  </button>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-[rgba(185,139,106,0.15)]">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                  <LogOut size={18} strokeWidth={1.5} />
                  <span className="text-[11px] uppercase tracking-wider">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'orders' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-serif text-[#4B2E2A] mb-8">Order History</h2>
                {loading ? <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl shimmer" />)}</div> :
                 orders.length === 0 ? <div className="text-center py-16"><Package size={48} strokeWidth={0.5} className="mx-auto mb-6 text-[#8B7355]" /><p className="text-[#8B7355] mb-6">No orders yet</p><Link href="/shop" className="btn-gold">Start Shopping</Link></div> :
                 <div className="space-y-4">
                   {orders.map((order) => (
                     <div key={order._id || order.order_id} className="border border-[rgba(185,139,106,0.15)] rounded-xl p-6 hover:bg-[rgba(185,139,106,0.03)] transition-colors">
                       <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                         <div>
                           <p className="text-[10px] uppercase tracking-wider text-[#8B7355] mb-1">Order</p>
                           <p className="font-serif text-xl text-[#4B2E2A]">#{String(order._id || order.order_id).slice(-6).toUpperCase()}</p>
                           <p className="text-xs text-[#8B7355] mt-1">{new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider ${
                           order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                           order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                           'bg-[rgba(212,175,55,0.1)] text-[#B8860B]'
                         }`}>{order.status || 'Pending'}</span>
                       </div>
                       <div className="flex flex-wrap justify-between items-center pt-4 border-t border-[rgba(185,139,106,0.1)]">
                         <span className="text-[#8B7355] text-sm">{(order.orderItems || []).length} item{order.orderItems?.length !== 1 ? 's' : ''}</span>
                         <span className="text-2xl font-serif gold-gradient">₹{Number(order.total_price || order.totalPrice || 0).toLocaleString('en-IN')}</span>
                       </div>
                     </div>
                   ))}
                 </div>}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-serif text-[#4B2E2A] mb-8">Your Wishlist</h2>
                {wishlistItems.length === 0 ? <div className="text-center py-16"><Heart size={48} strokeWidth={0.5} className="mx-auto mb-6 text-[#8B7355]" /><p className="text-[#8B7355] mb-6">Your wishlist is empty</p><Link href="/shop" className="btn-gold">Browse Collection</Link></div> :
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {wishlistItems.map((item) => (
                     <div key={item.id} className="border border-[rgba(185,139,106,0.15)] rounded-xl p-4 hover:bg-[rgba(185,139,106,0.03)] transition-colors flex gap-4">
                       <Link href={`/shop/${item.slug}`} className="w-24 h-24 relative rounded-lg overflow-hidden bg-[rgba(185,139,106,0.1)] flex-shrink-0">
                         <Image src={item.imgUrl} alt={item.name} fill className="object-cover" sizes="96px" />
                       </Link>
                       <div className="flex-1 min-w-0">
                         <Link href={`/shop/${item.slug}`} className="font-serif text-[#4B2E2A] hover:text-[#D4AF37] transition-colors block truncate">{item.name}</Link>
                         {item.origin && <p className="text-[10px] text-[#8B7355] uppercase tracking-wider mt-1">{item.origin}</p>}
                         <p className="text-lg font-serif gold-gradient mt-2">₹{item.price}</p>
                         <div className="flex gap-3 mt-3">
                           <button onClick={() => handleMoveToCart(item)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#D4AF37] hover:text-[#C9A227] transition-colors"><ShoppingBag size={12} /> Move to Cart</button>
                           <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"><Trash2 size={12} /> Remove</button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif text-[#4B2E2A]">Saved Addresses</h2>
                  <button onClick={() => { setEditingAddress(null); setAddressForm({ type: 'shipping', street: '', city: '', state: '', zipCode: '', country: 'India' }); setShowAddressModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(212,175,55,0.1)] text-[#B8860B] text-[10px] uppercase tracking-wider hover:bg-[rgba(212,175,55,0.2)] transition-colors">
                    <Plus size={14} /> Add New
                  </button>
                </div>
                <div className="text-center py-16"><MapPin size={48} strokeWidth={0.5} className="mx-auto mb-6 text-[#8B7355]" /><p className="text-[#8B7355] mb-6">No saved addresses</p></div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-serif text-[#4B2E2A] mb-8">Account Settings</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-serif text-[#4B2E2A] mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Full Name</label><div className="glass-input bg-white/80 px-4 py-3 rounded-xl text-[#4B2E2A]">{user?.name}</div></div>
                      <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Email</label><div className="glass-input bg-white/80 px-4 py-3 rounded-xl text-[#4B2E2A]">{user?.email}</div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardWithSuspense() {
  return (<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#8B7355]">Loading...</div>}><DashboardPage /></Suspense>);
}

export default DashboardWithSuspense;