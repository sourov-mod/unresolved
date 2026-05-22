import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/lib/fontawesome';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://unresolved.in'),
  title: {
    default: 'Unresolved — India\'s Public Complaint Registry',
    template: '%s | Unresolved',
  },
  description:
    'File public complaints against Indian companies. Track your complaint with a token. Hold companies accountable. No login required.',
  keywords: [
    'consumer complaints India',
    'file complaint online',
    'company complaints',
    'consumer rights India',
    'public complaint registry',
  ],
  authors: [{ name: 'Unresolved' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://unresolved.in',
    siteName: 'Unresolved',
    title: 'Unresolved — India\'s Public Complaint Registry',
    description: 'File public complaints against Indian companies. Track your complaint with a token.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unresolved — India\'s Public Complaint Registry',
    description: 'File public complaints. Get a token. Watch the pressure build.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Unresolved',
              url: 'https://unresolved.in',
              description: "India's public consumer complaint registry. File complaints against companies, track them with a token, and hold companies accountable.",
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://unresolved.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Unresolved',
                url: 'https://unresolved.in',
              },
            }),
          }}
        />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              borderRadius: '12px',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
