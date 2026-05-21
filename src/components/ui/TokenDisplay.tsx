'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface TokenDisplayProps {
  token: string;
  size?: 'sm' | 'md' | 'lg';
  showCopy?: boolean;
}

export default function TokenDisplay({ token, size = 'md', showCopy = true }: TokenDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      toast.success('Token copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl md:text-4xl',
  };

  return (
    <div className="inline-flex items-center gap-3">
      <span className={`token-text ${sizeClasses[size]}`}>
        {token}
      </span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
          title="Copy token"
        >
          <FontAwesomeIcon
            icon={copied ? faCheck : faCopy}
            className={`w-4 h-4 ${copied ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}
          />
        </button>
      )}
    </div>
  );
}
