'use client';

import { useSearchParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, Share2, Check } from 'lucide-react';
import { compareAPI } from '@/lib/buyer';

interface ListingDetail {
  id: string;
  title: string;
  price: number;
  property_type: string;
  listing_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  floor_number?: number;
  total_floors?: number;
  furnishing?: string;
  facing?: string;
  parking_count?: number;
  address: string;
  locality?: string;
  city: string;
  state: string;
  pincode?: string;
  images: { url: string; is_primary: boolean }[];
  amenities: string[];
  status: string;
  short_code: string;
  view_count: number;
  price_negotiable: boolean;
  agent_name: string;
  agent_phone?: string;
  agent_rera?: string;
  save_count: number;
  last_price?: number;
}

function formatPrice(price: number, type: string) {
  const suffix = type === 'rent' ? '/mo' : '';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr${suffix}`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L${suffix}`;
  return `₹${price.toLocaleString('en-IN')}${suffix}`;
}

function formatPricePerSqft(price: number, area?: number) {
  if (!area) return '—';
  return `₹${Math.round(price / area).toLocaleString('en-IN')}/sqft`;
}

function capitalize(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : '—';
}

const COMPARE_FIELDS: { label: string; key: keyof ListingDetail; format?: (v: any, l: ListingDetail) => string }[] = [
  { label: 'Price', key: 'price', format: (v, l) => formatPrice(v, l.listing_type) },
  { label: 'Price / sqft', key: 'price', format: (v, l) => formatPricePerSqft(v, l.area_sqft) },
  { label: 'Area', key: 'area_sqft', format: (v) => v ? `${v.toLocaleString()} sqft` : '—' },
  { label: 'Bedrooms', key: 'bedrooms', format: (v) => v ? `${v} BHK` : '—' },
  { label: 'Bathrooms', key: 'bathrooms', format: (v) => v ? `${v}` : '—' },
  { label: 'Floor', key: 'floor_number', format: (v, l) => v ? `${v} / ${l.total_floors || '?'}` : '—' },
  { label: 'Furnishing', key: 'furnishing', format: (v) => capitalize(v) },
  { label: 'Facing', key: 'facing', format: (v) => capitalize(v) },
  { label: 'Parking', key: 'parking_count', format: (v) => v ? `${v} spots` : '—' },
  { label: 'Negotiable', key: 'price_negotiable', format: (v) => v ? 'Yes' : 'No' },
  { label: 'Views', key: 'view_count', format: (v) => v?.toLocaleString() || '0' },
  { label: 'Saves', key: 'save_count', format: (v) => v?.toLocaleString() || '0' },
  { label: 'Agent', key: 'agent_name', format: (v) => v || '—' },
];

