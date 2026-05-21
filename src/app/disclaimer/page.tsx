import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faScaleBalanced, faUserShield, faEye } from '@fortawesome/free-solid-svg-icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimer about the Unresolved platform, user-generated content, and our role as a neutral registry.',
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Disclaimer
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Please read carefully before using Unresolved</p>

          <div className="space-y-8 text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed">
            {/* Important notice */}
            <div className="card p-6 flex items-start gap-3 border-l-4 border-l-[var(--color-amber)]" style={{ backgroundColor: 'var(--color-amber-light)' }}>
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-[var(--color-amber)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)] mb-2">Important Notice</p>
                <p>
                  Unresolved is a <strong>user-generated content platform</strong>. All complaints, descriptions,
                  proof files, and reviews are submitted by individual users and represent their personal experiences
                  and opinions. They do not represent the views, opinions, or position of Unresolved.
                </p>
              </div>
            </div>

            {/* Platform Role */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faScaleBalanced} className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Our Role
                </h2>
              </div>
              <p className="mb-3">Unresolved is a <strong>neutral registry platform</strong> that:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Provides a space for consumers to document unresolved grievances.</li>
                <li>Tracks and displays complaint statuses transparently.</li>
                <li>Calculates company scores based on objective data (resolution rates, response rates).</li>
              </ul>
              <div className="card p-5 mt-4 bg-[var(--color-primary-light)]">
                <p className="font-semibold text-[var(--color-primary-dark)] text-sm">
                  We are NOT a regulatory body, consumer court, legal authority, or arbitrator.
                  We do not investigate complaints, verify claims, or make legal determinations.
                </p>
              </div>
            </section>

            {/* What We Don't Do */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Company Privacy & Rights
                </h2>
              </div>
              <p className="mb-3">We take company rights seriously:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>We do <strong>not</strong> publish, share, or expose any company&apos;s internal, confidential, or proprietary information.</li>
                <li>We do <strong>not</strong> encourage users to violate NDAs, employment agreements, or confidentiality obligations.</li>
                <li>We do <strong>not</strong> make editorial judgments about whether a company is &quot;good&quot; or &quot;bad&quot;.</li>
                <li>Company rankings are <strong>algorithmic</strong> — based purely on aggregate complaint data, not our opinion.</li>
                <li>Companies may respond to complaints and request removal of provably false content.</li>
                <li>We comply with valid legal takedown requests from authorised representatives.</li>
              </ul>
            </section>

            {/* User-Generated Content */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faEye} className="w-5 h-5 text-[var(--color-primary)]" />
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  User-Generated Content Disclaimer
                </h2>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>All complaints are the sole responsibility of the user who submitted them.</li>
                <li>We do not guarantee the accuracy, completeness, or truthfulness of any complaint.</li>
                <li>We do not endorse any claims made by users.</li>
                <li>Complaint scores and statistics are based on user submissions and may not reflect the company&apos;s overall service quality.</li>
                <li>A high number of complaints against a company may reflect popularity and scale, not necessarily poor service.</li>
              </ul>
            </section>

            {/* No Legal Advice */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Not Legal Advice
              </h2>
              <p>
                Nothing on this platform constitutes legal advice. If you have a legal dispute with a company,
                please consult a qualified legal professional or approach the appropriate consumer forum:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li><strong>National Consumer Helpline:</strong> 1800-11-4000 (toll-free)</li>
                <li><strong>INGRAM Portal:</strong> <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">consumerhelpline.gov.in</a></li>
                <li><strong>Consumer Commission (NCDRC):</strong> <a href="https://ncdrc.nic.in" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">ncdrc.nic.in</a></li>
              </ul>
            </section>

            {/* Intermediary Status */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Intermediary Status
              </h2>
              <p>
                Unresolved operates as an intermediary under Section 2(1)(w) of the Information Technology Act, 2000.
                We comply with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
                As an intermediary, we are not liable for user-generated content, provided we act in good faith to
                remove unlawful content upon receiving actual knowledge or valid court orders.
              </p>
            </section>

            {/* Affiliate Disclaimer */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                No Affiliation
              </h2>
              <p>
                Unresolved is an independent platform. We are not affiliated with, sponsored by, endorsed by,
                or connected to any company, brand, or organisation listed on our platform. All company names,
                logos, and trademarks belong to their respective owners and are used here solely for
                identification purposes.
              </p>
            </section>

            {/* Contact */}
            <section className="card p-6">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Company Takedown Requests
              </h2>
              <p className="text-sm mb-2">
                If you are a company representative and believe a complaint is false, defamatory, or violates
                your rights, please contact us with supporting evidence:
              </p>
              <a href="mailto:takedown@unresolved.in" className="text-[var(--color-primary)] hover:underline text-sm font-semibold">
                takedown@unresolved.in
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
