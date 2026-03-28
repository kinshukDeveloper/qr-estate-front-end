// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
// } from 'recharts';
// import { TrendingUp, TrendingDown, Minus, Eye, QrCode, Home, Smartphone, Monitor, Tablet } from 'lucide-react';
// import api from '@/lib/api';

// const DAYS_OPTIONS = [7, 14, 30, 90];

// const DEVICE_ICONS: Record<string, React.ReactNode> = {
//   mobile: <Smartphone size={14} />,
//   tablet: <Tablet size={14} />,
//   desktop: <Monitor size={14} />,
// };

// const DEVICE_COLORS: Record<string, string> = {
//   mobile: '#00D4C8',
//   tablet: '#FFB830',
//   desktop: '#A78BFA',
//   unknown: '#4A6580',
// };

// const PIE_COLORS = ['#00D4C8', '#FFB830', '#A78BFA', '#2ECC8A', '#FF4D6A', '#60A5FA'];

// function formatPrice(price: number) {
//   if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
//   if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
//   return `₹${price.toLocaleString('en-IN')}`;
// }

// function StatCard({ label, value, sub, icon: Icon, color, trend }: any) {
//   return (
//     <div className="bg-[#111C28] border border-[#1A2D40] p-5">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center justify-center w-9 h-9" style={{ background: `${color}15` }}>
//           <Icon size={18} style={{ color }} />
//         </div>
//         {trend !== undefined && (
//           <div className={`flex items-center gap-1 text-xs font-bold ${
//             trend > 0 ? 'text-[#2ECC8A]' : trend < 0 ? 'text-[#FF4D6A]' : 'text-[#4A6580]'
//           }`}>
//             {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
//             {Math.abs(trend)}%
//           </div>
//         )}
//       </div>
//       <div className="mb-1 text-3xl font-black text-white">{value}</div>
//       <div className="text-xs font-semibold text-white mb-0.5">{label}</div>
//       {sub && <div className="text-[11px] text-[#4A6580]">{sub}</div>}
//     </div>
//   );
// }

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-[#111C28] border border-[#1A2D40] px-3 py-2 text-xs shadow-xl">
//       <div className="text-[#7A95AE] mb-1">{label}</div>
//       <div className="font-bold text-[#00D4C8]">{payload[0].value} scans</div>
//     </div>
//   );
// };

// export default function AnalyticsPage() {
//   const [days, setDays] = useState(30);
//   const [data, setData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       setIsLoading(true);
//       try {
//         const res = await api.get(`/analytics?days=${days}`);
//         setData(res.data.data);
//       } catch {
//         // handle silently
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     load();
//   }, [days]);

//   if (isLoading) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div className="h-8 w-48 bg-[#111C28]" />
//         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[#111C28]" />)}
//         </div>
//         <div className="h-64 bg-[#111C28]" />
//       </div>
//     );
//   }

//   const { overview, daily, byDevice, topListings, byCity, weekly } = data || {};

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header + period selector */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-white">Analytics</h1>
//           <p className="text-[#7A95AE] text-sm mt-0.5">QR scans, listing views and performance</p>
//         </div>
//         <div className="flex flex-shrink-0 gap-1">
//           {DAYS_OPTIONS.map(d => (
//             <button
//               key={d}
//               onClick={() => setDays(d)}
//               className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors ${
//                 days === d
//                   ? 'bg-[#00D4C8] text-[#080F17]'
//                   : 'bg-[#111C28] border border-[#1A2D40] text-[#7A95AE] hover:text-white'
//               }`}
//             >
//               {d}d
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Stats grid */}
//       <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//         <StatCard
//           label="Total QR Scans"
//           value={parseInt(overview?.total_scans || 0).toLocaleString()}
//           sub={`${parseInt(overview?.scans_this_month || 0)} this month`}
//           icon={QrCode}
//           color="#00D4C8"
//           trend={weekly?.change_pct}
//         />
//         <StatCard
//           label="Total Views"
//           value={parseInt(overview?.total_views || 0).toLocaleString()}
//           sub="Across all listings"
//           icon={Eye}
//           color="#A78BFA"
//         />
//         <StatCard
//           label="Active Listings"
//           value={overview?.active_listings || 0}
//           sub={`${overview?.total_listings || 0} total listings`}
//           icon={Home}
//           color="#FFB830"
//         />
//         <StatCard
//           label="QR Codes"
//           value={overview?.active_qr_codes || 0}
//           sub={`${overview?.total_qr_codes || 0} total created`}
//           icon={QrCode}
//           color="#2ECC8A"
//         />
//       </div>

