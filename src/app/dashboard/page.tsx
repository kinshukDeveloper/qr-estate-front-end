// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuthStore } from '@/store/authStore';
// import { listingsAPI } from '@/lib/listings';
// import { Home, QrCode, Eye, TrendingUp, ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// export default function DashboardPage() {
//   const { user, accessToken, _hasHydrated } = useAuthStore();

//   const [stats, setStats] = useState({
//     active: '0',
//     draft: '0',
//     sold: '0',
//     total: '0',
//     total_views: '0',
//   });

//   useEffect(() => {
//     if (!_hasHydrated || !accessToken) return;

//     listingsAPI.getStats()
//       .then(res => setStats(res.data.data.stats))
//       .catch(() => {});
//   }, [_hasHydrated, accessToken]);

//   const [greeting, setGreeting] = useState('');
//   useEffect(() => {
//     const h = new Date().getHours();
//     setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
//   }, []);

//   const firstName = user?.name?.split(' ')[0] || 'Agent';

//   const STATS = [
//     {
//       label: 'Active Listings',
//       value: stats.active,
//       max: '5',
//       icon: Home,
//       color: '#00D4C8',
//       hint: `${5 - parseInt(stats.active || '0')} remaining on Free plan`,
//     },
//     {
//       label: 'QR Codes',
//       value: stats.active,
//       icon: QrCode,
//       color: '#FFB830',
//       hint: 'Generated so far',
//     },
//     {
//       label: 'Total Views',
//       value: stats.total_views,
//       icon: Eye,
//       color: '#A78BFA',
//       hint: 'Across all listings',
//     },
//     {
//       label: 'Leads',
//       value: '0',
//       icon: TrendingUp,
//       color: '#2ECC8A',
//       hint: 'Leads captured',
//     },
//   ];

//   const QUICK_ACTIONS = [
//     {
//       label: 'Add First Listing',
//       description: 'Start by adding your property',
//       href: '/dashboard/listings/new',
//       icon: Home,
//       color: '#00D4C8',
//     },
//     {
//       label: 'Generate QR Code',
//       description: 'Turn listing into lead machine',
//       href: '/dashboard/qr',
//       icon: QrCode,
//       color: '#FFB830',
//     },
//   ];

//   const NEXT_STEPS = [
//     { step: '1', label: 'Add your first listing', done: parseInt(stats.total) > 0, href: '/dashboard/listings/new' },
//     { step: '2', label: 'Generate a QR code', done: parseInt(stats.active) > 0, href: '/dashboard/qr' },
//     { step: '3', label: 'Share QR on property boards', done: false, href: '#' },
//     { step: '4', label: 'Track your first scan', done: parseInt(stats.total_views) > 0, href: '/dashboard/analytics' },
//   ];

//   return (
//     <div className="space-y-8 animate-fade-in">

//       {/* Welcome */}
//       <div>
//         <h1 className="text-2xl font-black text-white">
//           {greeting && `${greeting}, `}{firstName} 👋
//         </h1>
//         <p className="text-[#7A95AE] text-sm mt-1">
//           Start by adding a listing → generate QR → get leads 🚀
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//         {STATS.map(({ label, value, max, icon: Icon, color, hint }) => (
//           <div key={label} className="bg-[#111C28] border border-[#1A2D40] p-5">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center justify-center w-9 h-9" style={{ background: `${color}15` }}>
//                 <Icon size={18} style={{ color }} />
//               </div>
//               {max && <span className="text-[10px] text-[#4A6580]">/ {max}</span>}
//             </div>
//             <div className="text-3xl font-black text-white">{value}</div>
//             <div className="text-xs font-semibold text-white">{label}</div>
//             <div className="text-[11px] text-[#4A6580]">{hint}</div>
//           </div>
//         ))}
//       </div>

//       {/* Growth */}
//       <div className="bg-[#111C28] border border-[#1A2D40] p-5">
//         <div className="text-[10px] font-bold tracking-widest text-[#FFB830] uppercase mb-2">
//           Growth
//         </div>
//         <div className="grid grid-cols-3 text-center">
//           <div>
//             <div className="text-lg font-black text-white">{stats.total_views}</div>
//             <div className="text-xs text-[#4A6580]">Views</div>
//           </div>
//           <div>
//             <div className="text-lg font-black text-white">0</div>
//             <div className="text-xs text-[#4A6580]">Leads</div>
//           </div>
//           <div>
//             <div className="text-lg font-black text-white">0%</div>
//             <div className="text-xs text-[#4A6580]">Conversion</div>
//           </div>
//         </div>
//       </div>

