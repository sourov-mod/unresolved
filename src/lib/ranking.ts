import type { RankLabel } from '@/types';

/**
 * Company Score: 0–100 (higher = better)
 *
 * Resolution Rate  → 40% weight
 * Response Rate    → 30% weight
 * Volume Penalty   → 20% weight (diminishing returns — more complaints = worse)
 * Recency          → 10% weight (recent complaints weigh more)
 */
export function calculateScore(company: {
  total_complaints: number;
  resolved_count: number;
  response_rate: number;
}): number {
  const { total_complaints, resolved_count, response_rate } = company;

  if (total_complaints === 0) return 50; // Neutral for companies with no complaints

  // Resolution rate (0-100)
  const resolutionRate = (resolved_count / total_complaints) * 100;

  // Response rate is stored as 0-100
  const responseRateNormalized = Math.min(100, Math.max(0, response_rate));

  // Volume penalty: more complaints = lower score
  // Uses logarithmic scaling so it doesn't penalize too harshly at high volumes
  const volumePenalty = Math.max(0, 100 - Math.log10(total_complaints + 1) * 30);

  // Combine weights
  const score =
    resolutionRate * 0.4 +
    responseRateNormalized * 0.3 +
    volumePenalty * 0.2 +
    50 * 0.1; // Recency placeholder (needs date data)

  return Math.round(Math.min(100, Math.max(0, score)));
}

/** Get rank label from score */
export function getLabel(score: number): RankLabel {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Poor';
  return 'Terrible';
}

/** Get color class for rank */
export function getRankColor(label: RankLabel): string {
  const colors: Record<RankLabel, string> = {
    Excellent: 'text-green-700 bg-green-50 border-green-200',
    Good: 'text-green-600 bg-green-50 border-green-200',
    Average: 'text-amber-600 bg-amber-50 border-amber-200',
    Poor: 'text-red-600 bg-red-50 border-red-200',
    Terrible: 'text-red-800 bg-red-50 border-red-200',
    Unrated: 'text-gray-500 bg-gray-50 border-gray-200',
  };
  return colors[label];
}

/** Get color for score meter arc */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#16A34A';
  if (score >= 60) return '#16A34A';
  if (score >= 40) return '#D97706';
  if (score >= 20) return '#C0392B';
  return '#7F1D1D';
}

/**
 * Recalculate company stats from actual complaint data.
 * Call this after inserting/updating complaints to keep stats fresh.
 */
export async function recalculateCompanyStats(
  supabase: { from: (table: string) => unknown },
  companyId: string
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  // Get total complaints for this company
  const { count: totalComplaints } = await sb
    .from('complaints')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .eq('is_published', true);

  // Get resolved count
  const { count: resolvedCount } = await sb
    .from('complaints')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .eq('is_published', true)
    .eq('status', 'resolved');

  // Get responded count (includes 'responded' and 'resolved')
  const { count: respondedCount } = await sb
    .from('complaints')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .eq('is_published', true)
    .in('status', ['responded', 'resolved']);

  const total = totalComplaints || 0;
  const resolved = resolvedCount || 0;
  const responded = respondedCount || 0;

  // Calculate response_rate as a percentage (0-100)
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  const newScore = calculateScore({
    total_complaints: total,
    resolved_count: resolved,
    response_rate: responseRate,
  });

  await sb
    .from('companies')
    .update({
      total_complaints: total,
      resolved_count: resolved,
      response_rate: responseRate,
      score: newScore,
      rank_label: getLabel(newScore),
      updated_at: new Date().toISOString(),
    })
    .eq('id', companyId);
}
