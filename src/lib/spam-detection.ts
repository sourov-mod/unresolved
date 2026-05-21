import { createServerClient } from './supabase/server';

interface SpamCheckResult {
  is_spam: boolean;
  reasons: string[];
}

/**
 * Multi-signal spam detection for complaint submissions.
 * Returns is_spam = true if 2+ checks triggered.
 */
export async function checkForSpam(
  complaint: {
    title: string;
    description: string;
    company_name: string;
  },
  phoneHash: string
): Promise<SpamCheckResult> {
  const supabase = createServerClient();
  const reasons: string[] = [];
  const now = new Date();

  // Check 1: Same description filed in last 7 days
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: dupes } = await supabase
    .from('complaints')
    .select('id')
    .eq('description', complaint.description)
    .gte('created_at', sevenDaysAgo)
    .limit(1);

  if (dupes && dupes.length > 0) {
    reasons.push('Duplicate description found in recent complaints.');
  }

  // Check 2: Same phone hash — >3 complaints in 24h
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recent, count } = await supabase
    .from('complaints')
    .select('id', { count: 'exact' })
    .eq('phone_hash', phoneHash)
    .gte('created_at', oneDayAgo);

  if (count && count > 3) {
    reasons.push('Too many complaints from this number in 24 hours.');
  }

  // Check 3: Title identical to description (copy-paste)
  if (complaint.title.trim().toLowerCase() === complaint.description.trim().toLowerCase()) {
    reasons.push('Title and description are identical.');
  }

  // Check 4: Description <50 chars (too vague)
  if (complaint.description.trim().length < 50) {
    reasons.push('Description is too short — please provide more detail.');
  }

  // Check 5: Company name is gibberish
  if (/^\d+$/.test(complaint.company_name.trim()) || complaint.company_name.trim().length < 2) {
    reasons.push('Company name appears invalid.');
  }

  // is_spam if 2+ checks triggered
  return {
    is_spam: reasons.length >= 2,
    reasons,
  };
}
