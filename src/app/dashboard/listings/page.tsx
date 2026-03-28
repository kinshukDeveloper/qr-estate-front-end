// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { Plus, Search, Filter, Home, RefreshCw } from 'lucide-react';
// import { useListings } from '@/hooks/useListings';
// import { ListingCard } from '@/components/listings/ListingCard';
// import { Button } from '@/components/ui/Button';

// const STATUSES = ['all', 'active', 'draft', 'sold', 'rented', 'inactive'];
// const PROPERTY_TYPES = ['all', 'apartment', 'villa', 'house', 'plot', 'commercial', 'pg'];

// export default function ListingsPage() {
//   const {
//     listings, pagination, isLoading, error,
//     applyFilters, changePage, deleteListing, updateStatus,
//   } = useListings();

//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [typeFilter, setTypeFilter] = useState('all');

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     applyFilters({ search: search || undefined });
//   }

//   function handleStatusFilter(status: string) {
//     setStatusFilter(status);
//     applyFilters({ status: status === 'all' ? undefined : status });
//   }

//   function handleTypeFilter(type: string) {
//     setTypeFilter(type);
//     applyFilters({ property_type: type === 'all' ? undefined : type });
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-white">Listings</h1>
//           <p className="text-[#7A95AE] text-sm mt-0.5">
//             {pagination ? `${pagination.total} total` : 'Manage your properties'}
//           </p>
//         </div>
//         <Link href="/dashboard/listings/new">
//           <Button size="sm" className="flex items-center gap-2 whitespace-nowrap">
//             <Plus size={14} /> New Listing
//           </Button>
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="space-y-3">
//         {/* Search */}
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative flex-1">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6580]" />
//             <input
//               type="text"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search by title, address, locality..."
//               className="input pl-9 py-2.5 text-sm"
//             />
//           </div>
//           <Button type="submit" variant="outline" size="sm">Search</Button>
//         </form>

//         {/* Status tabs */}
//         <div className="flex flex-wrap gap-1">
//           {STATUSES.map(s => (
//             <button
//               key={s}
//               onClick={() => handleStatusFilter(s)}
//               className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors ${
//                 statusFilter === s
//                   ? 'bg-[#00D4C8] text-[#080F17]'
//                   : 'bg-[#111C28] border border-[#1A2D40] text-[#7A95AE] hover:text-white hover:border-[#4A6580]'
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>

