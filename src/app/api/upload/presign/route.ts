import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl, getPublicUrl } from '@/lib/r2';
import { createServerClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
};

export async function POST(request: NextRequest) {
  try {
    const { session_id, content_type, file_name, file_size } = await request.json();

    // 1. Auth check: valid OTP session required
    if (!session_id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { data: session } = await supabase
      .from('otp_sessions')
      .select('id, verified')
      .eq('id', session_id)
      .single();

    if (!session?.verified) {
      return NextResponse.json({ error: 'Unverified session.' }, { status: 403 });
    }

    // 2. Validate file type
    if (!ALLOWED_TYPES.includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and PDF are accepted.' },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file_size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // 4. Generate unique key
    const ext = EXT_MAP[content_type];
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const key = `complaints/${session_id}/${timestamp}-${random}.${ext}`;

    // 5. Generate presigned URL
    const presigned_url = await generatePresignedUploadUrl(key, content_type);
    const public_url = getPublicUrl(key);

    return NextResponse.json({
      presigned_url,
      key,
      public_url,
    });
  } catch (error: unknown) {
    console.error('Presign error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL.' },
      { status: 500 }
    );
  }
}
