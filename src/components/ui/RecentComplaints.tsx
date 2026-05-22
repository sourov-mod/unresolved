'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFileAlt } from '@fortawesome/free-solid-svg-icons';

interface RecentComplaint {
  id: string;
  token: string;
  company_name: string;
  category: string;
  title: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const CATEGORY_COLORS: Record<string, string> = {
  'Telecom': '#6366F1',
  'E-commerce': '#F59E0B',
  'Banking & Finance': '#3B82F6',
  'Insurance': '#06B6D4',
  'Food Delivery': '#EF4444',
  'Utilities': '#F97316',
  'Other': '#8B5CF6',
};

export default function RecentComplaints() {
  const [complaints, setComplaints] = useState<RecentComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints/recent');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setComplaints(data.complaints || []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container-page py-20">
      <div className="flex items-center gap-3 mb-4 justify-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <h2
          className="text-3xl md:text-4xl font-bold text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Latest Complaints Filed
        </h2>
      </div>
      <p className="text-center text-[var(--color-text-secondary)] mb-10">
        Real-time feed of complaints being filed on the platform.
      </p>

      {loading && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-4 w-24 bg-[var(--color-surface-2)] rounded" />
                <div className="h-4 w-16 bg-[var(--color-surface-2)] rounded-full" />
              </div>
              <div className="h-4 w-3/4 bg-[var(--color-surface-2)] rounded mb-1" />
              <div className="h-3 w-20 bg-[var(--color-surface-2)] rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && (error || complaints.length === 0) && (
        <div className="card p-10 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
            <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            No complaints filed yet
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Be the first to file a complaint and hold companies accountable.
          </p>
          <Link href="/file-complaint" className="btn-primary py-3 px-6">
            File a Complaint
            <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {!loading && complaints.length > 0 && (
        <div className="space-y-3 max-w-2xl mx-auto">
          {complaints.map((c) => {
            const catColor = CATEGORY_COLORS[c.category] || '#8B5CF6';
            return (
              <Link
                key={c.id}
                href={`/complaint/${c.id}`}
                className="card p-5 block hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all group"
                style={{ borderLeft: `4px solid ${catColor}` }}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {c.company_name}
                  </span>
                  <span
                    className="text-[0.625rem] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: catColor + '15', color: catColor }}
                  >
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1 line-clamp-1">
                  {c.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {timeAgo(c.created_at)}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
