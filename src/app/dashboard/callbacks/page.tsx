// 'use client';

// import { useState, useEffect } from 'react';
// import { Phone, PhoneCall, PhoneMissed, Clock, TrendingUp, RefreshCw } from 'lucide-react';
// import { callbackAPI, type CallbackStats, type CallbackRequest } from '@/lib/features';

// const STATUS_STYLE: Record<string, string> = {
//   pending:   'bg-[rgba(255,184,48,0.1)] text-[#FFB830] border-[rgba(255,184,48,0.3)]',
//   calling:   'bg-[rgba(96,165,250,0.1)] text-[#60A5FA] border-[rgba(96,165,250,0.3)]',
//   connected: 'bg-[rgba(46,204,138,0.1)] text-[#2ECC8A] border-[rgba(46,204,138,0.3)]',
//   missed:    'bg-[rgba(255,77,106,0.1)] text-[#FF4D6A] border-[rgba(255,77,106,0.3)]',
//   failed:    'bg-[rgba(74,101,128,0.1)] text-[#4A6580] border-[rgba(74,101,128,0.3)]',
// };
// const STATUS_LABEL: Record<string, string> = {
//   pending: 'Pending', calling: 'Calling', connected: 'Connected', missed: 'Missed', failed: 'Failed',
// };

// function StatCard({ icon: Icon, value, label, color }: { icon: any; value: number | string; label: string; color: string }) {
//   return (
//     <div className="bg-[#111C28] border border-[#1A2D40] p-5">
//       <Icon size={18} style={{ color }} className="mb-3" />
//       <div className="font-mono text-3xl font-black" style={{ color }}>{value}</div>
//       <div className="text-[10px] text-[#4A6580] uppercase tracking-widest mt-1">{label}</div>
//     </div>
//   );
// }

// function fmtTime(iso: string) {
//   const d = new Date(iso);
//   return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
// }

// function fmtSec(s: number | null) {
//   if (!s) return '—';
//   return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
// }

// export default function CallbacksPage() {
//   const [stats, setStats]     = useState<CallbackStats | null>(null);
//   const [items, setItems]     = useState<CallbackRequest[]>([]);
//   const [filter, setFilter]   = useState('');
//   const [loading, setLoading] = useState(true);
//   const [page,    setPage]    = useState(1);
//   const [total,   setTotal]   = useState(0);

//   async function load(p = 1, s = '') {
//     setLoading(true);
//     try {
//       const [statsRes, listRes] = await Promise.all([
//         callbackAPI.getStats(),
//         callbackAPI.getAll({ page: p, limit: 20, status: s || undefined }),
//       ]);
//       setStats(statsRes.data.data);
//       setItems(listRes.data.data.callbacks);
//       setTotal(listRes.data.data.pagination.total);
//     } finally { setLoading(false); }
//   }

//   useEffect(() => { load(1, filter); }, [filter]);

//   const slaColor = stats && stats.avg_response_seconds !== null
//     ? (stats.avg_response_seconds <= 60 ? '#2ECC8A' : stats.avg_response_seconds <= 120 ? '#FFB830' : '#FF4D6A')
//     : '#4A6580';

//   return (
//     <div className="max-w-4xl space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="flex items-center gap-3 text-2xl font-black text-white">
//             <Phone size={22} className="text-[#00D4C8]" /> Callback Requests
//           </h1>
//           <p className="text-[#7A95AE] text-sm mt-1">60-second buyer callbacks — track response performance</p>
//         </div>
//         <button onClick={() => load(page, filter)} className="flex items-center gap-1.5 text-xs font-mono text-[#4A6580] border border-[#1A2D40] px-3 py-2 hover:text-white hover:border-[#00D4C8] transition-colors">
//           <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
//         </button>
//       </div>

//       {/* Stats */}
//       {stats && (
//         <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//           <StatCard icon={PhoneCall}  value={stats.connected}  label="Connected"    color="#2ECC8A" />
//           <StatCard icon={PhoneMissed} value={stats.missed}    label="Missed"       color="#FF4D6A" />
//           <StatCard icon={Clock}       value={stats.pending}   label="Pending"      color="#FFB830" />
//           <StatCard icon={TrendingUp}  value={fmtSec(stats.avg_response_seconds)} label="Avg Response" color={slaColor} />
//         </div>
//       )}

