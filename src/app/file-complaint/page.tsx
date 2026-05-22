'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TokenDisplay from '@/components/ui/TokenDisplay';
import ProofUploader, { type UploadedFile } from '@/components/ui/ProofUploader';
import { COMPLAINT_CATEGORIES } from '@/types';
import type { ComplaintCategory } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock, faCheck, faArrowRight, faArrowLeft, faTriangleExclamation,
  faShareNodes, faEnvelope, faScaleBalanced, faGavel,
  faShieldHalved, faClipboardList, faLightbulb, faCircleInfo,
  faFileLines, faCamera, faPaperPlane, faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import toast from 'react-hot-toast';

type Step = 1 | 2 | 3 | 4;

/* ============================================================
   STEP GUIDE DATA — right-side contextual tips per step
   ============================================================ */
interface GuideTip {
  icon: IconDefinition;
  title: string;
  text: string;
}

interface StepGuide {
  heading: string;
  subtitle: string;
  tips: GuideTip[];
}

const STEP_GUIDES: Record<Step, StepGuide> = {
  1: {
    heading: 'Terms & Verification',
    subtitle: 'Agree and verify your identity',
    tips: [
      {
        icon: faCircleInfo,
        title: 'Genuine issues only',
        text: 'This platform is strictly for real, unresolved consumer complaints. Fake or malicious submissions will be removed.',
      },
      {
        icon: faShieldHalved,
        title: 'Phone number stays private',
        text: 'We hash your phone number using SHA-256 immediately. The original number is never stored in our database.',
      },
      {
        icon: faClipboardList,
        title: 'Try the company first',
        text: 'Before filing here, make sure you have already tried contacting the company directly and your issue remains unresolved.',
      },
      {
        icon: faLightbulb,
        title: 'Quick tip',
        text: 'Make sure you have access to the phone right now. The OTP expires in 10 minutes.',
      },
    ],
  },
  2: {
    heading: 'Your Identity',
    subtitle: 'How your info is used',
    tips: [
      {
        icon: faUserCheck,
        title: 'Name is public',
        text: 'Your full name will appear on your complaint. This builds trust and makes your complaint credible.',
      },
      {
        icon: faEnvelope,
        title: 'Email stays private',
        text: 'Your email is only used to send you tracking updates and company responses. It is never shown publicly.',
      },
      {
        icon: faLightbulb,
        title: 'Use your real name',
        text: 'Complaints with real names are taken more seriously by companies and get 2x faster responses.',
      },
    ],
  },
  3: {
    heading: 'Complaint & Proof',
    subtitle: 'Be specific and provide evidence',
    tips: [
      {
        icon: faClipboardList,
        title: 'Be specific',
        text: 'Include dates, order/reference numbers, and the names of people you spoke to.',
      },
      {
        icon: faFileLines,
        title: 'Stick to facts',
        text: 'Describe what happened objectively. Avoid emotional language or personal attacks.',
      },
      {
        icon: faCamera,
        title: 'Screenshots help',
        text: 'Upload screenshots of conversations, error messages, or the issue itself. Visual evidence is very persuasive.',
      },
      {
        icon: faLightbulb,
        title: '3x more effective',
        text: 'Complaints with supporting evidence are 3 times more likely to receive a response from the company.',
      },
    ],
  },
  4: {
    heading: 'Final Check',
    subtitle: 'Review before submitting',
    tips: [
      {
        icon: faPaperPlane,
        title: 'This is permanent',
        text: 'Once submitted, your complaint becomes publicly visible and indexed by search engines.',
      },
      {
        icon: faEnvelope,
        title: 'Save your token',
        text: 'After submission, you will receive a unique tracking token. Save it to check status updates anytime.',
      },
      {
        icon: faLightbulb,
        title: 'Share for impact',
        text: 'Complaints that are shared on social media gain more visibility and faster resolution from companies.',
      },
    ],
  },
};

const STEP_LABELS: Record<Step, string> = {
  1: 'Terms & Verify',
  2: 'Details',
  3: 'Complaint',
  4: 'Review',
};

/* ============================================================
   GUIDE PANEL — animated sidebar
   ============================================================ */
