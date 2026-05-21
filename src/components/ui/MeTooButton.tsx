'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface MeTooButtonProps {
  complaintId: string;
  initialCount: number;
}

export default function MeTooButton({ complaintId, initialCount }: MeTooButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (voted) return;

    setAnimating(true);
    try {
      const fingerprint = `${navigator.userAgent}-${screen.width}-${screen.height}`;
      const res = await fetch('/api/complaints/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_id: complaintId, fingerprint }),
      });

      if (res.status === 409) {
        toast('You\'ve already supported this complaint');
        setVoted(true);
        return;
      }

      if (!res.ok) throw new Error('Failed to upvote');

      setCount(prev => prev + 1);
      setVoted(true);
      toast.success('Your support has been recorded!');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={voted}
      title="Same issue? You're not alone"
      className={`
        inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold
        transition-all duration-200 border
        ${voted
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
          : 'bg-transparent text-[var(--color-primary-dark)] border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
        }
        ${animating ? 'scale-110' : 'scale-100'}
        disabled:cursor-default
      `}
    >
      <FontAwesomeIcon icon={faThumbsUp} className={`w-3.5 h-3.5 ${animating ? 'animate-bounce' : ''}`} />
      <span>{voted ? 'Supported' : 'Me too'}</span>
      <span className="font-mono text-[0.6875rem]">
        {count > 0 && `+${count}`}
      </span>
    </button>
  );
}
