'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { SOCIAL_COMPLAINTS } from '@/lib/social-data';
import type { SocialPost } from '@/components/ui/SocialComplaintCard';

const PLATFORM_ICON = {
  twitter: faXTwitter,
  facebook: faFacebook,
  instagram: faInstagram,
  web: faGlobe,
};

const PLATFORM_COLOR: Record<string, string> = {
  twitter: '#536471',
  facebook: '#1877F2',
  instagram: '#E4405F',
  web: '#10B981',
};

function fmtNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function HorizontalCard({ post }: { post: SocialPost }) {
  return (
    <div
      className="card flex-shrink-0 flex flex-col justify-between overflow-hidden snap-start"
      style={{
        width: 'min(420px, 80vw)',
        padding: '24px',
        borderLeft: `3px solid ${post.companyColor}`,
      }}
    >
      {/* Header: Company + Platform + Date */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: post.companyColor }}
            />
            <span
              className="text-sm font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.company}
            </span>
          </div>
          <FontAwesomeIcon
            icon={PLATFORM_ICON[post.platform]}
            className="w-3.5 h-3.5"
            style={{ color: PLATFORM_COLOR[post.platform] }}
          />
        </div>
        {/* Date below company */}
        <span className="text-[11px] text-[var(--color-text-muted)] ml-[18px]">
          {post.date}
        </span>
      </div>

      {/* Text */}
      <p className="text-[13px] leading-[1.6] text-[var(--color-text-secondary)] mt-3 flex-1">
        {post.text}
      </p>

      {/* Footer: likes + comments */}
      <div
        className="flex items-center gap-4 pt-3 mt-3"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
          <FontAwesomeIcon icon={faHeart} className="w-3 h-3" />
          {fmtNum(post.likes)}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
          <FontAwesomeIcon icon={faComment} className="w-3 h-3" />
          {fmtNum(post.comments)}
        </span>
      </div>
    </div>
  );
}

export default function HorizontalSocialScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.querySelector('.card')?.getBoundingClientRect().width ?? 420;
    track.scrollBy({
      left: direction === 'right' ? cardWidth + 20 : -(cardWidth + 20),
      behavior: 'smooth',
    });
  };

  const posts = SOCIAL_COMPLAINTS.slice(0, 6);

  return (
    <section
      className="relative"
      style={{ background: 'var(--color-surface-2)' }}
    >
      {/* Header */}
      <div className="container-page pt-20 pb-8">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
              <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 text-[#1877F2]" />
              <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-[#E4405F]" />
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What People Are Saying
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mt-3">
              Real complaints from consumers across social media. Scroll to explore.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            {/* Scroll arrows */}
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors"
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors"
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            </button>
            <Link
              href="/social"
              className="btn-outline py-2.5 px-6 ml-2"
            >
              View All
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track — native overflow, GPU-composited */}
      <div
        ref={trackRef}
        className="flex gap-5 pb-16 overflow-x-auto scrollbar-hide"
        style={{
          paddingLeft: 'max(24px, calc((100vw - 1200px) / 2 + 24px))',
          paddingRight: '24px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {posts.map(post => (
          <HorizontalCard key={post.id} post={post} />
        ))}

        {/* Final CTA card */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl snap-start"
          style={{
            width: 'min(320px, 75vw)',
            minHeight: '220px',
            padding: '32px',
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary-muted)',
          }}
        >
          <p
            className="text-lg font-bold mb-3 text-center"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)' }}
          >
            See all complaints
          </p>
          <Link href="/social" className="btn-primary py-2.5 px-6">
            Browse All
            <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Spacer so last card doesn't cut off */}
        <div className="flex-shrink-0" style={{ width: '40px' }} />
      </div>

      {/* Mobile fallback link */}
      <div className="container-page pb-10 md:hidden text-center">
        <Link href="/social" className="btn-outline py-3 px-8">
          View All Social Complaints
          <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
