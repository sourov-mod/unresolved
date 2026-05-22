import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialFilters from './SocialFilters';
import { SOCIAL_COMPLAINTS } from '@/lib/social-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Complaints Wall',
  description: 'Real consumer complaints from social media about Indian companies. Browse complaints from Twitter, Facebook, Instagram, and consumer forums.',
};

export default function SocialPage() {
  const totalMeToo = SOCIAL_COMPLAINTS.reduce((s, p) => s + p.meTooCount, 0);
  const totalLikes = SOCIAL_COMPLAINTS.reduce((s, p) => s + p.likes, 0);
  const uniqueCompanies = new Set(SOCIAL_COMPLAINTS.map(p => p.company)).size;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12">
          {/* Hero — server-rendered, always in HTML */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-4">
              <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
              <FontAwesomeIcon icon={faFacebook} className="w-6 h-6 text-[#1877F2]" />
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-[#E4405F]" />
            </div>
            <h1
              className="text-4xl md:text-6xl font-extrabold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Social Complaints Wall
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8">
              {SOCIAL_COMPLAINTS.length} real consumer complaints across {uniqueCompanies}+ companies.
              Vote &quot;Me Too&quot; if you&apos;ve faced the same issue.
            </p>

            {/* Stats bar */}
            <div className="inline-flex items-center gap-8 px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="text-center">
                <p className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {SOCIAL_COMPLAINTS.length}
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-muted)]">Posts</p>
              </div>
              <div className="w-px h-8 bg-[var(--color-border)]" />
              <div className="text-center">
                <p className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {(totalMeToo / 1000).toFixed(1)}K
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-muted)]">Me Too Votes</p>
              </div>
              <div className="w-px h-8 bg-[var(--color-border)]" />
              <div className="text-center">
                <p className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {(totalLikes / 1000).toFixed(0)}K+
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-muted)]">Social Reach</p>
              </div>
            </div>
          </div>

          {/* Client-side interactive filtering — complaints are passed as SSR'd props */}
          <SocialFilters initialComplaints={SOCIAL_COMPLAINTS} />

          {/* Disclaimer — server-rendered */}
          <div className="card p-6 text-sm text-[var(--color-text-muted)] text-center max-w-2xl mx-auto">
            <p className="mb-2">
              These complaints are sourced from public social media posts and consumer forums.
              They represent the views of individual consumers. Unresolved does not verify or endorse these claims.
            </p>
            <p>
              Companies may have responded or resolved these issues after the original post.
              If you are a company representative, contact us at{' '}
              <a href="mailto:takedown@unresolved.in" className="text-[var(--color-primary)] hover:underline">
                takedown@unresolved.in
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