//       {/* Weekly comparison banner */}
//       {weekly && (
//         <div className="bg-[#111C28] border border-[#1A2D40] px-5 py-4 flex items-center gap-6">
//           <div>
//             <div className="text-[10px] text-[#4A6580] uppercase tracking-widest mb-0.5">This Week</div>
//             <div className="text-2xl font-black text-white">{weekly.this_week} scans</div>
//           </div>
//           <div className="h-10 w-px bg-[#1A2D40]" />
//           <div>
//             <div className="text-[10px] text-[#4A6580] uppercase tracking-widest mb-0.5">Last Week</div>
//             <div className="text-2xl font-black text-[#7A95AE]">{weekly.last_week} scans</div>
//           </div>
//           <div className="h-10 w-px bg-[#1A2D40]" />
//           <div className={`flex items-center gap-2 text-lg font-black ${
//             weekly.change_pct > 0 ? 'text-[#2ECC8A]' : weekly.change_pct < 0 ? 'text-[#FF4D6A]' : 'text-[#4A6580]'
//           }`}>
//             {weekly.change_pct > 0 ? <TrendingUp size={20} /> : weekly.change_pct < 0 ? <TrendingDown size={20} /> : <Minus size={20} />}
//             {weekly.change_pct > 0 ? '+' : ''}{weekly.change_pct}% vs last week
//           </div>
//         </div>
//       )}

//       {/* Daily scans chart */}
//       <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//         <div className="text-[10px] font-bold tracking-widest text-[#00D4C8] uppercase mb-1">Scan Activity</div>
//         <h2 className="mb-6 text-sm font-bold text-white">Daily QR Scans — Last {days} Days</h2>
//         {daily?.length > 0 ? (
//           <ResponsiveContainer width="100%" height={220}>
//             <BarChart data={daily} barCategoryGap="30%">
//               <CartesianGrid strokeDasharray="3 3" stroke="#1A2D40" vertical={false} />
//               <XAxis
//                 dataKey="label"
//                 tick={{ fill: '#4A6580', fontSize: 10 }}
//                 axisLine={false}
//                 tickLine={false}
//                 interval={days > 14 ? Math.floor(daily.length / 7) : 0}
//               />
//               <YAxis
//                 tick={{ fill: '#4A6580', fontSize: 10 }}
//                 axisLine={false}
//                 tickLine={false}
//                 allowDecimals={false}
//               />
//               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,200,0.05)' }} />
//               <Bar dataKey="scans" fill="#00D4C8" radius={[2, 2, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <EmptyChart />
//         )}
//       </div>

//       {/* Two column: device breakdown + top listings */}
//       <div className="grid gap-6 lg:grid-cols-2">

//         {/* Device breakdown */}
//         <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//           <div className="text-[10px] font-bold tracking-widest text-[#FFB830] uppercase mb-1">Device Breakdown</div>
//           <h2 className="mb-5 text-sm font-bold text-white">Scans by Device Type</h2>
//           {byDevice?.length > 0 ? (
//             <div className="flex items-center gap-6">
//               <ResponsiveContainer width={140} height={140}>
//                 <PieChart>
//                   <Pie
//                     data={byDevice}
//                     dataKey="count"
//                     nameKey="device"
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={40}
//                     outerRadius={65}
//                     strokeWidth={0}
//                   >
//                     {byDevice.map((entry: any, index: number) => (
//                       <Cell key={entry.device} fill={DEVICE_COLORS[entry.device] || PIE_COLORS[index]} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="flex-1 space-y-3">
//                 {byDevice.map((item: any) => (
//                   <div key={item.device} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2.5 h-2.5 flex-shrink-0" style={{ background: DEVICE_COLORS[item.device] || '#4A6580' }} />
//                       <span className="text-xs text-[#7A95AE] capitalize flex items-center gap-1.5">
//                         {DEVICE_ICONS[item.device]}
//                         {item.device}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-bold text-white">{item.count}</span>
//                       <span className="text-[10px] text-[#4A6580]">{item.percentage}%</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <EmptyChart />
//           )}
//         </div>

