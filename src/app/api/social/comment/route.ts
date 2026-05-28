import { NextRequest, NextResponse } from 'next/server';
import { checkCommentLimit } from '@/lib/rate-limit';

// In-memory store for demo — in production use Redis/Supabase
const comments = new Map<string, { text: string; fingerprint: string; timestamp: number }[]>();
const dailyLimits = new Map<string, number>(); // fp -> last comment timestamp

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 comments per IP per hour
    const rl = await checkCommentLimit(request);
    if (rl.limited) return rl.response!;

    const { post_id, text, fingerprint } = await request.json();

    if (!post_id || !text || !fingerprint) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (text.trim().length < 3 || text.trim().length > 200) {
      return NextResponse.json({ error: 'Comment must be 3-200 chars' }, { status: 400 });
    }

    const fpHash = await hashFP(fingerprint);
    const today = new Date().toDateString();
    const limitKey = `${fpHash}-${today}`;

    if (dailyLimits.has(limitKey)) {
      return NextResponse.json({ error: 'One comment per device per day' }, { status: 429 });
    }

    dailyLimits.set(limitKey, Date.now());

    if (!comments.has(post_id)) comments.set(post_id, []);
    comments.get(post_id)!.push({
      text: text.trim(),
      fingerprint: fpHash,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
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
