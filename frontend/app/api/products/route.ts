import { NextResponse } from 'next/server';
import { getSheetProducts, addSheetProduct } from '@/lib/sheetdb';

export async function GET() {
  try {
    const products = await getSheetProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const product = await request.json();
    const success = await addSheetProduct(product);

    if (!success) {
      return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}