'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

function InputField({
  id, label, type, value, onChange, autoComplete, placeholder, hint,
}: {
  id: string; label: string; type: string; value: string;
  onChange: (v: string) => void; autoComplete?: string; placeholder?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{
        display: 'block', fontSize: '0.75rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        color: focused ? '#1A0A00' : 'rgba(26,10,0,0.45)',
        marginBottom: '0.5rem', transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <input
        id={id} name={id} type={type} autoComplete={autoComplete}
        required placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '0.85rem 1.1rem',
          background: '#fff',
          border: `1px solid ${focused ? '#1A0A00' : 'rgba(26,10,0,0.15)'}`,
          borderRadius: '0px', color: '#1A0A00', fontSize: '0.95rem',
          outline: 'none', transition: 'border-color 0.25s',
          boxShadow: focused ? '3px 3px 0px rgba(26,10,0,0.1)' : 'none',
        }}
      />
      {hint && <p style={{ fontSize: '0.72rem', color: 'rgba(26,10,0,0.35)', marginTop: '0.35rem' }}>{hint}</p>}
    </div>
  );
}

const PERKS = [
  { icon: '🎁', text: 'Early access to limited editions' },
  { icon: '💌', text: 'Curated tasting notes by email' },
  { icon: '🏷️', text: 'Members-only discounts' },
  { icon: '🚀', text: 'Free shipping on first order' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF9', display: 'flex', alignItems: 'stretch' }}>

      {/* Left decorative panel */}
      <div style={{
        flex: '0 0 45%', background: '#1A0A00',
        display: 'none', flexDirection: 'column', justifyContent: 'space-between',
        padding: '5rem 4rem', position: 'relative', overflow: 'hidden',
      }} className="register-left-panel">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', color: '#FFFDF9', letterSpacing: '-0.03em' }}>
              ChocoLuxe
            </span>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '2.5rem', fontWeight: 900, color: '#FFFDF9', lineHeight: 1.1, marginTop: '4rem', textTransform: 'uppercase' }}>
            Join the<br/>Chocolate<br/>Club
          </h2>
          <p style={{ color: 'rgba(255,253,249,0.5)', marginTop: '1.5rem', lineHeight: 1.7, maxWidth: '280px' }}>
            Unlock an exclusive world of artisan chocolate experiences.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0', borderTop: '1px solid rgba(255,253,249,0.08)' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{p.icon}</span>
              <span style={{ color: 'rgba(255,253,249,0.6)', fontSize: '0.875rem' }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', color: '#1A0A00' }}>
                ChocoLuxe
              </span>
            </Link>
          </div>

          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', color: '#1A0A00', textTransform: 'uppercase' }}>
            Create Account
          </h1>
          <p style={{ color: 'rgba(26,10,0,0.45)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
            Start your premium chocolate journey today.
          </p>

          {error && (
            <div style={{ padding: '0.85rem 1.1rem', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.3)', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <InputField id="name" label="Full Name" type="text" value={name} onChange={setName} autoComplete="name" placeholder="Your full name" />
            <InputField id="email" label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
            <InputField id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="Min. 6 characters" hint="Use a mix of letters, numbers, and symbols." />

            <p style={{ fontSize: '0.75rem', color: 'rgba(26,10,0,0.3)', lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <a href="#" style={{ color: '#1A0A00', textDecoration: 'underline' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#1A0A00', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>

            <button id="register-submit" type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem', padding: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  Creating Account…
                </span>
              ) : 'Create My Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,10,0,0.1)' }} />
            <span style={{ color: 'rgba(26,10,0,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Have an account?</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,10,0,0.1)' }} />
          </div>

          <Link href="/login" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', padding: '0.9rem' }}>
            Sign In Instead
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .register-left-panel { display: flex !important; } }
      `}</style>
    </div>
  );
}