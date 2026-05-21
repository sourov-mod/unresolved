import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { sha256 } from '@/lib/utils';
import { recalculateCompanyStats } from '@/lib/ranking';

export async function POST(request: NextRequest) {
  try {
    const { complaint_id, fingerprint } = await request.json();

    if (!complaint_id || !fingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Hash fingerprint for privacy
    const session_fingerprint = await sha256(fingerprint);

    // Check for existing upvote
    const { data: existing } = await supabase
      .from('upvotes')
      .select('id')
      .eq('complaint_id', complaint_id)
      .eq('session_fingerprint', session_fingerprint)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Already upvoted.' },
        { status: 409 }
      );
    }

    // Insert upvote
    const { error: insertError } = await supabase
      .from('upvotes')
      .insert({ complaint_id, session_fingerprint });

    if (insertError) throw insertError;

    // Increment count on complaint
    const { data: complaint } = await supabase
      .from('complaints')
      .select('upvotes, company_id')
      .eq('id', complaint_id)
      .single();

    if (complaint) {
      await supabase
        .from('complaints')
        .update({ upvotes: complaint.upvotes + 1 })
        .eq('id', complaint_id);

      // Recalculate company stats
      await recalculateCompanyStats(supabase, complaint.company_id);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Upvote error:', error);
    return NextResponse.json(
      { error: 'Failed to record upvote.' },
      { status: 500 }
    );
  }
}
