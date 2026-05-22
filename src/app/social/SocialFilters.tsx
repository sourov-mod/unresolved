'use client';

import React, { useState, useMemo } from 'react';
import SocialComplaintCard from '@/components/ui/SocialComplaintCard';
import type { SocialPost, ComplaintCategory } from '@/components/ui/SocialComplaintCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  faGlobe, faMobileScreenButton, faCartShopping,
  faBuildingColumns, faMotorcycle, faShieldHalved,
  faBolt, faBoxOpen, faLayerGroup, faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const CATEGORY_FILTERS: { icon: IconDefinition; label: string; slug: ComplaintCategory | 'all'; color: string }[] = [
  { icon: faLayerGroup, label: 'All', slug: 'all', color: '#10B981' },
  { icon: faMobileScreenButton, label: 'Telecom', slug: 'telecom', color: '#6366F1' },
  { icon: faCartShopping, label: 'E-commerce', slug: 'e-commerce', color: '#F59E0B' },
  { icon: faBuildingColumns, label: 'Banking', slug: 'banking', color: '#3B82F6' },
  { icon: faMotorcycle, label: 'Food Delivery', slug: 'food-delivery', color: '#EF4444' },
  { icon: faShieldHalved, label: 'Insurance', slug: 'insurance', color: '#06B6D4' },
  { icon: faBolt, label: 'Utilities', slug: 'utilities', color: '#F97316' },
  { icon: faBoxOpen, label: 'Other', slug: 'other', color: '#8B5CF6' },
];

interface SocialFiltersProps {
  initialComplaints: SocialPost[];
}

export default function SocialFilters({ initialComplaints }: SocialFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<ComplaintCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return initialComplaints;
    return initialComplaints.filter(p => p.category === activeCategory);
  }, [activeCategory, initialComplaints]);

  const twitterPosts = filtered.filter(p => p.platform === 'twitter');
  const fbPosts = filtered.filter(p => p.platform === 'facebook');
  const instaPosts = filtered.filter(p => p.platform === 'instagram');
  const webPosts = filtered.filter(p => p.platform === 'web');

  // Count per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialComplaints.length };
    initialComplaints.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialComplaints]);

  return (
    <>
      {/* ===== CATEGORY FILTERS ===== */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {CATEGORY_FILTERS.map(cat => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? 'shadow-md scale-[1.03]'
                  : 'hover:scale-[1.02] hover:shadow-sm'
              }`}
              style={{
                backgroundColor: isActive ? cat.color + '18' : 'var(--color-surface)',
                borderColor: isActive ? cat.color : 'var(--color-border)',
                color: isActive ? cat.color : 'var(--color-text-secondary)',
              }}
            >
              <FontAwesomeIcon icon={cat.icon} className="w-3.5 h-3.5" />
              {cat.label}
              <span
                className="text-[0.625rem] px-1.5 py-0.5 rounded-full font-mono"
                style={{
                  backgroundColor: isActive ? cat.color + '20' : 'var(--color-surface-2)',
                  color: isActive ? cat.color : 'var(--color-text-muted)',
                }}
              >
                {categoryCounts[cat.slug] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===== FILTERED RESULTS ===== */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center mb-12">
          <div className="text-2xl mb-2 text-[var(--color-text-muted)]">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-6 h-6" />
          </div>
          <p className="text-[var(--color-text-muted)] font-semibold">No complaints found in this category yet.</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Be the first to file a complaint!</p>
        </div>
      ) : (
        <div className="mb-12">
          {/* Twitter */}
          {twitterPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#15202B] flex items-center justify-center">
                  <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    From X (Twitter)
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{twitterPosts.length} complaints</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {twitterPosts.map(post => (
                  <SocialComplaintCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Facebook */}
          {fbPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center">
                  <FontAwesomeIcon icon={faFacebook} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    From Facebook
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{fbPosts.length} complaints</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {fbPosts.map(post => (
                  <SocialComplaintCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Instagram */}
          {instaPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #833AB4, #C13584, #E1306C)' }}>
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    From Instagram
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{instaPosts.length} complaints</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {instaPosts.map(post => (
                  <SocialComplaintCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Web */}
          {webPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#065F46] flex items-center justify-center">
                  <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    From Web
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">{webPosts.length} complaints</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {webPosts.map(post => (
                  <SocialComplaintCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
