'use client';

import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  faThumbsUp, faShareNodes, faChevronDown, faChevronUp,
  faQuoteLeft, faGlobe, faCommentDots, faPaperPlane,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
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

const PLATFORM_THEME = {
  twitter: {
    icon: faXTwitter,
    label: 'X (Twitter)',
    bg: 'linear-gradient(135deg, #15202B 0%, #1A2730 50%, #192734 100%)',
    textPrimary: '#E7E9EA',
    textSecondary: '#8B98A5',
    accent: '#1D9BF0',
    cardBorder: '#2F3336',
    tagBg: 'rgba(29, 155, 240, 0.15)',
    tagBorder: 'rgba(29, 155, 240, 0.3)',
    inputBg: '#273340',
    buttonBg: '#1D9BF0',
  },
  facebook: {
    icon: faFacebook,
    label: 'Facebook',
    bg: 'linear-gradient(135deg, #1877F2 0%, #1565D8 50%, #0D47A1 100%)',
    textPrimary: '#FFFFFF',
    textSecondary: '#B8D4F0',
    accent: '#58A6FF',
    cardBorder: 'rgba(255,255,255,0.15)',
    tagBg: 'rgba(255, 255, 255, 0.15)',
    tagBorder: 'rgba(255, 255, 255, 0.25)',
    inputBg: 'rgba(255,255,255,0.12)',
    buttonBg: '#FFFFFF',
  },
  instagram: {
    icon: faInstagram,
    label: 'Instagram',
    bg: 'linear-gradient(135deg, #833AB4 0%, #C13584 40%, #E1306C 70%, #FD1D1D 100%)',
    textPrimary: '#FFFFFF',
    textSecondary: '#FFD6E7',
    accent: '#FF6B9D',
    cardBorder: 'rgba(255,255,255,0.2)',
    tagBg: 'rgba(255, 255, 255, 0.18)',
    tagBorder: 'rgba(255, 255, 255, 0.3)',
    inputBg: 'rgba(255,255,255,0.15)',
    buttonBg: '#FFFFFF',
  },
  web: {
    icon: faGlobe,
    label: 'Web',
    bg: 'linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)',
    textPrimary: '#FFFFFF',
    textSecondary: '#A7F3D0',
    accent: '#6EE7B7',
    cardBorder: 'rgba(255,255,255,0.15)',
    tagBg: 'rgba(110, 231, 183, 0.2)',
    tagBorder: 'rgba(110, 231, 183, 0.3)',
    inputBg: 'rgba(255,255,255,0.12)',
    buttonBg: '#6EE7B7',
  },
};

const MAX_CHARS = 160;

