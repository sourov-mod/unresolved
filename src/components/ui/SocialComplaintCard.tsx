'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faChevronDown, faChevronUp, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import toast from 'react-hot-toast';

export type ComplaintCategory = 'telecom' | 'e-commerce' | 'banking' | 'food-delivery' | 'insurance' | 'utilities' | 'other';

export interface SocialPost {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'web';
  company: string;
  companyColor: string;
  category: ComplaintCategory;
  text: string;
  date: string;
  likes: number;
  shares: number;
  comments: number;
  meTooCount: number;
  sourceUrl?: string;
}

const PLATFORM_ICON = {
  twitter: faXTwitter,
  facebook: faFacebook,
  instagram: faInstagram,
  web: faGlobe,
};

const PLATFORM_COLOR = {
  twitter: '#536471',
  facebook: '#1877F2',
  instagram: '#E4405F',
  web: '#10B981',
};

const MAX_CHARS = 180;

export default function SocialComplaintCard({ post }: { post: SocialPost }) {
  const [expanded, setExpanded] = useState(false);
  const [meToo, setMeToo] = useState(false);
  const [meTooCount, setMeTooCount] = useState(post.meTooCount);

  const isLong = post.text.length > MAX_CHARS;
  const displayText = expanded || !isLong ? post.text : post.text.slice(0, MAX_CHARS) + '…';

  const handleMeToo = async () => {
    if (meToo) return;
    const fp = `${navigator.userAgent}-${screen.width}`;
    try {
      const res = await fetch('/api/social/metoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, fingerprint: fp }),
      });
      if (res.status === 409) {
        toast('You already voted on this!');
        setMeToo(true);
        return;
      }
      setMeToo(true);
      setMeTooCount(c => c + 1);
      toast.success('Your voice matters!');
    } catch {
      setMeToo(true);
      setMeTooCount(c => c + 1);
    }
  };

  return (
    <div className="card group flex flex-col p-0 overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
      {/* Company + Platform header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: post.companyColor }}
          />
          <span className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {post.company}
          </span>
        </div>
        <FontAwesomeIcon
          icon={PLATFORM_ICON[post.platform]}
          className="w-3.5 h-3.5"
          style={{ color: PLATFORM_COLOR[post.platform] }}
        />
      </div>

      {/* Complaint text */}
      <div className="px-5 pb-3 flex-1">
        <p className="text-[13px] leading-[1.6] text-[var(--color-text-secondary)]">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold mt-1.5 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} className="w-2.5 h-2.5" />
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer: date + stats + me too */}
      <div
        className="flex items-center justify-between px-5 py-3 mt-auto"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        {/* Left: date + micro stats */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            {post.date}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
            <FontAwesomeIcon icon={faHeart} className="w-3 h-3" />
            {fmtNum(post.likes)}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
            <FontAwesomeIcon icon={faComment} className="w-3 h-3" />
            {fmtNum(post.comments)}
          </span>
        </div>

        {/* Right: Me too button */}
        <button
          onClick={handleMeToo}
          disabled={meToo}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            meToo
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white'
          }`}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="w-3 h-3" />
          Me too
          {meTooCount > 0 && (
            <span className="font-mono text-[10px] tabular-nums opacity-80">
              {fmtNum(meTooCount)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
