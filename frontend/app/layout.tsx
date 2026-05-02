import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChocoLuxe — Premium Artisan Chocolates',
  description: 'Indulge in handcrafted luxury chocolates sourced from the world\'s finest cacao regions. Free shipping on orders over ₹2500.',
  keywords: ['premium chocolate', 'artisan chocolate', 'luxury chocolate', 'gift chocolate', 'imported chocolates India'],
  openGraph: {
    title: 'ChocoLuxe — Premium Artisan Chocolates',
    description: 'Handcrafted luxury chocolates from the world\'s finest cacao regions.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}