//       {/* Layout */}
//       <div className="grid gap-6 lg:grid-cols-2">

//         {/* Steps */}
//         <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//           <h2 className="mb-4 font-bold text-white">Setup Guide</h2>
//           <div className="space-y-3">
//             {NEXT_STEPS.map(({ step, label, done, href }) => (
//               <Link key={step} href={href} className="flex items-center gap-3 group">
//                 <div className={`w-6 h-6 flex items-center justify-center border ${
//                   done ? 'bg-green-500 text-black' : 'border-gray-500'
//                 }`}>
//                   {done ? '✓' : step}
//                 </div>
//                 <span className={done ? 'line-through text-gray-500' : 'text-white'}>
//                   {label}
//                 </span>
//                 {!done && <ArrowRight size={14} className="ml-auto text-gray-500 group-hover:text-cyan-400" />}
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="space-y-3">
//           {QUICK_ACTIONS.map(({ label, description, href, icon: Icon, color }, index) => (
//             <Link key={label} href={href}>
//               <div className="flex items-center gap-4 bg-[#111C28] border border-[#1A2D40] p-4">
//                 <Icon size={20} style={{ color }} />
//                 <div className="flex-1">
//                   <div className="font-bold text-white">
//                     {label}
//                     {index === 0 && (
//                       <span className="ml-2 text-xs text-[#00D4C8]">START HERE</span>
//                     )}
//                   </div>
//                   <div className="text-xs text-gray-400">{description}</div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Advanced Tools */}
//       <div>
//         <div className="mb-2 text-xs text-purple-400">Advanced Tools</div>
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { label: 'Callbacks', href: '/dashboard/callbacks' },
//             { label: 'Brand Kit', href: '/dashboard/brand' },
//             { label: 'Portal API', href: '/dashboard/portal' },
//             { label: 'Optimizer AI', href: '/dashboard/optimizer' },
//             { label: 'Builder Suite', href: '/dashboard/builder' },
//             { label: 'QR Health', href: '/dashboard/health' },
//           ].map(tool => (
//             <Link key={tool.label} href={tool.href}>
//               <div className="bg-[#111C28] border p-3 text-sm hover:text-white">
//                 {tool.label}
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Activity */}
//       <div className="bg-[#111C28] border border-[#1A2D40] p-5">
//         <div className="mb-2 text-xs text-green-400">Activity</div>
//         <div className="space-y-1 text-sm text-gray-400">
//           <div>🔍 12 new views</div>
//           <div>📱 QR scanned today</div>
//           <div>👤 Leads incoming</div>
//         </div>
//       </div>

//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { motion, useMotionValue, useSpring } from 'framer-motion';
// import { useAuthStore } from '@/store/authStore';
// import { listingsAPI } from '@/lib/listings';
// import {
//   Building2, QrCode, Eye, TrendingUp, ArrowRight,
//   Plus, BarChart2, Zap, Users, Bell, ChevronRight,
//   Sparkles, Activity,
// } from 'lucide-react';
// import Link from 'next/link';

// // ─────────────────────────────────────────────────────────────────────────────
// // Animated stat card with cursor glow
// // ─────────────────────────────────────────────────────────────────────────────
// function StatCard({
//   label, value, max, icon: Icon, color, hint, delay,
// }: {
//   label: string; value: string; max?: string;
//   icon: React.ElementType; color: string; hint: string; delay: number;
// }) {
//   const mx = useMotionValue(0.5);
//   const my = useMotionValue(0.5);
//   const gx = useSpring(mx, { stiffness: 120, damping: 20 });
//   const gy = useSpring(my, { stiffness: 120, damping: 20 });

