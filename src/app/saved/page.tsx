'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, ExternalLink } from 'lucide-react';
import { savedAPI, type SavedListing } from '@/lib/buyer';
import { SaveButton } from '@/components/listings/SaveButton';

function formatPrice(price: number, type: string) {
  const suffix = type === 'rent' ? '/mo' : '';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr${suffix}`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L${suffix}`;
  return `₹${price.toLocaleString('en-IN')}${suffix}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function SavedPage() {
  const [listings, setListings] = useState<SavedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const load = async (p: number) => {
    setIsLoading(true);
    try {
      const res = await savedAPI.list(p, LIMIT);
      const { listings: data, pagination } = res.data.data;
      setListings(p === 1 ? data : (prev) => [...prev, ...data]);
      setTotal(pagination.total);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const hasMore = listings.length < total;

  return (
    <div className="min-h-screen bg-[#06040A] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#06040A]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-white transition-all"
        >
          <ArrowLeft size={14} />
        </Link>
        <div className="flex-1">
          <div className="text-[9px] font-bold text-red-400/80 uppercase tracking-widest mb-0.5">Saved</div>
          <div className="text-sm font-bold text-white">
            {total > 0 ? `${total} saved listing${total !== 1 ? 's' : ''}` : 'Saved Listings'}
          </div>
        </div>
        <Heart size={16} className="text-red-400 fill-red-400" />
      </div>

      {/* Empty state */}
      {!isLoading && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
            <Heart size={24} className="text-white/20" />
          </div>
          <div className="text-base font-bold text-white mb-2">No saved listings</div>
          <div className="text-sm text-white/40 mb-6 max-w-xs">
            Tap the heart icon on any listing to save it here for easy access.
          </div>
          <Link
            href="/dashboard/listings"
            className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-all"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* Listings grid */}
      {listings.length > 0 && (
        <div className="px-4 pt-4 space-y-3">
          {listings.map((listing) => {
            const primaryImage = listing.images?.find((i) => i.is_primary) || listing.images?.[0];
            return (
              <div key={listing.id} className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                <div className="flex gap-0">
                  {/* Image */}
                  <div className="w-28 h-28 flex-shrink-0 bg-white/[0.04] overflow-hidden">
                    {primaryImage?.url ? (
                      <img src={primaryImage.url} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-sm font-bold text-white line-clamp-2 leading-tight flex-1">
                        {listing.title}
                      </div>
                      <SaveButton listingId={listing.id} variant="icon" />
                    </div>

                    <div className="text-base font-black text-red-400 mb-1">
                      {formatPrice(listing.price, listing.listing_type)}
                    </div>

                    <div className="text-[10px] text-white/40 mb-2">
                      📍 {listing.locality ? `${listing.locality}, ` : ''}{listing.city}
                      {listing.bedrooms && ` · ${listing.bedrooms} BHK`}
                      {listing.area_sqft && ` · ${listing.area_sqft.toLocaleString()} sqft`}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/25">Saved {timeAgo(listing.saved_at)}</span>
                      <Link
                        href={`/p/${listing.short_code}`}
                        className="flex items-center gap-1 text-[10px] text-red-400/70 hover:text-red-400 transition-colors font-medium"
                      >
                        View
                        <ExternalLink size={9} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => { const next = page + 1; setPage(next); load(next); }}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/50 text-sm hover:bg-white/[0.06] transition-all disabled:opacity-40 mt-2"
            >
              {isLoading ? 'Loading...' : `Load more (${total - listings.length} remaining)`}
            </button>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && listings.length === 0 && (
        <div className="px-4 pt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0C0F14] border border-white/[0.04] rounded-2xl overflow-hidden animate-pulse">
              <div className="flex gap-0">
                <div className="w-28 h-28 bg-white/[0.04]" />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-3.5 bg-white/[0.04] rounded-full w-3/4" />
                  <div className="h-3.5 bg-white/[0.04] rounded-full w-1/2" />
                  <div className="h-3 bg-white/[0.03] rounded-full w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
