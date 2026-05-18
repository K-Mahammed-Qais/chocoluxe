import { NextResponse } from 'next/server';
import { getSheetUsers, updateSheetUserBlock } from '@/lib/sheetdb';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { isBlocked } = await request.json();

    const success = await updateSheetUserBlock(id, isBlocked);
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('User block error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}