'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Users, Search, Shield, Mail, CheckCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [blockConfirm, setBlockConfirm] = useState<{ id: string; action: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const { data } = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(data.map((u: any) => ({ ...u, ordersCount: Math.floor(Math.random() * 10) + 1, totalSpent: Math.floor(Math.random() * 50000) + 1000 })));
    } catch { setError('Failed to fetch users'); } finally { setLoading(false); }
  };

  const toggleBlock = async (userId: string, currentStatus: boolean) => {
    const token = localStorage.getItem('token') || '';
    try {
      await axios.put(`/api/users/${userId}/block`, { isBlocked: !currentStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setBlockConfirm(null);
      fetchUsers(token);
    } catch { setError('Failed to update user status'); }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto mb-4" /></div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-serif text-[#4B2E2A]">Users</h1><p className="text-[#8B7355] text-sm mt-1">{users.length} registered users</p></div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
          <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="glass-input w-full pl-12 pr-4 py-3 bg-white/80" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="glass-input appearance-none pr-10 py-3 bg-white/80 cursor-pointer">
          <option value="All">All Roles</option><option value="user">User</option><option value="admin">Admin</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.15em] text-[#8B7355] border-b border-[rgba(185,139,106,0.1)]">
              <th className="text-left px-6 py-4">User</th><th className="text-left px-6 py-4">Role</th><th className="text-left px-6 py-4">Status</th><th className="text-left px-6 py-4">Orders</th><th className="text-left px-6 py-4">Spent</th><th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id || user.id} className="border-b border-[rgba(185,139,106,0.1)] hover:bg-[rgba(185,139,106,0.03)] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center"><span className="text-[#D4AF37] font-serif text-sm">{(user.name || 'U')[0]?.toUpperCase()}</span></div>
                    <div><p className="text-[#4B2E2A] font-serif">{user.name}</p><p className="text-[#8B7355] text-xs flex items-center gap-1"><Mail size={10} />{user.email}</p></div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${user.role === 'admin' ? 'bg-[rgba(212,175,55,0.1)] text-[#B8860B] border-[rgba(212,175,55,0.2)]' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{user.role === 'admin' ? <Shield size={10} /> : null}{user.role}</span></td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                <td className="px-6 py-4 text-[#8B7355]">{user.ordersCount || 0}</td>
                <td className="px-6 py-4 text-[#4B2E2A] font-serif">₹{(user.totalSpent || 0).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  {user.role !== 'admin' && (
                    <button onClick={() => setBlockConfirm({ id: user._id || user.id, action: user.isBlocked ? 'unblock' : 'block' })} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors ${user.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                      <CheckCircle size={12} />{user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <div className="text-center py-16"><Users size={48} strokeWidth={0.5} className="mx-auto mb-4 text-[#8B7355]" /><p className="text-[#8B7355]">No users found</p></div>}
      </div>

      {blockConfirm && (
        <div className="fixed inset-0 bg-[rgba(75,46,42,0.4)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-sm p-8 animate-fade-up text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${blockConfirm.action === 'block' ? 'bg-red-100' : 'bg-green-100'}`}>
              {blockConfirm.action === 'block' ? <Shield size={24} className="text-red-500" /> : <CheckCircle size={24} className="text-green-500" />}
            </div>
            <h3 className="text-lg font-serif text-[#4B2E2A] mb-2">{blockConfirm.action === 'block' ? 'Block User?' : 'Unblock User?'}</h3>
            <p className="text-[#8B7355] text-sm mb-6">{blockConfirm.action === 'block' ? 'This user will not be able to access their account.' : 'This user will be able to access their account again.'}</p>
            <div className="flex gap-4">
              <button onClick={() => setBlockConfirm(null)} className="flex-1 glass-btn glass-btn-outline py-3">Cancel</button>
              <button onClick={() => { const u = users.find(x => (x._id || x.id) === blockConfirm.id); if (u) toggleBlock(blockConfirm.id, u.isBlocked); }} className={`flex-1 py-3 rounded-xl text-[11px] uppercase tracking-wider transition-colors ${blockConfirm.action === 'block' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                {blockConfirm.action === 'block' ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}