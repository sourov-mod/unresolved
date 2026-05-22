import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGavel, faNewspaper, faClock } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Unresolved team. Reach out for general inquiries, legal matters, or press coverage.',
};

const CONTACTS: { icon: IconDefinition; iconColor: string; label: string; description: string; email: string }[] = [
  {
    icon: faEnvelope,
    iconColor: '#10B981',
    label: 'General Inquiries',
    description: 'Questions, feedback, or partnership requests.',
    email: 'hello@unresolved.in',
  },
  {
    icon: faGavel,
    iconColor: '#F59E0B',
    label: 'Legal & Takedowns',
    description: 'Content removal requests, legal notices, or compliance questions.',
    email: 'legal@unresolved.in',
  },
  {
    icon: faNewspaper,
    iconColor: '#6366F1',
    label: 'Press & Media',
    description: 'Interview requests, data access, or media collaborations.',
    email: 'press@unresolved.in',
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 md:py-20 max-w-3xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get in Touch
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
              We&apos;re here to help. Choose the right contact for your query and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {CONTACTS.map((contact) => (
              <a
                key={contact.email}
                href={`mailto:${contact.email}`}
                className="card card-hover p-6 text-center group"
              >
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: contact.iconColor + '15' }}
                >
                  <FontAwesomeIcon
                    icon={contact.icon}
                    className="w-6 h-6"
                    style={{ color: contact.iconColor }}
                  />
                </div>
                <h2
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {contact.label}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                  {contact.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] group-hover:underline">
                  <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" />
                  {contact.email}
                </span>
              </a>
            ))}
          </div>

          {/* Response Time Note */}
          <div className="card p-6 text-center max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-[var(--color-primary)]" />
              <span>We typically respond within <strong className="text-[var(--color-text-primary)]">48 hours</strong>.</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