//         {/* Type filter */}
//         <div className="flex flex-wrap gap-1">
//           {PROPERTY_TYPES.map(t => (
//             <button
//               key={t}
//               onClick={() => handleTypeFilter(t)}
//               className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors ${
//                 typeFilter === t
//                   ? 'bg-[#FFB830] text-[#080F17]'
//                   : 'border border-[#1A2D40] text-[#4A6580] hover:text-white'
//               }`}
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.2)] text-[#FF4D6A] text-sm">
//           {error}
//         </div>
//       )}

//       {/* Loading */}
//       {isLoading && (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {[1, 2, 3, 4, 5, 6].map(i => (
//             <div key={i} className="bg-[#111C28] border border-[#1A2D40] h-72 animate-pulse" />
//           ))}
//         </div>
//       )}

//       {/* Empty state */}
//       {!isLoading && listings.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20 text-center">
//           <div className="w-16 h-16 border-2 border-dashed border-[#1A2D40] flex items-center justify-center mb-4">
//             <Home size={24} className="text-[#4A6580]" />
//           </div>
//           <h3 className="mb-2 font-bold text-white">No listings yet</h3>
//           <p className="text-[#4A6580] text-sm mb-6">Create your first property listing to get started</p>
//           <Link href="/dashboard/listings/new">
//             <Button>
//               <Plus size={14} className="mr-2" /> Create First Listing
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* Grid */}
//       {!isLoading && listings.length > 0 && (
//         <>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {listings.map(listing => (
//               <ListingCard
//                 key={listing.id}
//                 listing={listing}
//                 onDelete={deleteListing}
//                 onStatusChange={updateStatus}
//               />
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.total_pages > 1 && (
//             <div className="flex items-center justify-between pt-4 border-t border-[#1A2D40]">
//               <span className="text-xs text-[#4A6580]">
//                 Page {pagination.page} of {pagination.total_pages}
//               </span>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={!pagination.has_prev}
//                   onClick={() => changePage(pagination.page - 1)}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={!pagination.has_next}
//                   onClick={() => changePage(pagination.page + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Plus, Search, Filter, RefreshCw, Building2, QrCode, Eye, MapPin } from 'lucide-react';
// import { useListings } from '@/hooks/useListings';
// import { ListingCard } from '@/components/listings/ListingCard';

// const STATUSES = ['all', 'active', 'draft', 'sold', 'rented', 'inactive'];
// const TYPES    = ['all', 'apartment', 'villa', 'house', 'plot', 'commercial', 'pg'];

// const STATUS_COLOR: Record<string, string> = {
//   all: 'var(--muted)', active: 'var(--teal)', draft: 'var(--gold)',
//   sold: 'var(--green)', rented: 'var(--blue)', inactive: 'var(--dim)',
// };

// export default function ListingsPage() {
//   const { listings, pagination, isLoading, applyFilters, changePage, deleteListing, updateStatus } = useListings();
//   const [search, setSearch]   = useState('');
//   const [status, setStatus]   = useState('all');
//   const [type, setType]       = useState('all');

//   function handleStatusFilter(s: string) {
//     setStatus(s);
//     applyFilters({ status: s === 'all' ? undefined : s });
//   }
//   function handleTypeFilter(t: string) {
//     setType(t);
//     applyFilters({ property_type: t === 'all' ? undefined : t });
//   }
//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     applyFilters({ search: search || undefined });
//   }

//   return (
//     <div className="pb-8 space-y-5">

//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
//         className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
//       >
//         <div>
//           <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>
//             Listings
//           </h1>
//           <p className="text-[13px] text-[var(--muted)] mt-0.5">
//             {pagination ? (
//               <span style={{ fontFamily: 'var(--font-mono)' }}>
//                 <span className="text-[var(--white)] font-bold">{pagination.total}</span> properties
//               </span>
//             ) : 'Manage your properties'}
//           </p>
//         </div>
//         <Link href="/dashboard/listings/new">
//           <motion.button
//             whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[var(--bg)]"
//             style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)' }}
//           >
//             <Plus size={15} /> New Listing
//           </motion.button>
//         </Link>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}
//         className="space-y-3"
//       >
//         {/* Search bar */}
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative flex-1">
//             <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dim)] pointer-events-none" />
//             <input
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search by title, address, city…"
//               className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-[var(--white)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--teal)] transition-colors"
//             />
//           </div>
//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//             className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[12px] font-bold text-[var(--muted)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all"
//           >
//             Search
//           </motion.button>
//         </form>

//         {/* Status filter */}
//         <div className="flex gap-1.5 flex-wrap">
//           {STATUSES.map(s => (
//             <button
//               key={s}
//               onClick={() => handleStatusFilter(s)}
//               className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase transition-all border ${
//                 status === s
//                   ? 'border-[rgba(24,212,200,0.25)] bg-[rgba(24,212,200,0.08)] text-[var(--teal)]'
//                   : 'border-[var(--border)] text-[var(--dim)] hover:border-[var(--border2)] hover:text-[var(--muted)]'
//               }`}
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               {s}
//             </button>
//           ))}
//           <div className="w-px bg-[var(--border)] self-stretch" />
//           {TYPES.map(t => (
//             <button
//               key={t}
//               onClick={() => handleTypeFilter(t)}
//               className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] uppercase transition-all border ${
//                 type === t
//                   ? 'border-[rgba(232,184,75,0.25)] bg-[rgba(232,184,75,0.08)] text-[var(--gold)]'
//                   : 'border-[var(--border)] text-[var(--dim)] hover:border-[var(--border2)] hover:text-[var(--muted)]'
//               }`}
//               style={{ fontFamily: 'var(--font-mono)' }}
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </motion.div>

//       {/* Grid */}
//       {isLoading ? (
//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div key={i} className="h-64 rounded-2xl bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
//           ))}
//         </div>
//       ) : listings.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//           className="flex flex-col items-center justify-center py-20 text-center"
//         >
//           <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
//             <Building2 size={28} className="text-[var(--dim)]" />
//           </div>
//           <h3 className="text-[15px] font-bold text-[var(--white)] mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
//             No listings found
//           </h3>
//           <p className="text-[13px] text-[var(--muted)] mb-6">Create your first property listing to get started</p>
//           <Link href="/dashboard/listings/new">
//             <motion.button
//               whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-[var(--bg)]"
//               style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)' }}
//             >
//               <Plus size={14} /> Add First Listing
//             </motion.button>
//           </Link>
//         </motion.div>
//       ) : (
//         <>
//           <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {listings.map((listing, i) => (
//               <motion.div
//                 key={listing.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.04, duration: 0.4 }}
//               >
//                 <ListingCard
//                   listing={listing}
//                   onDelete={deleteListing}
//                   onStatusChange={updateStatus}
//                 />
//               </motion.div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.total_pages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-4">
//               <button
//                 onClick={() => changePage(pagination.page - 1)}
//                 disabled={pagination.page <= 1}
//                 className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[11px] text-[var(--muted)] hover:text-[var(--teal)] hover:border-[var(--teal)] disabled:opacity-30 transition-all"
//                 style={{ fontFamily: 'var(--font-mono)' }}
//               >
//                 ← Prev
//               </button>
//               <span className="text-[11px] text-[var(--dim)] px-3" style={{ fontFamily: 'var(--font-mono)' }}>
//                 {pagination.page} / {pagination.total_pages}
//               </span>
//               <button
//                 onClick={() => changePage(pagination.page + 1)}
//                 disabled={pagination.page >= pagination.total_pages}
//                 className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[11px] text-[var(--muted)] hover:text-[var(--teal)] hover:border-[var(--teal)] disabled:opacity-30 transition-all"
//                 style={{ fontFamily: 'var(--font-mono)' }}
//               >
//                 Next →
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import { motion } from 'framer-motion';
import { SaveButton } from '@/components/listings/SaveButton';
import { CompareButton } from '@/components/listings/CompareButton';
import { VoiceSearch } from '@/components/search/VoiceSearch';
import type { VoiceSearchFilters } from '@/lib/buyer';

const STATUSES = ['all', 'active', 'draft', 'sold', 'rented', 'inactive'];
const PROP_TYPES = ['all', 'apartment', 'villa', 'house', 'plot', 'commercial', 'pg'];

function fmt(p: number, type: string) {
  const s = type === 'rent' ? '/mo' : '';
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr${s}`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L${s}`;
  return `₹${p.toLocaleString('en-IN')}${s}`;
}

const STATUS_META: Record<string, { color: string; bg: string }> = {
  active:   { color: 'var(--green)',  bg: 'rgba(40,216,144,0.08)'  },
  draft:    { color: 'var(--dim)',    bg: 'rgba(86,96,112,0.08)'   },
  sold:     { color: 'var(--gold)',   bg: 'rgba(232,184,75,0.08)'  },
  rented:   { color: 'var(--purple)', bg: 'rgba(168,112,248,0.08)' },
  inactive: { color: 'var(--dim)',    bg: 'rgba(86,96,112,0.06)'   },
};

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-[10px] font-bold uppercase rounded-full transition-all capitalize"
      style={{
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.06em',
        background: active ? 'rgba(24,212,200,0.1)' : 'transparent',
        color: active ? 'var(--teal)' : 'var(--dim)',
        border: `1px solid ${active ? 'rgba(24,212,200,0.25)' : 'var(--border)'}`,
      }}
    >
      {label === 'all' ? 'All' : label}
    </button>
  );
}

