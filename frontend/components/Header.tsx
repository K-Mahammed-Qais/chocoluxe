'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, Heart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';
import UserAccount from './UserAccount';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop', hasMegaMenu: true },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'Our Craft' },
];

export default function Header() {
  const pathname = usePathname();
  const setCartOpen = useCartStore((state) => state.setIsOpen);
  const setWishlistOpen = useWishlistStore((state) => state.setIsOpen);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setActiveMegaMenu(null);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] shadow-[0_8px_40px_rgba(75,46,42,0.08)]">
      <div 
        className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="flex items-center justify-between h-[88px]">
          
          {/* Mobile Menu Icon */}
          <button className="md:hidden text-[var(--primary-text)]">
            <Menu size={20} strokeWidth={1} />
          </button>

          {/* Left Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14 flex-1">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.href}
                className="relative"
                onMouseEnter={() => link.hasMegaMenu && setActiveMegaMenu(link.href)}
              >
                <Link
                  href={link.href}
                  className={`font-sans font-light text-[10px] uppercase tracking-[0.15em] transition-colors duration-400 ${
                    pathname === link.href ? 'text-[var(--primary-text)]' : 'text-[var(--surface)] hover:text-[var(--primary-text)]'
                  }`}
                >
                  {link.label}
                </Link>
                {link.hasMegaMenu && activeMegaMenu === link.href && (
                  <MegaMenu onClose={() => setActiveMegaMenu(null)} />
                )}
              </div>
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
          <div className="flex items-center justify-end gap-6 md:gap-8 lg:gap-10 flex-1">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <UserAccount />
            <button 
              onClick={() => setWishlistOpen(true)}
              className="text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400 relative hidden md:block"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[var(--accent)] text-[var(--background)] text-[8px] font-sans font-light rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="text-[var(--surface)] hover:text-[var(--primary-text)] transition-colors duration-400 relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={18} strokeWidth={1} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[var(--primary-text)] text-[var(--background)] text-[8px] font-sans font-light rounded-full w-4 h-4 flex items-center justify-center">
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