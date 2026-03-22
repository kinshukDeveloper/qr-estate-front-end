'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneMissed, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { callbackAPI, type CallbackStats, type CallbackRequest } from '@/lib/features';

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-[rgba(255,184,48,0.1)] text-[#FFB830] border-[rgba(255,184,48,0.3)]',
  calling:   'bg-[rgba(96,165,250,0.1)] text-[#60A5FA] border-[rgba(96,165,250,0.3)]',
  connected: 'bg-[rgba(46,204,138,0.1)] text-[#2ECC8A] border-[rgba(46,204,138,0.3)]',
  missed:    'bg-[rgba(255,77,106,0.1)] text-[#FF4D6A] border-[rgba(255,77,106,0.3)]',
  failed:    'bg-[rgba(74,101,128,0.1)] text-[#4A6580] border-[rgba(74,101,128,0.3)]',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', calling: 'Calling', connected: 'Connected', missed: 'Missed', failed: 'Failed',
};

function StatCard({ icon: Icon, value, label, color }: { icon: any; value: number | string; label: string; color: string }) {
  return (
    <div className="bg-[#111C28] border border-[#1A2D40] p-5">
      <Icon size={18} style={{ color }} className="mb-3" />
      <div className="font-black text-3xl font-mono" style={{ color }}>{value}</div>
      <div className="text-[10px] text-[#4A6580] uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function fmtSec(s: number | null) {
  if (!s) return '—';
  return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
}

export default function CallbacksPage() {
  const [stats, setStats]     = useState<CallbackStats | null>(null);
  const [items, setItems]     = useState<CallbackRequest[]>([]);
  const [filter, setFilter]   = useState('');
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);

  async function load(p = 1, s = '') {
    setLoading(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        callbackAPI.getStats(),
        callbackAPI.getAll({ page: p, limit: 20, status: s || undefined }),
      ]);
      setStats(statsRes.data.data);
      setItems(listRes.data.data.callbacks);
      setTotal(listRes.data.data.pagination.total);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(1, filter); }, [filter]);

  const slaColor = stats && stats.avg_response_seconds !== null
    ? (stats.avg_response_seconds <= 60 ? '#2ECC8A' : stats.avg_response_seconds <= 120 ? '#FFB830' : '#FF4D6A')
    : '#4A6580';

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Phone size={22} className="text-[#00D4C8]" /> Callback Requests
          </h1>
          <p className="text-[#7A95AE] text-sm mt-1">60-second buyer callbacks — track response performance</p>
        </div>
        <button onClick={() => load(page, filter)} className="flex items-center gap-1.5 text-xs font-mono text-[#4A6580] border border-[#1A2D40] px-3 py-2 hover:text-white hover:border-[#00D4C8] transition-colors">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={PhoneCall}  value={stats.connected}  label="Connected"    color="#2ECC8A" />
          <StatCard icon={PhoneMissed} value={stats.missed}    label="Missed"       color="#FF4D6A" />
          <StatCard icon={Clock}       value={stats.pending}   label="Pending"      color="#FFB830" />
          <StatCard icon={TrendingUp}  value={fmtSec(stats.avg_response_seconds)} label="Avg Response" color={slaColor} />
        </div>
      )}

      {/* Missed today alert */}
      {stats && stats.missed_today > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(255,77,106,0.06)] border border-[rgba(255,77,106,0.2)] text-sm">
          <PhoneMissed size={14} className="text-[#FF4D6A]" />
          <span className="text-[#FF4D6A] font-bold">{stats.missed_today} missed callback{stats.missed_today > 1 ? 's' : ''} today.</span>
          <span className="text-[#7A95AE]"> Call these buyers back to recover the leads.</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-[#1A2D40]">
        {['','pending','calling','connected','missed','failed'].map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-2 text-xs font-mono font-bold transition-colors ${filter === s ? 'text-[#00D4C8] border-b-2 border-[#00D4C8] -mb-px' : 'text-[#4A6580] hover:text-[#7A95AE]'}`}>
            {s ? STATUS_LABEL[s] : 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111C28] border border-[#1A2D40] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32 gap-2 text-[#4A6580] text-sm">
            <RefreshCw size={16} className="animate-spin" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-[#4A6580]">
            <Phone size={28} strokeWidth={1} />
            <p className="text-sm">No callback requests yet</p>
            <p className="text-xs font-mono">They appear here when buyers click "Get a callback" on a property page.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0D1821]">
                  <tr className="text-[9px] font-bold tracking-[2px] uppercase text-[#4A6580] font-mono">
                    <th className="text-left px-4 py-3">Buyer Phone</th>
                    <th className="text-left px-4 py-3">Property</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Requested</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-t border-[#1A2D40] hover:bg-[#0D1821] transition-colors">
                      <td className="px-4 py-3 font-mono text-white font-bold">+91 {item.buyer_phone}</td>
                      <td className="px-4 py-3">
                        <div className="text-white text-xs font-bold truncate max-w-[200px]">{item.title}</div>
                        <div className="text-[#4A6580] text-[10px] font-mono">{item.city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 border ${STATUS_STYLE[item.status]}`}>
                          {STATUS_LABEL[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#4A6580] text-xs font-mono">{fmtTime(item.requested_at)}</td>
                      <td className="px-4 py-3">
                        {(item.status === 'missed' || item.status === 'pending') && (
                          <a
                            href={`tel:+91${item.buyer_phone}`}
                            className="flex items-center gap-1 text-[10px] font-mono text-[#00D4C8] hover:underline"
                          >
                            <Phone size={11} /> Call back
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 20 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#1A2D40]">
                <span className="text-xs text-[#4A6580] font-mono">{total} total requests</span>
                <div className="flex gap-2">
                  <button onClick={() => { setPage(p => p-1); load(page-1, filter); }} disabled={page === 1} className="text-xs font-mono text-[#4A6580] disabled:opacity-30 hover:text-white">← Prev</button>
                  <span className="text-xs font-mono text-[#4A6580]">Page {page}</span>
                  <button onClick={() => { setPage(p => p+1); load(page+1, filter); }} disabled={page * 20 >= total} className="text-xs font-mono text-[#4A6580] disabled:opacity-30 hover:text-white">Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