//   function onMove(e: React.MouseEvent<HTMLDivElement>) {
//     const r = e.currentTarget.getBoundingClientRect();
//     mx.set((e.clientX - r.left) / r.width);
//     my.set((e.clientY - r.top) / r.height);
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//       className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden group cursor-default"
//       onMouseMove={onMove}
//       onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
//       whileHover={{ borderColor: `${color}50` }}
//     >
//       {/* Cursor glow */}
//       <motion.div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background: `radial-gradient(circle at calc(${gx}*100%) calc(${gy}*100%), ${color}12 0%, transparent 65%)`,
//         }}
//       />
//       {/* Top line */}
//       <div
//         className="absolute top-0 h-px transition-opacity duration-500 opacity-0 inset-x-6 group-hover:opacity-100"
//         style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
//       />

//       <div className="relative p-5">
//         <div className="flex items-start justify-between mb-5">
//           <div
//             className="flex items-center justify-center w-10 h-10 rounded-xl"
//             style={{ background: `${color}12`, border: `1px solid ${color}25` }}
//           >
//             <Icon size={18} style={{ color }} strokeWidth={1.8} />
//           </div>
//           {max && (
//             <span
//               className="text-[10px] text-[var(--dim)]"
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               / {max}
//             </span>
//           )}
//         </div>
//         <div
//           className="text-3xl font-extrabold text-[var(--white)] mb-1 leading-none"
//           style={{ fontFamily: 'var(--font-syne)' }}
//         >
//           {value}
//         </div>
//         <div className="text-[12px] font-semibold text-[var(--white)] mb-0.5">{label}</div>
//         <div className="text-[11px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>{hint}</div>
//       </div>
//     </motion.div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Quick action card
// // ─────────────────────────────────────────────────────────────────────────────
// function ActionCard({
//   label, description, href, icon: Icon, color, delay,
// }: {
//   label: string; description: string; href: string;
//   icon: React.ElementType; color: string; delay: number;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -16 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//     >
//       <Link href={href}>
//         <motion.div
//           whileHover={{ x: 4, borderColor: `${color}40` }}
//           className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 transition-colors group cursor-pointer"
//         >
//           <div
//             className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl"
//             style={{ background: `${color}12`, border: `1px solid ${color}25` }}
//           >
//             <Icon size={18} style={{ color }} strokeWidth={1.8} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <div className="text-[13px] font-semibold text-[var(--white)] group-hover:text-[var(--teal)] transition-colors leading-tight">
//               {label}
//             </div>
//             <div className="text-[11px] text-[var(--dim)] mt-0.5">{description}</div>
//           </div>
//           <ArrowRight
//             size={14}
//             className="text-[var(--dim)] group-hover:text-[var(--teal)] transition-all group-hover:translate-x-0.5 flex-shrink-0"
//           />
//         </motion.div>
//       </Link>
//     </motion.div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Setup step
// // ─────────────────────────────────────────────────────────────────────────────
// function SetupStep({
//   step, label, done, href, color, delay,
// }: {
//   step: string; label: string; done: boolean; href: string; color: string; delay: number;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.35 }}
//     >
//       <Link href={href} className="flex items-center gap-3 py-1 group">
//         <div
//           className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 border transition-all ${
//             done
//               ? 'border-transparent text-[var(--bg)]'
//               : 'border-[var(--border)] text-[var(--dim)] group-hover:border-[var(--teal)] group-hover:text-[var(--teal)]'
//           }`}
//           style={done ? { background: color } : {}}
//         >
//           {done ? <Check size={11} /> : step}
//         </div>
//         <span
//           className={`text-[13px] flex-1 transition-colors ${
//             done ? 'text-[var(--dim)] line-through' : 'text-[var(--muted)] group-hover:text-[var(--white)]'
//           }`}
//         >
//           {label}
//         </span>
//         {!done && (
//           <ChevronRight size={13} className="text-[var(--dim)] group-hover:text-[var(--teal)] transition-colors flex-shrink-0" />
//         )}
//       </Link>
//     </motion.div>
//   );
// }

