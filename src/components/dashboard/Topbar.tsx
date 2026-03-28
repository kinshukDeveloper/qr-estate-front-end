// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import {
//   Bell, ChevronDown, Search,
//   LogOut, User, Settings,
//   Home, Building2, QrCode, Users,
// } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import { useAuth } from '@/hooks/useAuth';

// // ── Page title map (from new Topbar) ─────────────────────────────────────────
// const TITLE_MAP: Record<string, string> = {
//   dashboard:    'Dashboard',
//   listings:     'Listings',
//   qr:           'QR Codes',
//   leads:        'Leads',
//   analytics:    'Analytics',
//   billing:      'Billing',
//   settings:     'Settings',
//   health:       'System Health',
//   team:         'Team',
//   callbacks:    'Callbacks',
//   brand:        'Brand',
//   portal:       'Portal API',
//   optimizer:    'Optimizer',
//   builder:      'Builder',
//   eoi:          'E-Signature',
//   commission:   'Commission Calculator',
//   'follow-ups': 'Follow-ups',
// };

// // ── Topbar ────────────────────────────────────────────────────────────────────
// export function DashboardTopbar() {
//   const { user } = useAuthStore();
//   const { logout, isLoading } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Dynamic page title from pathname
//   const pathname = usePathname();
//   const segment  = pathname.split('/')[2] || 'dashboard';
//   const title    = TITLE_MAP[segment] || segment;

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClick);
//     return () => document.removeEventListener('mousedown', handleClick);
//   }, []);

//   const initials = user?.name
//     ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
//     : 'U';

//   return (
//     <header className="h-14 bg-[#0D1821] border-b border-[#1A2D40] px-4 lg:px-6 flex items-center justify-between flex-shrink-0">

//       {/* Left: mobile logo + page title */}
//       <div className="flex items-center gap-3">
//         {/* Mobile QR logo (hidden on lg+, sidebar handles it there) */}
//         <div className="lg:hidden w-7 h-7 border-2 border-[#00D4C8] flex items-center justify-center flex-shrink-0">
//           <div className="grid grid-cols-2 gap-0.5">
//             <div className="w-1 h-1 bg-[#00D4C8]" />
//             <div className="w-1 h-1 border border-[#00D4C8]" />
//             <div className="w-1 h-1 border border-[#00D4C8]" />
//             <div className="w-1 h-1 bg-[#00D4C8]" />
//           </div>
//         </div>

//         {/* Dynamic page title */}
//         <div>
//           <div className="text-[9px] font-bold tracking-[0.18em] text-[#4A6580] uppercase hidden sm:block">
//             QR Estate
//           </div>
//           <div className="text-sm font-bold text-white">{title}</div>
//         </div>
//       </div>

//       {/* Right: search + bell + user menu */}
//       <div className="flex items-center gap-2">

//         {/* Search button */}
//         <button className="w-8 h-8 flex items-center justify-center text-[#4A6580] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors">
//           <Search size={15} />
//         </button>

//         {/* Notifications */}
//         <button className="w-8 h-8 flex items-center justify-center text-[#4A6580] hover:text-white transition-colors relative">
//           <Bell size={16} />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D6A] rounded-full" />
//         </button>

//         {/* User dropdown */}
//         <div className="relative" ref={menuRef}>
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="flex items-center gap-2.5 hover:bg-[rgba(255,255,255,0.04)] px-2 py-1.5 transition-colors"
//           >
//             <div className="w-7 h-7 bg-[#00D4C8] flex items-center justify-center text-xs font-bold text-[#080F17]">
//               {initials}
//             </div>
//             <div className="hidden text-left sm:block">
//               <div className="text-xs font-semibold leading-tight text-white">{user?.name || 'Agent'}</div>
//               <div className="text-[10px] text-[#4A6580] leading-tight capitalize">
//                 {user?.role?.replace('_', ' ')}
//               </div>
//             </div>
//             <ChevronDown
//               size={14}
//               className={`text-[#4A6580] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
//             />
//           </button>

//           {/* Dropdown */}
//           {menuOpen && (
//             <div className="absolute right-0 top-full mt-1 w-52 bg-[#111C28] border border-[#1A2D40] shadow-xl z-50 animate-fade-in">
//               {/* User info */}
//               <div className="px-4 py-3 border-b border-[#1A2D40]">
//                 <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
//                 <div className="text-[11px] text-[#4A6580] truncate">{user?.email}</div>
//               </div>

