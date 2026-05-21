import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Complaints Wall — Real Consumer Issues from Social Media',
  description:
    'Browse 50+ real unresolved consumer complaints posted on Twitter, Facebook, and Instagram against Indian companies. Filter by Telecom, E-commerce, Banking, Food Delivery, Insurance, Utilities, and more.',
};

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
