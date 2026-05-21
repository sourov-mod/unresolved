'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComplaintCard from '@/components/ui/ComplaintCard';
import CompanyCard from '@/components/ui/CompanyCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Complaint, Company } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
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
    <>
      <h1
        className="text-3xl md:text-4xl font-bold mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Search
      </h1>

      <div className="flex gap-2 mb-10">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search companies or complaints..."
            className="input-field pl-12"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button onClick={handleSearch} className="btn-primary px-6" disabled={loading}>
          {loading ? <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto" />
        </div>
      )}

      {searched && !loading && (
        <div className="space-y-12 animate-fade-in">
          {companies.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Companies ({companies.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {companies.map(c => (
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
                {complaints.map(c => (
                  <ComplaintCard key={c.id} complaint={c} />
                ))}
              </div>
            </section>
          )}

          {companies.length === 0 && complaints.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No results found
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Try a different search term or browse the leaderboard.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-4xl mx-auto">
          <Suspense fallback={
            <div className="text-center py-20">
              <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
          }>
            <SearchContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
