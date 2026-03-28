// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { clsx } from 'clsx';
// import {
//   LayoutDashboard,
//   Home,
//   Building2,
//   QrCode,
//   BarChart2,
//   Activity,
//   LogOut,
//   PenLine,
//   Calculator,
//   Mail,
//   MessageSquare,
//   CreditCard,
//   Settings,
//   ChevronRight,
//   ShieldCheck,
//   Users,
//   Phone,
//   Palette,
//   KeyRound,
//   TrendingUp,
//   Layers,
// } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';

// // ─────────────────────────────────────────────────────────────────────────────
// // Nav structure — grouped sections (from v2), full item list (from v1)
// // ─────────────────────────────────────────────────────────────────────────────
// const NAV = [
//   {
//     section: 'Main',
//     items: [
//       { href: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard',  exact: true },
//       { href: '/dashboard/listings',  icon: Building2,       label: 'Listings' },
//       { href: '/dashboard/qr',        icon: QrCode,          label: 'QR Codes' },
//       { href: '/dashboard/leads',     icon: MessageSquare,   label: 'Leads' },
//       { href: '/dashboard/analytics', icon: BarChart2,       label: 'Analytics' },
//     ],
//   },
//   {
//     section: 'Tools',
//     items: [
//       { href: '/dashboard/callbacks', icon: Phone,      label: 'Callbacks' },
//       { href: '/dashboard/optimizer', icon: TrendingUp, label: 'Optimizer' },
//       { href: '/dashboard/builder',   icon: Layers,     label: 'Builder' },
//       { href: '/dashboard/health',    icon: ShieldCheck, label: 'QR Health' },
//     ],
//   },
//   {
//     section: 'Agency',
//     items: [
//       { href: '/dashboard/team',   icon: Users,   label: 'Team' },
//       { href: '/dashboard/brand',  icon: Palette, label: 'Brand' },
//       { href: '/dashboard/portal', icon: KeyRound, label: 'Portal API' },
//     ],
//   },
//   {
//     section: 'V3 Features',
//     items: [
//       { href: '/dashboard/eoi',         icon: PenLine,    label: 'E-Signature', badge: 'NEW' },
//       { href: '/dashboard/commission',  icon: Calculator, label: 'Commission',  badge: 'NEW' },
//       { href: '/dashboard/follow-ups',  icon: Mail,       label: 'Follow-ups',  badge: 'NEW' },
//     ],
//   },
//   {
//     section: 'Account',
//     items: [
//       { href: '/dashboard/billing',  icon: CreditCard, label: 'Billing' },
//       { href: '/dashboard/settings', icon: Settings,   label: 'Settings' },
//     ],
//   },
// ] as const;

// type NavItem = {
//   href:      string;
//   icon:      React.ElementType;
//   label:     string;
//   exact?:    boolean;
//   badge?:    string;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// export function DashboardSidebar() {
//   const pathname = usePathname();
//   const { user, clearAuth } = useAuthStore();

//   function isActive(item: NavItem) {
//     return item.exact
//       ? pathname === item.href
//       : pathname.startsWith(item.href);
//   }

//   function handleLogout() {
//     clearAuth();
//     document.cookie = 'qr_estate_auth=; path=/; max-age=0';
//     window.location.href = '/auth/login';
//   }

//   return (
//     <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0D1821] border-r border-[#1A2D40] flex-shrink-0 overflow-y-auto overflow-x-hidden">

//       {/* ── Logo ─────────────────────────────────────────── */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1A2D40] flex-shrink-0">
//         <Link href="/dashboard" className="flex items-center gap-3 group">
//           <div className="w-8 h-8 border-2 border-[#00D4C8] flex items-center justify-center flex-shrink-0">
//             <div className="grid grid-cols-2 gap-0.5">
//               <div className="w-1.5 h-1.5 bg-[#00D4C8]" />
//               <div className="w-1.5 h-1.5 border border-[#00D4C8]" />
//               <div className="w-1.5 h-1.5 border border-[#00D4C8]" />
//               <div className="w-1.5 h-1.5 bg-[#00D4C8]" />
//             </div>
//           </div>
//           <span className="text-sm font-bold tracking-wide text-white">QR Estate</span>
//         </Link>
//       </div>

//       {/* ── Navigation ───────────────────────────────────── */}
//       <nav className="flex-1 px-3 py-4 space-y-5">
//         {NAV.map(({ section, items }) => (
//           <div key={section}>
//             {/* Section label */}
//             <div className="text-[9px] font-bold tracking-[2px] text-[#4A6580] uppercase px-3 mb-1.5">
//               {section}
//             </div>

