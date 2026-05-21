import { NextRequest, NextResponse } from 'next/server';

// In-memory store for demo — in production use Redis/Supabase
const votes = new Map<string, Set<string>>();

export async function POST(request: NextRequest) {
  try {
    const { post_id, fingerprint } = await request.json();

    if (!post_id || !fingerprint) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const key = `${post_id}`;
    if (!votes.has(key)) votes.set(key, new Set());

    const fpHash = await hashFP(fingerprint);
    if (votes.get(key)!.has(fpHash)) {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 });
    }

    votes.get(key)!.add(fpHash);

    return NextResponse.json({ success: true, count: votes.get(key)!.size });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function hashFP(fp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(fp);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
