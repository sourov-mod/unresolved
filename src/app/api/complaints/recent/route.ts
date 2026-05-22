import { NextResponse } from 'next/server';
import { createAnonServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ complaints: [] });
  }

  try {
    const supabase = createAnonServerClient();

    const { data, error } = await supabase
      .from('complaints')
      .select('id, token, company_name, category, title, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent complaints:', error);
      return NextResponse.json({ complaints: [] });
    }

    return NextResponse.json({ complaints: data || [] });
  } catch (error) {
    console.error('Failed to fetch recent complaints:', error);
    return NextResponse.json({ complaints: [] });
  }
}
