'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ComplaintCard from '@/components/ui/ComplaintCard';
import CompanyCard from '@/components/ui/CompanyCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner, faFileAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Complaint, Company } from '@/types';

const FILTER_CHIPS = [
  { label: 'All', slug: 'all' },
  { label: 'Telecom', slug: 'telecom' },
  { label: 'E-commerce', slug: 'e-commerce' },
  { label: 'Banking', slug: 'banking' },
  { label: 'Food Delivery', slug: 'food-delivery' },
  { label: 'Insurance', slug: 'insurance' },
  { label: 'Utilities', slug: 'utilities' },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setCompanies(data.companies || []);
      setComplaints(data.complaints || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, [initialQuery, performSearch]);

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div>
      {/* Interactive search bar — replaces the static shell */}
      <div className="-mt-[calc(2.5rem+4rem+1.5rem+52px+8px+6px)]">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies or complaints..."
              className="input-field pl-12"
              style={{ height: '52px', fontSize: '16px', borderWidth: '2px', borderRadius: '10px' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Search complaints"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary px-6" disabled={loading}>
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Interactive filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.slug}
              onClick={() => setActiveFilter(chip.slug)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeFilter === chip.slug
                  ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto" />
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-12 animate-fade-in">
          {companies.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Companies ({companies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {companies.map((c) => (
                  <CompanyCard key={c.id} company={c} />
                ))}
              </div>
            </section>
          )}

          {complaints.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Complaints ({complaints.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((c) => (
                  <ComplaintCard key={c.id} complaint={c} />
                ))}
              </div>
            </section>
          )}

          {companies.length === 0 && complaints.length === 0 && (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-7 h-7 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No complaints found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Be the first to document this issue.
              </p>
              <Link
                href={`/file-complaint?company=${encodeURIComponent(query)}`}
                className="btn-primary py-3 px-6"
              >
                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                File a Complaint Against &ldquo;{query}&rdquo;
                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Default state — before any search */}
      {!searched && !loading && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Search for companies or complaints
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Enter a company name, complaint keyword, or browse the categories above.
          </p>
        </div>
      )}
    </div>
  );
}
