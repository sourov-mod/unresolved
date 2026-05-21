import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { session_id, otp_code } = await request.json();

    if (!session_id || !otp_code) {
      return NextResponse.json(
        { error: 'Session ID and OTP code are required.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Find session
    const { data: session, error } = await supabase
      .from('otp_sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: 'Invalid session. Please request a new OTP.' },
        { status: 404 }
      );
    }

    // Check expiry
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // Brute force prevention: max 5 attempts
    if (session.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Increment attempts
    await supabase
      .from('otp_sessions')
      .update({ attempts: session.attempts + 1 })
      .eq('id', session_id);

    // Compare OTP
    if (session.otp_code !== otp_code) {
      return NextResponse.json(
        { error: 'Incorrect OTP. Please try again.', attempts_remaining: 4 - session.attempts },
        { status: 401 }
      );
    }

    // Mark verified
    await supabase
      .from('otp_sessions')
      .update({ verified: true })
      .eq('id', session_id);

    return NextResponse.json({
      verified: true,
      session_id,
      phone_hash: session.phone_hash,
    });
  } catch (error: unknown) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
