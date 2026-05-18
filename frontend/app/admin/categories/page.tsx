'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FolderTree, Plus, Edit2, Trash2, X, Package } from 'lucide-react';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([
    { id: '1', name: 'Imported', slug: 'imported', description: 'Premium imported chocolates from around the world', productCount: 12 },
    { id: '2', name: 'Gift Boxes', slug: 'gift-boxes', description: 'Luxurious gift sets for every occasion', productCount: 8 },
    { id: '3', name: 'Premium', slug: 'premium', description: 'Our finest handcrafted chocolates', productCount: 15 },
    { id: '4', name: 'Dark Chocolate', slug: 'dark-chocolate', description: 'Rich and intense dark chocolate creations', productCount: 10 },
    { id: '5', name: 'Milk Chocolate', slug: 'milk-chocolate', description: 'Smooth and creamy milk chocolate delights', productCount: 14 },
  ]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [router]);

  const openModal = (category?: any) => {
    if (category) { setEditingCategory(category); setFormData({ name: category.name, description: category.description }); }
    else { setEditingCategory(null); setFormData({ name: '', description: '' }); }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-') } : c));
    } else {
      setCategories([...categories, { id: String(Date.now()), ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-'), productCount: 0 }]);
    }
    setShowModal(false);
  };

  const deleteCategory = (id: string) => { setCategories(categories.filter(c => c.id !== id)); setDeleteConfirm(null); };

  const getCategoryIcon = (name: string) => ({ 'Imported': '🌍', 'Gift Boxes': '🎁', 'Premium': '✨', 'Dark Chocolate': '🍫', 'Milk Chocolate': '🥛' }[name] || '📦');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-serif text-[#4B2E2A]">Categories</h1><p className="text-[#8B7355] text-sm mt-1">{categories.length} categories</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] text-[#2D1810] text-[11px] uppercase tracking-wider hover:bg-[#C9A227] transition-colors"><Plus size={16} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="glass-card p-6 group hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-2xl">{getCategoryIcon(category.name)}</div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(category)} className="p-2 rounded-lg hover:bg-[rgba(212,175,55,0.1)] text-[#8B7355] hover:text-[#D4AF37] transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(category.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8B7355] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="text-lg font-serif text-[#4B2E2A] mb-2">{category.name}</h3>
            <p className="text-[#8B7355] text-sm mb-4 line-clamp-2">{category.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(185,139,106,0.1)]">
              <div className="flex items-center gap-2 text-[#8B7355] text-sm"><Package size={14} /><span>{category.productCount} products</span></div>
              <span className="text-[10px] uppercase tracking-wider text-[#8B7355]">/{category.slug}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(75,46,42,0.4)] backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md p-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8"><h2 className="text-xl font-serif text-[#4B2E2A]">{editingCategory ? 'Edit' : 'Add'} Category</h2><button onClick={() => setShowModal(false)} className="text-[#8B7355] hover:text-[#4B2E2A]"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Category Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input w-full bg-white/80" placeholder="Dark Chocolate" /></div>
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Description</label><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="glass-input w-full bg-white/80 resize-none" placeholder="Rich and intense dark chocolate..." /></div>
              <div className="flex gap-4 pt-4"><button type="submit" className="flex-1 btn-gold py-3">{editingCategory ? 'Update' : 'Create'}</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 glass-btn glass-btn-outline py-3">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(75,46,42,0.4)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-sm p-8 animate-fade-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-lg font-serif text-[#4B2E2A] mb-2">Delete Category?</h3><p className="text-[#8B7355] text-sm mb-6">Products in this category will become uncategorized.</p>
            <div className="flex gap-4"><button onClick={() => setDeleteConfirm(null)} className="flex-1 glass-btn glass-btn-outline py-3">Cancel</button><button onClick={() => deleteCategory(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[11px] uppercase tracking-wider hover:bg-red-600 transition-colors">Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
}