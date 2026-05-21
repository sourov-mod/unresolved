// ===== COMPLAINT TYPES =====

export type ComplaintStatus = 'registered' | 'sent' | 'responded' | 'resolved' | 'rejected';

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  registered: 'Filed',
  sent: 'Sent to Company',
  responded: 'Company Responded',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export type ComplaintCategory =
  | 'Telecom'
  | 'E-commerce'
  | 'Banking & Finance'
  | 'Insurance'
  | 'Food Delivery'
  | 'Travel & Transport'
  | 'Utilities'
  | 'Education'
  | 'Healthcare'
  | 'Real Estate'
  | 'Other';

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  'Telecom',
  'E-commerce',
  'Banking & Finance',
  'Insurance',
  'Food Delivery',
  'Travel & Transport',
  'Utilities',
  'Education',
  'Healthcare',
  'Real Estate',
  'Other',
];

export interface Complaint {
  id: string;
  token: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  filer_name: string;
  filer_email: string;
  phone_hash: string;
  phone_last4: string;
  status: ComplaintStatus;
  upvotes: number;
  is_verified: boolean;
  is_flagged: boolean;
  is_published: boolean;
  proof_urls: string[];
  language: string;
  created_at: string;
  updated_at: string;
}

// ===== COMPANY TYPES =====

export type RankLabel = 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Terrible' | 'Unrated';

export interface Company {
  id: string;
  name: string;
  slug: string;
  category: string;
  logo_url?: string;
  total_complaints: number;
  resolved_count: number;
  response_rate: number;
  score: number;
  rank_label: RankLabel;
  created_at: string;
  updated_at: string;
}

// ===== TIMELINE =====

export interface ComplaintTimeline {
  id: string;
  complaint_id: string;
  token: string;
  status: ComplaintStatus;
  message?: string;
  updated_by: string;
  created_at: string;
}

// ===== UPVOTE =====

export interface Upvote {
  id: string;
  complaint_id: string;
  session_fingerprint: string;
  created_at: string;
}

// ===== OTP SESSION =====

export interface OTPSession {
  id: string;
  phone_hash: string;
  otp_code: string;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}
