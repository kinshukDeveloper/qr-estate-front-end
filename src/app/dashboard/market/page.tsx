'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart2, Layers, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

function fmt(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(0)}L`;
  return `₹${Math.round(p).toLocaleString('en-IN')}`;
}

// ── Inline bar chart (no recharts dep) ───────────────────────────────────────
function MiniTrendChart({ data, color = '#00D4C8' }: { data: { snapshot_date: string; avg_price_sqft: string }[]; color?: string }) {
  if (!data.length) return null;
  const vals = data.map((d) => parseFloat(d.avg_price_sqft));
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const W = 400, H = 80;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - ((v - min) / range) * (H - 8) - 4}`).join(' ');
  const first = vals[0], last = vals[vals.length - 1];
  const pctChange = (((last - first) / first) * 100).toFixed(1);
  const up = last >= first;
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,${H} ${pts} ${W},${H}`} fill="url(#chartGrad)" />
        <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {/* Last point dot */}
        {vals.length > 1 && (
          <circle cx={(vals.length - 1) / (vals.length - 1) * W} cy={H - ((last - min) / range) * (H - 8) - 4} r="4" fill={color} />
        )}
      </svg>
      <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {up ? '+' : ''}{pctChange}% over period
      </div>
    </div>
  );
}

export default function MarketPage() {
  const [cities, setCities]           = useState<string[]>([]);
  const [selectedCity, setCity]       = useState('Mumbai');
  const [propType, setPropType]       = useState('apartment');
  const [listType, setListType]       = useState('sale');
  const [days, setDays]               = useState(90);
  const [summary, setSummary]         = useState<any>(null);
  const [trend, setTrend]             = useState<any[]>([]);
  const [heatmap, setHeatmap]         = useState<any[]>([]);
  const [supplyDemand, setSD]         = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => { api.get('/v3/market/cities').then((r) => setCities(r.data.data.cities)).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/v3/market/city/${selectedCity}`),
      api.get('/v3/market/trend', { params: { city: selectedCity, propertyType: propType, listingType: listType, days } }),
      api.get('/v3/market/heatmap', { params: { city: selectedCity, propertyType: propType, listingType: listType } }),
      api.get('/v3/market/supply-demand', { params: { city: selectedCity } }),
    ]).then(([s, t, h, sd]) => {
      setSummary(s.data.data);
      setTrend(t.data.data.trend);
      setHeatmap(h.data.data.heatmap);
      setSD(sd.data.data.supply_demand);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [selectedCity, propType, listType, days]);

  const maxSqft = heatmap.length ? Math.max(...heatmap.map((h) => parseFloat(h.avg_price_sqft || 0))) : 1;

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[9px] font-black tracking-widest text-amber-400/70 uppercase mb-1">F10 · Intelligence</div>
          <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Market Intelligence</h1>
          <p className="text-sm text-white/40 mt-1">Price trends, locality heatmap, supply vs demand.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={selectedCity} onChange={(e) => setCity(e.target.value)}
          className="bg-[#0C0F14] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500/40">
          {(cities.length ? cities : ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Chandigarh']).map((c) => <option key={c}>{c}</option>)}
        </select>
        {['apartment', 'villa', 'house', 'commercial'].map((t) => (
          <button key={t} onClick={() => setPropType(t)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border capitalize transition-all
              ${propType === t ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-[#0C0F14] border-white/10 text-white/40 hover:text-white/60'}`}>
            {t}
          </button>
        ))}
        {['sale', 'rent'].map((t) => (
          <button key={t} onClick={() => setListType(t)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border capitalize transition-all
              ${listType === t ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400' : 'bg-[#0C0F14] border-white/10 text-white/40 hover:text-white/60'}`}>
            {t}
          </button>
        ))}
        {[30, 90, 180].map((d) => (
          <button key={d} onClick={() => setDays(d)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all
              ${days === d ? 'bg-violet-500/10 border-violet-500/25 text-violet-400' : 'bg-[#0C0F14] border-white/10 text-white/40 hover:text-white/60'}`}>
            {d}d
          </button>
        ))}
      </div>

      {loading && <div className="h-48 flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>}

      {!loading && summary && (
        <>
          {/* City KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Active Listings', val: summary.total_listings?.toLocaleString() || '—', icon: Layers },
              { label: 'Avg ₹/sqft', val: summary.avg_price_sqft ? `₹${summary.avg_price_sqft.toLocaleString('en-IN')}` : '—', icon: BarChart2 },
              { label: '90d Change', val: summary.price_change_90d != null ? `${summary.price_change_90d > 0 ? '+' : ''}${summary.price_change_90d}%` : '—',
                icon: summary.price_change_90d > 0 ? TrendingUp : TrendingDown,
                color: summary.price_change_90d > 0 ? 'text-green-400' : summary.price_change_90d < 0 ? 'text-red-400' : 'text-white/50' },
              { label: 'Top Locality', val: summary.top_locality || '—', icon: ArrowRight },
            ].map(({ label, val, icon: Icon, color }) => (
              <div key={label} className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-4">
                <Icon size={14} className={`mb-2 ${color || 'text-amber-400'}`} />
                <div className={`text-xl font-black font-['Syne',sans-serif] ${color || 'text-white'}`}>{val}</div>
                <div className="text-[10px] text-white/30 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Price trend chart */}
          <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-1">Price per sqft trend</div>
                <div className="text-sm font-bold text-white">{selectedCity} · {propType} · {listType}</div>
              </div>
            </div>
            {trend.length ? <MiniTrendChart data={trend} color="#E8B84B" /> : <div className="text-sm text-white/30 py-8 text-center">No trend data available</div>}
          </div>

          {/* Locality heatmap */}
          <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
            <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-1">Locality Heatmap</div>
            <div className="text-sm font-bold text-white mb-4">Price intensity by locality (₹/sqft)</div>
            {heatmap.length === 0 ? (
              <div className="text-sm text-white/30 py-6 text-center">No heatmap data</div>
            ) : (
              <div className="space-y-2">
                {heatmap.map((h) => {
                  const intensity = parseFloat(h.avg_price_sqft) / maxSqft;
                  const color = `rgba(232,184,75,${0.15 + intensity * 0.7})`;
                  return (
                    <div key={h.locality} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-white/60 truncate">{h.locality}</div>
                      <div className="flex-1 h-6 rounded-lg overflow-hidden bg-white/[0.03]">
                        <div className="h-full rounded-lg flex items-center px-2 transition-all" style={{ width: `${intensity * 100}%`, background: color, minWidth: 40 }}>
                          <span className="text-[10px] font-bold text-black/70">₹{Math.round(h.avg_price_sqft).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-white/30 w-12 text-right">{h.total_listings} listings</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Supply vs Demand */}
          <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
            <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-1">Supply vs Demand</div>
            <div className="text-sm font-bold text-white mb-4">Lead-to-listing ratio by locality (higher = more demand)</div>
            {supplyDemand.length === 0 ? (
              <div className="text-sm text-white/30 py-6 text-center">No data yet</div>
            ) : (
              <div className="space-y-2">
                {supplyDemand.slice(0, 8).map((sd, i) => {
                  const ratio = parseFloat(sd.demand_supply_ratio);
                  const hot = ratio > 1.5;
                  return (
                    <div key={`${sd.locality}-${sd.property_type}-${i}`} className="flex items-center gap-3">
                      <div className="w-32 text-[11px] text-white/60 truncate">{sd.locality}</div>
                      <div className="text-[9px] text-white/30 capitalize w-20">{sd.property_type}</div>
                      <div className="flex-1 h-5 rounded-lg overflow-hidden bg-white/[0.03]">
                        <div className={`h-full rounded-lg transition-all ${hot ? 'bg-green-500/40' : 'bg-white/10'}`}
                          style={{ width: `${Math.min(ratio / 3 * 100, 100)}%`, minWidth: 4 }} />
                      </div>
                      <div className={`text-[10px] font-bold w-10 text-right ${hot ? 'text-green-400' : 'text-white/40'}`}>
                        {ratio.toFixed(1)}x
                      </div>
                      {hot && <span className="text-[9px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full">HOT</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
