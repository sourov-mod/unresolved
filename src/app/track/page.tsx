'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function TrackLandingPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleTrack = () => {
    const clean = token.trim().toUpperCase();
    if (clean) router.push(`/track/${clean}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="container-page max-w-lg text-center py-20">
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Track Your Complaint
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Enter the tracking token you received when you filed your complaint.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value.toUpperCase())}
                placeholder="UNR-2024-XXXXXX"
                className="input-field pl-12 uppercase"
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
              />
            </div>
            <button onClick={handleTrack} className="btn-primary px-6">
              Track
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mt-4">
            Tokens start with <span className="token-text text-[0.6875rem]">UNR-</span> followed by year and 6 characters
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