//         {/* Top listings */}
//         <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//           <div className="text-[10px] font-bold tracking-widest text-[#A78BFA] uppercase mb-1">Performance</div>
//           <h2 className="mb-5 text-sm font-bold text-white">Top Listings by QR Scans</h2>
//           {topListings?.length > 0 ? (
//             <div className="space-y-3">
//               {topListings.map((listing: any, index: number) => (
//                 <div key={listing.id} className="flex items-center gap-3">
//                   <div className="text-xs font-black text-[#4A6580] w-4 flex-shrink-0">#{index + 1}</div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-xs font-semibold text-white truncate">{listing.title}</div>
//                     <div className="text-[10px] text-[#4A6580]">
//                       {listing.city} · {listing.listing_type} · {formatPrice(listing.price)}
//                     </div>
//                   </div>
//                   <div className="flex-shrink-0 text-right">
//                     <div className="text-sm font-black text-[#00D4C8]">{listing.scan_count}</div>
//                     <div className="text-[9px] text-[#4A6580]">scans</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <EmptyChart message="No scan data yet" />
//           )}
//         </div>
//       </div>

//       {/* Scans by city */}
//       {byCity?.length > 0 && (
//         <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//           <div className="text-[10px] font-bold tracking-widest text-[#2ECC8A] uppercase mb-1">Geographic</div>
//           <h2 className="mb-5 text-sm font-bold text-white">Scans by City</h2>
//           <div className="space-y-2">
//             {byCity.map((item: any) => {
//               const maxCount = Math.max(...byCity.map((c: any) => parseInt(c.count)));
//               const pct = Math.round((parseInt(item.count) / maxCount) * 100);
//               return (
//                 <div key={item.city} className="flex items-center gap-3">
//                   <div className="w-24 text-xs text-[#7A95AE] flex-shrink-0 truncate">{item.city}</div>
//                   <div className="flex-1 h-5 bg-[#0D1821] overflow-hidden">
//                     <div
//                       className="h-full bg-[#2ECC8A] transition-all duration-500"
//                       style={{ width: `${pct}%`, opacity: 0.7 + (pct / 100) * 0.3 }}
//                     />
//                   </div>
//                   <div className="flex-shrink-0 w-8 text-xs font-bold text-right text-white">{item.count}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function EmptyChart({ message = 'No data for this period' }) {
//   return (
//     <div className="flex items-center justify-center h-32">
//       <p className="text-sm text-[#4A6580]">{message}</p>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
// } from 'recharts';
// import { TrendingUp, TrendingDown, Minus, Eye, QrCode, Building2, Smartphone, Monitor, Tablet } from 'lucide-react';
// import api from '@/lib/api';

// const DAYS_OPTIONS = [7, 14, 30, 90];
// const PIE_COLORS = ['#18D4C8', '#E8B84B', '#A870F8', '#28D890', '#F04060', '#4898F8'];

// const DEVICE_ICONS: Record<string, React.ReactNode> = {
//   mobile:  <Smartphone size={13} />,
//   tablet:  <Tablet size={13} />,
//   desktop: <Monitor size={13} />,
// };

// const DEVICE_COLORS: Record<string, string> = {
//   mobile: '#18D4C8', tablet: '#E8B84B', desktop: '#A870F8', unknown: '#566070',
// };

// function fmtPrice(p: number) {
//   if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
//   if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
//   return `₹${p.toLocaleString('en-IN')}`;
// }

