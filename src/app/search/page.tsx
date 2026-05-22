import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: 'Search Complaints',
  description: 'Search consumer complaints against Indian companies. Find complaints by company name, category, or keywords.',
};

const FILTER_CHIPS = [
  { label: 'All', slug: 'all' },
  { label: 'Telecom', slug: 'telecom' },
  { label: 'E-commerce', slug: 'e-commerce' },
  { label: 'Banking', slug: 'banking' },
  { label: 'Food Delivery', slug: 'food-delivery' },
  { label: 'Insurance', slug: 'insurance' },
  { label: 'Utilities', slug: 'utilities' },
];

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-4xl mx-auto">
          {/* Server-rendered static shell — visible before JS loads */}
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Search Complaints
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Find complaints by company name, category, or keywords.
          </p>

          {/* noscript fallback */}
          <noscript>
            <div className="card p-6 text-center mb-8">
              <p className="text-sm text-[var(--color-text-secondary)]">
                JavaScript is required for search functionality. Please enable JavaScript in your browser to search complaints.
              </p>
            </div>
          </noscript>

          {/* Static search bar shell — always visible in HTML */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
                />
                <input
                  type="text"
                  placeholder="Search companies or complaints..."
                  className="input-field pl-12"
                  style={{ height: '52px', fontSize: '16px', borderWidth: '2px', borderRadius: '10px' }}
                  aria-label="Search complaints"
                  readOnly
                />
              </div>
              <button className="btn-primary px-6" disabled>
                Search
              </button>
            </div>

            {/* Filter chips — static HTML shell */}
            <div className="flex flex-wrap gap-2">
              {FILTER_CHIPS.map((chip) => (
                <span
                  key={chip.slug}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${chip.slug === 'all'
                      ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                    }`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Client-side interactive search — hydrates over the static shell */}
          <Suspense fallback={<SearchSkeleton />}>
            <SearchClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)]" />
            <div>
              <div className="h-4 w-32 bg-[var(--color-surface-2)] rounded mb-1" />
              <div className="h-3 w-20 bg-[var(--color-surface-2)] rounded" />
            </div>
          </div>
          <div className="h-4 w-3/4 bg-[var(--color-surface-2)] rounded mb-2" />
          <div className="h-3 w-full bg-[var(--color-surface-2)] rounded mb-1" />
          <div className="h-3 w-2/3 bg-[var(--color-surface-2)] rounded" />
        </div>
      ))}
    </div>
  );
}
