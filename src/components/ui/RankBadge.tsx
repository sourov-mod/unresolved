'use client';

import React from 'react';
import type { RankLabel } from '@/types';

const RANK_CONFIG: Record<RankLabel, { marker: string; colorClass: string; bgClass: string }> = {
  Excellent: { marker: 'A+', colorClass: 'text-[var(--rank-best)]', bgClass: 'bg-emerald-50 border-emerald-200' },
  Good:      { marker: 'A',  colorClass: 'text-[var(--rank-good)]', bgClass: 'bg-green-50 border-green-200' },
  Average:   { marker: 'B',  colorClass: 'text-[var(--rank-average)]', bgClass: 'bg-amber-50 border-amber-200' },
  Poor:      { marker: 'C',  colorClass: 'text-[var(--rank-bad)]', bgClass: 'bg-orange-50 border-orange-200' },
  Terrible:  { marker: 'D',  colorClass: 'text-[var(--rank-worst)]', bgClass: 'bg-red-50 border-red-200' },
  Unrated:   { marker: '--', colorClass: 'text-gray-400', bgClass: 'bg-gray-50 border-gray-200' },
};

interface RankBadgeProps {
  label: RankLabel;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export default function RankBadge({ label, size = 'md', showIcon = true }: RankBadgeProps) {
  const config = RANK_CONFIG[label] || RANK_CONFIG.Unrated;

  return (
    <span
      className={`badge border ${config.bgClass} ${config.colorClass} ${
        size === 'sm' ? 'text-[0.6875rem] px-2 py-0.5' : ''
      }`}
    >
      {showIcon && <span className="font-mono text-[0.75em] font-bold">{config.marker}</span>}
      {label}
    </span>
  );
}
