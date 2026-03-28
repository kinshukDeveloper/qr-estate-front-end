'use client';
import { useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertTriangle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const SEVERITY_META = {
  high:   { color: 'text-red-400',    bg: 'bg-red-500/10',   border: 'border-red-500/20',   icon: AlertTriangle },
  medium: { color: 'text-amber-400',  bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle   },
  low:    { color: 'text-cyan-400',   bg: 'bg-cyan-500/10',  border: 'border-cyan-500/20',  icon: CheckCircle2  },
};

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#22C55E' : score >= 65 ? '#00D4C8' : score >= 50 ? '#F59E0B' : '#EF4444';
  const r = 20, circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg width="56" height="56" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circ} ${circ}`} />
      </svg>
      <div className="absolute text-center">
        <div className="text-sm font-black text-white leading-none">{score}</div>
      </div>
    </div>
  );
}

export default function PhotoAdvisorPage() {
  const [listings, setListings]   = useState<any[]>([]);
  const [selected, setSelected]   = useState('');
  const [result, setResult]       = useState<any>(null);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    api.get('/listings', { params: { status: 'active', limit: 20 } })
      .then((r) => setListings(r.data.data.listings || [])).catch(() => {});
  }, []);

  const analyse = async (force = false) => {
    if (!selected) return;
    setLoading(true); setResult(null);
    try {
      const res = await api.post(`/v3/listings/${selected}/photos/analyse`, {}, { params: { force } });
      setResult(res.data.data);
    } catch (e: any) { alert(e?.response?.data?.message || 'Analysis failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-5">
      <div>
        <div className="text-[9px] font-black tracking-widest text-pink-400/70 uppercase mb-1">F14 · AI Vision</div>
        <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Photo Enhancement Advisor</h1>
        <p className="text-sm text-white/40 mt-1">GPT-4o Vision analyses every listing photo and gives specific improvement tips.</p>
      </div>

      <div className="flex gap-3">
        <select value={selected} onChange={(e) => { setSelected(e.target.value); setResult(null); }}
          className="flex-1 bg-[#0C0F14] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500/40">
          <option value="">— Select a listing to analyse —</option>
          {listings.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        <button onClick={() => analyse(false)} disabled={!selected || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-400 text-sm font-bold hover:bg-pink-500/20 transition-all disabled:opacity-40 whitespace-nowrap">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          Analyse Photos
        </button>
      </div>

      {loading && (
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-10 text-center">
          <Loader2 size={32} className="text-pink-400 mx-auto mb-3 animate-spin" />
          <div className="text-sm font-semibold text-white mb-1">Analysing with GPT-4o Vision...</div>
          <div className="text-[11px] text-white/30">Each photo is reviewed for quality, lighting, composition</div>
        </div>
      )}

      {result && !loading && (
        <>
          {/* Summary */}
          {result.summary && (
            <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <ScoreCircle score={result.summary.avg_score} />
                <div className="flex-1">
                  <div className="text-lg font-black text-white font-['Syne',sans-serif]">{result.summary.grade} Photo Quality</div>
                  <div className="text-sm text-white/40">{result.summary.photos_analysed} photos analysed · {result.summary.high_priority_issues} high-priority issues</div>
                </div>
                <button onClick={() => analyse(true)} className="text-white/30 hover:text-white/60 transition-colors p-1"><RefreshCw size={14} /></button>
              </div>
            </div>
          )}

          {/* Individual photo reports */}
          {result.reports?.map((report: any, i: number) => {
            const issues = typeof report.issues === 'string' ? JSON.parse(report.issues || '[]') : report.issues || [];
            return (
              <div key={report.id || i} className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-white/[0.05]">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04]">
                    <img src={report.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">Photo {i + 1}</div>
                    <div className="text-[10px] text-white/30 truncate">{report.image_url.split('/').pop()}</div>
                  </div>
                  <ScoreCircle score={report.overall_score || 0} />
                </div>

                <div className="p-4 space-y-3">
                  {/* AI feedback */}
                  {report.ai_feedback && (
                    <div className="text-xs text-white/60 leading-relaxed bg-white/[0.02] rounded-xl p-3 border border-white/[0.05]">
                      {report.ai_feedback}
                    </div>
                  )}

                  {/* Issues */}
                  {issues.length > 0 && (
                    <div className="space-y-2">
                      {issues.map((issue: any, j: number) => {
                        const meta = SEVERITY_META[issue.severity as keyof typeof SEVERITY_META] || SEVERITY_META.low;
                        const Icon = meta.icon;
                        return (
                          <div key={j} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${meta.bg} ${meta.border}`}>
                            <Icon size={13} className={`${meta.color} flex-shrink-0 mt-0.5`} />
                            <div>
                              <div className={`text-[11px] font-bold ${meta.color}`}>{issue.issue}</div>
                              <div className="text-[10px] text-white/50 mt-0.5">{issue.suggestion}</div>
                            </div>
                            <span className={`ml-auto text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.border} ${meta.color} flex-shrink-0`}>
                              {issue.severity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {issues.length === 0 && <div className="text-[11px] text-green-400 flex items-center gap-1.5"><CheckCircle2 size={12} /> No issues found — excellent photo!</div>}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
