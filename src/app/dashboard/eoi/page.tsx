'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenLine, Check, X, Eye, Download, Loader2,
  User, Phone, Mail, IndianRupee, MessageSquare,
  Clock, CheckCircle2, XCircle, Calendar, Building2,
} from 'lucide-react';
import api from '@/lib/api';
import { eoiAPI } from '@/lib/features';

// ── Types ──────────────────────────────────────────────────────────────────────
interface EOI {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_city: string;
  listing_price: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string;
  offer_price?: number;
  message?: string;
  signature_url?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
}

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:      { label:'Pending',      color:'var(--gold)',   bg:'rgba(232,184,75,0.08)',  border:'rgba(232,184,75,0.25)',  icon:Clock        },
  expired: { label:'Expired', color:'var(--blue)',   bg:'rgba(72,152,248,0.08)',  border:'rgba(72,152,248,0.25)',  icon:Eye          },
  accepted:     { label:'Accepted',     color:'var(--green)',  bg:'rgba(40,216,144,0.08)',  border:'rgba(40,216,144,0.25)',  icon:CheckCircle2 },
  rejected:     { label:'Rejected',     color:'var(--red)',    bg:'rgba(240,64,96,0.08)',   border:'rgba(240,64,96,0.25)',   icon:XCircle      },
};

function fmt(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EOI['status'] }) {
  const c = STATUS_CFG[status];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 text-[8px] font-black tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border"
      style={{ color:c.color, background:c.bg, borderColor:c.border, fontFamily:'var(--font-mono)' }}>
      <Icon size={9} />{c.label}
    </span>
  );
}

