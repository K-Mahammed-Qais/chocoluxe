import { NextResponse } from 'next/server';
import { updateSheetProduct, deleteSheetProduct, getSheetProducts } from '@/lib/sheetdb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const product = await request.json();

    const success = await updateSheetProduct(id, product);
    if (!success) {
      return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteSheetProduct(id);

    if (!success) {
      return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}