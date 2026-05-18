import axios from 'axios';

const SHEETDB_API_URL = process.env.NEXT_PUBLIC_SHEETDB_API_URL || '';

if (!SHEETDB_API_URL) {
  console.warn('SheetDB API URL is missing. Please add NEXT_PUBLIC_SHEETDB_API_URL to your .env.local file.');
}

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
  items: string; // JSON string or comma-separated list of items
  total_price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

/**
 * Fetches all products from the 'products' sheet tab.
 */
export async function getSheetProducts(): Promise<SheetProduct[]> {
  try {
    const response = await sheetdbClient.get('', {
      params: { sheet: 'products' }
    });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: parseFloat(item.price) || 0,
      original_price: item.original_price ? parseFloat(item.original_price) : undefined,
      in_stock: String(item.in_stock).toLowerCase() === 'true',
      img_url: item.img_url || item.imgUrl || '',
      description: item.description || '',
      origin: item.origin || '',
      cacao: item.cacao || '',
      weight: item.weight || '',
      category: item.category || 'All',
      tasting_notes: parseTastingNotes(item.tasting_notes)
    }));
  } catch (error) {
    console.error('Error fetching products from SheetDB:', error);
    return [];
  }
}

/**
 * Fetches a single product from the 'products' sheet by its slug.
 */
export async function getSheetProductBySlug(slug: string): Promise<SheetProduct | null> {
  try {
    const response = await sheetdbClient.get('/search', {
      params: {
        sheet: 'products',
        slug: slug
      }
    });

    const data = Array.isArray(response.data) ? response.data : [];
    if (data.length === 0) return null;

    const item = data[0];
    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: parseFloat(item.price) || 0,
      original_price: item.original_price ? parseFloat(item.original_price) : undefined,
      in_stock: String(item.in_stock).toLowerCase() === 'true',
      img_url: item.img_url || item.imgUrl || '',
      description: item.description || '',
      origin: item.origin || '',
      cacao: item.cacao || '',
      weight: item.weight || '',
      category: item.category || 'All',
      tasting_notes: parseTastingNotes(item.tasting_notes)
    };
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}" from SheetDB:`, error);
    return null;
  }
}

/**
 * Submits a new order to the 'orders' sheet tab.
 */
export async function submitSheetOrder(order: Omit<SheetOrder, 'created_at' | 'status'>): Promise<boolean> {
  try {
    const fullOrder = {
      ...order,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    const response = await sheetdbClient.post('', {
      data: [fullOrder]
    }, {
      params: { sheet: 'orders' }
    });

    return response.data && response.data.created === 1;
  } catch (error) {
    console.error('Error submitting order to SheetDB:', error);
    return false;
  }
}

/**
 * Safely parses the tasting_notes field which might be a JSON array string.
 */
function parseTastingNotes(notesField: any): string[] {
  if (!notesField) return [];
  if (Array.isArray(notesField)) return notesField;
  
  try {
    const parsed = JSON.parse(notesField);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // If it's a comma separated string, split it
    if (typeof notesField === 'string' && notesField.includes(',')) {
      return notesField.split(',').map(s => s.trim());
    }
  }

  return [String(notesField)];
}
