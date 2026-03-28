'use client';

import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';

// ── CompareButton ──────────────────────────────────────────────────────────────
interface CompareButtonProps {
  listing: {
    id: string;
    title: string;
    price: number;
    city: string;
    property_type: string;
    images: { url: string; is_primary: boolean }[];
  };
  variant?: 'icon' | 'full';
  className?: string;
}

export function CompareButton({ listing, variant = 'icon', className = '' }: CompareButtonProps) {
  const { isInCompare, addToCompare, removeFromCompare, canAdd } = useCompare();
  const inCompare = isInCompare(listing.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) removeFromCompare(listing.id);
    else addToCompare(listing);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        title={inCompare ? 'Remove from compare' : canAdd ? 'Add to compare' : 'Max 3 listings'}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
          ${inCompare
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            : 'bg-black/40 text-white/60 border border-white/10 hover:text-white hover:border-white/20'
          }
          ${!inCompare && !canAdd ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
          ${className}`}
      >
        <Scale size={13} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inCompare && !canAdd}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200
        ${inCompare
          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/15'
          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
        }
        disabled:opacity-40 disabled:cursor-not-allowed active:scale-95
        ${className}`}
    >
      <Scale size={14} />
      <span>{inCompare ? 'In Compare' : 'Compare'}</span>
    </button>
  );
}

// ── CompareBar (floating bottom bar) ──────────────────────────────────────────
export function CompareBar() {
  const { items, removeFromCompare, clearCompare, goToComparePage } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0D1117]/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-[0_8px_32px_rgba(0,212,200,0.15)] overflow-hidden">
        {/* Top strip */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-cyan-500/[0.04]">
          <div className="flex items-center gap-2">
            <Scale size={13} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Comparing {items.length}/3
            </span>
          </div>
          <button
            onClick={clearCompare}
            className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* Listing thumbnails */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-0 max-w-[180px]"
              >
                {/* Thumbnail */}
                <div className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden">
                  {item.images?.[0]?.url ? (
                    <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm">🏠</div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-white truncate leading-tight">
                    {item.title.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-bold">
                    {item.price >= 10000000
                      ? `₹${(item.price / 10000000).toFixed(1)}Cr`
                      : `₹${(item.price / 100000).toFixed(0)}L`}
                  </div>
                </div>
                {/* Remove */}
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="flex-shrink-0 text-white/30 hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Empty slot placeholder */}
            {items.length < 3 && (
              <div className="flex items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl px-4 py-2 flex-1 min-w-[100px] max-w-[140px]">
                <span className="text-[10px] text-white/20">+ Add listing</span>
              </div>
            )}
          </div>

          {/* Compare button */}
          <button
            onClick={goToComparePage}
            disabled={items.length < 2}
            className="flex-shrink-0 flex items-center gap-2 bg-cyan-500 text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
