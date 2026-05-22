import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RankBadge from '@/components/ui/RankBadge';
import { createAnonServerClient, isSupabaseConfigured } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Company } from '@/types';
import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleCheck, faChartBar } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'India Company Rankings by Consumer Complaints',
  description: 'See which Indian companies have the most complaints, best resolution rates, and worst consumer service. Ranked by data.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 1800;

async function fetchRankings(): Promise<{ worstCompanies: Company[]; bestCompanies: Company[] }> {
  if (!isSupabaseConfigured()) {
    return { worstCompanies: [], bestCompanies: [] };
  }

  try {
    const supabase = createAnonServerClient();

    const [worstResult, bestResult] = await Promise.all([
      supabase
        .from('companies')
        .select('*')
        .gt('total_complaints', 0)
        .lt('score', 60)
        .order('score', { ascending: true })
        .limit(20),
      supabase
        .from('companies')
        .select('*')
        .gt('total_complaints', 0)
        .gte('score', 40)
        .order('score', { ascending: false })
        .limit(20),
    ]);

    return {
      worstCompanies: worstResult.data || [],
      bestCompanies: bestResult.data || [],
    };
  } catch (error) {
    console.error('Failed to fetch rankings:', error);
    return { worstCompanies: [], bestCompanies: [] };
  }
}

export default async function LeaderboardPage() {
  const { worstCompanies, bestCompanies } = await fetchRankings();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-4">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
              Rankings are algorithmic, not editorial
            </div>
            <h1
              className="text-4xl md:text-6xl lg:text-[72px] font-extrabold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Company Accountability Rankings
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Ranked by resolution rate, response time, and public complaints.
              Updated every 30 minutes. Data-driven, not opinion-based.
            </p>
          </div>

          {/* Hall of Shame */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-6 h-6 text-[var(--rank-worst)]" />
              <h2
                className="text-2xl font-bold text-[var(--rank-worst)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Most Complained About
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Companies with the most complaints and lowest resolution rates.
            </p>
            <CompanyTable companies={worstCompanies} type="shame" />
          </section>

          {/* Best performing */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faCircleCheck} className="w-6 h-6 text-[var(--color-primary)]" />
              <h2
                className="text-2xl font-bold text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Who&apos;s Actually Trying
              </h2>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Companies with the best resolution rates and consumer responsiveness.
            </p>
            <CompanyTable companies={bestCompanies} type="best" />
          </section>

          {/* How calculated */}
          <details className="card p-6">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--color-text-primary)]">
              <FontAwesomeIcon icon={faChartBar} className="w-4 h-4 mr-1.5" /> How is this score calculated?
            </summary>
            <div className="mt-4 text-sm text-[var(--color-text-secondary)] space-y-2">
              <p>Every company is scored on a 0–100 scale based on:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Resolution Rate (40%)</strong> — % of complaints resolved</li>
                <li><strong>Response Rate (30%)</strong> — % of complaints responded to</li>
                <li><strong>Volume Penalty (20%)</strong> — More complaints = lower score</li>
                <li><strong>Recency (10%)</strong> — Recent complaints weigh more</li>
              </ul>
              <p className="text-xs text-[var(--color-text-muted)] mt-3">
                Note: Higher complaint volumes may reflect a company&apos;s large customer base, not necessarily poor service.
              </p>
            </div>
          </details>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CompanyTable({
  companies,
  type,
}: {
  companies: Company[];
  type: 'shame' | 'best';
}) {
  if (companies.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center">
          <FontAwesomeIcon icon={faChartBar} className="w-7 h-7 text-[var(--color-text-muted)]" />
        </div>
        <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          No rankings yet
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Be the first to file a complaint and hold companies accountable.
        </p>
        <Link href="/file-complaint" className="btn-primary py-3 px-6">
          File a Complaint
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">#</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Company</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Complaints</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider hidden sm:table-cell">Resolution</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Score</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Rank</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, i) => {
            const resRate = c.total_complaints > 0
              ? Math.round((c.resolved_count / c.total_complaints) * 100)
              : 0;

            return (
              <tr
                key={c.id}
                className={`border-b border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors ${
                  type === 'shame' ? 'border-l-2 border-l-[var(--rank-worst)]' : ''
                }`}
              >
                <td className="py-3 px-4 font-mono text-[var(--color-text-muted)]">
                  {i + 1}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/company/${c.slug}`}
                    className="font-semibold hover:text-[var(--color-primary)] transition-colors"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-[var(--color-text-muted)] hidden md:table-cell">
                  {c.category}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-[var(--color-text-primary)]">
                  {c.total_complaints}
                </td>
                <td className="py-3 px-4 text-right font-mono hidden sm:table-cell">
                  <span className={
                    resRate >= 60 ? 'text-[var(--rank-best)]' :
                    resRate >= 30 ? 'text-[var(--rank-average)]' :
                    'text-[var(--rank-worst)]'
                  }>
                    {resRate}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold">
                  {c.score}
                </td>
                <td className="py-3 px-4 text-right">
                  <RankBadge label={c.rank_label} size="sm" showIcon={false} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
