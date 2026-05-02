'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?category=Gift%20Hamper', label: 'Gift Hampers' },
  { href: '/shop?category=Sugar%20Free', label: 'Sugar Free' },
];

const SUPPORT_LINKS = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/shipping', label: 'Shipping Info' },
  { href: '/returns', label: 'Returns Policy' },
  { href: '/faq', label: 'FAQ' },
];

const TYPES = [
  { href: '/shop?category=Milk%20Chocolates', label: 'Milk Chocolates' },
  { href: '/shop?category=Dark%20Chocolates', label: 'Dark Chocolates' },
  { href: '/shop?category=White%20Chocolates', label: 'White Chocolates' },
  { href: '/shop?category=Assorted', label: 'Assorted' },
];

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer style={{ 
      background: 'rgba(26, 10, 0, 0.75)', 
      backdropFilter: 'blur(20px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
      borderTop: '1px solid rgba(26,10,0,0.15)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '5rem 2rem 0', position: 'relative', zIndex: 1 }}>

        {/* Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize: '2rem',
                fontWeight: 900,
                fontStyle: 'italic',
                color: '#FFFDF9',
                letterSpacing: '-0.03em',
              }}>
                ChocoLuxe
              </span>
            </div>
            <p style={{ color: 'rgba(255,253,249,0.5)', fontSize: '0.875rem', lineHeight: 1.9, marginBottom: '2rem', maxWidth: '240px' }}>
              India&apos;s premium imported chocolate destination. All products are 100% authentic and sourced directly from global brands.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { label: 'Instagram', href: '#' },
                { label: 'Facebook', href: '#' },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="footer-social-icon"
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Sweet Selections */}
          <div>
            <h4 style={{ color: '#FFFDF9', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Sweet Selections
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {TYPES.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFDF9', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#FFFDF9', fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Get in Touch
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '✉', text: 'hello@chocoluxe.com' },
                { icon: '☎', text: '+91 80012 02278' },
                { icon: '📍', text: 'Mumbai, India' },
              ].map(item => (
                <li key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'rgba(255,253,249,0.5)', fontSize: '0.875rem' }}>
                  <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,253,249,0.08)',
          padding: '1.75rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,253,249,0.3)', fontSize: '0.8rem' }}>
            © {year} ChocoLuxe. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a
                key={item}
                href="#"
                className="footer-link"
                style={{ fontSize: '0.8rem' }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: rgba(255,253,249,0.45);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: rgba(255,253,249,0.9); }
        .footer-social-icon {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255,253,249,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,253,249,0.45);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .footer-social-icon:hover {
          border-color: rgba(255,253,249,0.5);
          color: rgba(255,253,249,0.9);
          background: rgba(255,253,249,0.05);
        }
      `}</style>
    </footer>
  );
}