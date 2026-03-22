import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'Mkadamnasi - Piga Kura na Kadiria kwa Siri',
    template: '%s | Mkadamnasi',
  },
  description: 'Jukwaa la kwanza la Kitanzania la kupiga kura, kukadiria na kupanga kwa siri. Sauti yako, siri yako.',
  keywords: ['mkadamnasi', 'piga kura', 'kadiria', 'tanzania', 'anonymous voting', 'rating platform'],
  authors: [{ name: 'Mkadamnasi' }],
  creator: 'Mkadamnasi',
  openGraph: {
    type: 'website',
    locale: 'sw_TZ',
    url: 'https://mkadamnasi.co.tz',
    siteName: 'Mkadamnasi',
    title: 'Mkadamnasi - Piga Kura na Kadiria kwa Siri',
    description: 'Jukwaa la kwanza la Kitanzania la kupiga kura, kukadiria na kupanga kwa siri.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mkadamnasi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mkadamnasi',
    description: 'Sauti yako, siri yako. Piga kura na kadiria kwa siri.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
