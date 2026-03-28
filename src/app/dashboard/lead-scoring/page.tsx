'use client';
import { useState, useEffect } from 'react';
import { Flame, Thermometer, Snowflake, RefreshCw, TrendingUp, Users, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

const GRADE_CONFIG = {
  HOT:  { icon: Flame,       color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/25',    label: 'Hot Lead',  ring: 'ring-red-500/20'  },
  WARM: { icon: Thermometer, color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  label: 'Warm Lead', ring: 'ring-amber-500/20' },
  COLD: { icon: Snowflake,   color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',   label: 'Cold Lead', ring: 'ring-cyan-500/20'  },
};

function ScoreBar({ score, grade }: { score: number; grade: string }) {
  const color = grade === 'HOT' ? 'bg-red-400' : grade === 'WARM' ? 'bg-amber-400' : 'bg-cyan-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-black text-white w-6 text-right">{score}</span>
    </div>
  );
}

export default function LeadScoringPage() {
  const [leads, setLeads]     = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [filter, setFilter]   = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [lRes, sRes] = await Promise.all([
        api.get('/v3/leads/scores', { params: { grade: filter === 'all' ? undefined : filter, limit: 50 } }),
        api.get('/v3/leads/scores/summary'),
      ]);
      setLeads(lRes.data.data.leads);
      setSummary(sRes.data.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const rescore = async () => {
    setScoring(true);
    try { await api.post('/v3/leads/score-all', {}, { headers: { 'x-cron-secret': '' } }); }
    catch (_) {}
    finally { setScoring(false); load(); }
  };

  useEffect(() => { load(); }, [filter]);

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[9px] font-black tracking-widest text-red-400/70 uppercase mb-1">F13 · ML Scoring</div>
          <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Smart Lead Scoring</h1>
          <p className="text-sm text-white/40 mt-1">AI scores every lead 0–100 based on behaviour signals.</p>
        </div>
        <button onClick={rescore} disabled={scoring}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/50 text-xs font-bold hover:text-white hover:border-white/20 transition-all disabled:opacity-40">
          <RefreshCw size={12} className={scoring ? 'animate-spin' : ''} />
          Re-score All
        </button>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'hot',     label: 'Hot',     icon: Flame,       color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20'   },
            { key: 'warm',    label: 'Warm',    icon: Thermometer, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { key: 'cold',    label: 'Cold',    icon: Snowflake,   color: 'text-cyan-400',  bg: 'bg-cyan-500/10',  border: 'border-cyan-500/20'  },
            { key: 'unscored',label: 'Unscored',icon: Users,       color: 'text-white/40',  bg: 'bg-white/5',      border: 'border-white/10'     },
          ].map(({ key, label, icon: Icon, color, bg, border }) => (
            <button key={key} onClick={() => setFilter(key === 'unscored' ? 'all' : key.toUpperCase())}
              className={`rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${bg} ${border}`}>
              <Icon size={16} className={`${color} mb-2`} />
              <div className={`text-2xl font-black font-['Syne',sans-serif] ${color}`}>{summary[key] || 0}</div>
              <div className="text-[10px] text-white/30 mt-1">{label} leads</div>
            </button>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[{ v: 'all', l: 'All' }, { v: 'HOT', l: '🔥 Hot' }, { v: 'WARM', l: '🌡 Warm' }, { v: 'COLD', l: '❄️ Cold' }].map(({ v, l }) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all
              ${filter === v ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-[#0C0F14] border-white/10 text-white/40 hover:text-white/60'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="space-y-2">{[1,2,3,4,5].map((i) => <div key={i} className="h-20 bg-[#0C0F14] rounded-2xl animate-pulse border border-white/[0.04]" />)}</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <Flame size={32} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm">No leads found. Scores are calculated automatically.</div>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => {
            const grade = lead.grade || 'COLD';
            const cfg = GRADE_CONFIG[grade as keyof typeof GRADE_CONFIG];
            const GIcon = cfg.icon;
            const breakdown = typeof lead.score_breakdown === 'string' ? JSON.parse(lead.score_breakdown || '{}') : lead.score_breakdown || {};
            return (
              <div key={lead.id} className={`bg-[#0C0F14] border rounded-2xl p-4 transition-all hover:border-opacity-50 ${cfg.border}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                    <GIcon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{lead.name || 'Unknown'}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color} uppercase tracking-wider`}>{grade}</span>
                      {lead.listing_title && (
                        <span className="text-[10px] text-white/25 truncate">{lead.listing_title}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/30 mb-2">{lead.phone} · {lead.source}</div>
                    <ScoreBar score={lead.score || 0} grade={grade} />
                    {/* Score breakdown */}
                    {Object.keys(breakdown).length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {Object.entries(breakdown).filter(([, v]) => (v as number) > 0).map(([k, v]) => (
                          <span key={k} className="text-[8px] text-white/30 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full">
                            {k.replace(/_/g, ' ')}: +{String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link href={`/dashboard/leads`} className="flex-shrink-0 text-white/20 hover:text-white/60 transition-colors">
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
