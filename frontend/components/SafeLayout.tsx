'use client';

import { useSafeAreaInsets } from '@/lib/safe-area';
import { ReactNode } from 'react';

interface SafeLayoutProps {
  children: ReactNode;
}

export default function SafeLayout({ children }: SafeLayoutProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <div style={{ 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      minHeight: '100vh',
    }}>
      {children}
    </div>
  );
}