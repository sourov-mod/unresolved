import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced, faHandshake, faBan, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the Unresolved platform. Read before filing a complaint.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Terms & Conditions
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">Last updated: May 21, 2026</p>

          <div className="space-y-8 text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed">
            {/* Mission statement */}
            <div className="card p-6 flex items-start gap-3 bg-[var(--color-primary-light)]">
              <FontAwesomeIcon icon={faHandshake} className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
              <p>
                <strong>Our Mission:</strong> Unresolved exists solely to bring genuinely unresolved consumer
                issues to public attention. We are a neutral platform — we do not judge, defame, or target
                companies. We do not violate any company&apos;s privacy or proprietary rights. We simply
                provide a transparent space for consumers to document and track their unresolved grievances.
              </p>
            </div>

            {/* 1. Acceptance */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Unresolved (&quot;the Platform&quot;), you agree to be bound by these Terms & Conditions.
                If you do not agree, you must not use the Platform. These terms constitute a legally binding agreement
                between you (&quot;User&quot;, &quot;you&quot;) and Unresolved (&quot;we&quot;, &quot;us&quot;, &quot;the Platform&quot;).
              </p>
            </section>

            {/* 2. Platform Purpose */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                2. Platform Purpose & Neutrality
              </h2>
              <div className="card p-5 flex items-start gap-3 mb-4">
                <FontAwesomeIcon icon={faScaleBalanced} className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-2">Unresolved is a <strong>consumer complaint registry</strong> — not a court, regulator, or arbitrator. We:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2">
                    <li>Provide a platform for consumers to publicly document <strong>genuinely unresolved</strong> grievances.</li>
                    <li>Aggregate and display data transparently to promote accountability.</li>
                    <li>Do <strong>not</strong> make judgments about whether a company is &quot;good&quot; or &quot;bad&quot;.</li>
                    <li>Do <strong>not</strong> investigate, verify, or guarantee the accuracy of user-submitted complaints.</li>
                    <li>Do <strong>not</strong> act as a legal representative for any party.</li>
                  </ul>
                </div>
              </div>
              <p>
                Company scores and rankings are calculated purely from aggregate complaint data (resolution rate,
                response rate, volume). They reflect publicly available user-submitted data, not our editorial opinion.
              </p>
            </section>

            {/* 3. User Responsibilities */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                3. User Responsibilities
              </h2>
              <p className="mb-3">By filing a complaint on Unresolved, you represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Your complaint is <strong>truthful, accurate, and based on your real personal experience</strong> with the named company.</li>
                <li>You have <strong>genuinely attempted to resolve</strong> the issue with the company through their official channels before filing.</li>
                <li>You will <strong>not</strong> file false, misleading, fraudulent, or malicious complaints.</li>
                <li>You will <strong>not</strong> use defamatory, abusive, obscene, or threatening language.</li>
                <li>You will <strong>not</strong> disclose private or confidential business information (trade secrets, internal communications not related to your grievance).</li>
                <li>You will <strong>not</strong> post personal information of company employees (personal phone numbers, home addresses, personal social media profiles).</li>
                <li>You will <strong>not</strong> upload manipulated or fabricated proof/evidence.</li>
                <li>You are at least <strong>18 years of age</strong>.</li>
                <li>You are using your <strong>real identity</strong> (no impersonation).</li>
              </ul>
            </section>

            {/* 4. What We Do NOT Allow */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                4. Prohibited Content
              </h2>
              <div className="card p-5 flex items-start gap-3 border-l-4 border-l-[var(--rank-bad)]">
                <FontAwesomeIcon icon={faBan} className="w-5 h-5 text-[var(--rank-bad)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)] mb-2">The following content is strictly prohibited:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2">
                    <li>Defamatory statements — unsubstantiated claims intended to damage reputation.</li>
                    <li>Hate speech, communal, casteist, sexist, or discriminatory language.</li>
                    <li>Personal attacks on individual employees by name (unless they are a public-facing executive directly responsible).</li>
                    <li>Content violating any company&apos;s intellectual property, trade secrets, or NDAs.</li>
                    <li>Complaints filed for competitive sabotage or commercial gain.</li>
                    <li>Content that violates any applicable Indian law.</li>
                    <li>Spam, duplicate, or mass-generated complaints.</li>
                    <li>Personal data of others — Aadhaar numbers, phone numbers, bank account details.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Company Rights */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                5. Respect for Companies
              </h2>
              <p className="mb-3">We recognise that companies have rights too. Therefore:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Companies may respond to complaints through our platform. Their responses will be displayed alongside the complaint.</li>
                <li>Companies may request removal of complaints that are demonstrably false, defamatory, or violate these Terms.</li>
                <li>We will review removal requests impartially and in good faith.</li>
                <li>Company rankings are algorithmic, not editorial. A low score is not a &quot;judgment&quot; — it reflects aggregate data.</li>
                <li>We do not share, publish, or expose any proprietary, confidential, or internal company data beyond what users submit.</li>
              </ul>
            </section>

            {/* 6. Moderation */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                6. Content Moderation
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>All complaints pass through automated moderation (profanity filter, personal data detection, spam detection) before publication.</li>
                <li>We reserve the right to remove, edit, or flag any complaint that violates these Terms.</li>
                <li>Repeated violations will result in a permanent ban (phone hash block).</li>
                <li>Moderation decisions may be appealed by emailing <a href="mailto:appeals@unresolved.in" className="text-[var(--color-primary)] hover:underline">appeals@unresolved.in</a>.</li>
              </ul>
            </section>

            {/* 7. Email Communications */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                7. Email Communications
              </h2>
              <p>By providing your email address during complaint filing, you consent to receive:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                <li>Complaint submission confirmation with your tracking token.</li>
                <li>Status change notifications (Sent to Company, Company Responded, Resolved).</li>
                <li>Company response notifications.</li>
                <li>Account-related security alerts.</li>
              </ul>
              <p className="mt-3">We will <strong>never</strong> send marketing emails, newsletters, or promotional content. You can opt out of status notifications by replying STOP to any email.</p>
            </section>

            {/* 8. Liability */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                8. Limitation of Liability
              </h2>
              <div className="card p-5 flex items-start gap-3">
                <FontAwesomeIcon icon={faCircleExclamation} className="w-5 h-5 text-[var(--color-amber)] mt-0.5 flex-shrink-0" />
                <div>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Unresolved is provided &quot;as is&quot; without warranty of any kind.</li>
                    <li>We are not liable for the accuracy, completeness, or consequences of user-submitted complaints.</li>
                    <li>We are not liable for any actions taken by companies in response to complaints.</li>
                    <li>We are not responsible for any loss, damage, or legal consequences arising from the use of this platform.</li>
                    <li>Users are solely responsible for the content they submit.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 9. Indemnification */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                9. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless Unresolved, its operators, and contributors from any
                claims, damages, losses, or expenses arising from your use of the Platform, your complaints,
                or your violation of these Terms.
              </p>
            </section>

            {/* 10. Governing Law */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                10. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
                jurisdiction of the courts in New Delhi, India. This platform operates in compliance with the
                Information Technology Act, 2000, the Consumer Protection Act, 2019, and the Digital Personal
                Data Protection Act, 2023.
              </p>
            </section>

            {/* 11. Changes */}
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                11. Changes to Terms
              </h2>
              <p>
                We may modify these Terms at any time. Material changes will be notified via the Platform.
                Continued use after changes constitutes acceptance.
              </p>
            </section>

            {/* Contact */}
            <section className="card p-6">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Questions?
              </h2>
              <p className="text-sm">
                Contact us at{' '}
                <a href="mailto:legal@unresolved.in" className="text-[var(--color-primary)] hover:underline">
                  legal@unresolved.in
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