// // ── V3 Stat card ──────────────────────────────────────────────────────────────
// function StatCard({ label, value, sub, icon: Icon, color, trend, delay }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 18 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//       className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 group overflow-hidden"
//       whileHover={{ borderColor: `${color}40` } as any}
//     >
//       <div
//         className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-100"
//         style={{ background: `radial-gradient(circle at 20% 20%, ${color}10 0%, transparent 65%)` }}
//       />
//       <div className="relative flex items-start justify-between mb-5">
//         <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
//           <Icon size={17} style={{ color }} strokeWidth={1.8} />
//         </div>
//         {trend !== undefined && (
//           <div className={`flex items-center gap-1 text-[11px] font-bold rounded-full px-2 py-0.5 ${trend > 0 ? 'text-[var(--green)] bg-[rgba(40,216,144,0.08)]' : trend < 0 ? 'text-[var(--red)] bg-[rgba(240,64,96,0.08)]' : 'text-[var(--dim)]'}`}>
//             {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
//             {Math.abs(trend)}%
//           </div>
//         )}
//       </div>
//       <div className="text-[2rem] font-extrabold text-[var(--white)] leading-none mb-1" style={{ fontFamily: 'var(--font-syne)' }}>{value}</div>
//       <div className="text-[12px] font-semibold text-[var(--white)]">{label}</div>
//       {sub && <div className="text-[11px] text-[var(--dim)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{sub}</div>}
//     </motion.div>
//   );
// }

// // ── Chart wrapper ─────────────────────────────────────────────────────────────
// function ChartCard({ title, color, children, delay }: { title: string; color: string; children: React.ReactNode; delay?: number }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 18 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: delay || 0, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//       className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
//     >
//       <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2.5">
//         <div className="w-1.5 h-4 rounded-full" style={{ background: color }} />
//         <span className="text-[12px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>{title}</span>
//       </div>
//       <div className="p-5">{children}</div>
//     </motion.div>
//   );
// }

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-[11px] shadow-xl">
//       <div className="text-[var(--muted)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>{label}</div>
//       {payload.map((p: any, i: number) => (
//         <div key={i} className="font-bold" style={{ color: p.color }}>{p.name}: {p.value}</div>
//       ))}
//     </div>
//   );
// };

// export default function AnalyticsPage() {
//   const [days, setDays] = useState(30);
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     api.get(`/analytics?days=${days}`)
//       .then(r => setData(r.data.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [days]);

//   const stats = data?.stats || {};
//   const scanTimeline = data?.scan_timeline || [];
//   const topListings  = data?.top_listings  || [];
//   const deviceBreakdown = data?.device_breakdown || [];
//   const cityBreakdown   = data?.city_breakdown   || [];

//   const STATS = [
//     { label: 'Total Scans',    value: stats.total_scans    ?? '—', icon: QrCode,     color: '#18D4C8', trend: stats.scan_trend,  sub: `Last ${days} days` },
//     { label: 'Total Views',    value: stats.total_views    ?? '—', icon: Eye,        color: '#E8B84B', trend: stats.view_trend,  sub: 'Property page opens' },
//     { label: 'Active Listings',value: stats.active_listings ?? '—', icon: Building2, color: '#A870F8', sub: 'Currently live' },
//     { label: 'Conversion Rate',value: stats.conversion_rate ? `${stats.conversion_rate}%` : '—', icon: TrendingUp, color: '#28D890', trend: stats.conversion_trend, sub: 'Scan → enquiry' },
//   ];

//   return (
//     <div className="pb-8 space-y-5">

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
//         className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Analytics</h1>
//           <p className="text-[13px] text-[var(--muted)] mt-0.5">QR scans, views, conversions across all listings</p>
//         </div>