function GuidePanel({ step }: { step: Step }) {
  const guide = STEP_GUIDES[step];

  return (
    <div className="guide-panel sticky top-28">
      {/* Step indicator */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-1">
          Step {step} of 4
        </p>
        <h3
          className="text-xl font-bold text-[var(--color-text-primary)] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {guide.heading}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">{guide.subtitle}</p>
      </div>

      {/* Tips list */}
      <div className="space-y-4">
        {guide.tips.map((tip, i) => (
          <div
            key={`${step}-${i}`}
            className="guide-tip-card"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="guide-tip-icon">
              <FontAwesomeIcon icon={tip.icon} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
                {tip.title}
              </p>
              <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                {tip.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress summary */}
      <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 flex-wrap">
          {([1, 2, 3, 4] as Step[]).map(s => (
            <div
              key={s}
              className={`guide-step-pill ${
                s < step ? 'guide-step-done' :
                s === step ? 'guide-step-active' :
                'guide-step-pending'
              }`}
            >
              {s < step ? (
                <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />
              ) : (
                <span className="text-[11px] font-mono">{s}</span>
              )}
              <span className="text-[11px]">{STEP_LABELS[s]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
   ============================================================ */
export default function FileComplaintPage() {
  // Step 1: Disclaimer + T&C + Phone
  const [agreedTC, setAgreedTC] = useState(false);
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);

  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  // Step 2: Name + Email
  const [filerName, setFilerName] = useState('');
  const [filerEmail, setFilerEmail] = useState('');

  // Step 3: Complaint + Proof
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proofFiles, setProofFiles] = useState<UploadedFile[]>([]);

  // Step 4: Review + Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultToken, setResultToken] = useState('');

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const sendOTP = async () => {
    if (phone.length !== 10) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setOtpLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessionId(data.session_id);
      setPhoneLast4(data.phone_last4);
      setOtpSent(true);
      setResendTimer(60);
      toast.success('OTP sent!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally { setOtpLoading(false); }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setOtpLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, otp_code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPhoneVerified(true);
      toast.success('Phone verified!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Verification failed');
    } finally { setOtpLoading(false); }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp_session_id: sessionId,
          filer_name: filerName,
          filer_email: filerEmail,
          company_name: companyName,
          category,
          title,
          description,
          proof_urls: proofFiles.map(f => f.publicUrl),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultToken(data.token);
      setSubmitted(true);
      toast.success('Complaint filed successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally { setSubmitting(false); }
  };

  // Determine if Step 1 can proceed
  const canProceedStep1 = agreedTC && agreedDisclaimer && phoneVerified;

  // ===================== SUCCESS SCREEN =====================
  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[var(--color-bg)]">
          <div className="container-page py-20 text-center max-w-xl mx-auto">
            <div className="animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Complaint Filed!
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-8">
                Your complaint is now public. Save your tracking token. We&apos;ll send updates to <strong>{filerEmail}</strong>.
              </p>
              <div className="card p-8 mb-8">
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Your Tracking Token</p>
                <TokenDisplay token={resultToken} size="lg" />
                <p className="text-xs text-[var(--color-text-muted)] mt-4">
                  Save this token — you&apos;ll need it to track your complaint.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`/track/${resultToken}`} className="btn-primary py-3 px-6">
                  Track Your Complaint
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: `Complaint ${resultToken}`,
                      text: `I filed a complaint against ${companyName}. Track it: `,
                      url: `${window.location.origin}/track/${resultToken}`,
                    });
                  }}
                  className="btn-outline py-3 px-6"
                >
                  <FontAwesomeIcon icon={faShareNodes} className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ===================== PROGRESS BAR =====================
  const progressPercent = ((step - 1) / 3) * 100;

  // ===================== MAIN FORM LAYOUT =====================
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-10 md:py-14">
          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              File a Complaint
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Your complaint will be publicly visible and indexed by search engines.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              {([1, 2, 3, 4] as Step[]).map(s => (
                <span key={s} className={`text-[11px] font-medium ${
                  s <= step ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-text-muted)]'
                }`}>
                  {STEP_LABELS[s]}
                </span>
              ))}
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Two-column layout */}
          <div className="complaint-layout">
            {/* ======== LEFT COLUMN: FORM ======== */}
            <div className="complaint-form-col">
              {/* ===== STEP 1: Terms + Verify (merged) ===== */}
              {step === 1 && (
                <div className="animate-fade-in space-y-6">
                  {/* Section heading */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faGavel} className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                        Terms & Verification
                      </h2>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Agree to terms and verify your phone
                      </p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="card p-5 border-l-4 border-l-[var(--color-amber)]" style={{ backgroundColor: 'var(--color-amber-light)' }}>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-[var(--color-amber)] mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-[var(--color-text-primary)] mb-2">Important</p>
                        <ul className="space-y-1 text-[var(--color-text-secondary)]">
                          <li>This platform is for <strong>genuinely unresolved</strong> consumer issues only.</li>
                          <li>Your complaint must be <strong>truthful</strong> and based on <strong>your real experience</strong>.</li>
                          <li>You must have <strong>already attempted</strong> to resolve the issue with the company.</li>
                          <li><strong>False or malicious</strong> complaints will be removed and may result in a ban.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreedTC} onChange={e => setAgreedTC(e.target.checked)} className="mt-1 w-4 h-4 accent-[var(--color-primary)]" />
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        I agree to the{' '}
                        <Link href="/terms" target="_blank" className="text-[var(--color-primary)] underline">Terms & Conditions</Link>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreedDisclaimer} onChange={e => setAgreedDisclaimer(e.target.checked)} className="mt-1 w-4 h-4 accent-[var(--color-primary)]" />
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        I understand the{' '}
                        <Link href="/disclaimer" target="_blank" className="text-[var(--color-primary)] underline">Disclaimer</Link>{' '}and{' '}
                        <Link href="/privacy" target="_blank" className="text-[var(--color-primary)] underline">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  {/* Phone verification section — only show if agreed to terms */}
                  {agreedTC && agreedDisclaimer && (
                    <div className="card p-5 space-y-4 animate-fade-in">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                        <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[var(--color-primary)]" />
                        Phone Verification
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-[var(--color-surface-2)] rounded-xl text-[13px] text-[var(--color-text-secondary)]">
                        <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5 text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
                        Your phone number is never stored. It&apos;s hashed with SHA-256 immediately.
                      </div>

                      {!otpSent ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Mobile Number</label>
                            <div className="flex items-stretch gap-0">
                              <span className="inline-flex items-center justify-center px-4 text-sm font-semibold text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] rounded-l-xl min-w-[56px]" style={{ border: '1.5px solid var(--color-border)', borderRight: 'none' }}>
                                +91
                              </span>
                              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit number" className="input-field flex-1 rounded-l-none" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} maxLength={10} autoFocus />
                            </div>
                          </div>
                          <button onClick={sendOTP} disabled={phone.length !== 10 || otpLoading} className="btn-primary w-full py-3">
                            {otpLoading ? 'Sending...' : 'Send OTP'}
                          </button>
                        </div>
                      ) : !phoneVerified ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 p-3 bg-[var(--color-primary-light)] rounded-xl text-sm text-[var(--color-primary-dark)]">
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                            OTP sent to +91 ****{phoneLast4}
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Enter 6-digit OTP</label>
                            <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="- - - - - -" className="input-field text-center text-2xl tracking-[0.5em]" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.4em' }} maxLength={6} autoFocus />
                          </div>
                          <button onClick={verifyOTP} disabled={otp.length !== 6 || otpLoading} className="btn-primary w-full py-3">
                            {otpLoading ? 'Verifying...' : 'Verify OTP'}
                          </button>
                          <button onClick={sendOTP} disabled={resendTimer > 0 || otpLoading} className="text-sm text-[var(--color-primary)] hover:underline disabled:text-[var(--color-text-muted)] w-full text-center">
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-[var(--color-primary-light)] rounded-xl text-sm text-[var(--color-primary-dark)]">
                          <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          Phone verified: ****{phoneLast4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Continue button */}
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="btn-primary w-full py-3.5"
                  >
                    Continue
                    <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* ===== STEP 2: Name + Email ===== */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faUserCheck} className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Your Details</h2>
                      <p className="text-sm text-[var(--color-text-muted)]">We&apos;ll send complaint updates to your email</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 p-3 bg-[var(--color-primary-light)] rounded-xl text-sm text-[var(--color-primary-dark)]">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" /> Phone verified: ****{phoneLast4}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name *</label>
                      <input type="text" value={filerName} onChange={e => setFilerName(e.target.value)} placeholder="Enter your full name" className="input-field" />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5">This will be visible on your public complaint.</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 mr-1.5 text-[var(--color-text-muted)]" />
                        Email Address *
                      </label>
                      <input type="email" value={filerEmail} onChange={e => setFilerEmail(e.target.value)} placeholder="your@email.com" className="input-field" />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                        Used to send you complaint updates and company responses. Never displayed publicly.
                      </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="btn-outline py-3 px-6">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /> Back
                      </button>
                      <button onClick={() => setStep(3)} disabled={filerName.trim().length < 2 || !isValidEmail(filerEmail)} className="btn-primary flex-1 py-3.5">
                        Continue <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== STEP 3: Complaint + Proof (merged) ===== */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Company & Complaint</h2>
                      <p className="text-sm text-[var(--color-text-muted)]">Describe your experience and upload proof</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Name *</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Airtel, Flipkart, HDFC Bank" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category *</label>
                      <select value={category} onChange={e => setCategory(e.target.value as ComplaintCategory)} className="input-field">
                        <option value="">Select a category</option>
                        {COMPLAINT_CATEGORIES.map(c => (<option key={c} value={c}>{c}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title *</label>
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief summary of your complaint" className="input-field" maxLength={200} />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5 text-right">{title.length}/200</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description *</label>
                      <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={"Describe what happened in detail.\n\nInclude:\n- Dates and timeline\n- Order or reference numbers\n- What you've tried so far\n- What resolution you expect"}
                        className="input-field min-h-[160px] resize-y"
                        maxLength={5000}
                      />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5 text-right">{description.length}/5000</p>
                    </div>

                    {/* Proof upload — inline */}
                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <div className="flex items-center gap-2 mb-3">
                        <FontAwesomeIcon icon={faCamera} className="w-4 h-4 text-[var(--color-primary)]" />
                        <label className="text-sm font-medium">Upload Proof *</label>
                      </div>
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl text-[13px] text-[var(--color-amber)]" style={{ backgroundColor: 'var(--color-amber-light)' }}>
                        <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 flex-shrink-0" />
                        Complaints with proof are 3x more likely to get a response
                      </div>
                      <ProofUploader sessionId={sessionId} files={proofFiles} onFilesChange={setProofFiles} />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep(2)} className="btn-outline py-3 px-6">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /> Back
                      </button>
                      <button onClick={() => setStep(4)} disabled={!companyName.trim() || !category || title.trim().length < 10 || description.trim().length < 50 || proofFiles.length === 0} className="btn-primary flex-1 py-3.5">
                        Continue to Review <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== STEP 4: Review ===== */}
              {step === 4 && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Review & Submit</h2>
                      <p className="text-sm text-[var(--color-text-muted)]">Double-check everything before submitting</p>
                    </div>
                  </div>

                  <div className="card p-6 mb-6 space-y-4">
                    <ReviewRow label="Name" value={filerName} />
                    <ReviewRow label="Email" value={filerEmail} />
                    <ReviewRow label="Phone" value={`Verified: ****${phoneLast4}`} />
                    <ReviewRow label="Company" value={companyName} />
                    <ReviewRow label="Category" value={category} />
                    <ReviewRow label="Title" value={title} />
                    <ReviewRow label="Description" value={description} />
                    <ReviewRow label="Proof" value={`${proofFiles.length} file(s) uploaded`} />
                  </div>

                  <div className="card p-4 mb-6 bg-[var(--color-primary-light)] text-sm text-[var(--color-primary-dark)]">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                    We&apos;ll send your tracking token and status updates to <strong>{filerEmail}</strong>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="btn-outline py-3 px-6">
                      <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /> Back
                    </button>
                    <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 py-3.5">
                      {submitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ======== RIGHT COLUMN: GUIDE ======== */}
            <aside className="complaint-guide-col">
              <GuidePanel step={step} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider sm:w-28 flex-shrink-0">{label}</span>
      <span className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap">{value}</span>
    </div>
  );
}
