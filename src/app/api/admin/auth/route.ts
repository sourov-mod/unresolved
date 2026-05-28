import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_SECRET) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
}
