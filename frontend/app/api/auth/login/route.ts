import { NextResponse } from 'next/server';
import { getSheetUserByEmail, getSheetUsers } from '@/lib/sheetdb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt:', email);

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // First, let's get all users to see what's available
    const allUsers = await getSheetUsers();
    console.log('Total users in sheet:', allUsers.length);
    console.log('Users:', JSON.stringify(allUsers.map(u => ({ email: u.email, role: u.role }))));

    const user = await getSheetUserByEmail(email);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Password check:', user.password, '===', password, ':', user.password === password);

    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { message: 'Your account has been blocked' },
        { status: 403 }
      );
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}