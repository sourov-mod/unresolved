import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faShield, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Unresolved handles your data, protects your privacy, and ensures your personal information is safe.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Last updated: May 21, 2026</p>

          <div className="space-y-8 text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed">
            {/* Intro */}
            <div className="card p-6 flex items-start gap-3 bg-[var(--color-primary-light)]">
              <FontAwesomeIcon icon={faShield} className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
              <p>
                Unresolved (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard your information when you
                use the Unresolved platform at <strong>unresolved.in</strong>.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                1. Information We Collect
              </h2>

              <h3 className="font-semibold text-[var(--color-text-primary)] mt-4 mb-2">1.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Full Name</strong> — displayed publicly on your complaint.</li>
                <li><strong>Email Address</strong> — used to send you complaint updates, status changes, and company responses. Never displayed publicly.</li>
                <li><strong>Phone Number (for OTP only)</strong> — used solely for one-time verification. <strong>We immediately hash your phone number with SHA-256 and discard the original.</strong> The plain phone number is never stored in any database, log file, analytics event, or backup.</li>
                <li><strong>Complaint Content</strong> — title, description, category, and company name.</li>
                <li><strong>Proof Files</strong> — images (JPG, PNG) and documents (PDF) uploaded as evidence.</li>
              </ul>

              <h3 className="font-semibold text-[var(--color-text-primary)] mt-4 mb-2">1.2 Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Browser Fingerprint (hashed)</strong> — to prevent duplicate upvotes. Not linked to your identity.</li>
                <li><strong>Basic Analytics</strong> — page views, referrer URLs, and device type for improving the platform. No personal identifiers tracked.</li>
              </ul>

              <h3 className="font-semibold text-[var(--color-text-primary)] mt-4 mb-2">1.3 Information We Do NOT Collect</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Full phone number (never stored after hashing)</li>
                <li>IP addresses linked to identifiable profiles</li>
                <li>Location or GPS data</li>
                <li>Device identifiers (IMEI, advertising ID)</li>
                <li>Social media accounts or third-party logins</li>
                <li>Credit card or payment information</li>
              </ul>
            </section>

            {/* 2. How We Use Your Data */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                2. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Public complaint records:</strong> Your name, complaint content, and proof files are displayed publicly to ensure transparency.</li>
                <li><strong>Email notifications:</strong> We send complaint status updates, company responses, and resolution notices to your email address.</li>
                <li><strong>Spam prevention:</strong> Phone hash is used to prevent duplicate/fake complaints from the same number.</li>
                <li><strong>Company scoring:</strong> Aggregate complaint data (not personal data) is used to calculate company scores and rankings.</li>
                <li><strong>Platform improvement:</strong> Anonymous analytics help us improve usability.</li>
              </ul>
              <div className="card p-4 mt-4 bg-[var(--color-primary-light)]">
                <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
                  We do NOT use your data for advertising, marketing, profiling, or sharing with third parties.
                </p>
              </div>
            </section>

            {/* 3. Data Storage & Security */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                3. Data Storage & Security
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Complaint data is stored on <strong>Supabase</strong> (PostgreSQL) with Row Level Security (RLS).</li>
                <li>Proof files are stored on <strong>Cloudflare R2</strong> with encryption at rest.</li>
                <li>All connections use HTTPS/TLS 1.3 encryption.</li>
                <li>OTP codes expire after 10 minutes and are deleted after verification.</li>
                <li>Admin access requires a server-side secret key.</li>
              </ul>
            </section>

            {/* 4. Data Sharing */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                4. Data Sharing
              </h2>
              <p>We share data only in the following limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                <li><strong>Public complaints:</strong> Complaint content, your name, proof files, status, and company name are publicly visible.</li>
                <li><strong>Legal obligation:</strong> If required by Indian law, court order, or government authority.</li>
                <li><strong>Safety:</strong> To prevent harm or protect the rights, property, or safety of users or the public.</li>
              </ul>
              <p className="mt-3 font-semibold">We never sell, rent, or trade your personal data to any third party.</p>
            </section>

            {/* 5. Your Rights */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                5. Your Rights
              </h2>
              <p>Under the Digital Personal Data Protection Act, 2023 (DPDPA), you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                <li><strong>Access</strong> your complaint data.</li>
                <li><strong>Correction</strong> of inaccurate information in your complaint.</li>
                <li><strong>Erasure</strong> — request deletion of your complaint. We will verify your identity via OTP before processing.</li>
                <li><strong>Grievance Redressal</strong> — contact our Data Protection Officer.</li>
              </ul>
            </section>

            {/* 6. Cookies */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                6. Cookies
              </h2>
              <p>We use only essential cookies for:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                <li>Admin authentication (session cookie).</li>
                <li>Upvote tracking (to prevent duplicate votes).</li>
              </ul>
              <p className="mt-2">We do not use advertising, tracking, or analytics cookies.</p>
            </section>

            {/* 7. Children */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                7. Children&apos;s Privacy
              </h2>
              <p>Unresolved is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from minors.</p>
            </section>

            {/* 8. Changes */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                8. Changes to This Policy
              </h2>
              <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of the platform constitutes acceptance of the updated policy.</p>
            </section>

            {/* 9. Contact */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                9. Contact Us
              </h2>
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Data Protection Officer</p>
                    <a href="mailto:privacy@unresolved.in" className="text-[var(--color-primary)] hover:underline text-sm">
                      privacy@unresolved.in
                    </a>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  For data access, correction, or deletion requests, please email us with your complaint token.
                </p>
              </div>
            </section>

            {/* Phone disclaimer */}
            <div className="card p-6 flex items-start gap-3 bg-[var(--color-primary-light)]">
              <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Phone Number Guarantee:</strong> Your phone number is hashed with SHA-256 immediately on receipt.
                The original is never stored in any database, log file, or analytics system. We cannot reverse this hash.
                We cannot identify you, contact you, or sell your number — because we don&apos;t have it.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
