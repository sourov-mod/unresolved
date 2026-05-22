'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/leaderboard', label: 'Rankings' },
  { href: '/search', label: 'Search' },
  { href: '/track', label: 'Track' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[var(--color-border)] transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(246, 250, 247, 0.98)' : 'rgba(246, 250, 247, 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 2px 20px rgba(16,185,129,0.06)' : 'none',
        }}
      >
        <div className="container-page">
          <div
            className="flex items-center justify-between transition-all duration-300"
            style={{ height: scrolled ? '56px' : '64px' }}
          >
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
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'text-[var(--color-primary-dark)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[var(--color-primary)] rounded-full" />
                    )}
                  </Link>
                );
              })}
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-[56px] z-[60] animate-fade-in overflow-y-auto"
          style={{ backgroundColor: '#1a3d2e' }}
        >
          <nav className="container-page py-8 flex flex-col gap-2">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-semibold py-3 px-4 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-white/10 text-[#00c853]'
                      : 'text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4 px-4">
              <Link href="/file-complaint" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center py-3">
                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                File a Complaint
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Bar — always visible CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 border-t border-[var(--color-border)]" style={{ backgroundColor: 'rgba(246, 250, 247, 0.98)', backdropFilter: 'blur(12px)' }}>
        <Link href="/file-complaint" className="btn-primary w-full text-center py-3 text-sm">
          <FontAwesomeIcon icon={faFileAlt} className="w-3.5 h-3.5" />
          File a Complaint
        </Link>
      </div>
    </>
  );
}