//       {/* Missed today alert */}
//       {stats && stats.missed_today > 0 && (
//         <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(255,77,106,0.06)] border border-[rgba(255,77,106,0.2)] text-sm">
//           <PhoneMissed size={14} className="text-[#FF4D6A]" />
//           <span className="text-[#FF4D6A] font-bold">{stats.missed_today} missed callback{stats.missed_today > 1 ? 's' : ''} today.</span>
//           <span className="text-[#7A95AE]"> Call these buyers back to recover the leads.</span>
//         </div>
//       )}

//       {/* Filter tabs */}
//       <div className="flex gap-1 border-b border-[#1A2D40]">
//         {['','pending','calling','connected','missed','failed'].map(s => (
//           <button key={s} onClick={() => { setFilter(s); setPage(1); }}
//             className={`px-4 py-2 text-xs font-mono font-bold transition-colors ${filter === s ? 'text-[#00D4C8] border-b-2 border-[#00D4C8] -mb-px' : 'text-[#4A6580] hover:text-[#7A95AE]'}`}>
//             {s ? STATUS_LABEL[s] : 'All'}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="bg-[#111C28] border border-[#1A2D40] overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-32 gap-2 text-[#4A6580] text-sm">
//             <RefreshCw size={16} className="animate-spin" /> Loading…
//           </div>
//         ) : items.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-40 gap-2 text-[#4A6580]">
//             <Phone size={28} strokeWidth={1} />
//             <p className="text-sm">No callback requests yet</p>
//             <p className="font-mono text-xs">They appear here when buyers click "Get a callback" on a property page.</p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-[#0D1821]">
//                   <tr className="text-[9px] font-bold tracking-[2px] uppercase text-[#4A6580] font-mono">
//                     <th className="px-4 py-3 text-left">Buyer Phone</th>
//                     <th className="px-4 py-3 text-left">Property</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-left">Requested</th>
//                     <th className="px-4 py-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {items.map(item => (
//                     <tr key={item.id} className="border-t border-[#1A2D40] hover:bg-[#0D1821] transition-colors">
//                       <td className="px-4 py-3 font-mono font-bold text-white">+91 {item.buyer_phone}</td>
//                       <td className="px-4 py-3">
//                         <div className="text-white text-xs font-bold truncate max-w-[200px]">{item.title}</div>
//                         <div className="text-[#4A6580] text-[10px] font-mono">{item.city}</div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border ${STATUS_STYLE[item.status]}`}>
//                           {STATUS_LABEL[item.status]}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-[#4A6580] text-xs font-mono">{fmtTime(item.requested_at)}</td>
//                       <td className="px-4 py-3">
//                         {(item.status === 'missed' || item.status === 'pending') && (
//                           <a
//                             href={`tel:+91${item.buyer_phone}`}
//                             className="flex items-center gap-1 text-[10px] font-mono text-[#00D4C8] hover:underline"
//                           >
//                             <Phone size={11} /> Call back
//                           </a>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {total > 20 && (
//               <div className="flex items-center justify-between px-4 py-3 border-t border-[#1A2D40]">
//                 <span className="text-xs text-[#4A6580] font-mono">{total} total requests</span>
//                 <div className="flex gap-2">
//                   <button onClick={() => { setPage(p => p-1); load(page-1, filter); }} disabled={page === 1} className="text-xs font-mono text-[#4A6580] disabled:opacity-30 hover:text-white">← Prev</button>
//                   <span className="text-xs font-mono text-[#4A6580]">Page {page}</span>
//                   <button onClick={() => { setPage(p => p+1); load(page+1, filter); }} disabled={page * 20 >= total} className="text-xs font-mono text-[#4A6580] disabled:opacity-30 hover:text-white">Next →</button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneCall, PhoneMissed, Clock, RefreshCw, TrendingUp } from 'lucide-react';
import { callbackAPI, type CallbackStats, type CallbackRequest } from '@/lib/features';

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#E8B84B', bg: 'rgba(232,184,75,0.08)'  },
  calling:   { label: 'Calling',   color: '#4898F8', bg: 'rgba(72,152,248,0.08)'  },
  connected: { label: 'Connected', color: '#28D890', bg: 'rgba(40,216,144,0.08)'  },
  missed:    { label: 'Missed',    color: '#F04060', bg: 'rgba(240,64,96,0.08)'   },
  failed:    { label: 'Failed',    color: '#566070', bg: 'rgba(86,96,112,0.08)'   },
};

function getResponseTime(item: CallbackRequest): number | null {
  if (!item.connected_at) return null;

  const start = new Date(item.requested_at).getTime();
  const end = new Date(item.connected_at).getTime();

  return Math.floor((end - start) / 1000); // seconds
}

