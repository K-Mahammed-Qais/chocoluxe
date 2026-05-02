'use client';

import React, { useState, useEffect } from 'react';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function useSafeAreaInsets(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0', 10),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0', 10),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0', 10),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0', 10),
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}

interface SafeAreaProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  className?: string;
}

export function SafeAreaView({ children, edges = ['top', 'bottom'], className = '' }: SafeAreaProps) {
  const insets = useSafeAreaInsets();
  
  const style: React.CSSProperties = {};
  
  if (edges.includes('top')) {
    style.paddingTop = Math.max(insets.top, 16);
  }
  if (edges.includes('bottom')) {
    style.paddingBottom = Math.max(insets.bottom, 16);
  }
  if (edges.includes('left')) {
    style.paddingLeft = insets.left;
  }
  if (edges.includes('right')) {
    style.paddingRight = insets.right;
  }

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}