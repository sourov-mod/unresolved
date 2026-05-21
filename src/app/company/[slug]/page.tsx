import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RankBadge from '@/components/ui/RankBadge';
import ComplaintCard from '@/components/ui/ComplaintCard';
import { createAnonServerClient } from '@/lib/supabase/server';
import { getScoreColor } from '@/lib/ranking';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAnonServerClient();
  const { data: company } = await supabase
    .from('companies')
    .select('name, total_complaints')
    .eq('slug', slug)
    .single();

  if (!company) return { title: 'Company Not Found' };

  return {
    title: `${company.name} Complaints | ${company.total_complaints} Issues`,
    description: `View all public complaints filed against ${company.name}. See their resolution rate and consumer feedback.`,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAnonServerClient();

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!company) notFound();

  const { data: complaints } = await supabase
    .from('complaints')
    .select('*')
    .eq('company_slug', slug)
    .eq('is_published', true)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .limit(20);

  const resolutionPct = company.total_complaints > 0
    ? Math.round((company.resolved_count / company.total_complaints) * 100)
    : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12">
          {/* Company Header */}
          <div className="card p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-20 h-20 rounded-xl object-contain bg-[var(--color-surface-2)]" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-3xl font-bold flex-shrink-0"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  {company.name.charAt(0)}
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {company.name}
                  </h1>
                  <RankBadge label={company.rank_label} />
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">{company.category}</p>
              </div>

              {/* Score meter */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-surface-2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={getScoreColor(company.score)}
                      strokeWidth="8"
                      strokeDasharray={`${(company.score / 100) * 264} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                      {company.score}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)] mt-1">Score</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--color-border)]">
              <StatItem label="Total Complaints" value={company.total_complaints} color="var(--color-text-primary)" />
              <StatItem label="Resolved" value={company.resolved_count} color="var(--color-primary)" />
              <StatItem label="Resolution Rate" value={`${resolutionPct}%`} color="var(--color-amber)" />
            </div>
          </div>

          {/* Complaints list */}
          <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Complaints ({complaints?.length || 0})
          </h2>

          {!complaints || complaints.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No complaints yet
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Be the first to file a complaint against {company.name}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatItem({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-mono)', color }}>
        {value}
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">{label}</p>
    </div>
  );
}
