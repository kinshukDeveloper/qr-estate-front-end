'use client';
import { useState, useEffect } from 'react';
import { Cpu, TrendingUp, TrendingDown, Minus, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import AVMWidget from './AVMWidget';

function fmt(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${Math.round(p).toLocaleString('en-IN')}`;
}

// ── AVM Dashboard page ────────────────────────────────────────────────────────
export default function ValuationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [form, setForm] = useState({ city: 'Mumbai', locality: '', propertyType: 'apartment', areaSqft: '', bedrooms: '', inputPrice: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [states] = useState(['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Chandigarh']);

  useEffect(() => {
    api.get('/v3/avm/history').then((r) => setReports(r.data.data.reports || [])).catch(() => {});
  }, []);

  const run = async () => {
    setLoading(true);
    try {
      const res = await api.post('/v3/avm/value', {
        city: form.city, locality: form.locality || undefined,
        propertyType: form.propertyType,
        areaSqft: form.areaSqft ? parseInt(form.areaSqft) : undefined,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
        inputPrice: form.inputPrice ? parseFloat(form.inputPrice) : undefined,
      });
      setResult(res.data.data);
      setReports((p) => [res.data.data, ...p.slice(0, 9)]);
    } catch (e: any) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl pb-16 mx-auto space-y-6">
      <div>
        <div className="text-[9px] font-black tracking-widest text-violet-400/70 uppercase mb-1">F12 · AI Valuation</div>
        <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Property Valuation (AVM)</h1>
        <p className="mt-1 text-sm text-white/40">AI-powered instant property valuations using comparable sales data.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        {/* Form */}
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold tracking-widest uppercase text-white/40">Property Details</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">City *</label>
              <select value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/40">
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Locality</label>
              <input value={form.locality} onChange={(e) => setForm((p) => ({ ...p, locality: e.target.value }))}
                placeholder="e.g. Andheri West"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Property Type *</label>
              <select value={form.propertyType} onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/40">
                {['apartment', 'villa', 'house', 'plot', 'commercial'].map((t) => <option key={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Area (sqft)</label>
              <input type="number" value={form.areaSqft} onChange={(e) => setForm((p) => ({ ...p, areaSqft: e.target.value }))}
                placeholder="e.g. 1200"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => setForm((p) => ({ ...p, bedrooms: e.target.value }))}
                placeholder="e.g. 3"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Listed Price (₹)</label>
              <input type="number" value={form.inputPrice} onChange={(e) => setForm((p) => ({ ...p, inputPrice: e.target.value }))}
                placeholder="e.g. 18000000"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20" />
            </div>
          </div>
          <button onClick={run} disabled={loading || !form.city || !form.propertyType}
            className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold text-white transition-all rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 active:scale-95">
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Analysing with AI...</> : <><Cpu size={14} /> Run AI Valuation</>}
          </button>
        </div>

        {/* Result */}
        <div>
          {result ? <AVMWidget listingId={result.listing_id || 'custom'} className="h-fit" /> : (
            <div className="bg-[#0C0F14] border border-dashed border-white/10 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center gap-3">
              <Cpu size={28} className="text-white/10" />
              <div className="text-sm text-white/25">Fill the form and run valuation</div>
              <div className="text-[10px] text-white/15">Uses GPT-4o mini + comparable sales</div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {reports.length > 0 && (
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <div className="text-sm font-bold text-white">Valuation History</div>
          </div>
          {reports.map((r, i) => (
            <div key={r.id || i} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-all ${i < reports.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 border rounded-lg bg-violet-500/10 border-violet-500/20">
                <Cpu size={13} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{r.listing_title || `${r.city}${r.locality ? ` · ${r.locality}` : ''}`}</div>
                <div className="text-[10px] text-white/30 capitalize">{r.property_type} · {r.comparables_used} comparables</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-violet-400">{fmt(r.estimated_mid)}</div>
                <div className="text-[10px] text-white/25">{r.confidence_score}% confidence</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
