import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mkadamnasi - Sauti Yako, Siri Yako',
  description: "Tanzania's First Anonymous Rating, Voting & Ranking Platform",
  keywords: ['mkadamnasi', 'tanzania', 'voting', 'rating', 'ranking', 'anonymous', 'kura'],
  authors: [{ name: 'Mkadamnasi' }],
  openGraph: {
    title: 'Mkadamnasi - Sauti Yako, Siri Yako',
    description: "Tanzania's First Anonymous Rating, Voting & Ranking Platform",
    type: 'website',
    locale: 'sw_TZ',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF6B35',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw">
      <body className="min-h-screen bg-off-white">
        {children}
      </body>
    </html>
  );
}
