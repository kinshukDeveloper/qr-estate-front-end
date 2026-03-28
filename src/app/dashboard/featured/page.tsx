'use client';
import { useState, useEffect } from 'react';
import { Star, Zap, Crown, Building2, CheckCircle2, MessageSquare, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function fmt(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(0)}L`;
  return `₹${Math.round(p).toLocaleString('en-IN')}`;
}

const TIER_META = {
  basic:   { icon: Zap,       color: 'text-white/60', bg: 'bg-white/5',       border: 'border-white/15',     label: 'Basic',   priceLabel: '₹99/week'  },
  premium: { icon: Crown,     color: 'text-cyan-400', bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25',  label: 'Premium', priceLabel: '₹249/week' },
  top:     { icon: Building2, color: 'text-amber-400',bg: 'bg-amber-500/10',  border: 'border-amber-500/25', label: 'Top Spot',priceLabel: '₹499/week' },
};

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/15'} />
      ))}
    </div>
  );
}

// ── Featured Listings section ─────────────────────────────────────────────────
function FeaturedSection() {
  const { user } = useAuthStore();
  const [featured, setFeatured] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any>(null);
  const [boosting, setBoosting] = useState<string | null>(null);
  const [selectedListing, setSelected] = useState('');
  const [selectedTier, setTier] = useState('premium');

  useEffect(() => {
    api.get('/v3/featured').then((r) => setFeatured(r.data.data.listings)).catch(() => {});
    api.get('/v3/featured/tiers').then((r) => setTiers(r.data.data.tiers)).catch(() => {});
    api.get('/listings', { params: { status: 'active', limit: 20 } }).then((r) => setMyListings(r.data.data.listings || [])).catch(() => {});
  }, []);

  const boost = async () => {
    if (!selectedListing) return;
    setBoosting(selectedListing);
    try {
      await api.post(`/v3/listings/${selectedListing}/boost`, { tier: selectedTier });
      const res = await api.get('/v3/featured');
      setFeatured(res.data.data.listings);
      alert('Listing boosted successfully!');
    } catch (e: any) { alert(e?.response?.data?.message || 'Boost failed'); }
    finally { setBoosting(null); }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[9px] font-black tracking-widest text-amber-400/70 uppercase mb-1">F18 · Boost</div>
        <h2 className="text-xl font-black text-white font-['Syne',sans-serif]">Featured Listings</h2>
        <p className="text-sm text-white/40 mt-1">Boost your listings to the top of search results.</p>
      </div>

      {/* Tier cards */}
      {tiers && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(tiers).map(([key, tier]: [string, any]) => {
            const meta = TIER_META[key as keyof typeof TIER_META];
            const Icon = meta.icon;
            return (
              <button key={key} onClick={() => setTier(key)}
                className={`rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${selectedTier === key ? `${meta.bg} ${meta.border}` : 'bg-[#0C0F14] border-white/[0.06]'}`}>
                <Icon size={18} className={`${meta.color} mb-2`} />
                <div className={`text-sm font-bold ${meta.color}`}>{tier.label}</div>
                <div className="text-lg font-black text-white">{tier.price_display}</div>
                <div className="text-[10px] text-white/30 mt-1">{tier.duration_days} days · visible on homepage</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Boost form */}
      <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Select Listing</label>
          <select value={selectedListing} onChange={(e) => setSelected(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/40">
            <option value="">— Choose a listing —</option>
            {myListings.map((l) => <option key={l.id} value={l.id}>{l.title} · {fmt(l.price)}</option>)}
          </select>
        </div>
        <button onClick={boost} disabled={!selectedListing || !!boosting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap">
          {boosting ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Zap size={14} />}
          Boost Listing
        </button>
      </div>

      {/* Active featured */}
      {featured.length > 0 && (
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.05]"><div className="text-sm font-bold text-white">Currently Featured</div></div>
          {featured.map((l, i) => {
            const tier = TIER_META[(l.boost_tier as keyof typeof TIER_META)] || TIER_META.basic;
            const TIcon = tier.icon;
            return (
              <div key={l.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < featured.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                <TIcon size={14} className={tier.color} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{l.title}</div>
                  <div className="text-[10px] text-white/30">{l.agent_name} · {fmt(l.price)}</div>
                </div>
                <div className="text-right text-[10px] text-white/30">
                  <div className={`font-bold ${tier.color} uppercase text-[9px]`}>{l.boost_tier}</div>
                  <div>Ends {new Date(l.boost_ends).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Reviews section ───────────────────────────────────────────────────────────
function ReviewsSection() {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats]     = useState<any>(null);
  const [replyText, setReply] = useState<Record<string, string>>({});
  const [replyLoading, setRL] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/v3/agents/${user.id}/reviews`).then((r) => {
      setReviews(r.data.data.reviews);
      setStats(r.data.data.stats);
    }).catch(() => {});
  }, [user]);

  const submitReply = async (reviewId: string) => {
    if (!replyText[reviewId]?.trim()) return;
    setRL(reviewId);
    try {
      await api.patch(`/v3/reviews/${reviewId}/reply`, { reply: replyText[reviewId] });
      setReviews((p) => p.map((r) => r.id === reviewId ? { ...r, agent_reply: replyText[reviewId] } : r));
      setReply((p) => ({ ...p, [reviewId]: '' }));
    } catch (_) {}
    finally { setRL(null); }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[9px] font-black tracking-widest text-green-400/70 uppercase mb-1">F18 · Reviews</div>
        <h2 className="text-xl font-black text-white font-['Syne',sans-serif]">Agent Reviews</h2>
      </div>

      {stats && (
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-5xl font-black text-amber-400 font-['Syne',sans-serif]">{stats.avg_rating || '—'}</div>
              <Stars rating={Math.round(parseFloat(stats.avg_rating) || 0)} />
              <div className="text-[10px] text-white/30 mt-1">{stats.total} reviews</div>
            </div>
            <div className="flex-1 space-y-1.5">
              {[['5', stats.five_star], ['4', stats.four_star], ['3', stats.three_star], ['≤2', stats.low_star]].map(([label, count]) => {
                const pct = stats.total > 0 ? (parseInt(count) / parseInt(stats.total)) * 100 : 0;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-400 w-5 text-right">{label}★</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-white/30 w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-white/30">
          <Star size={28} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm">No reviews yet. They appear here once buyers leave feedback.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{r.reviewer_name}</span>
                    {r.is_verified && <CheckCircle2 size={12} className="text-green-400" />}
                  </div>
                  <Stars rating={r.rating} size={12} />
                </div>
                <span className="text-[10px] text-white/25">{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
              </div>
              {r.title && <div className="text-sm font-semibold text-white mb-1">{r.title}</div>}
              {r.body && <div className="text-sm text-white/50 leading-relaxed">{r.body}</div>}

              {/* Agent reply */}
              {r.agent_reply ? (
                <div className="mt-3 pl-3 border-l-2 border-cyan-500/30 bg-cyan-500/[0.04] rounded-r-xl p-3">
                  <div className="text-[9px] font-bold text-cyan-400/60 uppercase tracking-widest mb-1">Your Reply</div>
                  <div className="text-xs text-white/60">{r.agent_reply}</div>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input value={replyText[r.id] || ''} onChange={(e) => setReply((p) => ({ ...p, [r.id]: e.target.value }))}
                    placeholder="Reply to this review..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/40 transition-all placeholder:text-white/20" />
                  <button onClick={() => submitReply(r.id)} disabled={replyLoading === r.id || !replyText[r.id]?.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all disabled:opacity-40">
                    {replyLoading === r.id ? '...' : 'Reply'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeaturedReviewsPage() {
  const [tab, setTab] = useState<'featured' | 'reviews'>('featured');
  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="flex gap-2 mb-6">
        {[{ v: 'featured', l: '⭐ Featured Listings' }, { v: 'reviews', l: '💬 Reviews' }].map(({ v, l }) => (
          <button key={v} onClick={() => setTab(v as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all
              ${tab === v ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-[#0C0F14] border-white/10 text-white/40 hover:text-white/60'}`}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'featured' ? <FeaturedSection /> : <ReviewsSection />}
    </div>
  );
}
