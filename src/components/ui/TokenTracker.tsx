'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { ComplaintTimeline, ComplaintStatus } from '@/types';
import { STATUS_LABELS } from '@/types';
import { formatDateTimeIN } from '@/lib/utils';

const STEPS: ComplaintStatus[] = ['registered', 'sent', 'responded', 'resolved'];

interface TokenTrackerProps {
  currentStatus: ComplaintStatus;
  timeline: ComplaintTimeline[];
}

export default function TokenTracker({ currentStatus, timeline }: TokenTrackerProps) {
  const currentIndex = STEPS.indexOf(currentStatus);
  const isRejected = currentStatus === 'rejected';

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex || (index === currentIndex && step === 'resolved');
        const isCurrent = index === currentIndex && step !== 'resolved';
        const isUpcoming = index > currentIndex;

        const entry = timeline.find(t => t.status === step);

        return (
          <div key={step} className="relative flex gap-4">
            {index < STEPS.length - 1 && (
              <div
                className="absolute left-[15px] top-[32px] bottom-0 w-[2px]"
                style={{
                  backgroundColor: isComplete ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            )}

            <div
              className={`stepper-dot ${
                isComplete ? 'stepper-dot-complete' :
                isCurrent ? 'stepper-dot-current' :
                'stepper-dot-upcoming'
              }`}
            >
              {isComplete && <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />}
              {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
              {isUpcoming && <span className="text-xs">{index + 1}</span>}
            </div>

            <div className={`pb-8 ${isUpcoming ? 'opacity-40' : ''}`}>
              <p className={`text-sm font-semibold ${isCurrent ? 'text-[var(--color-primary-dark)]' : ''}`}>
                {STATUS_LABELS[step]}
              </p>
              {entry && (
                <>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {formatDateTimeIN(entry.created_at)}
                  </p>
                  {entry.message && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 bg-[var(--color-surface-2)] p-2.5 rounded-lg border-l-2 border-[var(--color-primary)]">
                      {entry.message}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {isRejected && (
        <div className="relative flex gap-4 animate-fade-in">
          <div className="stepper-dot bg-gray-400 text-white">
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Rejected</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Removed — violated community guidelines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
