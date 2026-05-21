'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    today_complaints: number;
    flagged_count: number;
    pending_count: number;
    new_companies: number;
  } | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('Invalid password');
      setAuthed(true);

      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'x-admin-secret': password },
      });
      const data = await statsRes.json();
      setStats(data);
    } catch {
      toast.error('Invalid admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg)]">
        <div className="container-page py-12 max-w-4xl mx-auto">
          {!authed ? (
            <div className="max-w-sm mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center">
                <FontAwesomeIcon icon={faLock} className="w-7 h-7 text-[var(--color-text-muted)]" />
              </div>
              <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Admin Access</h1>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin secret"
                className="input-field mb-4 text-center"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={handleLogin} disabled={loading || !password} className="btn-primary w-full py-3">
                {loading ? <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" /> : 'Login'}
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DashCard label="Today" value={stats.today_complaints} color="var(--color-primary)" />
                  <DashCard label="Flagged" value={stats.flagged_count} color="var(--rank-worst)" />
                  <DashCard label="Pending" value={stats.pending_count} color="var(--color-amber)" />
                  <DashCard label="New Companies" value={stats.new_companies} color="var(--color-sky)" />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function DashCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="card p-6 text-center">
      <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-mono)', color }}>
        {value}
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">{label}</p>
    </div>
  );
}
