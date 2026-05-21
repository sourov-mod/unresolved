import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p
            className="text-8xl font-bold text-[var(--color-primary)] mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            404
          </p>
          <h1
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Page Not Found
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            This page doesn&apos;t exist. Maybe the complaint you&apos;re looking for was removed, or the URL is incorrect.
          </p>
          <Link href="/" className="btn-primary py-3 px-8">
            Go to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
