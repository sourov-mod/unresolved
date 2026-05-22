'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'Is my phone number safe?',
    answer:
      'Absolutely. Your phone number is never stored in our database. We use it only for OTP verification, then immediately hash it using SHA-256 encryption. Only the last 4 digits and the irreversible hash are kept — the original number is discarded. We cannot identify or contact you through your phone number.',
  },
  {
    question: 'What happens after I file a complaint?',
    answer:
      'You receive a unique tracking token (like UNR-2026-XXXXXX) via email. Your complaint becomes publicly visible and is indexed by search engines like Google. You can track status updates anytime using your token. If the company responds, you\'ll be notified via email.',
  },
  {
    question: 'Can the company remove my complaint?',
    answer:
      'Companies cannot remove complaints directly. A complaint may only be taken down if it is demonstrably false, defamatory, or violates our Terms & Conditions. Companies can request a review by contacting legal@unresolved.in with evidence. Legitimate, factual complaints remain permanently public.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. There is no signup or login process. You verify your identity with a one-time OTP sent to your phone, provide your name and email for updates, and that\'s it. The entire process takes under 5 minutes.',
  },
  {
    question: 'Will this actually help resolve my issue?',
    answer:
      'Public accountability works. Your complaint is indexed by Google, which means when someone searches for that company + "complaint," your experience shows up. Journalists and consumer advocates monitor platforms like this. Companies increasingly respond to publicly documented complaints because they affect reputation and search rankings.',
  },
  {
    question: 'What if I filed my complaint incorrectly?',
    answer:
      'If you made a mistake or need to update your complaint, contact us at legal@unresolved.in with your tracking token and the details you\'d like to correct. We\'ll review and update it. Please note that complaints cannot be deleted simply because the issue was resolved — they remain as a public record.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQ_DATA.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="card overflow-hidden transition-all duration-200"
            style={{
              borderLeft: isOpen ? '4px solid var(--color-primary)' : '4px solid transparent',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface-2)] transition-colors"
              aria-expanded={isOpen}
            >
              <span
                className="text-base font-semibold text-[var(--color-text-primary)] pr-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.question}
              </span>
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center transition-transform duration-200">
                <FontAwesomeIcon
                  icon={isOpen ? faMinus : faPlus}
                  className="w-3.5 h-3.5 text-[var(--color-primary)]"
                />
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: isOpen ? '500px' : '0px',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
