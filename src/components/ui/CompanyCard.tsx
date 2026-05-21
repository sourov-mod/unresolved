'use client';

import React from 'react';
import Link from 'next/link';
import type { Company } from '@/types';
import RankBadge from './RankBadge';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const resolutionPct = company.total_complaints > 0
    ? Math.round((company.resolved_count / company.total_complaints) * 100)
    : 0;

  return (
    <Link href={`/company/${company.slug}`}>
      <div className="card card-hover p-5 cursor-pointer animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="w-12 h-12 rounded-xl object-contain bg-[var(--color-surface-2)]" />
          ) : (
            <div
              className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {company.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {company.name}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">{company.category}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono font-semibold text-[var(--color-primary-dark)]">
            {company.total_complaints} complaints
          </span>
          <RankBadge label={company.rank_label} size="sm" />
        </div>

        {/* Resolution bar */}
        <div>
          <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
            <span>Resolution Rate</span>
            <span className="font-mono font-semibold">{resolutionPct}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${resolutionPct}%`,
                backgroundColor: resolutionPct >= 70 ? 'var(--color-primary)' : resolutionPct >= 40 ? 'var(--color-amber)' : 'var(--rank-worst)',
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
