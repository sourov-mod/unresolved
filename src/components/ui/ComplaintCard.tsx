'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import type { Complaint } from '@/types';
import StatusBadge from './StatusBadge';
import MeTooButton from './MeTooButton';
import { truncate, timeAgo } from '@/lib/utils';

interface ComplaintCardProps {
  complaint: Complaint;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <Link href={`/complaint/${complaint.id}`}>
      <article className="card card-hover p-5 cursor-pointer animate-fade-in">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {complaint.company_name}
            </span>
            <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] font-medium">
              {complaint.category}
            </span>
          </div>
          {complaint.is_verified && (
            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-[var(--color-primary)]" />
          )}
        </div>

        <h3 className="text-lg font-bold leading-snug mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {complaint.title}
        </h3>

        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-2">
          {truncate(complaint.description, 160)}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <StatusBadge status={complaint.status} size="sm" />
            <MeTooButton complaintId={complaint.id} initialCount={complaint.upvotes} />
          </div>
          <div className="flex items-center gap-3 text-[0.6875rem] text-[var(--color-text-muted)]">
            <span className="token-text text-[0.625rem]">{complaint.token}</span>
            <span>•</span>
            <time>{timeAgo(complaint.created_at)}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
