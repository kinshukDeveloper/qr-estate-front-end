'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  school:      { emoji: '🏫', label: 'Schools',       color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'    },
  hospital:    { emoji: '🏥', label: 'Hospitals',      color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20'     },
  metro:       { emoji: '🚇', label: 'Transit',        color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'    },
  mall:        { emoji: '🛍️', label: 'Malls',          color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20'  },
  park:        { emoji: '🌳', label: 'Parks',          color: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20'   },
  bank:        { emoji: '🏦', label: 'Banks',          color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  restaurant:  { emoji: '🍽️', label: 'Restaurants',   color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20'  },
  supermarket: { emoji: '🛒', label: 'Supermarkets',   color: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20'    },
  gym:         { emoji: '💪', label: 'Gyms',           color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20'    },
  pharmacy:    { emoji: '💊', label: 'Pharmacies',     color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20'    },
};

function distLabel(m?: number) {
  if (!m) return '';
  if (m < 1000) return `${m}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function ScoreRing({ score }: { score: number }) {
  const r = 28, circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#00D4C8' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg width="80" height="80" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circ} ${circ}`} style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-black text-white leading-none">{score}</div>
        <div className="text-[8px] text-white/30 font-bold">/ 100</div>
      </div>
    </div>
  );
}

interface NeighbourhoodPanelProps {
  listingId: string;
  className?: string;
}

export function NeighbourhoodPanel({ listingId, className = '' }: NeighbourhoodPanelProps) {
  const [pois, setPois]     = useState<Record<string, any[]>>({});
  const [score, setScore]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [source, setSource] = useState('');

  useEffect(() => {
    api.get(`/v3/listings/${listingId}/neighbourhood`)
      .then((r) => {
        setPois(r.data.data.pois);
        setScore(r.data.data.livability_score);
        setSource(r.data.data.source || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [listingId]);

  const categories = Object.keys(pois);

  if (loading) {
    return (
      <div className={`bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 bg-white/[0.04] rounded-full w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className={`bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5 text-center ${className}`}>
        <div className="text-2xl mb-2">📍</div>
        <div className="text-sm text-white/40">Neighbourhood data not available</div>
        <div className="text-[10px] text-white/20 mt-1">Add coordinates to the listing to enable this feature</div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden ${className}`}>
      {/* Header with livability score */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05]">
        <div className="flex-1">
          <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-1">F11 · Neighbourhood</div>
          <div className="text-sm font-bold text-white">Nearby Amenities</div>
          <div className="text-[10px] text-white/30 mt-0.5">{categories.length} categories · {Object.values(pois).flat().length} places within 2km</div>
        </div>
        {score !== null && (
          <div className="text-center">
            <ScoreRing score={score} />
            <div className="text-[9px] font-bold text-white/30 mt-1 uppercase tracking-wider">Livability</div>
          </div>
        )}
      </div>

      {/* Category grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat] || { emoji: '📍', label: cat, color: 'text-white/60', bg: 'bg-white/5', border: 'border-white/10' };
          const items = pois[cat];
          const closest = items[0];
          const isOpen = expanded === cat;
          return (
            <div key={cat}>
              <button
                onClick={() => setExpanded(isOpen ? null : cat)}
                className={`w-full text-left p-3 rounded-xl border transition-all
                  ${isOpen ? `${meta.bg} ${meta.border}` : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base">{meta.emoji}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.border} ${meta.color}`}>
                    {items.length}
                  </span>
                </div>
                <div className={`text-xs font-bold ${isOpen ? meta.color : 'text-white/70'}`}>{meta.label}</div>
                {closest && (
                  <div className="text-[10px] text-white/30 mt-0.5 truncate">{closest.name}</div>
                )}
                {closest?.distance_m && (
                  <div className={`text-[10px] font-bold mt-0.5 ${meta.color}`}>{distLabel(closest.distance_m)} away</div>
                )}
              </button>

              {/* Expanded list */}
              {isOpen && (
                <div className={`mt-1 rounded-xl border ${meta.border} bg-[#0A0D12] overflow-hidden`}>
                  {items.map((poi, i) => (
                    <div key={poi.id || i} className={`flex items-center gap-3 px-3 py-2.5 ${i < items.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{poi.name}</div>
                        {poi.address && <div className="text-[10px] text-white/30 truncate">{poi.address}</div>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {poi.distance_m && <div className={`text-[10px] font-bold ${meta.color}`}>{distLabel(poi.distance_m)}</div>}
                        {poi.rating && <div className="text-[9px] text-amber-400">⭐ {poi.rating}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {source === 'cache_no_key' && (
        <div className="px-5 pb-3 text-[10px] text-white/20">
          💡 Set <code className="text-cyan-400">GOOGLE_PLACES_API_KEY</code> for live data
        </div>
      )}
    </div>
  );
}
