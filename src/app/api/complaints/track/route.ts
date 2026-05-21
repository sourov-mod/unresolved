import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get complaint
    const { data: complaint, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('token', token.toUpperCase())
      .eq('is_published', true)
      .single();

    if (error || !complaint) {
      return NextResponse.json(
        { error: 'Token not found. Double-check for typos.' },
        { status: 404 }
      );
    }

    // Get timeline
    const { data: timeline } = await supabase
      .from('complaint_timeline')
      .select('*')
      .eq('complaint_id', complaint.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      complaint,
      timeline: timeline || [],
    });
  } catch (error: unknown) {
    console.error('Track error:', error);
    return NextResponse.json(
      { error: 'Failed to track complaint.' },
      { status: 500 }
    );
  }
}
