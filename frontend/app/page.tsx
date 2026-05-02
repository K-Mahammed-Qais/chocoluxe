import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'ChocoLuxe — Premium Artisan Chocolates',
  description: 'Indulge in handcrafted luxury chocolates from the world\'s finest cacao regions. Shop imported delights, gift boxes, and premium selections.',
};

export default function Home() {
  return <HomeClient />;
}