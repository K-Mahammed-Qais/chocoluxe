import axios from 'axios';

const SHEETDB_API_URL = process.env.NEXT_PUBLIC_SHEETDB_API_URL || '';

const sheetdbClient = axios.create({
  baseURL: SHEETDB_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export interface SheetProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price?: number;
  in_stock: boolean;
  img_url: string;
  description: string;
  origin?: string;
  cacao?: string;
  weight?: string;
  category: string;
  tasting_notes: string[];
  stock?: number;
  isFeatured?: boolean;
}

export interface SheetOrder {
  order_id: string;
  email: string;
  first_name: string;
  last_name: string;
  street_address: string;
  apartment?: string;
  city: string;
  postal_code: string;
  delivery_method: 'standard' | 'express';
  items: string;
  total_price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'Pending' | 'Shipped' | 'Delivered';
  created_at: string;
  user?: { name?: string; email?: string };
  shippingAddress?: { street?: string; city?: string; state?: string; zipCode?: string };
  orderItems?: Array<{ product?: { name?: string }; name?: string; quantity?: number; price?: number }>;
  isPaid?: boolean;
  paymentMethod?: string;
  _id?: string;
}

export interface SheetUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

async function getSheetData(sheetName: string): Promise<any[]> {
  try {
    const response = await sheetdbClient.get('', { params: { sheet: sheetName } });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching from ${sheetName}:`, error);
    return [];
  }
}

async function appendToSheet(sheetName: string, data: any[]): Promise<boolean> {
  try {
    const response = await sheetdbClient.post('', { data }, { params: { sheet: sheetName } });
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    return false;
  }
}

async function replaceSheetData(sheetName: string, data: any[]): Promise<boolean> {
  try {
    const response = await sheetdbClient.post('', { data }, { params: { sheet: sheetName } });
    return response.status === 201 || response.status === 200;
  } catch (error) {
    console.error(`Error replacing ${sheetName}:`, error);
    return false;
  }
}

async function searchSheet(sheetName: string, field: string, value: string): Promise<any[]> {
  try {
    const response = await sheetdbClient.get('/search', {
      params: { sheet: sheetName, [field]: value }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
}

// ============ PRODUCTS ============

export async function getSheetProducts(): Promise<SheetProduct[]> {
  const data = await getSheetData('products');
  return data.map((item: any, idx: number) => ({
    id: item.id || String(idx + 1),
    slug: item.slug || '',
    name: item.name || '',
    price: parseFloat(item.price) || 0,
    original_price: item.original_price ? parseFloat(item.original_price) : undefined,
    in_stock: item.in_stock !== undefined ? String(item.in_stock).toLowerCase() === 'true' : true,
    img_url: item.img_url || item.imgUrl || item.imageUrl || '',
    description: item.description || '',
    origin: item.origin || '',
    cacao: item.cacao || '',
    weight: item.weight || '',
    category: item.category || 'All',
    tasting_notes: parseTastingNotes(item.tasting_notes),
    stock: parseInt(item.stock) || 999,
    isFeatured: String(item.isFeatured || item.featured || '').toLowerCase() === 'true',
  }));
}

export async function getSheetProductBySlug(slug: string): Promise<SheetProduct | null> {
  try {
    const data = await searchSheet('products', 'slug', slug);
    if (data.length === 0) return null;
    const item = data[0];
    return {
      id: item.id || String(Math.random()),
      slug: item.slug || '',
      name: item.name || '',
      price: parseFloat(item.price) || 0,
      original_price: item.original_price ? parseFloat(item.original_price) : undefined,
      in_stock: item.in_stock !== undefined ? String(item.in_stock).toLowerCase() === 'true' : true,
      img_url: item.img_url || item.imgUrl || item.imageUrl || '',
      description: item.description || '',
      origin: item.origin || '',
      cacao: item.cacao || '',
      weight: item.weight || '',
      category: item.category || 'All',
      tasting_notes: parseTastingNotes(item.tasting_notes),
      stock: parseInt(item.stock) || 999,
      isFeatured: String(item.isFeatured || item.featured || '').toLowerCase() === 'true',
    };
  } catch (error) {
    return null;
  }
}

export async function addSheetProduct(product: Omit<SheetProduct, 'id'>): Promise<boolean> {
  const id = String(Date.now());
  const data = [{
    id,
    slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
    name: product.name,
    price: String(product.price),
    in_stock: product.in_stock ? 'true' : 'false',
    img_url: product.img_url || '',
    description: product.description || '',
    category: product.category || 'Premium',
    stock: String(product.stock || 100),
    isFeatured: product.isFeatured ? 'true' : 'false',
    origin: product.origin || '',
    cacao: product.cacao || '',
    weight: product.weight || '',
    tasting_notes: Array.isArray(product.tasting_notes) ? product.tasting_notes.join(', ') : '',
  }];
  return appendToSheet('products', data);
}

export async function updateSheetProduct(id: string, product: Partial<SheetProduct>): Promise<boolean> {
  try {
    const products = await getSheetData('products');
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      const newProduct = { ...product, id };
      return appendToSheet('products', [newProduct]);
    }
    
    const updated = { ...products[index], ...product };
    products[index] = updated;
    return replaceSheetData('products', products);
  } catch (error) {
    console.error('Update product error:', error);
    return false;
  }
}

export async function deleteSheetProduct(id: string): Promise<boolean> {
  try {
    const products = await getSheetData('products');
    const filtered = products.filter((p: any) => p.id !== id);
    return replaceSheetData('products', filtered);
  } catch (error) {
    return false;
  }
}

// ============ ORDERS ============

export async function getSheetOrders(): Promise<SheetOrder[]> {
  const data = await getSheetData('orders');
  return data.map((item: any, idx: number) => ({
    order_id: item.order_id || item.id || String(idx + 1),
    email: item.email || '',
    first_name: item.first_name || item.name || '',
    last_name: item.last_name || '',
    street_address: item.street_address || item.address || '',
    apartment: item.apartment || '',
    city: item.city || '',
    postal_code: item.postal_code || item.zipCode || '',
    delivery_method: (item.delivery_method || 'standard') as 'standard' | 'express',
    items: item.items || '',
    total_price: parseFloat(item.total_price || item.price || 0),
    status: (item.status || 'Pending') as SheetOrder['status'],
    created_at: item.created_at || item.date || new Date().toISOString(),
    user: { name: item.first_name || item.name || '', email: item.email || '' },
    shippingAddress: {
      street: item.street_address || '',
      city: item.city || '',
      state: item.state || '',
      zipCode: item.postal_code || '',
    },
    orderItems: parseOrderItems(item.items),
    isPaid: item.isPaid !== undefined ? String(item.isPaid).toLowerCase() === 'true' : item.status === 'COMPLETED',
    paymentMethod: item.payment_method || item.paymentMethod || 'COD',
    _id: item.order_id || item.id,
  }));
}

function parseOrderItems(items: string): Array<{ product?: { name: string }; name?: string; quantity: number; price: number }> {
  if (!items) return [];
  try {
    const parsed = JSON.parse(items);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  
  const parts = items.split(',').map((s: string) => s.trim());
  return parts.map((p: string) => {
    const match = p.match(/(.+?)\s*x\s*(\d+)/i);
    if (match) {
      return { product: { name: match[1].trim() }, quantity: parseInt(match[2]), price: 0 };
    }
    return { product: { name: p }, quantity: 1, price: 0 };
  });
}

export async function addSheetOrder(order: Omit<SheetOrder, 'created_at' | 'status'>): Promise<boolean> {
  const data = [{
    id: String(Date.now()),
    email: order.email,
    first_name: order.first_name,
    last_name: order.last_name || '',
    street_address: order.street_address,
    city: order.city,
    postal_code: order.postal_code,
    delivery_method: order.delivery_method,
    items: order.items,
    total_price: String(order.total_price),
    status: 'Pending',
    created_at: new Date().toISOString(),
    payment_method: 'COD',
    isPaid: 'false',
  }];
  return appendToSheet('orders', data);
}

export async function updateSheetOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const orders = await getSheetData('orders');
    const index = orders.findIndex((o: any) => o.order_id === orderId || o.id === orderId);
    if (index === -1) return false;
    
    orders[index].status = status;
    return replaceSheetData('orders', orders);
  } catch (error) {
    return false;
  }
}

// ============ USERS ============

export async function getSheetUsers(): Promise<SheetUser[]> {
  const data = await getSheetData('users');
  return data.map((item: any, idx: number) => ({
    id: item.id || String(idx + 1),
    name: item.name || '',
    email: item.email || '',
    password: item.password || '',
    role: item.role || 'user',
    isBlocked: String(item.isBlocked || item.blocked || 'false').toLowerCase() === 'true',
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
  }));
}

export async function getSheetUserByEmail(email: string): Promise<SheetUser | null> {
  try {
    const data = await searchSheet('users', 'email', email);
    if (data.length > 0) {
      const item = data[0];
      return {
        id: item.id || String(Math.random()),
        name: item.name || '',
        email: item.email || '',
        password: item.password || '',
        role: item.role || 'user',
        isBlocked: String(item.isBlocked || item.blocked || 'false').toLowerCase() === 'true',
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      };
    }
    const users = await getSheetData('users');
    const user = users.find((u: any) => u.email?.toLowerCase() === email?.toLowerCase());
    if (user) {
      return {
        id: user.id || String(Math.random()),
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        role: user.role || 'user',
        isBlocked: String(user.isBlocked || user.blocked || 'false').toLowerCase() === 'true',
        createdAt: user.createdAt || user.created_at || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function addSheetUser(user: Omit<SheetUser, 'id'>): Promise<boolean> {
  const id = String(Date.now());
  const data = [{
    id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role || 'user',
    isBlocked: user.isBlocked ? 'true' : 'false',
    createdAt: user.createdAt || new Date().toISOString(),
  }];
  return appendToSheet('users', data);
}

export async function updateSheetUserBlock(userId: string, isBlocked: boolean): Promise<boolean> {
  try {
    const users = await getSheetData('users');
    const index = users.findIndex((u: any) => u.id === userId);
    if (index === -1) return false;
    
    users[index].isBlocked = isBlocked ? 'true' : 'false';
    return replaceSheetData('users', users);
  } catch (error) {
    return false;
  }
}

// ============ HELPERS ============

function parseTastingNotes(notesField: any): string[] {
  if (!notesField) return [];
  if (Array.isArray(notesField)) return notesField;
  
  try {
    const parsed = JSON.parse(notesField);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    if (typeof notesField === 'string' && notesField.includes(',')) {
      return notesField.split(',').map(s => s.trim());
    }
  }

  return [String(notesField)];
}