//             {/* Items */}
//             <div className="space-y-0.5">
//               {(items as readonly NavItem[]).map((item) => {
//                 const active = isActive(item);
//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={clsx(
//                       'flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 group relative',
//                       active
//                         ? 'bg-[rgba(0,212,200,0.08)] text-[#00D4C8] border-r-2 border-[#00D4C8] -mr-3 pr-[10px]'
//                         : 'text-[#7A95AE] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
//                     )}
//                   >
//                     <item.icon size={15} className="flex-shrink-0" />
//                     <span className="flex-1 font-medium">{item.label}</span>

//                     {/* NEW badge */}
//                     {item.badge && !active && (
//                       <span className="text-[8px] font-black tracking-wider bg-[rgba(0,212,200,0.12)] text-[#00D4C8] border border-[rgba(0,212,200,0.25)] px-1.5 py-0.5">
//                         {item.badge}
//                       </span>
//                     )}

//                     {/* Active indicator */}
//                     {active && (
//                       <ChevronRight size={13} className="flex-shrink-0 opacity-50" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* ── User footer ──────────────────────────────────── */}
//       <div className="flex-shrink-0 border-t border-[#1A2D40] p-3">

//         {/* Avatar row */}
//         <div className="flex items-center gap-3 px-2 py-2.5 hover:bg-[rgba(255,255,255,0.03)] transition-all group rounded-sm">
//           <div className="w-8 h-8 bg-[#00D4C8] flex items-center justify-center text-xs font-black text-[#080F17] flex-shrink-0">
//             {user?.name?.[0]?.toUpperCase() || 'A'}
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-[11px] font-bold text-white truncate">{user?.name || 'Agent'}</div>
//             <div className="text-[9px] text-[#4A6580] truncate">{user?.email}</div>
//           </div>
//           <button
//             onClick={handleLogout}
//             title="Sign out"
//             className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#4A6580] hover:text-[#FF4D6A]"
//           >
//             <LogOut size={13} />
//           </button>
//         </div>

//         {/* Plan badge */}
//         <Link href="/dashboard/billing" className="block mt-2">
//           <div className="bg-[rgba(255,184,48,0.06)] border border-[rgba(255,184,48,0.15)] p-3 hover:border-[rgba(255,184,48,0.3)] transition-colors cursor-pointer">
//             <div className="text-[10px] font-bold tracking-widest text-[#FFB830] uppercase mb-1">
//               {(user as any)?.plan ? `${(user as any).plan} Plan` : 'Free Plan'}
//             </div>
//             <div className="text-xs text-[#7A95AE] mb-2">5 of 5 listings used</div>
//             <div className="w-full h-1 bg-[#1A2D40] overflow-hidden">
//               <div className="h-full bg-[#FFB830] w-full" />
//             </div>
//             <div className="mt-2 text-[10px] font-bold tracking-widest text-[#FFB830] uppercase">
//               Upgrade to Pro →
//             </div>
//           </div>
//         </Link>
//       </div>

//     </aside>
//   );
// }


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, QrCode, BarChart2, MessageSquare,
  Phone, Palette, KeyRound, TrendingUp, Layers, ShieldCheck,
  CreditCard, Settings, Users, PenLine, Calculator, Mail,
  LogOut, X, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// ── Nav structure ─────────────────────────────────────────────────────────────
