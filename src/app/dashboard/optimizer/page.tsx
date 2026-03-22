'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Wand2, CheckCircle2, AlertCircle, Loader2, RefreshCw, Copy } from 'lucide-react';
import api from '@/lib/api';

interface Listing { id:string; title:string; price:number; city:string; status:string }

const TOOL_COLOR: Record<string,string> = { price:'#00D4C8', title:'#A78BFA', amenities:'#2ECC8A', conversion:'#FFB830' };

function LoadBtn({ onClick, loading, color, children }: any) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 border transition-colors disabled:opacity-40"
      style={{ borderColor: color+'40', color, background: loading ? color+'10' : 'transparent' }}>
      {loading ? <Loader2 size={12} className="animate-spin"/> : null}
      {children}
    </button>
  );
}

function Section({ title, color, children }: any) {
  return (
    <div className="bg-[#0D1821] border border-[#1A2D40] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#1A2D40] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function OptimizerPage() {
  const [listings,  setListings]  = useState<Listing[]>([]);
  const [selected,  setSelected]  = useState('');
  const [loadingL,  setLoadingL]  = useState(true);

  const [priceData,  setPriceData]  = useState<any>(null);
  const [titleData,  setTitleData]  = useState<any>(null);
  const [amenData,   setAmenData]   = useState<any>(null);
  const [convData,   setConvData]   = useState<any>(null);

  const [loading, setLoading]     = useState<Record<string,boolean>>({});
  const [copiedTitle, setCopied]  = useState('');

  useEffect(() => {
    api.get('/listings').then(r => {
      const ls = r.data.data.listings || [];
      setListings(ls);
      if (ls.length > 0) setSelected(ls[0].id);
    }).finally(() => setLoadingL(false));
  }, []);

  const run = async (tool: string, setter: any) => {
    if (!selected) return;
    setLoading(l => ({ ...l, [tool]: true }));
    setter(null);
    try {
      const r = await api.post(`/optimizer/${tool}/${selected}`);
      setter(r.data.data);
    } catch (e:any) {
      setter({ error: e?.response?.data?.message || 'Failed' });
    } finally {
      setLoading(l => ({ ...l, [tool]: false }));
    }
  };

  function fmtPrice(p:number) {
    if (!p) return '—';
    if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
    if (p >= 100000)   return `₹${(p/100000).toFixed(2)} L`;
    return `₹${p.toLocaleString('en-IN')}`;
  }

  const selectedListing = listings.find(l => l.id === selected);

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3"><TrendingUp size={22} className="text-[#FFB830]" /> AI Optimizer</h1>
        <p className="text-[#7A95AE] text-sm mt-1">Optimise any listing for maximum conversion — price, title, amenities, and more.</p>
      </div>

      {/* Listing selector */}
      <div className="bg-[#111C28] border border-[#1A2D40] px-5 py-4">
        <p className="text-[10px] font-mono text-[#4A6580] uppercase tracking-wide mb-2">Select listing to optimise</p>
        {loadingL ? <div className="text-sm text-[#4A6580] font-mono">Loading listings…</div> : (
          <select value={selected} onChange={e => { setSelected(e.target.value); setPriceData(null); setTitleData(null); setAmenData(null); setConvData(null); }}
            className="w-full bg-[#0D1821] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8]">
            {listings.map(l => <option key={l.id} value={l.id}>{l.title} — {l.city}</option>)}
          </select>
        )}
      </div>

      {/* ── Price Suggestion ── */}
      <Section title="Price Suggestion" color={TOOL_COLOR.price}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#4A6580]">Compare your price against similar active + sold listings in the same city.</p>
          <LoadBtn onClick={() => run('price', setPriceData)} loading={loading.price} color={TOOL_COLOR.price}>
            Analyse Price
          </LoadBtn>
        </div>
        {priceData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{priceData.error}</p>}
        {priceData && !priceData.error && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[['Min',priceData.suggested_min,'#4A6580'],['Mid ★',priceData.suggested_mid,'#00D4C8'],['Max',priceData.suggested_max,'#2ECC8A']].map(([l,v,c]) => (
                <div key={l as string} className="bg-[#060C12] border border-[#1A2D40] p-3 text-center">
                  <div className="text-[9px] font-mono text-[#4A6580] uppercase mb-1">{l}</div>
                  <div className="font-mono font-bold text-sm" style={{color:c as string}}>{fmtPrice(v as number)}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wide text-[#4A6580]">vs Market:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 font-mono ${priceData.price_vs_market==='fair' ? 'bg-[rgba(46,204,138,0.1)] text-[#2ECC8A]' : priceData.price_vs_market==='above' ? 'bg-[rgba(255,77,106,0.1)] text-[#FF4D6A]' : 'bg-[rgba(0,212,200,0.1)] text-[#00D4C8]'}`}>
                {priceData.price_vs_market?.toUpperCase()} {priceData.adjustment_pct !== 0 && `(${priceData.adjustment_pct > 0 ? '+' : ''}${priceData.adjustment_pct}%)`}
              </span>
              <span className="text-[10px] font-mono text-[#4A6580]">Confidence: {priceData.confidence}</span>
              <span className="text-[10px] font-mono text-[#4A6580]">{priceData.comps_count} comparables</span>
              <span className="text-[10px] font-mono text-[#4A6580]">Source: {priceData.source}</span>
            </div>
            <p className="text-xs text-[#7A95AE] bg-[#060C12] p-3 leading-relaxed">{priceData.reasoning}</p>
          </div>
        )}
      </Section>

      {/* ── Title Optimizer ── */}
      <Section title="Title Optimizer" color={TOOL_COLOR.title}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#4A6580]">Get 3 SEO-optimised title variants with keyword analysis.</p>
          <LoadBtn onClick={() => run('title', setTitleData)} loading={loading.title} color={TOOL_COLOR.title}>
            Optimise Title
          </LoadBtn>
        </div>
        {titleData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{titleData.error}</p>}
        {titleData && !titleData.error && (
          <div className="space-y-3">
            {titleData.current_issues?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {titleData.current_issues.map((i:string) => <span key={i} className="text-[9px] font-mono bg-[rgba(255,77,106,0.08)] text-[#FF4D6A] border border-[rgba(255,77,106,0.2)] px-2 py-0.5">{i}</span>)}
              </div>
            )}
            {titleData.variants?.map((v:any, i:number) => (
              <div key={i} className="bg-[#060C12] border border-[#1A2D40] p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#A78BFA] font-bold">#{i+1}</span>
                    <span className="font-mono text-[9px] text-[#4A6580]">Score: {v.score}/10</span>
                    <span className="text-[9px] font-mono text-[#4A6580]">Source: {titleData.source}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { navigator.clipboard.writeText(v.title); setCopied(v.title); setTimeout(()=>setCopied(''),1600); }}
                      className="flex items-center gap-1 text-[10px] font-mono text-[#4A6580] hover:text-[#A78BFA]">
                      {copiedTitle === v.title ? <Check size={10}/> : <Copy size={10}/>} Copy
                    </button>
                  </div>
                </div>
                <p className="text-sm text-white font-medium mb-2">{v.title}</p>
                {v.improvements?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {v.improvements.map((imp:string) => <span key={imp} className="text-[9px] font-mono bg-[rgba(46,204,138,0.08)] text-[#2ECC8A] border border-[rgba(46,204,138,0.2)] px-1.5 py-0.5">{imp}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Amenity Gap ── */}
      <Section title="Amenity Gap Analysis" color={TOOL_COLOR.amenities}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#4A6580]">See which amenities top-performing listings in your market have that yours is missing.</p>
          <LoadBtn onClick={() => run('amenities', setAmenData)} loading={loading.amenities} color={TOOL_COLOR.amenities}>
            Analyse Amenities
          </LoadBtn>
        </div>
        {amenData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{amenData.error}</p>}
        {amenData && !amenData.error && (
          <div className="space-y-3">
            <div className="flex gap-4 text-xs font-mono text-[#4A6580]">
              <span>You have: <strong className="text-white">{amenData.current_count}</strong> amenities</span>
              <span>Comparables analysed: <strong className="text-white">{amenData.comparables_analyzed}</strong></span>
            </div>
            {amenData.missing_amenities?.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-[#FF4D6A] uppercase tracking-wide mb-2">Missing from your listing</p>
                <div className="space-y-1.5">
                  {amenData.missing_amenities.map((m:any) => (
                    <div key={m.amenity} className="flex items-center gap-3 bg-[#060C12] px-3 py-2">
                      <span className="text-sm text-white w-28 flex-shrink-0">{m.amenity}</span>
                      <div className="flex-1 h-1.5 bg-[#1A2D40] overflow-hidden"><div className="h-full bg-[#2ECC8A]" style={{width:`${m.prevalence_pct}%`}}/></div>
                      <span className="text-[10px] font-mono text-[#2ECC8A] w-12 text-right">{m.prevalence_pct}%</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 ${m.impact==='high'?'bg-[rgba(255,77,106,0.1)] text-[#FF4D6A]':'bg-[rgba(255,184,48,0.1)] text-[#FFB830]'}`}>{m.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {amenData.unique_selling_amenities?.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-[#2ECC8A] uppercase tracking-wide mb-1">Your unique selling amenities</p>
                <div className="flex flex-wrap gap-1">{amenData.unique_selling_amenities.map((a:string) => <span key={a} className="text-[10px] font-mono bg-[rgba(46,204,138,0.08)] text-[#2ECC8A] border border-[rgba(46,204,138,0.2)] px-2 py-0.5">{a}</span>)}</div>
              </div>
            )}
            <p className="text-xs text-[#7A95AE] bg-[#060C12] p-3">{amenData.recommendation}</p>
          </div>
        )}
      </Section>

      {/* ── Conversion Score ── */}
      <Section title="Conversion Predictor" color={TOOL_COLOR.conversion}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#4A6580]">Score your listing's ability to convert scans into enquiries.</p>
          <LoadBtn onClick={() => run('conversion', setConvData)} loading={loading.conversion} color={TOOL_COLOR.conversion}>
            Predict Conversion
          </LoadBtn>
        </div>
        {convData?.error && <p className="text-xs text-[#FF4D6A] font-mono">{convData.error}</p>}
        {convData && !convData.error && (
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-mono font-black text-4xl" style={{color:convData.grade==='A'?'#2ECC8A':convData.grade==='B'?'#00D4C8':convData.grade==='C'?'#FFB830':'#FF4D6A'}}>
                  {convData.grade}
                </div>
                <div className="text-[10px] font-mono text-[#4A6580] mt-0.5">Grade</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-black text-4xl text-[#FFB830]">{convData.conversion_score}</div>
                <div className="text-[10px] font-mono text-[#4A6580] mt-0.5">/ 100 pts</div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex gap-4 text-xs font-mono text-[#4A6580]">
                  <span>{convData.stats?.qr_scans} QR scans</span>
                  <span>{convData.stats?.leads_generated} leads</span>
                  <span>Rate: {convData.stats?.scan_to_lead_rate}</span>
                </div>
              </div>
            </div>

            {convData.factors_to_improve?.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-[#FFB830] uppercase tracking-wide mb-2">Top improvements (by impact)</p>
                <div className="space-y-2">
                  {convData.factors_to_improve.map((f:any) => (
                    <div key={f.factor} className="flex items-start gap-3 bg-[#060C12] p-3">
                      <div className="w-20 flex-shrink-0">
                        <div className="text-[9px] font-mono text-[#4A6580] uppercase">{f.factor}</div>
                        <div className="text-[10px] font-mono text-[#FFB830] font-bold">+{f.pts_available} pts</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-[#4A6580]">{f.current} → {f.target}</div>
                        <div className="text-xs text-[#7A95AE] mt-0.5">{f.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