//               {/* Menu items */}
//               <div className="py-1">
//                 <Link
//                   href="/dashboard/settings"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#7A95AE] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors"
//                 >
//                   <User size={14} />
//                   My Profile
//                 </Link>
//                 <Link
//                   href="/dashboard/settings"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#7A95AE] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors"
//                 >
//                   <Settings size={14} />
//                   Settings
//                 </Link>
//               </div>

//               {/* Logout */}
//               <div className="border-t border-[#1A2D40] py-1">
//                 <button
//                   onClick={() => { setMenuOpen(false); logout(); }}
//                   disabled={isLoading}
//                   className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#FF4D6A] hover:bg-[rgba(255,77,106,0.06)] transition-colors disabled:opacity-50"
//                 >
//                   <LogOut size={14} />
//                   {isLoading ? 'Signing out...' : 'Sign Out'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// // ── Mobile Bottom Nav (from new Topbar) ───────────────────────────────────────
// const BOTTOM_NAV = [
//   { href: '/dashboard',           icon: Home,      label: 'Home'     },
//   { href: '/dashboard/listings',  icon: Building2, label: 'Listings' },
//   { href: '/dashboard/qr',        icon: QrCode,    label: 'QR'       },
//   { href: '/dashboard/leads',     icon: Users,     label: 'Leads'    },
//   { href: '/dashboard/settings',  icon: Settings,  label: 'Settings' },
// ];

// export function DashboardBottomNav() {
//   const pathname = usePathname();

//   return (
//     <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-[#0D1821]/95 backdrop-blur-xl border-t border-[#1A2D40]">
//       {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
//         const active = href === '/dashboard'
//           ? pathname === href
//           : pathname.startsWith(href);
//         return (
//           <Link key={href} href={href} className="flex-1">
//             <div className={`flex flex-col items-center gap-1 py-2.5 px-1 transition-all relative
//               ${active ? 'text-[#00D4C8]' : 'text-[#4A6580]'}`}
//             >
//               <Icon size={18} />
//               <span className="text-[9px] font-bold tracking-wide">{label}</span>
//               {active && (
//                 <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[#00D4C8] rounded-full" />
//               )}
//             </div>
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, LogOut, User, Settings, Search, Menu, X, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { MobileSidebarDrawer } from './Sidebar';

// ── Page title map ────────────────────────────────────────────────────────────
const TITLE_MAP: Record<string, { label: string; color: string }> = {
  dashboard:    { label: 'Dashboard',            color: 'var(--teal)'   },
  listings:     { label: 'Listings',             color: 'var(--blue)'   },
  qr:           { label: 'QR Codes',             color: 'var(--gold)'   },
  leads:        { label: 'Leads',                color: 'var(--purple)' },
  analytics:    { label: 'Analytics',            color: 'var(--green)'  },
  callbacks:    { label: 'Callbacks',            color: 'var(--red)'    },
  optimizer:    { label: 'AI Optimizer',         color: 'var(--teal)'   },
  builder:      { label: 'Builder Suite',        color: 'var(--gold)'   },
  health:       { label: 'QR Health',            color: 'var(--green)'  },
  team:         { label: 'Team',                 color: 'var(--blue)'   },
  brand:        { label: 'Brand',                color: 'var(--purple)' },
  portal:       { label: 'Portal API',           color: 'var(--teal)'   },
  eoi:          { label: 'E-Signature',          color: 'var(--gold)'   },
  commission:   { label: 'Commission Calc',      color: 'var(--green)'  },
  'follow-ups': { label: 'Follow-ups',           color: 'var(--blue)'   },
  billing:      { label: 'Billing',              color: 'var(--gold)'   },
  settings:     { label: 'Settings',             color: 'var(--muted)'  },
  'lead-scoring':{ label: 'Lead Scoring',        color: 'var(--red)'    },
  market:       { label: 'Market Intelligence',  color: 'var(--teal)'   },
  documents:    { label: 'Document Vault',       color: 'var(--purple)' },
  valuation:    { label: 'AVM Valuation',        color: 'var(--gold)'   },
  nri:          { label: 'NRI Mode',             color: 'var(--green)'  },
};

