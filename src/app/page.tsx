import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialComplaintCard from '@/components/ui/SocialComplaintCard';
import { SOCIAL_COMPLAINTS } from '@/lib/social-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt, faMagnifyingGlass, faArrowRight, faShield, faCamera, faHashtag,
  faMobileScreenButton, faCartShopping, faBuildingColumns, faMotorcycle,
  faShieldHalved, faBolt, faBoxOpen,
  faPaperPlane, faCheckCircle, faBullhorn,
} from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const CATEGORIES: { icon: IconDefinition; label: string; slug: string; color: string }[] = [
  { icon: faMobileScreenButton, label: 'Telecom', slug: 'telecom', color: '#6366F1' },
  { icon: faCartShopping, label: 'E-commerce', slug: 'e-commerce', color: '#F59E0B' },
  { icon: faBuildingColumns, label: 'Banking', slug: 'banking', color: '#3B82F6' },
  { icon: faMotorcycle, label: 'Food Delivery', slug: 'food-delivery', color: '#EF4444' },
  { icon: faShieldHalved, label: 'Insurance', slug: 'insurance', color: '#06B6D4' },
  { icon: faBolt, label: 'Utilities', slug: 'utilities', color: '#F97316' },
  { icon: faBoxOpen, label: 'Other', slug: 'other', color: '#8B5CF6' },
];

const HOW_IT_WORKS: { icon: IconDefinition; iconColor: string; title: string; description: string }[] = [
  {
    icon: faMobileScreenButton,
    iconColor: '#6366F1',
    title: 'Verify with OTP',
    description: 'Quick phone verification — we never store your number.',
  },
  {
    icon: faPaperPlane,
    iconColor: '#10B981',
    title: 'File Your Complaint',
    description: 'Describe the issue, upload proof, and agree to our terms.',
  },
  {
    icon: faCheckCircle,
    iconColor: '#F59E0B',
    title: 'Get Your Token',
    description: 'Receive a unique tracking ID. Your complaint is now public.',
  },
  {
    icon: faBullhorn,
    iconColor: '#EF4444',
    title: 'Track & Share',
    description: 'Get email updates. Share your complaint. Accountability follows.',
  },
];

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ===== HERO ===== */}
        <section 
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "linear-gradient(to bottom, rgba(236, 253, 245, 0.55), rgba(246, 250, 247, 0.80)), url('/background.png')" }}
        >
          <div className="container-page relative py-20 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary-muted)] text-[var(--color-primary-dark)] text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                India&apos;s Public Consumer Complaint Registry
              </div>
              <h1
                className="text-5xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.05] mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Unresolved Issue?
                <br />
                <span className="text-[var(--color-primary)]">Bring It to Light.</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl mb-10 leading-relaxed">
                Document your complaint. Get a tracking token. Receive email updates.
                No login. No signup. Just transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/file-complaint" className="btn-primary text-base py-3.5 px-8">
                  <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                  File a Complaint
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </Link>
                <Link href="/track" className="btn-outline text-base py-3.5 px-8">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
                  Track Your Complaint
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONTEXT BAR — Real NCH Data ===== */}
        <section className="bg-[var(--color-navy)] py-6">
          <div className="container-page">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
              <StatCounter label="Consumer complaints in India (FY 2023-24)" value="4,45,960+" />
              <div className="hidden md:block w-px h-8 bg-gray-600" />
              <StatCounter label="Of all complaints are E-commerce related" value="36.1%" />
              <div className="hidden md:block w-px h-8 bg-gray-600" />
              <StatCounter label="Hours Indians spent resolving issues (2024)" value="15 Billion" />
            </div>
            <p className="text-[0.625rem] text-gray-500 text-center mt-4">
              Source: National Consumer Helpline (NCH), Dept. of Consumer Affairs, Govt. of India
            </p>
          </div>
        </section>

        {/* ===== SOCIAL WALL ===== */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

        {/* ===== HOW IT WORKS ===== */}
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
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: step.iconColor + '15' }}
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

        {/* ===== CATEGORY GRID ===== */}
        <section className="container-page py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Browse by Category
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-12">
            Find complaints in your industry
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/social?category=${cat.slug}`} className="card card-hover p-5 text-center" style={{ backgroundColor: cat.color + '0D' }}>
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.color + '20' }}
                >
                  <FontAwesomeIcon icon={cat.icon} className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <p className="text-sm font-semibold">{cat.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== REAL CONTEXT — India Consumer Stats ===== */}
        <section className="bg-[var(--color-surface-2)] py-20">
          <div className="container-page">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Why This Matters
            </h2>
            <p className="text-center text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto">
              Real data from India&apos;s consumer landscape
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>1,60,857</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  Grievances against Flipkart alone in FY 2023-24, topping the e-commerce complaints chart for 4 years straight.
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-muted)] mt-2">Source: NCH / Factly.in</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>36.1%</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  Of all consumer complaints on the National Consumer Helpline were e-commerce related in FY 2023-24.
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-muted)] mt-2">Source: Dept. of Consumer Affairs</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>15B hrs</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  Estimated time Indians spent waiting to lodge or resolve service complaints in 2024.
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-muted)] mt-2">Source: ServiceNow Report</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST SIGNALS ===== */}
        <section className="container-page py-20">
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
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-dark)] font-bold py-3.5 px-8 rounded-xl hover:bg-gray-50 transition-colors"
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

function StatCounter({ label, value }: { label: string; value: string }) {
  return (
    <div className="animate-count-up">
      <p className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function TrustCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}
