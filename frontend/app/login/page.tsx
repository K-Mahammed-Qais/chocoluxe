'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(data.user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#F7F2EC] via-[#EDE4DA] to-[#F7F2EC]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-5xl grid md:grid-cols-2 gap-8 relative z-10">
        <div className="hidden md:flex glass-card flex-col justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1614088523011-8e0192d6e38b?q=80&w=1200" alt="Chocolate" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <Link href="/"><span className="font-serif italic text-[36px] text-[#4B2E2A] tracking-[-0.03em]">ChocoLuxe</span></Link>
            <h2 className="font-serif text-[48px] text-[#4B2E2A] leading-[1.1] mt-12 uppercase">Premium<br/><span className="italic">Indulgence</span></h2>
            <p className="font-sans font-light text-[13px] text-[#8B7355] mt-8 leading-[1.8]">Discover the finest handcrafted chocolates from around the world.</p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-12">
          <div className="text-center mb-10">
            <Link href="/" className="md:hidden mb-6 inline-block"><span className="font-serif italic text-[28px] text-[#4B2E2A] tracking-[-0.03em]">ChocoLuxe</span></Link>
            <h1 className="font-serif text-[32px] text-[#4B2E2A] mb-2">Welcome Back</h1>
            <p className="font-sans font-light text-[11px] text-[#8B7355] uppercase tracking-[0.1em]">Sign in to continue your chocolate journey</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 font-sans text-[11px]">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.12em] text-[#8B7355] mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="glass-input w-full pl-12 bg-white/80" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.12em] text-[#8B7355] mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="glass-input w-full pl-12 pr-12 bg-white/80" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#4B2E2A] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="glass-btn w-full justify-center">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center font-sans text-[11px] text-[#8B7355] mt-8">
            Don&apos;t have an account? <Link href="/register" className="text-[#D4AF37] hover:text-[#C9A227] transition-colors">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}