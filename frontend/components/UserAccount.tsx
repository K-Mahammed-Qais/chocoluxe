'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlistStore } from '@/lib/store';

export default function UserAccount() {
  const { user, logout } = useAuth();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  const menuItems = [
    { icon: User, label: 'My Account', href: '/dashboard' },
    { icon: Package, label: 'My Orders', href: '/dashboard?tab=orders' },
    { icon: Heart, label: `Wishlist (${wishlistCount})`, href: '/dashboard?tab=wishlist' },
  ];

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="font-sans font-light text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400"
      >
        Account
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-sans font-light text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400"
      >
        <span className="hidden md:inline">
          {user?.name?.split(' ')[0] || 'Account'}
        </span>
        <ChevronDown 
          size={12} 
          strokeWidth={1} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 w-56 bg-[var(--background)] shadow-[var(--card-shadow)] border border-[var(--muted)]/20 mt-3 z-50"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          <div className="p-4 border-b border-[var(--muted)]/20">
            <p className="font-serif text-[16px] text-[var(--primary-text)]">
              {user?.name}
            </p>
            <p className="font-sans text-[10px] text-[var(--surface)] truncate mt-1">
              {user?.email}
            </p>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)]/20 transition-colors group"
              >
                <item.icon 
                  size={16} 
                  strokeWidth={1} 
                  className="text-[var(--surface)] group-hover:text-[var(--accent)]" 
                />
                <span className="font-sans text-[11px] text-[var(--primary-text)] group-hover:text-[var(--accent)] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="border-t border-[var(--muted)]/20 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full hover:bg-[var(--muted)]/20 transition-colors group"
            >
              <LogOut 
                size={16} 
                strokeWidth={1} 
                className="text-[var(--surface)] group-hover:text-[var(--error)]" 
              />
              <span className="font-sans text-[11px] text-[var(--primary-text)] group-hover:text-[var(--error)] transition-colors">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}