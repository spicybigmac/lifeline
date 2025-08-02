import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("terrahacks");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}