//         {/* Day filter */}
//         <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
//           {DAYS_OPTIONS.map(d => (
//             <button
//               key={d}
//               onClick={() => setDays(d)}
//               className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${days === d ? 'bg-[rgba(24,212,200,0.12)] text-[var(--teal)] border border-[rgba(24,212,200,0.2)]' : 'text-[var(--dim)] hover:text-[var(--muted)]'}`}
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               {d}d
//             </button>
//           ))}
//         </div>
//       </motion.div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//         {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={0.05 + i * 0.05} />)}
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-48 text-[var(--dim)]">
//           <div className="w-6 h-6 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
//         </div>
//       ) : (
//         <>
//           {/* Scan timeline */}
//           <ChartCard title="QR Scan Timeline" color="var(--teal)" delay={0.25}>
//             {scanTimeline.length > 0 ? (
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={scanTimeline} barSize={8}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,42,56,0.6)" vertical={false} />
//                   <XAxis dataKey="date" tick={{ fill: '#566070', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fill: '#566070', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={30} />
//                   <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(24,212,200,0.05)' }} />
//                   <Bar dataKey="scans" fill="var(--teal)" name="scans" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-48 flex items-center justify-center text-[var(--dim)] text-[13px]">No scan data yet — generate QR codes to start tracking</div>
//             )}
//           </ChartCard>

//           {/* 2-col row */}
//           <div className="grid gap-4 lg:grid-cols-2">
//             {/* Device breakdown */}
//             <ChartCard title="Device Breakdown" color="var(--gold)" delay={0.3}>
//               {deviceBreakdown.length > 0 ? (
//                 <div className="space-y-3">
//                   {deviceBreakdown.map(({ device, count, percent }: any, i: number) => (
//                     <div key={device} className="flex items-center gap-3">
//                       <div className="text-[var(--muted)]">{DEVICE_ICONS[device] || <Monitor size={13} />}</div>
//                       <span className="capitalize text-[12px] text-[var(--muted)] w-16 flex-shrink-0">{device}</span>
//                       <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${percent}%` }}
//                           transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
//                           className="h-full rounded-full"
//                           style={{ background: DEVICE_COLORS[device] || '#566070' }}
//                         />
//                       </div>
//                       <span className="text-[11px] text-[var(--dim)] w-10 text-right" style={{ fontFamily: 'var(--font-mono)' }}>{percent}%</span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="h-24 flex items-center justify-center text-[var(--dim)] text-[13px]">No device data yet</div>
//               )}
//             </ChartCard>

//             {/* Top listings */}
//             <ChartCard title="Top Performing Listings" color="var(--purple)" delay={0.35}>
//               {topListings.length > 0 ? (
//                 <div className="space-y-2.5">
//                   {topListings.slice(0, 5).map((l: any, i: number) => (
//                     <div key={l.id} className="flex items-center gap-3">
//                       <span
//                         className="text-[10px] font-bold text-[var(--dim)] w-4 flex-shrink-0"
//                         style={{ fontFamily: 'var(--font-mono)' }}
//                       >
//                         #{i + 1}
//                       </span>
//                       <div className="flex-1 min-w-0">
//                         <div className="text-[12px] font-semibold text-[var(--white)] truncate">{l.title}</div>
//                         <div className="text-[10px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>{l.city}</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-[12px] font-bold text-[var(--teal)]">{l.scan_count}</div>
//                         <div className="text-[10px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>scans</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="h-24 flex items-center justify-center text-[var(--dim)] text-[13px]">No listings data yet</div>
//               )}
//             </ChartCard>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Eye, QrCode, Home, Smartphone, Monitor, Tablet } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

const DAYS_OPTIONS = [7, 14, 30, 90];
const TEAL   = 'var(--teal)';
const GOLD   = 'var(--gold)';
const PURPLE = 'var(--purple)';
const GREEN  = 'var(--green)';