function fmtSec(s: number | null) {
  if (!s) return '—';
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function StatCard({ icon: Icon, value, label, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 group"
      whileHover={{ borderColor: `${color}40` } as any}
    >
      <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-xl" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
        <Icon size={17} style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="text-[2rem] font-extrabold leading-none mb-1" style={{ color, fontFamily: 'var(--font-syne)' }}>{value}</div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>{label}</div>
    </motion.div>
  );
}

export default function CallbacksPage() {
  const [stats,   setStats]   = useState<CallbackStats | null>(null);
  const [items,   setItems]   = useState<CallbackRequest[]>([]);
  const [filter,  setFilter]  = useState('');
  const [loading, setLoading] = useState(true);

  async function load(s = '') {
    setLoading(true);
    try {
      const [sRes, lRes] = await Promise.all([
        callbackAPI.getStats(),
        callbackAPI.getAll({ limit: 30, status: s || undefined }),
      ]);
      setStats(sRes.data.data);
      setItems(lRes.data.data.callbacks);
      console.log('Callback item sample:', lRes.data.data.callbacks[0]);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(filter); }, [filter]);

  const slaColor = stats?.avg_response_seconds != null
    ? stats.avg_response_seconds <= 60 ? '#28D890' : stats.avg_response_seconds <= 120 ? '#E8B84B' : '#F04060'
    : '#566070';

  const STATS = [
    { icon: PhoneCall,  value: stats?.total          ?? '—', label: 'Total Requests',    color: '#18D4C8' },
    { icon: Phone,      value: stats?.connected       ?? '—', label: 'Connected',         color: '#28D890' },
    { icon: PhoneMissed,value: stats?.missed          ?? '—', label: 'Missed',            color: '#F04060' },
    { icon: Clock,      value: fmtSec(stats?.avg_response_seconds ?? null), label: 'Avg Response', color: slaColor },
  ];

  return (
    <div className="pb-8 space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Callbacks</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">60-second buyer callbacks — track response performance</p>
        </div>
        <button onClick={() => load(filter)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[12px] text-[var(--muted)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all" style={{ fontFamily: 'var(--font-mono)' }}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={0.06 + i * 0.05} />)}
      </div>

      {/* SLA badge */}
      {stats?.avg_response_seconds != null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-3 px-4 py-3 border rounded-xl"
          style={{ background: `${slaColor}08`, borderColor: `${slaColor}25` }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: slaColor }} />
          <span className="text-[12px] font-bold" style={{ color: slaColor }}>
            {stats.avg_response_seconds <= 60 ? '✓ SLA Met — avg. under 60 seconds' :
             stats.avg_response_seconds <= 120 ? '⚠ Borderline — aim to reduce response time' :
             '✗ SLA Missed — buyers waiting too long'}
          </span>
          <span className="text-[11px] text-[var(--dim)] ml-auto" style={{ fontFamily: 'var(--font-mono)' }}>
            avg {fmtSec(stats.avg_response_seconds)}
          </span>
        </motion.div>
      )}

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {['', ...Object.keys(STATUS_CFG)].map(s => {
          const cfg = s ? STATUS_CFG[s] : null;
          return (
            <button key={s || 'all'} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full border text-[10px] font-black tracking-[0.1em] uppercase transition-all ${filter === s ? 'border-[rgba(24,212,200,0.3)] bg-[rgba(24,212,200,0.08)] text-[var(--teal)]' : 'border-[var(--border)] text-[var(--dim)] hover:text-[var(--muted)]'}`}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {s ? (cfg?.label || s) : 'All'}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }}
        className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <Phone size={28} className="mx-auto mb-3 text-[var(--dim)]" />
            <p className="text-[13px] text-[var(--muted)]">No callbacks yet — they appear when buyers tap "Get a callback" on your listing pages</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Buyer', 'Listing', 'Status', 'Response Time', 'Requested At'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const cfg = STATUS_CFG[item.status] || STATUS_CFG.failed;
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[var(--white)]">{item.buyer_phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] max-w-[160px] truncate">{item.listing_id || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase border" style={{ color: cfg.color, background: cfg.bg, borderColor: `${cfg.color}30`, fontFamily: 'var(--font-mono)' }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>  {fmtSec(getResponseTime(item))}</td>
                      <td className="px-4 py-3 text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>{fmtTime(item.requested_at)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
