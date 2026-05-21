import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const adminSecret = request.headers.get('x-admin-secret');

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [
    { count: totalToday },
    { count: flagged },
    { count: pending },
    { count: newCompanies },
  ] = await Promise.all([
    supabase.from('complaints').select('id', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
    supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('status', 'registered'),
    supabase.from('companies').select('id', { count: 'exact', head: true }).gte('created_at', todayISO),
  ]);

  return NextResponse.json({
    total_today: totalToday || 0,
    flagged: flagged || 0,
    pending: pending || 0,
    new_companies: newCompanies || 0,
  });
}