// ── EOI Detail sheet ───────────────────────────────────────────────────────────
function EOISheet({ eoi, onClose, onStatusChange }: {
  eoi: EOI;
  onClose: () => void;
  onStatusChange: (id: string, status: EOI['status']) => void;
}) {
  const [updating, setUpdating] = useState(false);

  async function update(status: EOI['status']) {
    if (status === "pending") return; // 🚫 block invalid state
    setUpdating(true);
    try {
      await eoiAPI.updateStatus(eoi.id, status);
      onStatusChange(eoi.id, status);
    } catch { /* silent */ }
    finally { setUpdating(false); }
  }

  const diff = eoi.offer_price && eoi.listing_price
    ? ((eoi.offer_price - eoi.listing_price) / eoi.listing_price * 100).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y:60, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:60, opacity:0 }}
        transition={{ type:'spring', stiffness:320, damping:32 }}
        className="w-full sm:max-w-xl bg-[var(--bg2)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Top accent */}
        <div className="h-0.5" style={{ background:'linear-gradient(90deg,transparent,var(--teal),var(--gold),transparent)' }} />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--teal)] mb-1" style={{ fontFamily:'var(--font-mono)' }}>
                Expression of Interest
              </div>
              <h2 className="text-[16px] font-extrabold text-[var(--white)] leading-snug" style={{ fontFamily:'var(--font-syne)' }}>
                {eoi.buyer_name}
              </h2>
              <div className="text-[11px] text-[var(--dim)] mt-0.5" style={{ fontFamily:'var(--font-mono)' }}>
                {fmtDate(eoi.created_at)}
              </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-2">
              <StatusBadge status={eoi.status} />
              <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--white)] hover:bg-[var(--card)] transition-all">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Listing */}
          <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[rgba(24,212,200,0.1)] border border-[rgba(24,212,200,0.2)] flex items-center justify-center flex-shrink-0">
              <Building2 size={16} className="text-[var(--teal)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[var(--white)] truncate">{eoi.listing_title}</div>
              <div className="text-[10px] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>{eoi.listing_city} · Listed at {fmt(eoi.listing_price)}</div>
            </div>
          </div>

          {/* Buyer details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon:User,          label:'Name',    value:eoi.buyer_name,  color:'var(--teal)'   },
              { icon:Phone,         label:'Phone',   value:eoi.buyer_phone, color:'var(--green)'  },
              { icon:Mail,          label:'Email',   value:eoi.buyer_email, color:'var(--blue)'   },
              { icon:Calendar,      label:'Date',    value:new Date(eoi.created_at).toLocaleDateString('en-IN'), color:'var(--muted)' },
            ].filter(d => d.value).map(({ icon:Icon, label, value, color }) => (
              <div key={label} className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} style={{ color }} />
                  <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>{label}</span>
                </div>
                <div className="text-[13px] font-semibold text-[var(--white)] truncate">{value}</div>
              </div>
            ))}
          </div>

          {/* Offer price */}
          {eoi.offer_price && (
            <div className="p-4 border rounded-xl" style={{ background:'rgba(232,184,75,0.05)', borderColor:'rgba(232,184,75,0.2)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)] mb-1" style={{ fontFamily:'var(--font-mono)' }}>Offer Price</div>
                  <div className="text-[22px] font-extrabold text-[var(--gold)]" style={{ fontFamily:'var(--font-syne)' }}>{fmt(eoi.offer_price)}</div>
                </div>
                {diff && (
                  <div className={`text-right`}>
                    <div className="text-[9px] text-[var(--dim)] mb-0.5" style={{ fontFamily:'var(--font-mono)' }}>vs Listed</div>
                    <div className={`text-[16px] font-bold ${parseFloat(diff) >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} style={{ fontFamily:'var(--font-mono)' }}>
                      {parseFloat(diff) >= 0 ? '+' : ''}{diff}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {eoi.message && (
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={12} className="text-[var(--purple)]" />
                <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>Buyer's Message</span>
              </div>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">{eoi.message}</p>
            </div>
          )}

          {/* Signature */}
          {eoi.signature_url && (
            <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <PenLine size={12} className="text-[var(--teal)]" />
                <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>Digital Signature</span>
              </div>
              <div className="bg-white rounded-xl p-3 flex items-center justify-center min-h-[80px]">
                <img src={eoi.signature_url} alt="Signature" className="max-h-[70px] object-contain" />
              </div>
            </div>
          )}

          {/* Action buttons */}
          {eoi.status === 'pending' || eoi.status === 'expired' ? (
            <div className="flex gap-2 pt-2">
              <motion.button
                onClick={() => update('accepted')} disabled={updating}
                whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-[var(--bg)] disabled:opacity-50"
                style={{ background:'linear-gradient(135deg,#28D890,#1AAD6E)', fontFamily:'var(--font-syne)' }}>
                {updating ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Accept
              </motion.button>
              {eoi.status === 'pending' && (
                <motion.button
                  onClick={() => update('expired')} disabled={updating}
                  whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold border border-[rgba(72,152,248,0.3)] text-[var(--blue)] hover:bg-[rgba(72,152,248,0.06)] transition-all disabled:opacity-50">
                  <Eye size={14}/> Acknowledge
                </motion.button>
              )}
              <motion.button
                onClick={() => update('rejected')} disabled={updating}
                whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-bold border border-[rgba(240,64,96,0.3)] text-[var(--red)] hover:bg-[rgba(240,64,96,0.06)] transition-all disabled:opacity-50">
                <X size={14}/> Reject
              </motion.button>
            </div>
          ) : (
            <div className="py-2 text-center">
              <StatusBadge status={eoi.status} />
              <p className="text-[11px] text-[var(--dim)] mt-2" style={{ fontFamily:'var(--font-mono)' }}>This EOI has been {eoi.status}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EOIPage() {
  const [eois,    setEois]    = useState<EOI[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<'all' | EOI['status']>('all');
  const [search,  setSearch]  = useState('');
  const [selected, setSelected] = useState<EOI | null>(null);

  useEffect(() => {
    api.get('/eoi').then(r => setEois(r.data.data.eois || []))
      .finally(() => setLoading(false));
  }, []);

  function handleStatusChange(id: string, status: EOI['status']) {
    setEois(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  const filtered = eois.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || e.buyer_name?.toLowerCase().includes(q) || e.buyer_phone?.includes(q) || e.listing_title?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = (Object.keys(STATUS_CFG) as EOI['status'][]).reduce((a, s) => {
    a[s] = eois.filter(e => e.status === s).length; return a;
  }, {} as Record<EOI['status'], number>);

  return (
    <div className="pb-8 space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }}
        className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily:'var(--font-syne)' }}>
            EOI — Expressions of Interest
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Digital offers from buyers — signed, tracked, managed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
            <span className="text-[10px] font-bold text-[var(--muted)]" style={{ fontFamily:'var(--font-mono)' }}>
              {counts.pending || 0} pending
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Status filter bar ── */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.06 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        <button onClick={() => setFilter('all')}
          className={`rounded-xl px-3 py-3 border transition-all ${filter==='all'?'border-[var(--border2)] bg-[var(--surface)]':'border-transparent hover:border-[var(--border)] hover:bg-[var(--surface)]'}`}>
          <div className="text-[17px] font-extrabold text-[var(--muted)]" style={{ fontFamily:'var(--font-syne)' }}>{eois.length}</div>
          <div className="text-[8px] uppercase tracking-[0.12em] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>All</div>
        </button>
        {(Object.entries(STATUS_CFG) as [EOI['status'], typeof STATUS_CFG[keyof typeof STATUS_CFG]][]).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`rounded-xl px-3 py-3 border text-left transition-all ${filter===key?'border-[var(--border2)] bg-[var(--surface)]':'border-transparent hover:border-[var(--border)] hover:bg-[var(--surface)]'}`}>
            <div className="text-[17px] font-extrabold" style={{ color:cfg.color, fontFamily:'var(--font-syne)' }}>{counts[key] || 0}</div>
            <div className="text-[8px] uppercase tracking-[0.1em] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>{cfg.label}</div>
          </button>
        ))}
      </motion.div>

      {/* ── Search ── */}
      <div className="relative">
        <PenLine size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by buyer name, phone, listing…"
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[var(--white)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--teal)] transition-colors"
        />
      </div>

      {/* ── Cards ── */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_,i) => (
            <div key={i} className="h-44 rounded-2xl bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
            <PenLine size={28} className="text-[var(--dim)]" />
          </div>
          <p className="text-[14px] font-bold text-[var(--white)] mb-1">No expressions of interest yet</p>
          <p className="text-[12px] text-[var(--muted)]">
            EOIs appear here when buyers tap "Express Interest" on your property pages
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((eoi, i) => {
            const cfg = STATUS_CFG[eoi.status];
            return (
              <motion.div
                key={eoi.id}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                onClick={() => setSelected(eoi)}
                className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 cursor-pointer hover:border-[var(--border2)] transition-all group overflow-hidden"
              >
                {/* Left bar */}
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full" style={{ background:cfg.color }} />

                <div className="pl-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-bold text-[var(--white)] truncate">{eoi.buyer_name}</span>
                        <StatusBadge status={eoi.status} />
                      </div>
                      <div className="text-[10px] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>{eoi.buyer_phone}</div>
                    </div>
                  </div>

                  {/* Listing */}
                  <div className="text-[11px] text-[var(--muted)] bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 mb-3 truncate">
                    🏠 {eoi.listing_title}
                  </div>

                  {/* Prices */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[9px] text-[var(--dim)] mb-0.5" style={{ fontFamily:'var(--font-mono)' }}>Listed</div>
                      <div className="text-[12px] font-bold text-[var(--muted)]">{fmt(eoi.listing_price)}</div>
                    </div>
                    {eoi.offer_price && (
                      <>
                        <div className="text-[var(--border2)]">→</div>
                        <div className="text-right">
                          <div className="text-[9px] text-[var(--dim)] mb-0.5" style={{ fontFamily:'var(--font-mono)' }}>Offered</div>
                          <div className="text-[12px] font-bold" style={{ color:cfg.color }}>{fmt(eoi.offer_price)}</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)]">
                    <span className="text-[9px] text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>
                      {new Date(eoi.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })}
                    </span>
                    <span className="text-[10px] text-[var(--teal)] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily:'var(--font-mono)' }}>
                      View details →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Detail Sheet ── */}
      <AnimatePresence>
        {selected && (
          <EOISheet eoi={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
        )}
      </AnimatePresence>
    </div>
  );
}
