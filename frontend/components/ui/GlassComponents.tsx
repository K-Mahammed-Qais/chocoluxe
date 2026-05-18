'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  padding?: string;
}

export default function GlassCard({ children, className = '', dark = false, padding = 'p-6' }: GlassCardProps) {
  return (
    <div className={`${dark ? 'glass-card-dark' : 'glass-card'} ${padding} ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'gold' | 'blue' | 'green' | 'red';
}

export function StatCard({ title, value, icon, trend, color = 'gold' }: StatCardProps) {
  const colorClasses = {
    gold: 'from-[rgba(212,175,55,0.15)] to-transparent border-[rgba(212,175,55,0.2)]',
    blue: 'from-[rgba(96,165,250,0.15)] to-transparent border-[rgba(96,165,250,0.2)]',
    green: 'from-[rgba(74,222,128,0.15)] to-transparent border-[rgba(74,222,128,0.2)]',
    red: 'from-[rgba(248,113,113,0.15)] to-transparent border-[rgba(248,113,113,0.2)]',
  };

  const iconColorClasses = {
    gold: 'text-[var(--gold)]',
    blue: 'text-[#60a5fa]',
    green: 'text-[#4ade80]',
    red: 'text-[#f87171]',
  };

  return (
    <div className={`glass-card-dark bg-gradient-to-br ${colorClasses[color]} border p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[rgba(255,253,249,0.5)] mb-2">
            {title}
          </p>
          <p className="font-serif text-[32px] text-[#FFFDF9] leading-none">{value}</p>
          {trend && (
            <p className={`font-sans text-[10px] mt-2 ${trend.isPositive ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-[rgba(255,255,255,0.05)] ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function GlassButton({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  icon
}: GlassButtonProps) {
  const baseClasses = 'font-sans font-medium inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'text-[9px] px-4 py-2 tracking-[0.1em]',
    md: 'text-[10px] px-6 py-3 tracking-[0.12em]',
    lg: 'text-[11px] px-8 py-4 tracking-[0.15em]',
  };

  const variantClasses = {
    primary: 'glass-btn',
    outline: 'glass-btn glass-btn-outline',
    ghost: 'bg-transparent text-[rgba(255,253,249,0.7)] hover:text-[#FFFDF9] border border-transparent hover:border-[rgba(255,253,249,0.2)]',
    danger: 'bg-[rgba(248,113,113,0.2)] text-[#f87171] border border-[rgba(248,113,113,0.3)] hover:bg-[rgba(248,113,113,0.3)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content ${sizeClasses[size]} animate-fade-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-[24px] text-[#FFFDF9]">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[rgba(255,253,249,0.5)] hover:text-[#FFFDF9] transition-colors p-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
}

export function InputField({ label, type = 'text', value, onChange, placeholder, error, required, icon }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block font-sans text-[10px] uppercase tracking-[0.12em] text-[rgba(255,253,249,0.5)] mb-2">
        {label} {required && <span className="text-[#f87171]">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,253,249,0.3)]">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`glass-input w-full ${icon ? 'pl-12' : ''} ${error ? 'border-[#f87171]' : ''}`}
        />
      </div>
      {error && (
        <p className="font-sans text-[10px] text-[#f87171] mt-1">{error}</p>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses: Record<string, string> = {
    pending: 'status-pending',
    processing: 'status-pending',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`status-badge ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}

interface LoadingSkeletonProps {
  height?: string;
  className?: string;
}

export function LoadingSkeleton({ height = '100px', className = '' }: LoadingSkeletonProps) {
  return (
    <div 
      className={`shimmer rounded-lg ${className}`} 
      style={{ height }}
    />
  );
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const typeClasses = {
    success: 'border-[rgba(74,222,128,0.3)] text-[#4ade80]',
    error: 'border-[rgba(248,113,113,0.3)] text-[#f87171]',
    info: 'border-[rgba(96,165,250,0.3)] text-[#60a5fa]',
  };

  return (
    <div className={`fixed bottom-6 right-6 glass-card-dark border ${typeClasses[type]} px-6 py-4 flex items-center gap-4 z-[200] animate-fade-up`}>
      <span className="font-sans text-[11px]">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}