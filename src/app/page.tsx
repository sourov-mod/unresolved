import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialComplaintCard from '@/components/ui/SocialComplaintCard';
import AnimatedStatCounter from '@/components/ui/AnimatedStatCounter';
import FAQAccordion from '@/components/ui/FAQAccordion';
import RecentComplaints from '@/components/ui/RecentComplaints';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { SOCIAL_COMPLAINTS } from '@/lib/social-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt, faMagnifyingGlass, faArrowRight, faShield, faCamera, faHashtag,
  faMobileScreenButton, faCartShopping, faBuildingColumns, faMotorcycle,
  faShieldHalved, faBolt, faBoxOpen,
  faPaperPlane, faCheckCircle, faBullhorn,
  faLock, faEye, faQuestionCircle,
  faScaleBalanced, faBookOpen, faFlag,
} from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const CATEGORIES: { icon: IconDefinition; label: string; slug: string; color: string; count: string }[] = [
  { icon: faMobileScreenButton, label: 'Telecom', slug: 'telecom', color: '#6366F1', count: '1,240' },
  { icon: faCartShopping, label: 'E-commerce', slug: 'e-commerce', color: '#F59E0B', count: '3,890' },
  { icon: faBuildingColumns, label: 'Banking', slug: 'banking', color: '#3B82F6', count: '2,340' },
  { icon: faMotorcycle, label: 'Food Delivery', slug: 'food-delivery', color: '#EF4444', count: '1,670' },
  { icon: faShieldHalved, label: 'Insurance', slug: 'insurance', color: '#06B6D4', count: '890' },
  { icon: faBolt, label: 'Utilities', slug: 'utilities', color: '#F97316', count: '1,120' },
  { icon: faBoxOpen, label: 'Other', slug: 'other', color: '#8B5CF6', count: '560' },
];

