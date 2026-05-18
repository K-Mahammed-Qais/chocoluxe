'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/store';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'Our Craft' },
];

export default function Header() {
  const pathname = usePathname();
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Must be AFTER all hooks (Rules of Hooks)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] shadow-[0_8px_40px_rgba(75,46,42,0.08)]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="flex items-center justify-between h-[80px]">
          
          {/* Mobile Menu Icon */}
          <button className="md:hidden text-[var(--primary-text)]">
            <Menu size={20} strokeWidth={1} />
          </button>

          {/* Left Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans font-light text-[10px] uppercase tracking-[0.15em] transition-colors duration-400 ${
                  pathname === link.href ? 'text-[var(--primary-text)]' : 'text-[var(--surface)] hover:text-[var(--primary-text)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo (Centered) */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-decoration-none">
              <span className="font-serif italic text-[28px] text-[var(--primary-text)] tracking-[-0.03em]">
                ChocoLuxe
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-8 flex-1">
            <button className="text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400">
              <Search size={18} strokeWidth={1} />
            </button>
            <Link 
              href="/login" 
              className="hidden md:block font-sans font-light text-[10px] uppercase tracking-[0.15em] text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400"
            >
              Account
            </Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400 relative"
            >
              <ShoppingBag size={18} strokeWidth={1} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[var(--primary-text)] text-[var(--background)] text-[8px] font-sans font-light rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}