// // Need Check icon
// function Check({ size }: { size: number }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//       <polyline points="20 6 9 17 4 12" />
//     </svg>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Activity feed item
// // ─────────────────────────────────────────────────────────────────────────────
// const FEED = [
//   { icon: '👁️', text: 'New scan on 3BHK Andheri West', time: '2m ago', color: '#18D4C8' },
//   { icon: '💬', text: 'Lead from Neha Agarwal', time: '14m ago', color: '#A870F8' },
//   { icon: '📈', text: 'Listing views +24% this week', time: '1h ago', color: '#28D890' },
//   { icon: '✍️', text: 'EOI signed by Sachin Bansal', time: '3h ago', color: '#E8B84B' },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // Main page
// // ─────────────────────────────────────────────────────────────────────────────
// export default function DashboardPage() {
//   const { user, accessToken, _hasHydrated } = useAuthStore();
//   const [stats, setStats] = useState({
//     active: '0', draft: '0', sold: '0', total: '0', total_views: '0',
//   });
//   const [greeting, setGreeting] = useState('');

//   useEffect(() => {
//     if (!_hasHydrated || !accessToken) return;
//     listingsAPI.getStats()
//       .then(res => setStats(res.data.data.stats))
//       .catch(() => {});
//   }, [_hasHydrated, accessToken]);

//   useEffect(() => {
//     const h = new Date().getHours();
//     setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
//   }, []);

//   const firstName = user?.name?.split(' ')[0] || 'Agent';

//   const STATS = [
//     { label: 'Active Listings', value: stats.active,      max: '5',  icon: Building2,  color: '#18D4C8', hint: `${5 - parseInt(stats.active)} remaining on Free plan` },
//     { label: 'QR Codes',        value: stats.active,                  icon: QrCode,     color: '#E8B84B', hint: 'Generated so far' },
//     { label: 'Total Views',     value: stats.total_views,             icon: Eye,        color: '#A870F8', hint: 'Across all listings' },
//     { label: 'Draft Listings',  value: stats.draft,                   icon: TrendingUp, color: '#28D890', hint: 'Saved as draft' },
//   ];

//   const ACTIONS = [
//     { label: 'Add New Listing',   description: 'Create a property listing with photos',  href: '/dashboard/listings/new', icon: Plus,      color: '#18D4C8' },
//     { label: 'Generate QR Code',  description: 'Print-ready QR for any listing',          href: '/dashboard/qr',           icon: QrCode,    color: '#E8B84B' },
//     { label: 'View Analytics',    description: 'Scan counts, views, lead sources',        href: '/dashboard/analytics',    icon: BarChart2, color: '#A870F8' },
//     { label: 'AI Optimizer',      description: 'Score and improve your listings',         href: '/dashboard/optimizer',    icon: Sparkles,  color: '#28D890' },
//   ];

//   const STEPS = [
//     { step: '1', label: 'Add your first listing',         done: false, href: '/dashboard/listings/new', color: '#18D4C8' },
//     { step: '2', label: 'Generate a QR code',             done: false, href: '/dashboard/qr',           color: '#E8B84B' },
//     { step: '3', label: 'Share QR on property boards',    done: false, href: '#',                       color: '#A870F8' },
//     { step: '4', label: 'Track your first scan',          done: false, href: '/dashboard/analytics',    color: '#28D890' },
//   ];

//   return (
//     <div className="pb-8 space-y-6 animate-fade-in">

//       {/* ── Welcome ─────────────────────────────────────────────────────── */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//         className="flex items-start justify-between gap-4"
//       >
//         <div>
//           {greeting && (
//             <p
//               className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--dim)] mb-1"
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               {greeting}
//             </p>
//           )}
//           <h1
//             className="text-[1.6rem] tracking-tight text-[var(--white)] leading-snug"
//             style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
//           >
//             {firstName}&apos;s Dashboard 👋
//           </h1>
//           <p className="text-[13px] text-[var(--muted)] mt-1 flex items-center gap-2">
//             Here&apos;s your QR Estate overview
//             {user?.rera_number && (
//               <span
//                 className="font-mono text-[9px] tracking-[0.15em] uppercase bg-[rgba(24,212,200,0.08)] border border-[rgba(24,212,200,0.2)] text-[var(--teal)] px-2 py-0.5 rounded-full"
//                 style={{ fontFamily: 'var(--font-mono)' }}
//               >
//                 RERA: {user.rera_number}
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Plan badge */}
//         <Link href="/dashboard/billing" className="flex-shrink-0">
//           <motion.div
//             whileHover={{ scale: 1.03 }}
//             className="hidden sm:flex items-center gap-2 bg-[rgba(232,184,75,0.06)] border border-[rgba(232,184,75,0.2)] rounded-xl px-3 py-2 cursor-pointer hover:border-[rgba(232,184,75,0.4)] transition-colors"
//           >
//             <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
//             <span
//               className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--gold)]"
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               Free Plan · Upgrade →
//             </span>
//           </motion.div>
//         </Link>
//       </motion.div>