export default function ListingsPage() {
  const { listings, pagination, isLoading, applyFilters, changePage } = useListings();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [voiceResults, setVoiceResults] = useState<any[] | null>(null);
  const [voiceFilters, setVoiceFilters] = useState<VoiceSearchFilters | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setVoiceResults(null);
    applyFilters({ search: search || undefined });
  }
  function handleStatus(s: string) {
    setStatusFilter(s); setVoiceResults(null);
    applyFilters({ status: s === 'all' ? undefined : s });
  }
  function handleType(t: string) {
    setTypeFilter(t); setVoiceResults(null);
    applyFilters({ property_type: t === 'all' ? undefined : t });
  }
  const handleVoiceResults = useCallback((results: any[], filters: VoiceSearchFilters) => {
    setVoiceResults(results); setVoiceFilters(filters);
  }, []);

  const displayed = voiceResults !== null ? voiceResults : (listings || []);

  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } } };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(24,212,200,0.05) 0%, transparent 60%)', border: '1px solid rgba(24,212,200,0.08)' }}>
        <div>
          <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2" style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>
            <div className="w-4 h-px" style={{ background: 'var(--teal)' }} /> Property Portfolio
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Listings</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--dim)' }}>
            {voiceResults !== null ? `${voiceResults.length} voice results` : pagination ? `${pagination.total} properties` : 'Manage your real estate inventory'}
          </p>
        </div>
        <Link href="/dashboard/listings/new">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap"
            style={{ background: 'var(--teal)', color: 'var(--bg)', boxShadow: '0 4px 20px rgba(24,212,200,0.25)' }}
          >
            <Plus size={14} /> New Listing
          </motion.button>
        </Link>
      </motion.div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="p-4 space-y-3 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--dim)' }} />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search title, locality, address..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--white)' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(24,212,200,0.4)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button type="submit" className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              Search
            </button>
          </form>
          <VoiceSearch onResults={handleVoiceResults} />
        </div>

        {/* Voice filter chips */}
        {voiceFilters && voiceResults !== null && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[8px] uppercase tracking-wider font-bold" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Voice:</span>
            {Object.entries(voiceFilters).map(([k, v]) => {
              if (!v) return null;
              const lbl = k === 'min_price' ? `Min ₹${(v as number) >= 10000000 ? ((v as number)/10000000).toFixed(1)+'Cr' : ((v as number)/100000).toFixed(0)+'L'}`
                : k === 'max_price' ? `Max ₹${(v as number) >= 10000000 ? ((v as number)/10000000).toFixed(1)+'Cr' : ((v as number)/100000).toFixed(0)+'L'}`
                : k === 'bedrooms' ? `${v} BHK` : k === 'listing_type' ? String(v).toUpperCase() : String(v);
              return <span key={k} className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(24,212,200,0.1)', color: 'var(--teal)', border: '1px solid rgba(24,212,200,0.2)' }}>{lbl}</span>;
            })}
            <button onClick={() => { setVoiceResults(null); setVoiceFilters(null); }} className="text-[9px] underline" style={{ color: 'var(--dim)' }}>Clear</button>
          </div>
        )}

        <div className="h-px" style={{ background: 'var(--border)' }} />

        <div className="flex flex-col gap-4 lg:flex-row">
          <div>
            <div className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Status</div>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map(s => <FilterChip key={s} label={s} active={statusFilter === s} onClick={() => handleStatus(s)} />)}
            </div>
          </div>
          <div>
            <div className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Type</div>
            <div className="flex flex-wrap gap-1.5">
              {PROP_TYPES.map(t => <FilterChip key={t} label={t} active={typeFilter === t} onClick={() => handleType(t)} />)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Listings ────────────────────────────────────────────────────── */}
      <motion.div variants={stagger} className="space-y-3">
        {isLoading && displayed.length === 0 && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl h-36 animate-pulse" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
          ))
        )}

        {!isLoading && displayed.length === 0 && (
          <motion.div variants={fadeUp} className="py-20 text-center" style={{ color: 'var(--dim)' }}>
            <div className="mb-3 text-4xl">🏠</div>
            <div className="text-sm font-semibold">No listings found</div>
          </motion.div>
        )}

        {displayed.map((l: any) => {
          const img = l.images?.find((x: any) => x.is_primary) || l.images?.[0];
          const sm = STATUS_META[l.status] || STATUS_META.inactive;
          return (
            <motion.div key={l.id} variants={fadeUp}>
              <div className="rounded-2xl overflow-hidden group transition-all hover:border-[var(--border2)]"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex">
                  {/* Image */}
                  <Link href={`/dashboard/listings/${l.id}`} className="relative flex-shrink-0 w-32 overflow-hidden sm:w-44" style={{ background: 'var(--surface)' }}>
                    {img?.url
                      ? <img src={img.url} alt={l.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" style={{ minHeight: 120 }} />
                      : <div className="flex items-center justify-center w-full h-full text-4xl" style={{ minHeight: 120 }}>
                          {l.property_type === 'commercial' ? '🏪' : l.property_type === 'villa' ? '🏘' : '🏢'}
                        </div>}
                    {/* Status badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full" style={{ ...sm, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                        {l.status}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0 p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <Link href={`/dashboard/listings/${l.id}`} className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>
                          {l.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <CompareButton listing={{ id: l.id, title: l.title, price: l.price, city: l.city, property_type: l.property_type, images: l.images }} variant="icon" />
                        <SaveButton listingId={l.id} listingTitle={l.title} listingPrice={l.price} variant="icon" />
                      </div>
                    </div>

                    <div className="mb-1 text-base font-black text-gradient-gold">{fmt(l.price, l.listing_type)}</div>

                    <div className="text-[10px] mb-3" style={{ color: 'var(--dim)' }}>
                      📍 {l.locality ? `${l.locality}, ` : ''}{l.city}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] pt-2.5" style={{ color: 'var(--dim)', borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                      {l.bedrooms    && <span>🛏 {l.bedrooms} BHK</span>}
                      {l.bathrooms   && <span>🛁 {l.bathrooms}</span>}
                      {l.area_sqft   && <span>📐 {l.area_sqft.toLocaleString()} sqft</span>}
                      <span className="ml-auto">👁 {l.view_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination */}
      {!voiceResults && pagination && pagination.pages > 1 && (
        <motion.div variants={fadeUp} className="flex justify-center gap-2 pt-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => changePage(p)}
              className="w-8 h-8 text-xs font-bold transition-all rounded-lg"
              style={{
                background:  p === pagination.page ? 'var(--gold)' : 'var(--card)',
                color:       p === pagination.page ? 'var(--bg)'   : 'var(--dim)',
                border:      `1px solid ${p === pagination.page ? 'transparent' : 'var(--border)'}`,
                fontFamily:  'var(--font-mono)',
              }}>
              {p}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