// All possible amenities to compare across listings
const COMMON_AMENITIES = [
  'parking', 'gym', 'swimming pool', 'security', 'lift', 'power backup',
  'garden', 'clubhouse', 'cctv', 'play area', 'intercom', 'gated community',
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<ListingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam.split(',').filter(Boolean).slice(0, 3);

  useEffect(() => {
    if (ids.length < 2) {
      setError('Please select at least 2 listings to compare.');
      setIsLoading(false);
      return;
    }

    compareAPI.getListings(ids)
      .then((res) => setListings(res.data.data.listings))
      .catch(() => setError('Failed to load listings for comparison.'))
      .finally(() => setIsLoading(false));
  }, [idsParam]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06040A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 border-2 rounded-full border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <div className="text-sm text-white/40">Loading comparison...</div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || listings.length < 2) {
    return (
      <div className="min-h-screen bg-[#06040A] flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <div className="mb-2 text-lg font-bold text-white">Nothing to compare</div>
          <div className="mb-6 text-sm text-white/40">{error || 'Add at least 2 listings from the listings page.'}</div>
          <Link href="/dashboard/listings" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-black transition-all bg-cyan-500 rounded-xl hover:bg-cyan-400">
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  const colWidth = listings.length === 2 ? 'flex-1' : 'flex-1';

  return (
    <div className="min-h-screen bg-[#06040A] text-white pb-16">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#06040A]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex-1">
          <div className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest mb-0.5">Comparison</div>
          <div className="text-sm font-bold leading-tight text-white">
            Comparing {listings.length} Properties
          </div>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/50 text-xs hover:text-white hover:border-white/20 transition-all"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* ── Property Photos Row ──────────────────────────────────────────────── */}
      <div className="flex gap-3 px-4 pt-5 pb-3 overflow-x-auto">
        {listings.map((l) => {
          const primaryImage = l.images?.find((i) => i.is_primary) || l.images?.[0];
          return (
            <div key={l.id} className={`${colWidth} min-w-[200px] flex-shrink-0`}>
              <div className="relative h-36 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.06] mb-2">
                {primaryImage?.url ? (
                  <img src={primaryImage.url} alt={l.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-4xl">🏠</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-0.5">
                    {l.property_type} · {l.listing_type === 'rent' ? 'Rent' : 'Sale'}
                  </div>
                </div>
              </div>
              <div className="mb-1 text-sm font-bold leading-tight text-white line-clamp-2">{l.title}</div>
              <div className="mb-1 text-lg font-black text-cyan-400">{formatPrice(l.price, l.listing_type)}</div>
              <div className="text-[11px] text-white/40">{l.locality ? `${l.locality}, ` : ''}{l.city}</div>
              <Link
                href={`/p/${l.short_code}`}
                className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
              >
                <ExternalLink size={10} />
                View listing
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Data Comparison Table ────────────────────────────────────────────── */}
      <div className="px-4">
        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3 mt-4 pl-1">
          Key Details
        </div>
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
          {COMPARE_FIELDS.map((field, idx) => {
            const values = listings.map((l) =>
              field.format ? field.format((l as any)[field.key], l) : String((l as any)[field.key] ?? '—')
            );
            // Highlight the best value (lowest price, highest area, most amenities)
            return (
              <div
                key={field.key + idx}
                className={`flex ${idx !== 0 ? 'border-t border-white/[0.04]' : ''}`}
              >
                {/* Label */}
                <div className="w-28 flex-shrink-0 flex items-center px-3 py-3 bg-white/[0.01] border-r border-white/[0.04]">
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wide leading-tight">
                    {field.label}
                  </span>
                </div>
                {/* Values */}
                {values.map((val, i) => (
                  <div key={i} className={`${colWidth} flex items-center px-3 py-3 ${i < values.length - 1 ? 'border-r border-white/[0.04]' : ''}`}>
                    <span className="text-sm font-semibold text-white">{val}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── Amenities Comparison ──────────────────────────────────────────── */}
        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3 mt-6 pl-1">
          Amenities
        </div>
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
          {COMMON_AMENITIES.map((amenity, idx) => {
            const hasAmenity = listings.map((l) =>
              (l.amenities || []).some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
            );
            // Skip if none have it
            if (!hasAmenity.some(Boolean)) return null;
            return (
              <div key={amenity} className={`flex ${idx !== 0 ? 'border-t border-white/[0.04]' : ''}`}>
                <div className="w-28 flex-shrink-0 flex items-center px-3 py-3 bg-white/[0.01] border-r border-white/[0.04]">
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wide leading-tight capitalize">
                    {amenity}
                  </span>
                </div>
                {hasAmenity.map((has, i) => (
                  <div key={i} className={`${colWidth} flex items-center justify-center px-3 py-3 ${i < hasAmenity.length - 1 ? 'border-r border-white/[0.04]' : ''}`}>
                    {has
                      ? <CheckCircle2 size={16} className="text-green-400" />
                      : <XCircle size={16} className="text-white/10" />
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── CTA Row ───────────────────────────────────────────────────────── */}
        <div className="flex gap-3 mt-5">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/p/${l.short_code}`}
              className={`${colWidth} flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-all active:scale-95`}
            >
              View Details
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