//       {/* ── Stats grid ──────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//         {STATS.map((s, i) => (
//           <StatCard key={s.label} {...s} delay={0.08 + i * 0.06} />
//         ))}
//       </div>

//       {/* ── 3-column layout ─────────────────────────────────────────────── */}
//       <div className="grid gap-4 lg:grid-cols-3">

//         {/* Setup guide — spans 1 col */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.5 }}
//           className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 overflow-hidden"
//         >
//           <div
//             className="absolute top-0 left-0 right-0 h-px"
//             style={{ background: 'linear-gradient(90deg, transparent, var(--teal), transparent)' }}
//           />
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--teal)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
//                 Setup Guide
//               </p>
//               <h2 className="text-[14px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>
//                 Get started in 4 steps
//               </h2>
//             </div>
//             <span className="font-mono text-[10px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>0 / 4</span>
//           </div>

//           {/* Progress bar */}
//           <div className="w-full h-1 bg-[var(--border)] rounded-full mb-5 overflow-hidden">
//             <div className="w-0 h-full rounded-full" style={{ background: 'var(--teal)' }} />
//           </div>

//           <div className="space-y-3">
//             {STEPS.map((s, i) => (
//               <SetupStep key={s.step} {...s} delay={0.35 + i * 0.05} />
//             ))}
//           </div>
//         </motion.div>

//         {/* Quick actions — spans 1 col */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.35, duration: 0.5 }}
//           className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
//         >
//           <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--gold)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
//             Quick Actions
//           </p>
//           <h2 className="text-[14px] font-bold text-[var(--white)] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
//             What do you want to do?
//           </h2>
//           <div className="space-y-2.5">
//             {ACTIONS.map((a, i) => (
//               <ActionCard key={a.label} {...a} delay={0.4 + i * 0.05} />
//             ))}
//           </div>
//         </motion.div>

//         {/* Activity feed — spans 1 col */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.5 }}
//           className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--purple)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
//                 Live Activity
//               </p>
//               <h2 className="text-[14px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>
//                 Recent events
//               </h2>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
//               <span className="font-mono text-[9px] text-[var(--green)]" style={{ fontFamily: 'var(--font-mono)' }}>Live</span>
//             </div>
//           </div>

//           <div className="space-y-1">
//             {FEED.map(({ icon, text, time, color }, i) => (
//               <motion.div
//                 key={text}
//                 initial={{ opacity: 0, x: 12 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.45 + i * 0.07 }}
//                 className="flex items-start gap-3 py-2.5 border-b border-[var(--border)] last:border-0 group"
//               >
//                 <div
//                   className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-sm"
//                   style={{ background: `${color}12`, border: `1px solid ${color}20` }}
//                 >
//                   {icon}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[12px] text-[var(--muted)] group-hover:text-[var(--white)] transition-colors leading-snug">{text}</p>
//                   <p className="font-mono text-[10px] text-[var(--dim)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{time}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <Link href="/dashboard/analytics">
//             <motion.button
//               whileHover={{ x: 2 }}
//               className="w-full flex items-center justify-center gap-1.5 mt-4 py-2 rounded-xl border border-[var(--border)] text-[var(--dim)] hover:text-[var(--teal)] hover:border-[var(--teal)] text-[11px] transition-all"
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               View full analytics
//               <ArrowRight size={11} />
//             </motion.button>
//           </Link>
//         </motion.div>
//       </div>

