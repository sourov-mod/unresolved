'use client';

import React, { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TokenDisplay from '@/components/ui/TokenDisplay';
import TokenTracker from '@/components/ui/TokenTracker';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Complaint, ComplaintTimeline } from '@/types';

export default function TrackPage() {
  const params = useParams();
  const initialToken = (params?.token as string) || '';

  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [timeline, setTimeline] = useState<ComplaintTimeline[]>([]);
  const [notFound, setNotFound] = useState(false);

  const trackComplaint = useCallback(async (t?: string) => {
    const searchToken = (t || token).trim().toUpperCase();
    if (!searchToken) {
      toast.error('Enter a tracking token');
      return;
    }

    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/complaints/track?token=${searchToken}`);
      const data = await res.json();

      if (!res.ok) {
        setNotFound(true);
        setComplaint(null);
        return;
      }

      setComplaint(data.complaint);
      setTimeline(data.timeline);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-track if token in URL
  React.useEffect(() => {
    if (initialToken) trackComplaint(initialToken);
  }, [initialToken, trackComplaint]);

  const STATUS_MESSAGES: Record<string, string> = {
    registered: 'Your complaint is now public and indexed.',
    sent: `Forwarded to ${complaint?.company_name || 'the company'}'s registered support channel.`,
    responded: 'The company has responded. See details below.',
    resolved: 'Marked as resolved.',
    rejected: 'Removed — violated community guidelines.',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-2xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Track Your Complaint
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Enter your tracking token to see the status of your complaint.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value.toUpperCase())}
                placeholder="UNR-2024-XXXXXX"
                className="input-field pl-12 uppercase"
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                onKeyDown={e => e.key === 'Enter' && trackComplaint()}
              />
            </div>
            <button
              onClick={() => trackComplaint()}
              disabled={loading}
              className="btn-primary px-6"
            >
              {loading ? '...' : 'Track'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Not found */}
          {notFound && (
            <div className="card p-8 text-center animate-fade-in">
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Token Not Found
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Double-check for typos. Tokens start with <code className="token-text text-xs">UNR-</code>
              </p>
            </div>
          )}

          {/* Result */}
          {complaint && (
            <div className="animate-fade-in space-y-6">
              {/* Token */}
              <div className="card p-6 text-center">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">Tracking Token</p>
                <TokenDisplay token={complaint.token} size="lg" />
              </div>

              {/* Complaint summary */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {complaint.company_name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">{complaint.category}</p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {complaint.title}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] p-4 rounded-sm">
                  {STATUS_MESSAGES[complaint.status]}
                </p>
              </div>

              {/* Timeline */}
              <div className="card p-6">
                <h3
                  className="text-lg font-bold mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Status Timeline
                </h3>
                <TokenTracker currentStatus={complaint.status} timeline={timeline} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
