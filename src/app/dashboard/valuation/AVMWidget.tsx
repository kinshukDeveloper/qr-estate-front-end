'use client';

import { useState, useEffect } from 'react';
import { Cpu, TrendingUp, TrendingDown, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

// ALSO MOVE THESE 👇 (important)
function fmt(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${Math.round(p).toLocaleString('en-IN')}`;
}

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-cyan-400' : score >= 40 ? 'bg-amber-400' : 'bg-red-400';
  const label = score >= 80 ? 'High' : score >= 60 ? 'Medium' : score >= 40 ? 'Low' : 'Very Low';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[10px] font-bold ${color.replace('bg-', 'text-')}`}>
        {label} ({score}%)
      </span>
    </div>
  );
}

export default function AVMWidget({ listingId, className = '' }: { listingId: string; className?: string }) {
  const [report, setReport]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ran, setRan]         = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      // Try existing first
      const existing = await api.get(`/v3/listings/${listingId}/avm`);
      if (existing.data.data.report) { setReport(existing.data.data.report); setRan(true); return; }
    } catch (_) {}
    try {
      const res = await api.post('/v3/avm/value', { listingId });
      setReport(res.data.data);
      setRan(true);
    } catch (_) {}
    finally { setLoading(false); }
  };

  if (!ran) {
    return (
      <div className={`bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center border w-9 h-9 rounded-xl bg-violet-500/10 border-violet-500/20">
            <Cpu size={16} className="text-violet-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">AI Valuation</div>
            <div className="text-[10px] text-white/30">Instant AVM powered by GPT-4o mini</div>
          </div>
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold transition-all border rounded-xl bg-violet-500/10 border-violet-500/25 text-violet-400 hover:bg-violet-500/20 disabled:opacity-50">
          {loading ? <><RefreshCw size={14} className="animate-spin" /> Analysing...</> : <><Cpu size={14} /> Get AI Valuation</>}
        </button>
      </div>
    );
  }

  if (!report) return null;

  const inputVsMid = report.input_price && report.estimated_mid
    ? (((report.input_price - report.estimated_mid) / report.estimated_mid) * 100).toFixed(1)
    : null;
  const priceStatus = inputVsMid
    ? parseFloat(inputVsMid) > 5 ? 'above'
    : parseFloat(inputVsMid) < -5 ? 'below' : 'fair'
    : null;

  return (
    <div className={`bg-[#0C0F14] border border-violet-500/20 rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-violet-500/[0.04] border-b border-violet-500/15">
        <Cpu size={15} className="flex-shrink-0 text-violet-400" />
        <div className="flex-1">
          <div className="text-sm font-bold text-white">AI Valuation Report</div>
          <div className="text-[10px] text-white/30">{report.comparables_used} comparables · {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
        <button onClick={run} disabled={loading} className="transition-colors text-violet-400/50 hover:text-violet-400">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Price range bar */}
        <div>
          <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-3">Estimated Value Range</div>
          <div className="flex items-end justify-between gap-2 mb-2">
            <div className="text-center">
              <div className="mb-1 text-xs font-bold text-white/50">Low</div>
              <div className="text-sm font-black text-white">{fmt(report.estimated_low)}</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-[9px] font-bold text-violet-400 mb-1 uppercase tracking-wider">Best Estimate</div>
              <div className="text-xl font-black text-violet-400">{fmt(report.estimated_mid)}</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-xs font-bold text-white/50">High</div>
              <div className="text-sm font-black text-white">{fmt(report.estimated_high)}</div>
            </div>
          </div>
          {/* Range gradient bar */}
          <div className="h-2 rounded-full bg-gradient-to-r from-white/10 via-violet-500/60 to-white/10" />
        </div>

        {/* Listed vs estimated */}
        {report.input_price && priceStatus && (
          <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm
            ${priceStatus === 'fair'  ? 'bg-green-500/[0.06] border-green-500/20 text-green-400'
            : priceStatus === 'above' ? 'bg-amber-500/[0.06] border-amber-500/20 text-amber-400'
            : 'bg-cyan-500/[0.06] border-cyan-500/20 text-cyan-400'}`}>
            {priceStatus === 'fair' ? <CheckCircle2 size={14} />
              : priceStatus === 'above' ? <TrendingUp size={14} />
              : <TrendingDown size={14} />}
            <span className="font-semibold">
              Listed at {fmt(report.input_price)} — {' '}
              {priceStatus === 'fair' ? 'fairly priced relative to market'
               : priceStatus === 'above' ? `${Math.abs(parseFloat(inputVsMid!))}% above mid estimate`
               : `${Math.abs(parseFloat(inputVsMid!))}% below mid estimate — good value`}
            </span>
          </div>
        )}

        {/* Confidence */}
        <div>
          <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">Confidence Score</div>
          <ConfidenceBar score={report.confidence_score} />
        </div>

        {/* AI Summary */}
        {report.ai_summary && (
          <div className="bg-violet-500/[0.04] border border-violet-500/15 rounded-xl p-3">
            <div className="text-[9px] font-bold text-violet-400/60 uppercase tracking-widest mb-2">AI Analysis</div>
            <p className="text-xs leading-relaxed text-white/60">{report.ai_summary}</p>
          </div>
        )}

        {/* Comparables preview */}
        {report.comparables?.length > 0 && (
          <div>
            <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-2">Comparable Listings</div>
            <div className="space-y-1.5">
              {(report.comparables || []).slice(0, 3).map((c: any, i: number) => (
                <div key={c.id || i} className="flex items-center gap-2 py-1.5 px-3 bg-white/[0.02] rounded-lg">
                  <div className="flex-1 text-xs truncate text-white/60">{c.title || c.locality}</div>
                  <div className="text-xs font-bold text-white">{fmt(c.price)}</div>
                  {c.price_per_sqft && <div className="text-[10px] text-white/30">₹{Math.round(c.price_per_sqft).toLocaleString('en-IN')}/sqft</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