//       {/* ── Feature discovery strip ─────────────────────────────────────── */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.55, duration: 0.5 }}
//         className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 overflow-hidden"
//       >
//         <div
//           className="absolute inset-0 opacity-[0.015] pointer-events-none"
//           style={{
//             backgroundImage: 'radial-gradient(circle, var(--border2) 1px, transparent 1px)',
//             backgroundSize: '24px 24px',
//           }}
//         />
//         <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--gold)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
//               V3 Features available
//             </p>
//             <h3 className="text-[15px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>
//               Explore everything on your plan
//             </h3>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {[
//               { label: 'AI Chat',      href: '/dashboard/ai-chat',      color: '#A870F8' },
//               { label: 'Lead Scoring', href: '/dashboard/lead-scoring', color: '#F04060' },
//               { label: 'Doc Vault',    href: '/dashboard/documents',    color: '#18D4C8' },
//               { label: 'NRI Mode',     href: '/dashboard/nri',          color: '#28D890' },
//               { label: 'Market Intel', href: '/dashboard/market',       color: '#E8B84B' },
//             ].map(({ label, href, color }) => (
//               <Link key={label} href={href}>
//                 <motion.span
//                   whileHover={{ scale: 1.05 }}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold cursor-pointer transition-colors"
//                   style={{
//                     borderColor: `${color}30`,
//                     background: `${color}0E`,
//                     color,
//                     fontFamily: 'var(--font-mono)',
//                   }}
//                 >
//                   {label} →
//                 </motion.span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </motion.div>

//     </div>
//   );
// }


'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { listingsAPI } from '@/lib/listings';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, QrCode, Eye, TrendingUp, ArrowRight, Plus, Zap,
  Users, Activity, BarChart2, Star, Phone, FileText, Globe,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(0)}L`;
  return `₹${Math.round(p).toLocaleString('en-IN')}`;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '', duration = 1400 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || to === 0) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{prefix}{val.toLocaleString('en-IN')}{suffix}</>;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 100; const h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h * 0.9 - 2}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 32 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Stat bento card ────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, spark, href, badge }: any) {
  return (
    <Link href={href || '#'}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative p-5 overflow-hidden cursor-pointer rounded-2xl group"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {/* Corner glow */}
        <div
          className="absolute w-24 h-24 transition-opacity duration-500 rounded-full opacity-0 pointer-events-none -top-6 -right-6 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, ${color}20, transparent 70%)` }}
        />
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
            <Icon size={16} style={{ color }} />
          </div>
          {badge && (
            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full" style={{ background: `${color}12`, color, border: `1px solid ${color}25`, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
              {badge}
            </span>
          )}
        </div>
        <div className="text-2xl font-black mb-0.5" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>
          {value}
        </div>
        <div className="text-[11px] mb-3" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
          {label}
        </div>
        {spark && <Sparkline data={spark} color={color} />}
        <ArrowRight size={12} className="absolute transition-opacity opacity-0 bottom-4 right-4 group-hover:opacity-40" style={{ color }} />
      </motion.div>
    </Link>
  );
}