const HOW_IT_WORKS: { icon: IconDefinition; iconColor: string; title: string; description: string; step: string }[] = [
  {
    icon: faMobileScreenButton,
    iconColor: '#6366F1',
    title: 'Verify with OTP',
    description: 'Quick phone verification — we never store your number.',
    step: '01',
  },
  {
    icon: faPaperPlane,
    iconColor: '#10B981',
    title: 'File Your Complaint',
    description: 'Describe the issue, upload proof, and agree to our terms.',
    step: '02',
  },
  {
    icon: faCheckCircle,
    iconColor: '#F59E0B',
    title: 'Get Your Token',
    description: 'Receive a unique tracking ID. Your complaint is now public.',
    step: '03',
  },
  {
    icon: faBullhorn,
    iconColor: '#EF4444',
    title: 'Track & Share',
    description: 'Get email updates. Share your complaint. Accountability follows.',
    step: '04',
  },
];

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ===== HERO ===== */}
        <section className="hero-section relative overflow-hidden">
          <div className="container-page relative py-20 md:py-32">
            <div className="flex items-center gap-12">
              {/* Left column */}
              <div className="flex-1 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary-muted)] text-[var(--color-primary-dark)] text-xs font-semibold mb-6">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  India&apos;s Public Consumer Complaint Registry
                </div>
                <h1
                  className="text-5xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.05] mb-6 hero-animate-title"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Unresolved Issue?
                  <br />
                  <span className="text-[var(--color-primary)]">Bring It to Light.</span>
                </h1>
                <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl mb-8 leading-relaxed hero-animate-subtitle">
                  Document your complaint. Get a tracking token. Receive email updates.
                  No login. No signup. Just transparency.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8 hero-animate-buttons">
                  <Link href="/file-complaint" className="btn-primary text-base py-3.5 px-8 hero-cta-pulse">
                    <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                    File a Complaint
                    <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/track" className="btn-outline text-base py-3.5 px-8">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                    Track Your Complaint
                  </Link>
                </div>
                {/* Trust micro-stats bar */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)] hero-animate-trust">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faShield} className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    4,45,960+ Complaints Documented
                  </span>
                  <span className="hidden sm:block text-[var(--color-border)]">|</span>
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Phone Never Stored
                  </span>
                  <span className="hidden sm:block text-[var(--color-border)]">|</span>
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Publicly Indexed Forever
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className="bg-[var(--color-navy)] py-8">
          <div className="container-page">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
              <AnimatedStatCounter label="Consumer complaints in India (FY 2023-24)" value="4,45,960+" />
              <div className="hidden md:block w-px h-10 bg-gray-600" />
              <AnimatedStatCounter label="Of all complaints are E-commerce related" value="36.1%" />
              <div className="hidden md:block w-px h-10 bg-gray-600" />
              <AnimatedStatCounter label="Hours Indians spent resolving issues (2024)" value="15 Billion" />
            </div>
            <p className="text-[0.625rem] text-gray-500 text-center mt-4">
              Source: National Consumer Helpline (NCH), Dept. of Consumer Affairs, Govt. of India
            </p>
          </div>
        </section>

        {/* ===== TRUST BADGES ===== */}
        <ScrollReveal>
          <section className="container-page py-10">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: faLock, label: 'DPDPA 2023 Compliant' },
                { icon: faFlag, label: 'Made in India 🇮🇳' },
                { icon: faBookOpen, label: 'Open Registry' },
                { icon: faScaleBalanced, label: 'Consumer Protection Act 2019 Aligned' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[var(--color-navy)] text-[#a8d5bc]"
                >
                  <FontAwesomeIcon icon={badge.icon} className="w-3 h-3" />
                  {badge.label}
                </span>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ===== SOCIAL WALL ===== */}
        <ScrollReveal>
          <section className="container-page py-20">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 text-[#1877F2]" />
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-[#E4405F]" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                What People Are Saying
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-12">
                Real complaints from consumers across social media. These are the issues that remain unresolved.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start card-grid">
              {SOCIAL_COMPLAINTS.slice(0, 9).map(post => (
                <SocialComplaintCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/social" className="btn-outline py-3 px-8">
                View All Social Complaints
                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </ScrollReveal>

        {/* ===== HOW IT WORKS ===== */}
        <ScrollReveal>
          <section className="bg-[var(--color-surface-2)] py-20">
            <div className="container-page">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                How It Works
              </h2>
              <p className="text-center text-[var(--color-text-secondary)] mb-14 max-w-lg mx-auto">
                Four simple steps to document and track your complaint.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={i} className="text-center relative">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center relative z-10 border-2"
                      style={{
                        backgroundColor: step.iconColor + '15',
                        borderColor: step.iconColor,
                      }}
                    >
                      <FontAwesomeIcon icon={step.icon} className="w-7 h-7" style={{ color: step.iconColor }} />
                    </div>
                    <div className="text-xs font-mono font-semibold text-[var(--color-primary-dark)] mb-2">
                      STEP {i + 1}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ===== RECENTLY FILED — LIVE FEED ===== */}
        <ScrollReveal>
          <RecentComplaints />
        </ScrollReveal>

        {/* ===== CATEGORY GRID ===== */}
        <ScrollReveal>
          <section className="container-page py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Browse by Category
            </h2>
            <p className="text-center text-[var(--color-text-secondary)] mb-12">
              Find complaints in your industry
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 card-grid">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/social?category=${cat.slug}`}
                  className="card p-6 group hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="w-14 h-14 mb-4 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: cat.color + '15' }}
                  >
                    <FontAwesomeIcon icon={cat.icon} className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <p className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{cat.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] font-mono">{cat.count} complaints</p>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ===== WHY THIS MATTERS ===== */}
        <ScrollReveal>
          <section className="py-20">
            <div className="container-page">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                The Problem Is Real. And It&apos;s Growing.
              </h2>
              <p className="text-center text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto">
                Real data from India&apos;s consumer landscape
              </p>

              {/* Big stat cards — dark background */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="rounded-2xl p-8 text-center bg-[var(--color-navy)]">
                  <p className="text-4xl font-bold text-[var(--color-primary)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>1,60,857</p>
                  <p className="text-sm text-white mb-2">
                    Grievances against Flipkart alone in FY 2023-24, topping the e-commerce complaints chart for 4 years straight.
                  </p>
                  <p className="text-[0.625rem] text-gray-500">Source: NCH / Factly.in</p>
                </div>
                <div className="rounded-2xl p-8 text-center bg-[var(--color-navy)]">
                  <p className="text-4xl font-bold text-[var(--color-primary)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>36.1%</p>
                  <p className="text-sm text-white mb-2">
                    Of all consumer complaints on the National Consumer Helpline were e-commerce related in FY 2023-24.
                  </p>
                  <p className="text-[0.625rem] text-gray-500">Source: Dept. of Consumer Affairs</p>
                </div>
                <div className="rounded-2xl p-8 text-center bg-[var(--color-navy)]">
                  <p className="text-4xl font-bold text-[var(--color-primary)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>15B hrs</p>
                  <p className="text-sm text-white mb-2">
                    Estimated time Indians spent waiting to lodge or resolve service complaints in 2024.
                  </p>
                  <p className="text-[0.625rem] text-gray-500">Source: ServiceNow Report</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ===== TRUST SIGNALS ===== */}
        <ScrollReveal>
          <section className="container-page py-10 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TrustCard
                icon={<FontAwesomeIcon icon={faShield} className="w-7 h-7 text-[var(--color-primary)]" />}
                title="Transparent & Public"
                description="Every complaint is visible, searchable, and indexed. Transparency drives accountability."
              />
              <TrustCard
                icon={<FontAwesomeIcon icon={faCamera} className="w-7 h-7 text-[var(--color-primary)]" />}
                title="Proof Required"
                description="Mandatory evidence uploads ensure credibility and prevent fake complaints."
              />
              <TrustCard
                icon={<FontAwesomeIcon icon={faHashtag} className="w-7 h-7 text-[var(--color-primary)]" />}
                title="No Account Needed"
                description="Verify with OTP. We hash your number instantly. Your privacy is guaranteed."
              />
            </div>
          </section>
        </ScrollReveal>

        {/* ===== FAQ ===== */}
        <ScrollReveal>
          <section className="bg-[var(--color-surface-2)] py-20">
            <div className="container-page">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FontAwesomeIcon icon={faQuestionCircle} className="w-6 h-6 text-[var(--color-primary)]" />
                <h2
                  className="text-3xl md:text-4xl font-bold text-center"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-center text-[var(--color-text-secondary)] mb-12 max-w-lg mx-auto">
                Everything you need to know before filing a complaint.
              </p>
              <FAQAccordion />
            </div>
          </section>
        </ScrollReveal>

        {/* ===== CTA BANNER ===== */}
        <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] py-16">
          <div className="container-page text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Have an Unresolved Issue?
            </h2>
            <p className="text-green-100 mb-8 max-w-lg mx-auto">
              Document it transparently. We&apos;ll track it for you and notify you of any updates.
            </p>
            <Link
              href="/file-complaint"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-dark)] font-bold py-3.5 px-8 rounded-xl hover:bg-gray-50 transition-all hover:scale-[1.02]"
            >
              <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
              File a Complaint
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TrustCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-8 text-center hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}
