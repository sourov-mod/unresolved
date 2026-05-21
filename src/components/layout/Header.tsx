'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/leaderboard', label: 'Rankings' },
  { href: '/search', label: 'Search' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="container-page">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>U</span>
              </div>
              <span
                className="text-lg font-extrabold tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                UNRESOLVED
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/track"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)] transition-colors"
              >
                Track
              </Link>
              <Link href="/file-complaint" className="btn-primary text-sm py-2 px-4">
                <FontAwesomeIcon icon={faFileAlt} className="w-3.5 h-3.5" />
                File Complaint
              </Link>
            </nav>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — rendered outside <header> so it escapes its stacking context */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-[60] bg-[var(--color-surface)] animate-fade-in overflow-y-auto">
          <nav className="container-page py-8 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-semibold py-3 px-4 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/track"
              onClick={() => setMobileOpen(false)}
              className="text-lg font-semibold py-3 px-4 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Track Complaint
            </Link>
            <div className="mt-4 px-4">
              <Link href="/file-complaint" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center py-3">
                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                File a Complaint
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
