'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowRight, faFileAlt, faShieldHalved, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function TrackLandingPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();
    const clean = raw.replace(/[^A-Z0-9]/g, '').slice(0, 16);
    const isDeleting = raw.length < token.length;

    // Build formatted string with dashes at positions 3 and 7
    let formatted = '';
    for (let i = 0; i < clean.length; i++) {
      if (i === 3 || i === 7) formatted += '-';
      formatted += clean[i];
    }

    // Auto-append dash immediately after 3rd or 7th character (only when typing, not deleting)
    if (!isDeleting && (clean.length === 3 || clean.length === 7)) {
      formatted += '-';
    }

    setToken(formatted);
  };

  const handleTrack = () => {
    const clean = token.trim();
    if (clean) router.push(`/track/${clean}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="container-page max-w-xl text-center py-20">

          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Track Your Complaint
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-10 max-w-md mx-auto">
            Enter the unique tracking token you received when you filed your complaint.
          </p>

          <div className="flex gap-2 max-w-md mx-auto mb-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={token}
                onChange={handleChange}
                placeholder="UNR-2026-XXXXXX"
                className="input-field uppercase text-center"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  height: '52px',
                  fontSize: '16px',
                  borderWidth: '2px',
                  borderRadius: '10px',
                }}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                autoFocus
              />
            </div>
            <button onClick={handleTrack} className="btn-primary px-6" disabled={!token.trim()}>
              Track
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mb-12">
            Format: <span className="token-text text-[0.6875rem]">UNR-2026-XXXXXX</span>
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-surface-2)]">
              <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-text-secondary)]">Private & Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-surface-2)]">
              <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-text-secondary)]">No Login Required</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-surface-2)]">
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs text-[var(--color-text-secondary)]">Email Updates</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Don&apos;t have a token? File a new complaint to get one.
            </p>
            <Link href="/file-complaint" className="btn-outline py-3 px-6">
              <FontAwesomeIcon icon={faFileAlt} className="w-3.5 h-3.5" />
              File a New Complaint
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
