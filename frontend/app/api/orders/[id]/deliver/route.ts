import { NextResponse } from 'next/server';
import { updateSheetOrderStatus } from '@/lib/sheetdb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const success = await updateSheetOrderStatus(id, 'Delivered');
    if (!success) {
      return NextResponse.json({ message: 'Failed to deliver order' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order delivered successfully' });
  } catch (error) {
    console.error('Order deliver error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}