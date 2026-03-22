import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthHydration } from '@/components/AuthHydration';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'QR Estate — India\'s QR-Native Property Platform',
    template: '%s | QR Estate',
  },
  description: 'Generate QR codes for every property listing. Buyers scan, view, and enquire instantly. Built for Indian real estate agents — RERA-ready, WhatsApp-native.',
  keywords: ['real estate', 'QR code', 'property listing', 'India', 'RERA', 'Mumbai', 'Delhi', 'Bengaluru'],
  authors: [{ name: 'QR Estate' }],
  themeColor: '#00D4C8',
  openGraph: {
    title: 'QR Estate — India\'s QR-Native Property Platform',
    description: 'QR codes for every listing. Buyers scan, agents close deals faster.',
    type: 'website',
    siteName: 'QR Estate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Estate',
    description: 'QR codes for every property listing. Built for India.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Gurmukhi:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-white bg-brand-bg">
        {/* Triggers Zustand rehydration from localStorage on the client.
            Also clears the stale auth cookie when no token exists. */}
        <AuthHydration />
        {children}
      </body>
    </html>
  );
}