export default function SocialComplaintCard({ post }: { post: SocialPost }) {
  const [expanded, setExpanded] = useState(false);
  const [meToo, setMeToo] = useState(false);
  const [meTooCount, setMeTooCount] = useState(post.meTooCount);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<{ name: string; text: string; time: string }[]>([]);
  const commentRef = useRef<HTMLInputElement>(null);

  const theme = PLATFORM_THEME[post.platform];
  const isLong = post.text.length > MAX_CHARS;
  const displayText = expanded || !isLong ? post.text : post.text.slice(0, MAX_CHARS) + '...';

  const handleMeToo = async () => {
    if (meToo) return;
    // Fingerprint for dedup
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
      // Fallback: just do local
      setMeToo(true);
      setMeTooCount(c => c + 1);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || commentText.trim().length < 3) {
      toast.error('Comment too short');
      return;
    }
    const fp = `${navigator.userAgent}-${screen.width}`;
    try {
      await fetch('/api/social/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, text: commentText.trim(), fingerprint: fp }),
      });
    } catch {
      // Continue anyway for local state
    }
    setLocalComments(prev => [...prev, {
      name: 'You',
      text: commentText.trim(),
      time: 'just now',
    }]);
    setCommentText('');
    toast.success('Comment posted!');
  };

  const shareUrl = post.sourceUrl || `https://unresolved.in/social#${post.id}`;
  const shareText = `Consumer complaint against ${post.company}: "${post.text.slice(0, 80)}..."`;

  const fbTextColor = post.platform === 'facebook' ? '#1A1A1A' : undefined;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
      style={{
        background: theme.bg,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{
              backgroundColor: post.avatarColor,
              fontFamily: 'var(--font-display)',
              boxShadow: `0 0 0 2px ${theme.accent}`,
            }}
          >
            {post.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: theme.textPrimary }}>
              {post.displayName}
            </p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              @{post.username} · {theme.label}
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={theme.icon}
          className="w-5 h-5"
          style={{ color: post.platform === 'twitter' ? '#71767B' : 'rgba(255,255,255,0.6)' }}
        />
      </div>

      {/* ===== COMPANY TAG ===== */}
      <div className="px-4 pb-1 pt-1">
        <span
          className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: theme.tagBg,
            color: post.platform === 'twitter' ? theme.accent : '#FFFFFF',
            border: `1px solid ${theme.tagBorder}`,
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: post.companyColor }}
          />
          {post.company}
        </span>
      </div>

      {/* ===== TEXT ===== */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          <FontAwesomeIcon
            icon={faQuoteLeft}
            className="w-3 h-3 mt-1 flex-shrink-0"
            style={{ color: theme.accent, opacity: 0.5 }}
          />
          <p
            className="text-[0.8125rem] leading-relaxed whitespace-pre-wrap"
            style={{ color: fbTextColor || theme.textPrimary }}
          >
            {displayText}
          </p>
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-bold mt-2 ml-5 transition-colors hover:opacity-80"
            style={{ color: theme.accent }}
          >
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} className="w-3 h-3" />
            {expanded ? 'Less' : 'Read more'}
          </button>
        )}
      </div>

      {/* ===== DATE + SOURCE ===== */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[0.6875rem]" style={{ color: theme.textSecondary }}>
        <span>{post.date}</span>
        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold transition-opacity hover:opacity-80"
            style={{ color: theme.accent }}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-2.5 h-2.5" />
            See the full story
          </a>
        )}
      </div>

      {/* ===== ENGAGEMENT BAR ===== */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderTop: `1px solid ${theme.cardBorder}` }}
      >
        <div className="flex items-center gap-5 text-xs" style={{ color: theme.textSecondary }}>
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
            {fmtNum(post.likes)}
          </span>
          <button
            onClick={() => { setShowComments(!showComments); }}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <FontAwesomeIcon icon={faComment} className="w-3.5 h-3.5" />
            {fmtNum(post.comments + localComments.length)}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* ME TOO BUTTON */}
          <button
            onClick={handleMeToo}
            disabled={meToo}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              meToo ? 'scale-95' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: meToo ? theme.accent : 'transparent',
              color: meToo
                ? (post.platform === 'twitter' ? '#FFFFFF' : '#000000')
                : theme.textPrimary,
              border: `1.5px solid ${theme.accent}`,
            }}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="w-3 h-3" />
            Me too
            <span className="font-mono text-[0.625rem] ml-0.5 tabular-nums">
              {meTooCount > 0 && `${fmtNum(meTooCount)}`}
            </span>
          </button>

          {/* SHARE */}
          <button
            onClick={() => {
              navigator.share?.({ text: shareText, url: shareUrl })
                .catch(() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                });
            }}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full transition-all hover:scale-105"
            style={{
              backgroundColor: theme.buttonBg,
              color: post.platform === 'facebook' ? '#1877F2'
                : post.platform === 'instagram' ? '#C13584'
                : post.platform === 'twitter' ? '#000' : '#065F46',
            }}
          >
            <FontAwesomeIcon icon={faShareNodes} className="w-3 h-3" />
            Share
          </button>
        </div>
      </div>

      {/* ===== COMMENTS ===== */}
      {showComments && (
        <div
          className="px-4 py-3 space-y-3 animate-fade-in"
          style={{ borderTop: `1px solid ${theme.cardBorder}` }}
        >
          {localComments.map((c, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.5rem] font-bold flex-shrink-0"
                style={{ backgroundColor: theme.accent, color: '#000' }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                  {c.name} <span className="font-normal" style={{ color: theme.textSecondary }}>· {c.time}</span>
                </p>
                <p className="text-xs" style={{ color: theme.textPrimary }}>{c.text}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              ref={commentRef}
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment... (1 per day)"
              maxLength={200}
              className="flex-1 text-xs px-3 py-2 rounded-full outline-none placeholder-opacity-50"
              style={{
                backgroundColor: theme.inputBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.cardBorder}`,
              }}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
              style={{ backgroundColor: theme.accent }}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3 text-white" />
            </button>
          </div>
          <p className="text-[0.5625rem] text-center" style={{ color: theme.textSecondary }}>
            One comment per device per day to prevent spam
          </p>
        </div>
      )}

    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