const NAV = [
  {
    section: 'Main',
    items: [
      { href: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard',  exact: true },
      { href: '/dashboard/listings',  icon: Building2,       label: 'Listings' },
      { href: '/dashboard/qr',        icon: QrCode,          label: 'QR Codes' },
      { href: '/dashboard/leads',     icon: MessageSquare,   label: 'Leads' },
      { href: '/dashboard/analytics', icon: BarChart2,       label: 'Analytics' },
    ],
  },
  {
    section: 'Tools',
    items: [
      { href: '/dashboard/callbacks', icon: Phone,       label: 'Callbacks' },
      { href: '/dashboard/optimizer', icon: TrendingUp,  label: 'Optimizer' },
      { href: '/dashboard/builder',   icon: Layers,      label: 'Builder' },
      { href: '/dashboard/health',    icon: ShieldCheck, label: 'QR Health' },
    ],
  },
  {
    section: 'Agency',
    items: [
      { href: '/dashboard/team',   icon: Users,    label: 'Team' },
      { href: '/dashboard/brand',  icon: Palette,  label: 'Brand' },
      { href: '/dashboard/portal', icon: KeyRound, label: 'Portal API' },
    ],
  },
  {
    section: 'V3 New',
    items: [
      { href: '/dashboard/eoi',        icon: PenLine,    label: 'E-Signature', badge: 'NEW' },
      { href: '/dashboard/commission', icon: Calculator, label: 'Commission',  badge: 'NEW' },
      { href: '/dashboard/follow-ups', icon: Mail,       label: 'Follow-ups',  badge: 'NEW' },
    ],
  },
  {
    section: 'Account',
    items: [
      { href: '/dashboard/billing',  icon: CreditCard, label: 'Billing' },
      { href: '/dashboard/settings', icon: Settings,   label: 'Settings' },
    ],
  },
] as const;

type NavItem = {
  href: string; icon: React.ElementType; label: string;
  exact?: boolean; badge?: string;
};

// ── Single nav link ───────────────────────────────────────────────────────────
function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link href={item.href} onClick={onClick}>
      <div className={`relative flex items-center gap-3 px-3 py-[9px] rounded-xl cursor-pointer transition-all duration-150 group
        ${active
          ? 'bg-[rgba(24,212,200,0.08)] border border-[rgba(24,212,200,0.18)]'
          : 'border border-transparent hover:bg-[rgba(255,255,255,0.03)] hover:border-[var(--border)]'
        }`}
      >
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[var(--teal)]" />
        )}
        <item.icon
          size={14}
          className={`flex-shrink-0 ${active ? 'text-[var(--teal)]' : 'text-[var(--dim)] group-hover:text-[var(--muted)]'}`}
        />
        <span className={`flex-1 text-[12.5px] font-semibold ${active ? 'text-[var(--teal)]' : 'text-[var(--muted)] group-hover:text-[var(--white)]'}`}>
          {item.label}
        </span>
        {item.badge && (
          <span
            className="text-[7px] font-black tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-full border"
            style={{ color: 'var(--gold)', background: 'rgba(232,184,75,0.08)', borderColor: 'rgba(232,184,75,0.2)', fontFamily: 'var(--font-mono)' }}
          >
            {item.badge}
          </span>
        )}
        {active && !item.badge && <ChevronRight size={11} className="text-[var(--teal)] opacity-50 flex-shrink-0" />}
      </div>
    </Link>
  );
}

// ── Inner content (shared between desktop + mobile) ───────────────────────────
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  function isActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  function handleLogout() {
    clearAuth();
    document.cookie = 'qr_estate_auth=; path=/; max-age=0';
    window.location.href = '/auth/login';
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AG';

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-[18px] border-b border-[var(--border)] flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
            style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)' }}
          >
            <QrCode size={15} className="text-[var(--bg)]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[14px] tracking-tight text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              QR<span className="text-gradient-gold">Estate</span>
            </div>
            <div className="text-[8px] tracking-[0.18em] text-[var(--dim)] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              v3 · Beta
            </div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-[var(--dim)] hover:text-[var(--white)] transition-colors p-1 lg:hidden">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div
              className="text-[8px] font-black tracking-[0.22em] uppercase px-3 mb-2"
              style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}
            >
              {section}
            </div>
            <div className="space-y-0.5">
              {(items as readonly NavItem[]).map(item => (
                <NavLink key={item.href} item={item} active={isActive(item)} onClick={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-[var(--border)] p-3 space-y-2">
        {/* Plan */}
        <Link href="/dashboard/billing">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition-colors hover:border-[rgba(232,184,75,0.35)]"
            style={{ background: 'rgba(232,184,75,0.04)', border: '1px solid rgba(232,184,75,0.15)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse flex-shrink-0" />
            <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[var(--gold)] flex-1" style={{ fontFamily: 'var(--font-mono)' }}>
              Free Plan
            </span>
            <span className="text-[9px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Upgrade →</span>
          </div>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-all group cursor-default">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-[var(--bg)] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,var(--teal),var(--purple))' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-[var(--white)] truncate">{user?.name || 'Agent'}</div>
            <div className="text-[9px] text-[var(--dim)] truncate" style={{ fontFamily: 'var(--font-mono)' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} title="Sign out" className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--dim)] hover:text-[var(--red)]">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────
export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-60 bg-[var(--bg2)] border-r border-[var(--border)] lg:hidden"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────
export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[var(--bg2)] border-r border-[var(--border)] h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
}
