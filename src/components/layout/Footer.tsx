import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] text-gray-300 mt-20">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-white text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              UNRESOLVED
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              India&apos;s public complaint registry. A platform to bring unresolved consumer
              issues to light — transparently and respectfully. We do not judge companies;
              we amplify consumer voices.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/file-complaint', label: 'File a Complaint' },
                { href: '/leaderboard', label: 'Company Rankings' },
                { href: '/search', label: 'Search' },
                { href: '/track', label: 'Track Complaint' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/disclaimer', label: 'Disclaimer' },
                { href: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex items-start gap-2 mb-6 p-4 bg-gray-800/50 rounded-xl">
            <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400 leading-relaxed">
              We never store or sell your phone number. OTP verification prevents fake complaints.
              Only a SHA-256 hash and your last 4 digits are associated with your complaint.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              UNRESOLVED is an independent consumer platform. Complaints are user-generated.
              We are not affiliated with any listed company. We do not make judgments about companies.
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Unresolved. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
