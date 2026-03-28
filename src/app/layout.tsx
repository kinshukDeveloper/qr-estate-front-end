// import type { Metadata } from 'next';
// import { Outfit, JetBrains_Mono, Syne, DM_Mono, Plus_Jakarta_Sans } from 'next/font/google';
// import './globals.css';
// import { AuthHydration } from '@/components/AuthHydration';
// import { FavouritesProvider } from '@/contexts/FavouritesContext';
// import { CompareProvider } from '@/contexts/CompareContext';
// import { CompareBar } from '@/components/listings/CompareButton';

// /* ── Fonts ─────────────────────────────────── */
// const syne = Syne({
//   subsets: ['latin'], variable: '--font-syne',
//   weight: ['400', '600', '700', '800'], display: 'swap',
// });
// const jakartaSans = Plus_Jakarta_Sans({
//   subsets: ['latin'], variable: '--font-jakarta',
//   weight: ['300', '400', '500', '600', '700'], display: 'swap',
// });
// const dmMono = DM_Mono({
//   subsets: ['latin'], variable: '--font-mono',
//   weight: ['400', '500'], style: ['normal', 'italic'], display: 'swap',
// });
// const outfit = Outfit({
//   subsets: ['latin'], variable: '--font-outfit', display: 'swap',
// });
// const jetbrains = JetBrains_Mono({
//   subsets: ['latin'], variable: '--font-jetbrains', display: 'swap',
// });

// export const metadata: Metadata = {
//   title: {
//     default: 'QR Estate — India\'s QR-Native Property Platform',
//     template: '%s | QR Estate',
//   },
//   description: 'Generate QR codes for every property listing. Buyers scan, view, and enquire instantly. Built for Indian real estate agents — RERA-ready, WhatsApp-native.',
//   keywords: ['real estate', 'QR code', 'property listing', 'India', 'RERA', 'Mumbai', 'Delhi', 'Bengaluru', 'Chandigarh'],
//   authors: [{ name: 'QR Estate' }],

//   openGraph: {
//     title: 'QR Estate — India\'s QR-Native Property Platform',
//     description: 'QR codes for every listing. Buyers scan, agents close deals faster.',
//     type: 'website',
//     siteName: 'QR Estate',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'QR Estate',
//     description: 'QR codes for every property listing. Built for India.',
//   },
//   icons: {
//     icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
//     apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
//   },
//   manifest: '/site.webmanifest',
// };
// export const viewport = {
//   themeColor: '#E8B84B',
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${syne.variable} ${jakartaSans.variable} ${dmMono.variable} ${outfit.variable} ${jetbrains.variable}`}>
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Gurmukhi:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="bg-[var(--bg)] text-[var(--white)] antialiased">
//         <FavouritesProvider>
//           <CompareProvider>
//             {/* Triggers Zustand rehydration from localStorage on the client.
//             Also clears the stale auth cookie when no token exists. */}
//             <AuthHydration />
//             {children}
//             <CompareBar />
//           </CompareProvider>
//         </FavouritesProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata, Viewport } from 'next';
import { Outfit, JetBrains_Mono, Syne, DM_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthHydration } from '@/components/AuthHydration';
import { CompareProvider } from '@/contexts/CompareContext';
import { FavouritesProvider } from '@/contexts/FavouritesContext';
import { CompareBar } from '@/components/listings/CompareButton';

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

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'], variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700'], display: 'swap',
});
const dmMono = DM_Mono({
  subsets: ['latin'], variable: '--font-mono',
  weight: ['400', '500'], style: ['normal', 'italic'], display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'QR Estate — India\'s QR-Native Property Platform',
    template: '%s | QR Estate',
  },
  description: 'Generate QR codes for every property listing. Buyers scan, view, and enquire instantly. Built for Indian real estate agents — RERA-ready, WhatsApp-native.',
  keywords: ['real estate', 'QR code', 'property listing', 'India', 'RERA', 'Mumbai', 'Delhi', 'Bengaluru', 'Chandigarh'],
  authors: [{ name: 'QR Estate' }],

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

export const viewport: Viewport = {
  themeColor: '#07090D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable} ${syne.variable}`}>
      <head>
        {/* Preconnect to Google Fonts for DM Mono / Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Auth hydration (restores auth state from localStorage) */}
        <AuthHydration />

        {/* Global buyer feature providers */}
        <FavouritesProvider>
          <CompareProvider>
            {children}
            {/* Floating compare bar — appears when ≥1 listing in compare */}
            <CompareBar />
          </CompareProvider>
        </FavouritesProvider>
      </body>
    </html>
  );
}


// import type { Metadata } from 'next';
// import { DashboardSidebar } from '@/components/dashboard/Sidebar';
// import { DashboardTopbar } from '@/components/dashboard/Topbar';
// import { TopBarLoader, PageTransitionOverlay } from '@/components/ui/RouteLoader';
// import { FavouritesProvider } from '@/contexts/FavouritesContext';

// export const metadata: Metadata = {
//   title: { default: 'Dashboard', template: '%s | QR Estate' },
// };

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

//       {/* ── Route loader + transition overlay ─────────────────────────── */}
//       <TopBarLoader />
//       <PageTransitionOverlay />

//       {/* ── Sidebar ───────────────────────────────────────────────────── */}
//       <div className="relative z-20 flex-shrink-0">
//         <DashboardSidebar />
//       </div>

//       {/* ── Main ──────────────────────────────────────────────────────── */}
//       <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
//         <DashboardTopbar />

//         <main
//           className="flex-1 overflow-x-hidden overflow-y-auto"
//           style={{
//             padding: 'clamp(16px, 2.5vw, 32px)',
//             paddingBottom: 'clamp(96px, 10vw, 48px)',
//           }}
//         >
//           <div className="w-full max-w-[1400px] mx-auto">
//             <FavouritesProvider>
//             {children}
//             </FavouritesProvider>
//           </div>
//         </main>
//       </div>

//       {/* ── Mobile bottom nav ─────────────────────────────────────────── */}
//       <nav
//         className="fixed bottom-0 left-0 right-0 z-50 flex h-16 lg:hidden"
//         style={{
//           background: 'rgba(11,14,20,0.97)',
//           backdropFilter: 'blur(24px)',
//           borderTop: '1px solid var(--border)',
//         }}
//       >
//         {[
//           { href: '/dashboard',          icon: '⊞', label: 'Home'     },
//           { href: '/dashboard/listings', icon: '⊟', label: 'Listings' },
//           { href: '/dashboard/qr',       icon: '⬡', label: 'QR'       },
//           { href: '/dashboard/leads',    icon: '👤', label: 'Leads'    },
//           { href: '/dashboard/settings', icon: '⋯', label: 'More'     },
//         ].map(({ href, icon, label }) => (
//           <a key={href} href={href} className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors"
//             style={{ color: 'var(--dim)', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
//             <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
//             {label}
//           </a>
//         ))}
//       </nav>
//     </div>
//   );
// }
