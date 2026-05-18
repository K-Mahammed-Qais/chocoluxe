'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Package, Plus, Search, Edit2, Trash2, X, Star, Image as ImageIcon, ChevronDown } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  img_url: string;
  description: string;
  isFeatured: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Premium',
    stock: '',
    imageUrl: '',
    isFeatured: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ['All', 'Imported', 'Gift Boxes', 'Premium', 'Dark Chocolate', 'Milk Chocolate', 'White Chocolate', 'Nuts & Fruits'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchProducts(token);
  }, [router]);

  const fetchProducts = async (token: string) => {
    try {
      const { data } = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: (product.stock || 100).toString(),
        imageUrl: product.img_url || '',
        isFeatured: product.isFeatured || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: 'Premium', stock: '', imageUrl: '', isFeatured: false });
    }
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 100,
        img_url: formData.imageUrl,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        isFeatured: formData.isFeatured,
        in_stock: true,
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/products', payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowModal(false);
      fetchProducts(token);
    } catch {
      setError('Failed to save product');
    }
  };

  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem('token') || '';
    try {
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDeleteConfirm(null);
      fetchProducts(token);
    } catch {
      setError('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto mb-4" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#4B2E2A]">Products</h1>
          <p className="text-[#8B7355] text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] text-[#2D1810] text-[11px] uppercase tracking-wider hover:bg-[#C9A227] transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="glass-input w-full pl-12 pr-4 py-3 bg-white/80" />
        </div>
        <div className="relative">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="glass-input appearance-none pr-10 py-3 bg-white/80 cursor-pointer">
            {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7355] pointer-events-none" />
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 flex items-center justify-between">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-[#8B7355]"><X size={16} /></button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] text-[#8B7355] border-b border-[rgba(185,139,106,0.1)]">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Stock</th>
                <th className="text-left px-6 py-4">Featured</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-[rgba(185,139,106,0.1)] hover:bg-[rgba(185,139,106,0.05)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[rgba(185,139,106,0.1)] flex-shrink-0">
                        {product.img_url ? <img src={product.img_url} alt={product.name} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="m-auto text-[#8B7355]" />}
                      </div>
                      <p className="text-[#4B2E2A] font-serif">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-[rgba(212,175,55,0.1)] text-[#B8860B] text-[10px] uppercase tracking-wider">{product.category}</span></td>
                  <td className="px-6 py-4 text-[#4B2E2A] font-serif">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider ${(product.stock || 100) < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{product.stock || 100} units</span></td>
                  <td className="px-6 py-4">{product.isFeatured ? <Star size={16} className="text-[#D4AF37] fill-current" /> : '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(product)} className="p-2 rounded-lg hover:bg-[rgba(212,175,55,0.1)] text-[#8B7355] hover:text-[#D4AF37] transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteConfirm(product._id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8B7355] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16"><Package size={48} strokeWidth={0.5} className="mx-auto mb-4 text-[#8B7355]" /><p className="text-[#8B7355]">No products found</p></div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(75,46,42,0.4)] backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg p-8 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif text-[#4B2E2A]">{editingProduct ? 'Edit' : 'Add'} Product</h2>
              <button onClick={() => setShowModal(false)} className="text-[#8B7355] hover:text-[#4B2E2A]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Product Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input w-full bg-white/80" /></div>
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Description</label><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="glass-input w-full bg-white/80 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Price (₹)</label><input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="glass-input w-full bg-white/80" /></div>
                <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Stock</label><input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="glass-input w-full bg-white/80" /></div>
              </div>
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="glass-input w-full bg-white/80 appearance-none">{categories.filter(c => c !== 'All').map((cat) => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
              <div><label className="block text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Image URL</label><input type="url" required value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="glass-input w-full bg-white/80" /></div>
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-5 h-5 rounded border-[rgba(185,139,106,0.3)] bg-white/80 accent-[#D4AF37]" /><span className="text-[#4B2E2A]">Featured Product</span></label>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-gold py-3">{editingProduct ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 glass-btn glass-btn-outline py-3">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(75,46,42,0.4)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card w-full max-w-sm p-8 animate-fade-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-lg font-serif text-[#4B2E2A] mb-2">Delete Product?</h3>
            <p className="text-[#8B7355] text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 glass-btn glass-btn-outline py-3">Cancel</button>
              <button onClick={() => deleteProduct(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[11px] uppercase tracking-wider hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}