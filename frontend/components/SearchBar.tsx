'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { getSheetProducts } from '@/lib/sheetdb';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getSheetProducts();
        setAllProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const searchTerm = query.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm) ||
          p.category?.toLowerCase().includes(searchTerm) ||
          p.origin?.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
      ).slice(0, 6);
      
      setResults(filtered);
      setIsOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search chocolates..."
          className="w-0 md:w-48 lg:w-64 bg-transparent border-b border-transparent focus:border-[var(--accent)] text-[13px] font-sans font-light text-[var(--primary-text)] px-2 py-1 outline-none transition-all duration-300 focus:w-64 lg:focus:w-80"
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--surface)] hover:text-[var(--primary-text)]"
          >
            <X size={14} strokeWidth={1} />
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--surface)] hover:text-[var(--primary-text)]"
          >
            <Search size={18} strokeWidth={1} />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 w-[380px] md:w-[420px] bg-[var(--background)] shadow-[var(--card-shadow)] border border-[var(--muted)]/20 mt-2 z-50">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-[var(--muted)]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[var(--muted)] w-3/4" />
                      <div className="h-3 bg-[var(--muted)] w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-[480px] overflow-y-auto">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-[var(--muted)]/20 transition-colors group"
                >
                  <div className="w-12 h-12 relative overflow-hidden bg-[var(--surface)] flex-shrink-0">
                    <Image
                      src={product.img_url || product.imgUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-serif text-[15px] text-[var(--primary-text)] block truncate group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </span>
                    <span className="font-sans text-[10px] text-[var(--surface)] uppercase tracking-[0.05em]">
                      {product.category}
                    </span>
                  </div>
                  <span className="font-serif text-[14px] text-[var(--primary-text)]">
                    ₹{product.price}
                  </span>
                </Link>
              ))}
              <div className="p-3 border-t border-[var(--muted)]/20">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="flex items-center justify-center gap-2 font-sans text-[10px] uppercase tracking-[0.1em] text-[var(--primary-text)] hover:text-[var(--accent)] transition-colors py-2"
                >
                  View all results for &quot;{query}&quot; <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="font-sans text-[12px] text-[var(--surface)] uppercase tracking-[0.05em]">
                No results found
              </p>
              <p className="font-sans text-[10px] text-[var(--muted)] mt-2">
                Try searching for &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}