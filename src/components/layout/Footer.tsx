import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const whatsappText = encodeURIComponent(
    "Check out Unresolved — India's Public Consumer Complaint Registry. File complaints against companies and hold them accountable: https://unresolved.in"
  );

  return (
    <footer className="mt-20" style={{ borderTop: '4px solid var(--color-primary)', backgroundColor: '#0d1f17' }}>
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              UNRESOLVED
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#a8d5bc' }}>
              India&apos;s public complaint registry. A platform to bring unresolved consumer
              issues to light — transparently and respectfully. We do not judge companies;
              we amplify consumer voices.
            </p>
          </div>

          {/* Quick Links */}
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
                  <Link href={link.href} className="text-sm hover:text-white transition-colors" style={{ color: '#a8d5bc' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
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
                  <Link href={link.href} className="text-sm hover:text-white transition-colors" style={{ color: '#a8d5bc' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://twitter.com/unresolvedin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(168, 213, 188, 0.1)' }}
                aria-label="Follow on X (Twitter)"
              >
                <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://linkedin.com/company/unresolved"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(168, 213, 188, 0.1)' }}
                aria-label="Follow on LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="w-4 h-4 text-white" />
              </a>
              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(37, 211, 102, 0.15)' }}
                aria-label="Share on WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366]" />
              </a>
            </div>
            <p className="text-xs" style={{ color: '#6b8a76' }}>
              Share Unresolved with friends and family. Help amplify consumer voices.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(168, 213, 188, 0.15)' }}>
          <div className="flex items-start gap-2 mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(168, 213, 188, 0.05)' }}>
            <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
            <p className="text-xs leading-relaxed" style={{ color: '#6b8a76' }}>
              We never store or sell your phone number. OTP verification prevents fake complaints.
              Only a SHA-256 hash and your last 4 digits are associated with your complaint.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs" style={{ color: '#4a6657' }}>
              UNRESOLVED is an independent consumer platform. Complaints are user-generated.
              We are not affiliated with any listed company. We do not make judgments about companies.
            </p>
            <p className="text-xs flex items-center gap-1 flex-shrink-0" style={{ color: '#4a6657' }}>
              © {new Date().getFullYear()} Unresolved. Built with{' '}
              <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-red-400" />{' '}
              in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
