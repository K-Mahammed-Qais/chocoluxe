import { NextResponse } from 'next/server';
import { getSheetOrders, updateSheetOrderStatus } from '@/lib/sheetdb';

export async function GET() {
  try {
    const orders = await getSheetOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, status } = await request.json();
    const success = await updateSheetOrderStatus(orderId, status);

    if (!success) {
      return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}