function StatCard({ label, value, sub, icon: Icon, color, trend }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-2xl"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <Icon size={16} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold`} style={{ color: trend > 0 ? 'var(--green)' : trend < 0 ? 'var(--red)' : 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
            {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mb-1 text-2xl font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{value}</div>
      <div className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--white)' }}>{label}</div>
      {sub && <div className="text-[10px]" style={{ color: 'var(--dim)' }}>{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 text-xs rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <div className="mb-1" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="font-bold" style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/analytics?days=${days}`)
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } } };

  const scanStats = data?.scan_stats || {};
  const STATS = [
    { label: 'Total Scans',    value: scanStats.total_scans    || 0, icon: QrCode, color: 'var(--teal)',   trend: 32, sub: `vs last ${days}d` },
    { label: 'Unique Visitors', value: scanStats.unique_scans  || 0, icon: Eye,    color: 'var(--purple)', trend: 18, sub: 'Unique visitors' },
    { label: 'Active Listings', value: scanStats.active_listings || 0, icon: Home, color: 'var(--gold)',   trend: null },
    { label: 'Conversion Rate', value: `${(scanStats.conversion_rate || 0).toFixed(1)}%`, icon: TrendingUp, color: 'var(--green)', trend: -2, sub: 'Scan → lead' },
  ];

  const PIE_COLORS = ['var(--teal)', 'var(--gold)', 'var(--purple)', 'var(--green)', 'var(--red)', 'var(--blue)'];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-1.5" style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>Insights</div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Analytics</h1>
        </div>
        <div className="flex gap-2">
          {DAYS_OPTIONS.map(d => (
            <button key={d} onClick={() => setDays(d)}
              className="px-4 py-2 text-xs font-bold transition-all rounded-xl"
              style={{
                fontFamily: 'var(--font-mono)',
                background: days === d ? 'var(--green)' : 'var(--card)',
                color:      days === d ? 'var(--bg)'    : 'var(--dim)',
                border:     `1px solid ${days === d ? 'transparent' : 'var(--border)'}`,
              }}>
              {d}D
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Stats grid ────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      {isLoading && (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map(i => <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} />)}
        </div>
      )}

      {!isLoading && (
        <>
          {/* ── Charts row ────────────────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-2">

            {/* Scans over time */}
            <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>QR Scans / Day</div>
              <div className="mb-4 text-sm font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Scan Activity</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data?.daily_scans || Array.from({ length: days }, (_, i) => ({ date: `D${i + 1}`, scans: Math.round(Math.random() * 40 + 10) }))}>
                  <XAxis dataKey="date" tick={{ fill: 'var(--dim)', fontSize: 9, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: 'var(--dim)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="scans" name="Scans" fill="var(--teal)" radius={[3, 3, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Device breakdown */}
            <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Device Breakdown</div>
              <div className="mb-4 text-sm font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>By Device Type</div>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie
                      data={data?.device_breakdown || [{ name: 'mobile', value: 62 }, { name: 'desktop', value: 26 }, { name: 'tablet', value: 12 }]}
                      cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                      dataKey="value" nameKey="name" paddingAngle={3}
                    >
                      {(data?.device_breakdown || [{ name: 'mobile', value: 62 }, { name: 'desktop', value: 26 }, { name: 'tablet', value: 12 }]).map((_: any, index: number) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5">
                  {(data?.device_breakdown || [{ name: 'mobile', value: 62 }, { name: 'desktop', value: 26 }, { name: 'tablet', value: 12 }]).map((d: any, i: number) => (
                    <div key={d.name} className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="flex-1 text-xs capitalize" style={{ color: 'var(--muted)' }}>{d.name}</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-mono)' }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Top listings table ─────────────────────────────────────────── */}
          {(data?.top_listings?.length > 0) && (
            <motion.div variants={fadeUp} className="overflow-hidden rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="text-[8px] font-black uppercase tracking-widest mb-0.5" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Performance</div>
                <div className="text-sm font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Top Listings by Views</div>
              </div>
              <div>
                {data.top_listings.map((l: any, i: number) => (
                  <div key={l.id} className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: i < data.top_listings.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="w-6 text-xs font-black text-center" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--white)' }}>{l.title}</div>
                      <div className="text-[10px]" style={{ color: 'var(--dim)' }}>{l.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>{l.view_count?.toLocaleString()}</div>
                      <div className="text-[9px]" style={{ color: 'var(--dim)' }}>views</div>
                    </div>
                    {/* Mini bar */}
                    <div className="hidden w-20 sm:block">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, ((l.view_count || 0) / (data.top_listings[0]?.view_count || 1)) * 100)}%`, background: 'var(--teal)' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
