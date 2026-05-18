import { NextResponse } from 'next/server';
import { getSheetUserByEmail, addSheetUser } from '@/lib/sheetdb';

export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'user' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await getSheetUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    const success = await addSheetUser({
      name,
      email,
      password,
      role,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    });

    if (!success) {
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 500 }
      );
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      token,
      user: {
        _id: String(Date.now()),
        name,
        email,
        role,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}