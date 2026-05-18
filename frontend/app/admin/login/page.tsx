'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      if (data.user?.role !== 'admin') {
        setError('Admin access only');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F2EC] via-[#EDE4DA] to-[#F7F2EC]">
      <div className="w-full max-w-md p-8">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif italic text-[#4B2E2A]">ChocoLuxe</h1>
            <p className="text-[#8B7355] text-sm mt-2">Admin Access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full bg-white/80"
                placeholder="admin@chocoluxe.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full bg-white/80"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#2D1810] font-sans text-[11px] uppercase tracking-wider hover:bg-[#C9A227] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-[#8B7355] text-xs hover:text-[#D4AF37] transition-colors">
              Back to user login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}