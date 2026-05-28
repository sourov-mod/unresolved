import { NextRequest, NextResponse } from 'next/server';
import { createAnonServerClient } from '@/lib/supabase/server';
import { checkSearchLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // Rate limit: 30 searches per IP per minute
  const rl = await checkSearchLimit(request);
  if (rl.limited) return rl.response!;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q) {
    return NextResponse.json({ companies: [], complaints: [] });
  }

  const supabase = createAnonServerClient();

  // Sanitize query: escape SQL LIKE wildcards and Supabase filter special chars
  const sanitized = q
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/,/g, '')   // commas break .or() syntax
    .replace(/\./g, ' ') // dots can cause issues
    .trim();

  if (!sanitized) {
    return NextResponse.json({ companies: [], complaints: [] });
  }

  const searchPattern = `%${sanitized}%`;

  // Search companies
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', searchPattern)
    .limit(10);

  // Search complaints — use separate queries to avoid .or() syntax issues
  const [titleRes, companyRes] = await Promise.all([
    supabase
      .from('complaints')
      .select('*')
      .eq('is_published', true)
      .eq('is_flagged', false)
      .ilike('title', searchPattern)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('complaints')
      .select('*')
      .eq('is_published', true)
      .eq('is_flagged', false)
      .ilike('company_name', searchPattern)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  // Merge and deduplicate results
  const allComplaints = [...(titleRes.data || []), ...(companyRes.data || [])];
  const seen = new Set<string>();
  const complaints = allComplaints.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  }).slice(0, 20);

  return NextResponse.json({
    companies: companies || [],
    complaints,
  });
}