export function DashboardTopbar() {
  const { user } = useAuthStore();
  const { logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [drawerOpen, setDrawer]   = useState(false);
  const [searchOpen, setSearch]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const segment = pathname.split('/')[2] || 'dashboard';
  const page = TITLE_MAP[segment] || { label: segment, color: 'var(--muted)' };

  // Close dropdown on outside click
  useEffect(() => {
    function h(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AG';

  return (
    <>
      <MobileSidebarDrawer open={drawerOpen} onClose={() => setDrawer(false)} />

      <header className="h-14 flex-shrink-0 flex items-center gap-3 px-4 lg:px-5 border-b border-[var(--border)] bg-[var(--bg2)]/80 backdrop-blur-xl relative z-30">

        {/* Mobile hamburger */}
        <button
          onClick={() => setDrawer(true)}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-[var(--dim)] hover:text-[var(--white)] transition-colors rounded-lg hover:bg-[var(--surface)]"
        >
          <Menu size={16} />
        </button>

        {/* Mobile logo */}
        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center justify-center w-6 h-6 rounded-md" style={{ background: 'linear-gradient(135deg,#E8B84B,#B89030)' }}>
            <QrCode size={12} className="text-[var(--bg)]" strokeWidth={2.5} />
          </div>
        </Link>

        {/* Page title */}
        <div className="flex-1 hidden sm:flex items-center gap-2.5">
          <div
            className="w-1.5 h-4 rounded-full"
            style={{ background: page.color }}
          />
          <h1
            className="text-[14px] font-bold text-[var(--white)] tracking-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {page.label}
          </h1>
        </div>

        <div className="flex items-center gap-2 ml-auto">

          {/* Search */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="open"
                initial={{ width: 36, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 36, opacity: 0 }}
                className="relative"
              >
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dim)]" />
                <input
                  ref={searchRef}
                  placeholder="Search anything…"
                  onBlur={() => setSearch(false)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-[var(--white)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--teal)]"
                />
              </motion.div>
            ) : (
              <motion.button
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSearch(true)}
                className="w-8 h-8 flex items-center justify-center text-[var(--dim)] hover:text-[var(--white)] rounded-lg hover:bg-[var(--surface)] transition-all border border-transparent hover:border-[var(--border)]"
              >
                <Search size={14} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Bell */}
          <button className="relative w-8 h-8 flex items-center justify-center text-[var(--dim)] hover:text-[var(--white)] rounded-lg hover:bg-[var(--surface)] transition-all border border-transparent hover:border-[var(--border)]">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--red)] shadow-[0_0_6px_rgba(240,64,96,0.8)]" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 hover:bg-[var(--surface)] px-2 py-1.5 rounded-lg transition-all border border-transparent hover:border-[var(--border)]"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-[var(--bg)] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,var(--teal),var(--purple))' }}
              >
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-[11px] font-semibold text-[var(--white)] leading-none">{user?.name?.split(' ')[0] || 'Agent'}</div>
                <div className="text-[9px] text-[var(--dim)] leading-none mt-0.5 capitalize" style={{ fontFamily: 'var(--font-mono)' }}>
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown
                size={12}
                className={`text-[var(--dim)] transition-transform hidden sm:block ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl z-50 overflow-hidden"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <div className="text-[12px] font-semibold text-[var(--white)] truncate">{user?.name}</div>
                    <div className="text-[10px] text-[var(--dim)] truncate" style={{ fontFamily: 'var(--font-mono)' }}>{user?.email}</div>
                  </div>

                  {/* Items */}
                  <div className="py-1">
                    {[
                      { href: '/dashboard/settings', icon: User, label: 'My Profile' },
                      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-[var(--muted)] hover:text-[var(--white)] hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer">
                          <item.icon size={13} />
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[var(--border)] py-1">
                    <button
                      onClick={() => { setMenuOpen(false); logout(); }}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-[var(--red)] hover:bg-[rgba(240,64,96,0.06)] transition-colors disabled:opacity-50"
                    >
                      <LogOut size={13} />
                      {isLoading ? 'Signing out…' : 'Sign Out'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
