import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sendOTP, validateIndianPhone } from '@/lib/otp';
import { checkOTPSendLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 OTP requests per IP per 15 minutes
    const rl = await checkOTPSendLimit(request);
    if (rl.limited) return rl.response!;

    const { phone } = await request.json();

    // Validate phone
    if (!phone || !validateIndianPhone(phone)) {
      return NextResponse.json(
        { error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const phone_last4 = phone.slice(-4);

    // Pre-compute hash for rate limit check (before sending OTP)
    const { sha256 } = await import('@/lib/utils');
    const phone_hash = await sha256(phone);

    // Rate limit: max 3 OTP requests per phone per hour — check BEFORE sending
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('otp_sessions')
      .select('id', { count: 'exact' })
      .eq('phone_hash', phone_hash)
      .gte('created_at', oneHourAgo);

    if (count && count >= 3) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again in an hour.' },
        { status: 429 }
      );
    }

    // Now send OTP (only after rate limit passes)
    const { otp_code } = await sendOTP(phone);

    // Store OTP session with phone_last4 so complaint submit can use real digits
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min
    const { data: session, error } = await supabase
      .from('otp_sessions')
      .insert({
        phone_hash,
        otp_code,
        expires_at: expiresAt,
        verified: false,
        attempts: 0,
        phone_last4,
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      session_id: session.id,
      expires_in: 600,
      phone_last4,
    });
  } catch (error: unknown) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
