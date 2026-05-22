import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchClient from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Complaints',
  description: 'Search consumer complaints against Indian companies. Find complaints by company name, category, or keywords.',
};

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-4xl mx-auto">
          {/* Server-rendered heading — always in HTML */}
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Search Complaints
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Find complaints by company name, category, or keywords.
          </p>

          <noscript>
            <div className="card p-6 text-center mb-8">
              <p className="text-sm text-[var(--color-text-secondary)]">
                JavaScript is required for search functionality. Please enable JavaScript in your browser.
              </p>
            </div>
          </noscript>

          {/* Client-side search — single source of truth for the search bar */}
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
    <div>
      {/* Skeleton search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 h-[52px] rounded-[10px] bg-[var(--color-surface-2)] animate-pulse" />
        <div className="w-24 h-[52px] rounded-xl bg-[var(--color-surface-2)] animate-pulse" />
      </div>
      {/* Skeleton filter chips */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="h-9 w-20 rounded-full bg-[var(--color-surface-2)] animate-pulse" />
        ))}
      </div>
      {/* Skeleton cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
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
    </div>
  );
}
