-- UNRESOLVED Database Schema
-- Run this in Supabase SQL Editor

-- COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  logo_url TEXT,
  total_complaints INT DEFAULT 0,
  resolved_count INT DEFAULT 0,
  response_rate FLOAT DEFAULT 0,
  score FLOAT DEFAULT 0,
  rank_label TEXT DEFAULT 'Unrated',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES companies(id),
  company_name TEXT NOT NULL,
  company_slug TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  filer_name TEXT NOT NULL,
  filer_email TEXT NOT NULL,
  phone_hash TEXT NOT NULL,
  phone_last4 TEXT NOT NULL,
  status TEXT DEFAULT 'registered',
  upvotes INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  proof_urls TEXT[],
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPLAINT STATUS TIMELINE
CREATE TABLE IF NOT EXISTS complaint_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id),
  token TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  updated_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UPVOTES (deduplicated by session fingerprint)
CREATE TABLE IF NOT EXISTS upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id),
  session_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(complaint_id, session_fingerprint)
);

-- OTP SESSIONS
CREATE TABLE IF NOT EXISTS otp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_hash TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INT DEFAULT 0,
  phone_last4 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_complaints_token ON complaints(token);
CREATE INDEX IF NOT EXISTS idx_complaints_company_slug ON complaints(company_slug);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_phone_hash ON complaints(phone_hash);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_score ON companies(score);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_phone_hash ON otp_sessions(phone_hash);
CREATE INDEX IF NOT EXISTS idx_timeline_complaint_id ON complaint_timeline(complaint_id);

-- ROW LEVEL SECURITY
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_timeline ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public complaints" ON complaints FOR SELECT USING (is_published = TRUE AND is_flagged = FALSE);
CREATE POLICY "Public companies" ON companies FOR SELECT USING (TRUE);
CREATE POLICY "Public upvotes" ON upvotes FOR SELECT USING (TRUE);
CREATE POLICY "Public timeline" ON complaint_timeline FOR SELECT USING (TRUE);

-- Service role can do everything (handled by service key)
