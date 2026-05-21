import { createAnonServerClient } from '@/lib/supabase/server';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAnonServerClient();
  const baseUrl = 'https://unresolved.in';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/file-complaint`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Company pages
  const { data: companies } = await supabase
    .from('companies')
    .select('slug, updated_at')
    .order('total_complaints', { ascending: false })
    .limit(500);

  const companyRoutes: MetadataRoute.Sitemap = (companies || []).map(c => ({
    url: `${baseUrl}/company/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Complaint pages
  const { data: complaints } = await supabase
    .from('complaints')
    .select('id, updated_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(1000);

  const complaintRoutes: MetadataRoute.Sitemap = (complaints || []).map(c => ({
    url: `${baseUrl}/complaint/${c.id}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...companyRoutes, ...complaintRoutes];
}
