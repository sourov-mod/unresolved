import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StatusBadge from '@/components/ui/StatusBadge';
import TokenDisplay from '@/components/ui/TokenDisplay';
import TokenTracker from '@/components/ui/TokenTracker';
import MeTooButton from '@/components/ui/MeTooButton';
import RankBadge from '@/components/ui/RankBadge';
import { createAnonServerClient } from '@/lib/supabase/server';
import { formatDateTimeIN } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from('complaints')
    .select('title, company_name')
    .eq('id', id)
    .single();

  if (!data) return { title: 'Complaint Not Found' };

  return {
    title: `${data.title} — Complaint against ${data.company_name}`,
    description: `Read the full complaint filed against ${data.company_name}. View proof, status updates, and timeline.`,
  };
}

export default async function ComplaintPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAnonServerClient();

  const { data: complaint } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (!complaint) notFound();

  const { data: timeline } = await supabase
    .from('complaint_timeline')
    .select('*')
    .eq('complaint_id', id)
    .order('created_at', { ascending: true });

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', complaint.company_id)
    .single();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token + Status */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <TokenDisplay token={complaint.token} size="md" />
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <span>Filed by <strong className="text-[var(--color-text-primary)]">{complaint.filer_name}</strong></span>
                  <span>•</span>
                  <time>{formatDateTimeIN(complaint.created_at)}</time>
                </div>
              </div>

              {/* Complaint details */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link href={`/company/${complaint.company_slug}`} className="text-sm font-semibold text-[var(--color-primary-dark)] hover:underline">
                    {complaint.company_name}
                  </Link>
                  <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)] font-medium">
                    {complaint.category}
                  </span>
                </div>

                <h1
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {complaint.title}
                </h1>

                <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Proof files */}
              {complaint.proof_urls?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    Proof ({complaint.proof_urls.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {complaint.proof_urls.map((url: string, i: number) => {
                      const isPdf = url.endsWith('.pdf');
                      return isPdf ? (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-[var(--color-surface-2)] rounded-xl hover:bg-[var(--color-border)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faFile} className="w-5 h-5 text-[var(--color-primary)]" />
                          <span className="text-sm truncate">Document {i + 1}</span>
                          <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3 ml-auto text-[var(--color-text-muted)]" />
                        </a>
                      ) : (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={url}
                            alt={`Proof ${i + 1}`}
                            className="w-full h-32 object-cover rounded-xl border border-[var(--color-border)] hover:opacity-90 transition-opacity"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
                <MeTooButton complaintId={complaint.id} initialCount={complaint.upvotes} />
                <ShareButtons companyName={complaint.company_name} title={complaint.title} complaintId={complaint.id} />
              </div>

              {/* Timeline */}
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                  Status Timeline
                </h3>
                <TokenTracker currentStatus={complaint.status} timeline={timeline || []} />
              </div>
            </div>

            {/* Sidebar: Company info */}
            {company && (
              <div className="space-y-6">
                <div className="card p-6 sticky top-20">
                  <Link href={`/company/${company.slug}`} className="block group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center text-lg font-bold"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold group-hover:text-[var(--color-primary)] transition-colors">{company.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{company.category}</p>
                      </div>
                    </div>
                  </Link>
                  <RankBadge label={company.rank_label} size="md" />
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Total Complaints</span>
                      <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>{company.total_complaints}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Resolved</span>
                      <span className="font-semibold text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-mono)' }}>{company.resolved_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">Score</span>
                      <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>{company.score}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ShareButtons({ companyName, title, complaintId }: { companyName: string; title: string; complaintId: string }) {
  const shareUrl = `https://unresolved.in/complaint/${complaintId}`;
  const twitterText = `Complaint against ${companyName}: "${title}" — filed on @unresolvedin`;
  const waText = `I filed a complaint against ${companyName} on Unresolved — India's public complaint registry.\n\n"${title}"\n\nCheck it out: ${shareUrl}`;

  return (
    <div className="flex gap-2 flex-wrap">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03] bg-[#0f1419] text-white"
      >
        <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
        Share on 𝕏
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03] text-white"
        style={{ backgroundColor: '#25D366' }}
      >
        <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
        Share on WhatsApp
      </a>
    </div>
  );
}