// ── Quick action card ──────────────────────────────────────────────────────────
function ActionCard({ href, icon: Icon, label, desc, color, badge }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative flex flex-col gap-2 p-4 overflow-hidden cursor-pointer rounded-2xl group"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', minHeight: 100 }}
      >
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse at top left, ${color}08, transparent 60%)` }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
            <Icon size={14} style={{ color }} />
          </div>
          {badge && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full" style={{ background: `${color}15`, color, fontFamily: 'var(--font-mono)' }}>{badge}</span>}
        </div>
        <div>
          <div className="text-[12px] font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{label}</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--dim)' }}>{desc}</div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Activity item ──────────────────────────────────────────────────────────────
function ActivityItem({ icon, text, time, color }: { icon: string; text: string; time: string; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center justify-center flex-shrink-0 text-sm rounded-lg w-7 h-7" style={{ background: `${color}12` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium truncate" style={{ color: 'var(--white)' }}>{text}</div>
      </div>
      <div className="text-[10px] flex-shrink-0" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>{time}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, accessToken, _hasHydrated } = useAuthStore();
  const [stats, setStats] = useState({ active: 0, draft: 0, sold: 0, total: 0, total_views: 0 });
  const [listings, setListings] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening');
  }, []);

  useEffect(() => {
    if (!_hasHydrated || !accessToken) return;
    listingsAPI.getStats()
      .then(res => {
        const s = res.data.data.stats;
        setStats({ active: +s.active || 0, draft: +s.draft || 0, sold: +s.sold || 0, total: +s.total || 0, total_views: +s.total_views || 0 });
      }).catch(() => {});
    listingsAPI.getAll({ limit: 5 })
      .then(res => setListings(res.data.data.listings || []))
      .catch(() => {});
  }, [_hasHydrated, accessToken]);

  const firstName = user?.name?.split(' ')[0] || 'Agent';
  const scanData = [12, 18, 22, 19, 31, 38, 42, 35, 48, 52, 61, 58];
  const viewData = [200, 310, 280, 420, 380, 490, 510, 460, 580, 620, 590, 680];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Welcome hero ──────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div
          className="relative overflow-hidden rounded-3xl p-7"
          style={{
            background: 'linear-gradient(135deg, rgba(17,22,30,0.95) 0%, rgba(12,15,20,0.9) 100%)',
            border: '1px solid var(--border)',
            boxShadow: '0 0 0 1px rgba(232,184,75,0.05) inset',
          }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          {/* Top glow orb */}
          <div className="absolute rounded-full pointer-events-none -top-24 -right-24 w-72 h-72"
            style={{ background: 'radial-gradient(circle, rgba(24,212,200,0.08), transparent 70%)' }} />
          <div className="absolute w-64 h-64 rounded-full pointer-events-none -bottom-20 -left-20"
            style={{ background: 'radial-gradient(circle, rgba(232,184,75,0.06), transparent 70%)' }} />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="flex-1">
              {/* Status pill */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                  Portfolio Active
                </span>
              </div>

              {/* Greeting */}
              <h1 className="mb-3 font-black leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontFamily: 'var(--font-syne)', color: 'var(--white)' }}>
                Good {greeting},<br />
                <span className="text-gradient-gold">{firstName}.</span>
              </h1>

              <p className="text-sm" style={{ color: 'var(--muted)', maxWidth: 420, lineHeight: 1.7 }}>
                {stats.active > 0
                  ? `${stats.active} listing${stats.active !== 1 ? 's' : ''} active · ${stats.total_views.toLocaleString()} total views`
                  : 'Start by adding your first listing — it takes under 2 minutes.'}
              </p>
            </div>

            {/* RERA badge */}
            {user?.rera_number && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(168,112,248,0.08)', border: '1px solid rgba(168,112,248,0.2)' }}>
                <Activity size={13} style={{ color: 'var(--purple)' }} />
                <div>
                  <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'rgba(168,112,248,0.6)', fontFamily: 'var(--font-mono)' }}>RERA</div>
                  <div className="text-xs font-bold" style={{ color: 'var(--white)' }}>{user.rera_number}</div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA strip */}
          <div className="relative z-10 flex gap-3 mt-6">
            <Link href="/dashboard/listings/new">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'var(--gold)', color: 'var(--bg)', boxShadow: '0 4px 24px rgba(232,184,75,0.3)' }}
              >
                <Plus size={14} /> Add Listing
              </motion.button>
            </Link>
            <Link href="/dashboard/qr">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(24,212,200,0.1)', color: 'var(--teal)', border: '1px solid rgba(24,212,200,0.2)' }}
              >
                <QrCode size={14} /> Generate QR
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Stats bento grid ──────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Listings" value={<Counter to={stats.active} />} icon={Building2} color="var(--teal)" spark={[3,4,5,4,6,7,6,7,8,7,8,stats.active]} href="/dashboard/listings" badge={stats.draft > 0 ? `${stats.draft} draft` : undefined} />
        <StatCard label="Total Views" value={<Counter to={stats.total_views} />} icon={Eye} color="var(--purple)" spark={viewData} href="/dashboard/analytics" />
        <StatCard label="QR Scans" value={<Counter to={847} />} icon={QrCode} color="var(--gold)" spark={scanData} href="/dashboard/analytics" badge="+32%" />
        <StatCard label="New Leads" value={<Counter to={24} />} icon={Users} color="var(--green)" spark={[2,5,3,8,6,9,12,10,14,18,22,24]} href="/dashboard/leads" />
      </motion.div>

      {/* ── Main bento row ────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid lg:grid-cols-[1fr_320px] gap-4">

        {/* Recent listings table */}
        <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Portfolio</div>
              <div className="text-sm font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Recent Listings</div>
            </div>
            <Link href="/dashboard/listings" className="text-[10px] font-bold flex items-center gap-1 transition-colors" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Building2 size={18} style={{ color: 'var(--dim)' }} />
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--dim)' }}>No listings yet</div>
              <Link href="/dashboard/listings/new">
                <button className="px-4 py-2 text-xs font-bold rounded-xl" style={{ background: 'var(--gold)', color: 'var(--bg)' }}>
                  Add First Listing
                </button>
              </Link>
            </div>
          ) : (
            <div>
              {listings.map((l: any, i: number) => {
                const img = l.images?.find((x: any) => x.is_primary) || l.images?.[0];
                const statusColors: Record<string, string> = { active: 'var(--green)', draft: 'var(--dim)', sold: 'var(--gold)', rented: 'var(--purple)' };
                return (
                  <Link key={l.id} href={`/dashboard/listings/${l.id}`}>
                    <div
                      className="flex items-center gap-4 px-5 py-3.5 hover:brightness-110 transition-all group"
                      style={{ borderBottom: i < listings.length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        {img?.url ? <img src={img.url} alt={l.title} className="object-cover w-full h-full" /> : <div className="flex items-center justify-center w-full h-full text-lg">{l.property_type === 'commercial' ? '🏪' : '🏢'}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--white)' }}>{l.title}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--dim)' }}>📍 {l.locality ? `${l.locality}, ` : ''}{l.city}</div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-black text-gradient-gold">{fmt(l.price)}</div>
                        <div className="text-[9px] mt-0.5 font-bold uppercase" style={{ color: statusColors[l.status] || 'var(--dim)', fontFamily: 'var(--font-mono)' }}>{l.status}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Actions</div>
              <div className="text-sm font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Quick Deploy</div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              <ActionCard href="/dashboard/listings/new" icon={Plus}      label="New Listing"  desc="Add property"   color="var(--teal)"   />
              <ActionCard href="/dashboard/qr"            icon={QrCode}    label="Gen QR"       desc="For listing"   color="var(--gold)"   />
              <ActionCard href="/dashboard/leads"         icon={Users}     label="View Leads"   desc="24 new"        color="var(--green)"  />
              <ActionCard href="/dashboard/analytics"     icon={BarChart2} label="Analytics"    desc="Last 30d"      color="var(--purple)" />
            </div>
          </div>

          {/* Activity feed */}
          <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Recent Activity</div>
            </div>
            <div className="px-4 py-1">
              <ActivityItem icon="⬡" text="QR scanned — 3BHK Andheri"   time="2m ago"  color="var(--teal)"   />
              <ActivityItem icon="👤" text="New lead: Priya Sharma"       time="14m ago" color="var(--green)"  />
              <ActivityItem icon="👁" text="12 views on Powai Villa"       time="1h ago"  color="var(--purple)" />
              <ActivityItem icon="⬡" text="QR scanned — BKC Commercial"  time="2h ago"  color="var(--teal)"   />
              <ActivityItem icon="✓" text="Listing published: Worli 4BHK" time="4h ago"  color="var(--gold)"   />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── V3 Feature cards ──────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { href: '/dashboard/lead-scoring',  icon: Star,       label: 'Lead Score',   color: 'var(--red)',    badge: 'F13' },
          { href: '/dashboard/market',        icon: TrendingUp, label: 'Market Intel', color: 'var(--gold)',   badge: 'F10' },
          { href: '/dashboard/commission',    icon: BarChart2,  label: 'Commission',   color: 'var(--green)',  badge: 'F07' },
          { href: '/dashboard/documents',     icon: FileText,   label: 'Doc Vault',    color: 'var(--purple)', badge: 'F09' },
          { href: '/dashboard/nri',           icon: Globe,      label: 'NRI Mode',     color: 'var(--teal)',   badge: 'F16' },
          { href: '/dashboard/follow-ups',    icon: Phone,      label: 'Follow-ups',   color: 'var(--blue)',   badge: 'F08' },
        ].map((item) => (
          <ActionCard key={item.href} {...item} desc="" />
        ))}
      </motion.div>
    </motion.div>
  );
}
