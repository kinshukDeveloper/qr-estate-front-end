// // import type { Metadata } from 'next';
// // import { DashboardSidebar } from '@/components/dashboard/Sidebar';
// // import { DashboardTopbar } from '@/components/dashboard/Topbar';

// // export const metadata: Metadata = {
// //   title: 'Dashboard',
// // };

// // export default function DashboardLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <div className="flex h-screen bg-[#080F17] overflow-hidden">
// //       {/* Sidebar */}
// //       <DashboardSidebar />

// //       {/* Main content area */}
// //       <div className="flex flex-col flex-1 overflow-hidden">
// //         <DashboardTopbar />
// //         <main className="flex-1 p-6 overflow-y-auto lg:p-8">
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }


// import type { Metadata } from 'next';
// import Link from 'next/link';
// import { DashboardSidebar } from '@/components/dashboard/Sidebar';
// import { DashboardTopbar } from '@/components/dashboard/Topbar';
// import { LayoutDashboard, Building2, QrCode, MessageSquare, Settings } from 'lucide-react';

// export const metadata: Metadata = {
//   title: { default: 'Dashboard', template: '%s | QR Estate' },
// };

// // ── Mobile bottom nav (server component is fine — Link handles interactivity) ─
// const BOTTOM_NAV = [
//   { href: '/dashboard',           icon: LayoutDashboard, label: 'Home',     exact: true },
//   { href: '/dashboard/listings',  icon: Building2,       label: 'Listings' },
//   { href: '/dashboard/qr',        icon: QrCode,          label: 'QR'       },
//   { href: '/dashboard/leads',     icon: MessageSquare,   label: 'Leads'    },
//   { href: '/dashboard/settings',  icon: Settings,        label: 'Settings' },
// ];

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex h-screen bg-[var(--bg)] overflow-hidden">

//       {/* ── Desktop sidebar ── */}
//       <DashboardSidebar />

//       {/* ── Main area ── */}
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         <DashboardTopbar />

//         {/* Scrollable content */}
//         <main className="flex-1 p-4 pb-24 overflow-y-auto sm:p-6 lg:p-8 lg:pb-8">
//           {children}
//         </main>
//       </div>

//       {/* ── Mobile bottom navigation ── */}
//       <BottomNav />
//     </div>
//   );
// }

// // Separate client component so we can use usePathname
// function BottomNav() {
//   return (
//     <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-[var(--bg2)]/95 backdrop-blur-xl border-t border-[var(--border)]">
//       {BOTTOM_NAV.map(({ href, icon: Icon, label }) => (
//         // Each link uses active styles via CSS :global — simpler without usePathname in server layout
//         // For proper active state wrap this in a 'use client' component if needed
//         <Link key={href} href={href} className="flex-1 flex flex-col items-center gap-0.5 py-3 text-[var(--dim)] hover:text-[var(--teal)] transition-colors group">
//           <Icon size={18} />
//           <span className="text-[9px] font-bold tracking-wide" style={{ fontFamily: 'var(--font-mono)' }}>
//             {label}
//           </span>
//         </Link>
//       ))}
//     </nav>
//   );
// }


import type { Metadata } from 'next';
import { DashboardSidebar, MobileSidebarDrawer } from '@/components/dashboard/Sidebar';
import { DashboardTopbar } from '@/components/dashboard/Topbar';
import { DashboardCanvas } from '@/components/dashboard/DashboardCanvas';
import { RouteLoader } from '@/components/ui/PageLoader';

export const metadata: Metadata = {
  title: { default: 'Dashboard', template: '%s | QR Estate' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* ── 3D Ambient canvas (fixed, behind everything) ─────────────────── */}
      <DashboardCanvas />

      {/* ── Route change progress bar ─────────────────────────────────────── */}
      <RouteLoader />

      {/* ── Desktop Sidebar ───────────────────────────────────────────────── */}
      <div className="relative z-20 flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardTopbar />

        {/* Scrollable page content */}
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto"
          style={{
            padding: 'clamp(16px, 2.5vw, 32px)',
            paddingBottom: 'clamp(80px, 8vw, 48px)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border2) transparent',
          }}
        >
          {/* Page content wrapper with max-width */}
          <div className="w-full max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav (always on top) ────────────────────────────── */}
      <MobileBottomNav />
    </div>
  );
}

// Mobile bottom navigation — client-rendered for active state
// (imported from Sidebar to keep nav items in sync)
function MobileBottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom"
      style={{
        background: 'rgba(12,15,20,0.97)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-stretch h-16">
        {[
          { href: '/dashboard',          label: 'Home',     icon: '⊞' },
          { href: '/dashboard/listings', label: 'Listings', icon: '⊟' },
          { href: '/dashboard/qr',       label: 'QR',       icon: '⊠' },
          { href: '/dashboard/leads',    label: 'Leads',    icon: '⊡' },
          { href: '/dashboard/settings', label: 'More',     icon: '⋯' },
        ].map(({ href, label, icon }) => (
          <a
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-all"
            style={{
              color: 'var(--dim)',
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
