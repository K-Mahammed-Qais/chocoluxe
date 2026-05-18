import { NextResponse } from 'next/server';
import { getSheetUsers } from '@/lib/sheetdb';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const email = decoded.split(':')[0];

    const users = await getSheetUsers();

    return NextResponse.json(users.map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isBlocked: u.isBlocked,
      createdAt: u.createdAt,
    })));
  } catch (error) {
    console.error('Users error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}