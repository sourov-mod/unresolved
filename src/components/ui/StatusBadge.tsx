'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faPaperPlane, faCommentDots, faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons';
import type { ComplaintStatus } from '@/types';
import { STATUS_LABELS } from '@/types';

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  registered: 'badge-filed',
  sent: 'badge-sent',
  responded: 'badge-responded',
  resolved: 'badge-resolved',
  rejected: 'badge-rejected',
};

const STATUS_ICONS: Record<ComplaintStatus, typeof faFileAlt> = {
  registered: faFileAlt,
  sent: faPaperPlane,
  responded: faCommentDots,
  resolved: faCheckCircle,
  rejected: faBan,
};

interface StatusBadgeProps {
  status: ComplaintStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={`badge ${STATUS_STYLES[status]} ${
        size === 'sm' ? 'text-[0.6875rem] px-2 py-0.5' : ''
      }`}
    >
      {showIcon && <FontAwesomeIcon icon={STATUS_ICONS[status]} className="w-3 h-3" />}
      {STATUS_LABELS[status]}
    </span>
  );
}
