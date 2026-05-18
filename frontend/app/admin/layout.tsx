'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, FolderTree, Settings, ExternalLink, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (pathname !== '/admin/login') {
      if (!token || user.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [isClient, pathname, router]);

  if (!isClient) return null;

  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F2EC] via-[#EDE4DA] to-[#F7F2EC] flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#F7F2EC] via-[#EDE4DA] to-[#F7F2EC]">
      <aside className={`glass-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="flex items-center justify-between p-5 border-b border-[rgba(185,139,106,0.15)]">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-serif italic text-[#4B2E2A] tracking-tight">ChocoLuxe</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#8B7355] mt-0.5">Admin Panel</p>
            </div>
          )}
          {collapsed && (
            <span className="text-xl font-serif italic text-[#D4AF37] mx-auto">C</span>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/admin');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} strokeWidth={1.5} className="flex-shrink-0" />
                {!collapsed && <span className="text-[11px] uppercase tracking-wider">{item.label}</span>}
                {isActive && !collapsed && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 space-y-1 border-t border-[rgba(185,139,106,0.15)]">
          <Link href="/" target="_blank" className="nav-item">
            <ExternalLink size={18} strokeWidth={1.5} />
            {!collapsed && <span className="text-[11px] uppercase tracking-wider">View Store</span>}
          </Link>
          <button onClick={handleLogout} className="nav-item w-full text-red-500 hover:bg-red-50">
            <LogOut size={18} strokeWidth={1.5} />
            {!collapsed && <span className="text-[11px] uppercase tracking-wider">Sign Out</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-md hover:bg-[#C9A227] transition-colors"
        >
          {collapsed ? <ChevronRight size={12} className="text-[#2D1810]" /> : <ChevronLeft size={12} className="text-[#2D1810]" />}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      <style jsx>{`
        .glass-sidebar {
          width: 260px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: relative;
        }
        .glass-sidebar.collapsed {
          width: 80px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #8B7355;
          transition: all 0.2s ease;
          text-decoration: none;
          border: 1px solid transparent;
        }
        .nav-item:hover {
          background: rgba(185, 139, 106, 0.08);
          color: #4B2E2A;
        }
        .nav-item.active {
          background: rgba(212, 175, 55, 0.12);
          border-color: rgba(212, 175, 55, 0.25);
          color: #4B2E2A;
        }
        .glass-sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}