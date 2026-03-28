// 'use client';

// import { useState } from 'react';
// import {
//   MapPin, BedDouble, Bath, Maximize2,
//   Phone, MessageCircle, Share2, ChevronLeft, ChevronRight,
//   CheckCircle2, AlertTriangle, Home, Layers,
// } from 'lucide-react';
// import dynamic from 'next/dynamic';
// import { LocaleProvider, useLocale, formatPriceLocalized } from '@/i18n';

// // These three components use framer-motion (AnimatePresence) which causes
// // hydration mismatches when pre-rendered on the server. ssr:false means they
// // render only in the browser, after hydration — zero mismatch.
// const LanguagePicker  = dynamic(
//   () => import('@/components/property/LanguagePicker').then(m => m.LanguagePicker),
//   { ssr: false, loading: () => <div className="w-[72px] h-[28px]" /> }
// );
// const CallbackButton  = dynamic(
//   () => import('@/components/property/CallbackButton').then(m => m.CallbackButton),
//   { ssr: false, loading: () => null }
// );
// const VirtualTourEmbed = dynamic(
//   () => import('@/components/property/VirtualTourEmbed').then(m => m.VirtualTourEmbed),
//   { ssr: false, loading: () => null }
// );

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Listing {
//   id:               string;
//   title:            string;
//   description?:     string;
//   property_type:    string;
//   listing_type:     string;
//   price:            number;
//   price_negotiable: boolean;
//   bedrooms?:        number;
//   bathrooms?:       number;
//   area_sqft?:       number;
//   floor_number?:    number;
//   total_floors?:    number;
//   furnishing?:      string;
//   facing?:          string;
//   address:          string;
//   locality?:        string;
//   city:             string;
//   state:            string;
//   pincode?:         string;
//   images:           { url: string; is_primary: boolean }[];
//   amenities:        string[];
//   status:           string;
//   view_count:       number;
//   short_code:       string;
//   agent_name:       string;
//   agent_phone?:     string;
//   agent_rera?:      string;
//   agent_photo?:     string;
//   qr_scans?:        number;
//   tour_url?:        string | null;
//   embed_url?:       string | null;
// }

// // ── Inner page (uses locale context) ─────────────────────────────────────────
// function PropertyPageInner({
//   listing,
//   isUnavailable,
// }: {
//   listing: Listing;
//   isUnavailable: boolean;
// }) {
//   const { t, locale } = useLocale();
//   const [activeImage, setActiveImage] = useState(0);
//   const [copied, setCopied]           = useState(false);

//   const images   = listing.images || [];
//   const isSold   = listing.status === 'sold';
//   const isRented = listing.status === 'rented';
//   const isGone   = isSold || isRented || isUnavailable;

//   // Localised price
//   const { main: priceMain, unit: priceUnit } =
//     formatPriceLocalized(listing.price, listing.listing_type, t, locale);

//   // Localised property type / furnishing / facing
//   const propTypeLabel  = (t.propertyType as any)[listing.property_type]  ?? listing.property_type;
//   const furnishLabel   = listing.furnishing ? (t.furnishing as any)[listing.furnishing] ?? listing.furnishing : null;
//   const facingLabel    = listing.facing     ? (t.facing as any)[listing.facing]         ?? listing.facing     : null;
//   const purposeLabel   = (t.listingType as any)[listing.listing_type]    ?? listing.listing_type;
//   const statusLabel    = (t.status as any)[listing.status]               ?? listing.status;

//   // Short URL for sharing
//   const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? ''}/${listing.short_code}`;

//   function handleShare() {
//     const url = typeof window !== 'undefined' ? window.location.href : shortUrl;
//     if (typeof navigator !== 'undefined' && navigator.share) {
//       navigator.share({ title: listing.title, url }).catch(() => {});
//     } else {
//       navigator.clipboard.writeText(url);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   }

//   function handleWhatsApp() {
//     const url = typeof window !== 'undefined' ? window.location.href : shortUrl;
//     const msg = encodeURIComponent(
//       `${listing.title}\n${listing.city}, ${listing.state}\n₹${listing.price.toLocaleString('en-IN')}\n\n${url}`
//     );
//     const phone = listing.agent_phone?.replace(/\D/g, '');
//     window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
//   }

//   // Banner text
//   function getBannerText() {
//     if (isSold)       return t.banner.sold;
//     if (isRented)     return t.banner.rented;
//     return t.banner.removed;
//   }

//   return (
//     <div
//       className="min-h-screen bg-[#F5F2EE]"
//       style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
//     >
//       {/* ── Unavailable Banner ─────────────────────────────────── */}
//       {isGone && (
//         <div className="bg-[#1A0A00] text-[#FFB830] text-center py-3 px-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2">
//           <AlertTriangle size={16} />
//           {getBannerText()}
//         </div>
//       )}

//       {/* ── Image Gallery ──────────────────────────────────────── */}
//       <div
//         className="relative bg-[#1C1C1C] overflow-hidden"
//         style={{ height: 'min(60vw, 420px)' }}
//       >
//         {images.length > 0 ? (
//           <>
//             <img
//               src={images[activeImage]?.url}
//               alt={listing.title}
//               className="object-cover w-full h-full transition-opacity duration-300"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
//                   className="absolute flex items-center justify-center text-white transition-colors -translate-y-1/2 left-3 top-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm hover:bg-black/60"
//                 >
//                   <ChevronLeft size={20} />
//                 </button>
//                 <button
//                   onClick={() => setActiveImage(i => (i + 1) % images.length)}
//                   className="absolute flex items-center justify-center text-white transition-colors -translate-y-1/2 right-3 top-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm hover:bg-black/60"
//                 >
//                   <ChevronRight size={20} />
//                 </button>
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
//                   {images.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setActiveImage(i)}
//                       className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-white w-4' : 'bg-white/50'}`}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}

//             <div className="absolute px-2 py-1 font-mono text-xs text-white top-4 right-4 bg-black/50 backdrop-blur-sm">
//               {activeImage + 1}/{images.length}
//             </div>

//             {/* Language picker in image corner */}
//             <div className="absolute top-4 left-4">
//               <LanguagePicker />
//             </div>
//           </>
//         ) : (
//           <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#444]">
//             <Home size={48} strokeWidth={1} />
//             <span className="text-sm">{t.noPhotos}</span>
//             {/* Language picker fallback position */}
//             <div className="absolute top-4 left-4">
//               <LanguagePicker />
//             </div>
//           </div>
//         )}

//         {/* Thumbnail strip */}
//         {images.length > 1 && (
//           <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-2 overflow-x-auto scrollbar-none">
//             {images.map((img, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveImage(i)}
//                 className={`flex-shrink-0 w-12 h-12 overflow-hidden border-2 transition-all ${
//                   i === activeImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
//                 }`}
//               >
//                 <img src={img.url} className="object-cover w-full h-full" alt="" />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Main Content ───────────────────────────────────────── */}
//       <div className="max-w-xl px-4 pb-32 mx-auto">

//         {/* Price + Status */}
//         <div className="bg-white border-b-4 border-[#1C1C1C] px-5 py-5 -mx-4">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-3xl font-black text-[#1C1C1C] leading-none">{priceMain}</span>
//                 <span className="text-sm font-semibold text-[#666]">{priceUnit}</span>
//               </div>
//               {listing.price_negotiable && (
//                 <span className="text-xs text-[#2D9945] font-semibold mt-0.5 block">
//                   {t.price.negotiable}
//                 </span>
//               )}
//             </div>
//             <div className="flex flex-col items-end gap-1.5">
//               <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 uppercase ${
//                 listing.status === 'active'
//                   ? 'bg-[#E8F5E9] text-[#2D9945]'
//                   : listing.status === 'sold'
//                   ? 'bg-[#FFF3E0] text-[#E65100]'
//                   : 'bg-[#FFF8E1] text-[#F57F17]'
//               }`}>
//                 {statusLabel}
//               </span>
//               <span className="text-[10px] text-[#999] uppercase tracking-wide">
//                 {propTypeLabel} · {purposeLabel}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Title + Location */}
//         <div className="bg-white px-5 py-5 -mx-4 mt-0 border-b border-[#EEE]">
//           <h1 className="text-xl font-black text-[#1C1C1C] leading-snug mb-2">{listing.title}</h1>
//           <div className="flex items-center gap-1.5 text-sm text-[#666]">
//             <MapPin size={14} className="text-[#C0392B] flex-shrink-0" />
//             <span>
//               {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
//               {listing.pincode ? ` — ${listing.pincode}` : ''}
//             </span>
//           </div>
//         </div>

//         {/* Quick Specs */}
//         <div className="grid grid-cols-4 gap-0 bg-[#1C1C1C] -mx-4 mt-3">
//           {[
//             { icon: BedDouble,  label: t.specs.beds,  value: listing.bedrooms    != null ? `${listing.bedrooms}`   : '—' },
//             { icon: Bath,       label: t.specs.baths, value: listing.bathrooms   != null ? `${listing.bathrooms}`  : '—' },
//             { icon: Maximize2,  label: t.specs.area,  value: listing.area_sqft   ? `${listing.area_sqft}`          : '—' },
//             { icon: Layers,     label: t.specs.floor, value: listing.floor_number != null ? `${listing.floor_number}/${listing.total_floors ?? '?'}` : '—' },
//           ].map(({ icon: Icon, label, value }) => (
//             <div key={label} className="flex flex-col items-center py-4 border-r border-[#333] last:border-0">
//               <Icon size={16} className="text-[#00D4C8] mb-1" />
//               <div className="text-sm font-bold text-white">{value}</div>
//               <div className="text-[10px] text-[#666] uppercase tracking-wide mt-0.5">{label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Property Details */}
//         <Section title={t.sections.propertyDetails}>
//           <div className="grid grid-cols-2 gap-y-3 gap-x-4">
//             {[
//               { label: t.details.type,       value: propTypeLabel },
//               { label: t.details.purpose,    value: purposeLabel },
//               furnishLabel && { label: t.details.furnishing, value: furnishLabel },
//               facingLabel  && { label: t.details.facing,     value: facingLabel },
//               listing.area_sqft   && { label: t.details.area,  value: `${listing.area_sqft} sq.ft` },
//               listing.floor_number != null && {
//                 label: t.details.floor,
//                 value: `${listing.floor_number} ${t.details.of} ${listing.total_floors ?? '?'}`,
//               },
//             ].filter(Boolean).map((item: any) => (
//               <div key={item.label}>
//                 <div className="text-[10px] text-[#999] uppercase tracking-wide mb-0.5">{item.label}</div>
//                 <div className="text-sm font-semibold text-[#1C1C1C]">{item.value}</div>
//               </div>
//             ))}
//           </div>
//         </Section>

//         {/* Property Code */}
//         <div className="bg-white -mx-4 mt-3 px-5 py-3 border-b border-[#EEE] flex items-center justify-between">
//           <span className="text-[10px] text-[#999] uppercase tracking-widest">{t.details.propertyCode}</span>
//           <span className="font-mono text-sm font-bold text-[#1C1C1C] bg-[#F5F2EE] px-2.5 py-1 tracking-widest">
//             {listing.short_code}
//           </span>
//         </div>

//         {/* Description */}
//         {listing.description && (
//           <Section title={t.sections.aboutProperty}>
//             <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">{listing.description}</p>
//           </Section>
//         )}

//         {/* Amenities */}
//         {listing.amenities?.length > 0 && (
//           <Section title={t.sections.amenities}>
//             <div className="flex flex-wrap gap-2">
//               {listing.amenities.map(a => (
//                 <span key={a} className="flex items-center gap-1.5 text-xs bg-[#F0FAF0] text-[#2D7A3A] px-3 py-1.5 font-medium border border-[#C8E6C9]">
//                   <CheckCircle2 size={11} />
//                   {a}
//                 </span>
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* Location */}
//         <Section title={t.sections.location}>
//           <div className="flex items-start gap-2 text-sm text-[#444]">
//             <MapPin size={16} className="text-[#C0392B] flex-shrink-0 mt-0.5" />
//             <div>
//               <div className="font-semibold text-[#1C1C1C]">{listing.address}</div>
//               <div className="text-[#666] mt-0.5">
//                 {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
//                 {listing.pincode ? ` ${listing.pincode}` : ''}
//               </div>
//             </div>
//           </div>
//         </Section>

//         {/* Agent Card */}
//         <Section title={t.sections.listedBy}>
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-[#1C1C1C] flex items-center justify-center text-xl font-black text-white flex-shrink-0">
//               {listing.agent_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
//             </div>
//             <div>
//               <div className="font-bold text-[#1C1C1C] text-base">{listing.agent_name}</div>
//               {listing.agent_phone && (
//                 <div className="text-sm text-[#666] mt-0.5">+91 {listing.agent_phone}</div>
//               )}
//               {listing.agent_rera && (
//                 <div className="text-[10px] text-[#00897B] font-bold tracking-wide mt-1 uppercase">
//                   {t.agent.reraLabel}: {listing.agent_rera}
//                 </div>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* Stats + Share */}
//         <div className="flex items-center gap-4 mt-4 text-xs text-[#999]">
//           <span>{listing.view_count} {t.stats.views}</span>
//           {listing.qr_scans != null && (
//             <><span>·</span><span>{listing.qr_scans} {t.stats.qrScans}</span></>
//           )}
//           <span>·</span>
//           <button
//             onClick={handleShare}
//             className="flex items-center gap-1 hover:text-[#1C1C1C] transition-colors"
//           >
//             <Share2 size={12} />
//             {copied ? t.stats.copied : t.stats.share}
//           </button>
//         </div>

//         {/* Feature 4: 60-second Callback */}
//         {!isGone && listing.agent_phone && (
//           <div className="bg-white -mx-4 mt-3 px-5 py-4 border-b border-[#EEE]">
//             <CallbackButton
//               listingId={listing.id}
//               agentName={listing.agent_name}
//               apiBaseUrl={process.env.NEXT_PUBLIC_API_URL || ''}
//             />
//           </div>
//         )}

//         {/* Feature 5: Virtual Tour */}
//         {listing.tour_url && listing.embed_url && (
//           <VirtualTourEmbed
//             tourUrl={listing.tour_url}
//             embedUrl={listing.embed_url}
//             shortCode={listing.short_code}
//             apiBase={process.env.NEXT_PUBLIC_API_URL || ''}
//           />
//         )}

//         {/* Enquiry Form */}
//         {!isGone && (
//           <EnquiryForm
//             shortCode={listing.short_code}
//             listingTitle={listing.title}
//             t={t}
//           />
//         )}

//         {/* Powered by */}
//         <div className="mt-8 text-center">
//           <span className="text-[10px] text-[#CCC] uppercase tracking-widest">{t.poweredBy}</span>
//           <div className="text-xs font-bold text-[#999] mt-0.5">QR Estate · {t.tagline}</div>
//         </div>
//       </div>

//       {/* ── Sticky CTA ─────────────────────────────────────────── */}
//       {!isGone && listing.agent_phone && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1C1C1C] px-4 py-3 flex gap-3 max-w-xl mx-auto shadow-2xl">
//           <a
//             href={`tel:+91${listing.agent_phone.replace(/\D/g, '')}`}
//             className="flex-1 flex items-center justify-center gap-2 bg-[#1C1C1C] text-white py-3.5 font-bold text-sm hover:bg-[#333] transition-colors active:scale-95"
//           >
//             <Phone size={16} fill="white" />
//             {t.agent.callAgent}
//           </a>
//           <button
//             onClick={handleWhatsApp}
//             className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 font-bold text-sm hover:bg-[#20BD5C] transition-colors active:scale-95"
//           >
//             <MessageCircle size={16} fill="white" />
//             {t.agent.whatsapp}
//           </button>
//         </div>
//       )}

//       {!isGone && !listing.agent_phone && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1C1C1C] px-4 py-3 max-w-xl mx-auto shadow-2xl">
//           <div className="text-center text-sm text-[#666]">{t.noContact}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Enquiry form ──────────────────────────────────────────────────────────────
// function EnquiryForm({
//   shortCode,
//   listingTitle,
//   t,
// }: {
//   shortCode: string;
//   listingTitle: string;
//   t: any;
// }) {
//   const [form, setForm]     = useState({ name: '', phone: '', message: '' });
//   const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!form.phone) return;
//     setStatus('loading');
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/leads/enquiry/${shortCode}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ...form, source: 'website' }),
//         }
//       );
//       setStatus(res.ok ? 'done' : 'error');
//     } catch {
//       setStatus('error');
//     }
//   }

//   if (status === 'done') {
//     return (
//       <div className="bg-white -mx-4 mt-3 px-5 py-8 text-center border-b border-[#EEE]">
//         <div className="mb-2 text-3xl">✅</div>
//         <div className="font-bold text-[#1C1C1C] mb-1">{t.enquiry.successTitle}</div>
//         <div className="text-sm text-[#666]">{t.enquiry.successDesc}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white -mx-4 mt-3 px-5 py-5 border-b border-[#EEE]">
//       <h2 className="text-[10px] font-black tracking-[2px] text-[#999] uppercase mb-4">
//         {t.sections.sendEnquiry}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           className="w-full border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1C1C1C] transition-colors"
//           placeholder={t.enquiry.namePlaceholder}
//           value={form.name}
//           onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//         />
//         <input
//           className="w-full border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1C1C1C] transition-colors"
//           placeholder={t.enquiry.phonePlaceholder}
//           type="tel"
//           required
//           value={form.phone}
//           onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
//         />
//         <textarea
//           className="w-full border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1C1C1C] transition-colors resize-none"
//           placeholder={t.enquiry.messagePlaceholder}
//           rows={3}
//           value={form.message}
//           onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
//         />
//         {status === 'error' && (
//           <p className="text-xs text-red-500">{t.enquiry.errorMsg}</p>
//         )}
//         <button
//           type="submit"
//           disabled={status === 'loading'}
//           className="w-full bg-[#1C1C1C] text-white py-3 font-bold text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
//         >
//           {status === 'loading' ? t.enquiry.submitting : t.enquiry.submit}
//         </button>
//       </form>
//     </div>
//   );
// }

// // ── Section wrapper ───────────────────────────────────────────────────────────
// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="bg-white -mx-4 mt-3 px-5 py-5 border-b border-[#EEE]">
//       <h2 className="text-[10px] font-black tracking-[2px] text-[#999] uppercase mb-4">{title}</h2>
//       {children}
//     </div>
//   );
// }

// // ── Public export (wraps with LocaleProvider) ──────────────────────────────────
// export function PropertyPageClient({
//   listing,
//   isUnavailable,
// }: {
//   listing: Listing;
//   isUnavailable: boolean;
// }) {
//   return (
//     <LocaleProvider>
//       <PropertyPageInner listing={listing} isUnavailable={isUnavailable} />
//     </LocaleProvider>
//   );
// }



// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import {
//   MapPin, BedDouble, Bath, Maximize2, Phone, MessageCircle,
//   Share2, ChevronLeft, ChevronRight, CheckCircle2, Eye, QrCode,
//   Layers, Home, Star, Clock, ArrowUpRight, X,
// } from 'lucide-react';
// import dynamic from 'next/dynamic';
// import { LocaleProvider, useLocale, formatPriceLocalized } from '@/i18n';
// import { AIChatWidget } from '@/components/chat/AIChatWidget';
// import { NeighbourhoodPanel } from '@/components/neighbourhood/NeighbourhoodPanel';
// import { SaveButton } from '@/components/listings/SaveButton';

// const CallbackButton  = dynamic(() => import('@/components/property/CallbackButton').then(m => m.CallbackButton),  { ssr: false });
// const VirtualTourEmbed= dynamic(() => import('@/components/property/VirtualTourEmbed').then(m => m.VirtualTourEmbed), { ssr: false });
// const LanguagePicker  = dynamic(() => import('@/components/property/LanguagePicker').then(m => m.LanguagePicker),  { ssr: false, loading: () => <div className="w-16 h-7" /> });

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface Listing {
//   id: string; title: string; description?: string;
//   property_type: string; listing_type: string; price: number;
//   price_negotiable: boolean; bedrooms?: number; bathrooms?: number;
//   area_sqft?: number; floor_number?: number; total_floors?: number;
//   furnishing?: string; facing?: string; address: string; locality?: string;
//   city: string; state: string; pincode?: string;
//   images: { url: string; is_primary: boolean }[];
//   amenities: string[]; status: string; view_count: number;
//   short_code: string; agent_name: string; agent_phone?: string;
//   agent_rera?: string; agent_photo?: string;
//   qr_scans?: number; tour_url?: string | null; embed_url?: string | null;
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────
// function formatPrice(price: number, type: string) {
//   const s = type === 'rent' ? '/mo' : '';
//   if (price >= 10000000) return { main: `₹${(price/10000000).toFixed(2)}Cr`, sub: s };
//   if (price >= 100000)   return { main: `₹${(price/100000).toFixed(1)}L`,   sub: s };
//   return { main: `₹${price.toLocaleString('en-IN')}`, sub: s };
// }

// const AMENITY_ICONS: Record<string, string> = {
//   'Lift': '🛗', 'Parking': '🚗', 'Power Backup': '⚡', 'Security / Guard': '👮',
//   'CCTV': '📹', 'Gym': '💪', 'Swimming Pool': '🏊', 'Clubhouse': '🏛',
//   'Garden / Park': '🌳', 'Play Area': '🛝', 'Intercom': '📞',
//   'Fire Safety': '🔥', 'Gas Pipeline': '🔧', 'Water Storage': '💧',
//   'Rainwater Harvesting': '🌧', 'Solar Panels': '☀️', 'Servant Room': '🚪',
//   'Gated Community': '🏰', 'Visitor Parking': '🅿️',
// };

// // ── Image carousel ─────────────────────────────────────────────────────────────
// function ImageCarousel({ images, title }: { images: { url: string; is_primary: boolean }[]; title: string }) {
//   const [active, setActive] = useState(0);
//   const [lightbox, setLightbox] = useState(false);

//   if (!images.length) {
//     return (
//       <div className="w-full aspect-[4/3] sm:aspect-video flex items-center justify-center text-6xl"
//         style={{ background: 'var(--surface)' }}>
//         🏠
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Main carousel */}
//       <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-black group">
//         <img
//           src={images[active].url}
//           alt={title}
//           className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in group-hover:scale-[1.02]"
//           onClick={() => setLightbox(true)}
//         />

//         {/* Gradient overlays */}
//         <div className="absolute inset-0 pointer-events-none"
//           style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.7) 100%)' }} />

//         {/* Arrow nav */}
//         {images.length > 1 && (
//           <>
//             <button onClick={() => setActive(i => (i - 1 + images.length) % images.length)}
//               className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full opacity-0 left-3 top-1/2 w-9 h-9 group-hover:opacity-100 active:scale-90"
//               style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
//               <ChevronLeft size={18} />
//             </button>
//             <button onClick={() => setActive(i => (i + 1) % images.length)}
//               className="absolute flex items-center justify-center transition-all -translate-y-1/2 rounded-full opacity-0 right-3 top-1/2 w-9 h-9 group-hover:opacity-100 active:scale-90"
//               style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
//               <ChevronRight size={18} />
//             </button>
//           </>
//         )}

//         {/* Dot indicators */}
//         {images.length > 1 && (
//           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//             {images.map((_, i) => (
//               <button key={i} onClick={() => setActive(i)}
//                 className="transition-all"
//                 style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 3, background: i === active ? '#E8B84B' : 'rgba(255,255,255,0.4)' }} />
//             ))}
//           </div>
//         )}

//         {/* Photo count */}
//         <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
//           style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', fontFamily: 'var(--font-mono)' }}>
//           {active + 1} / {images.length}
//         </div>
//       </div>

//       {/* Thumbnail strip */}
//       {images.length > 1 && (
//         <div className="flex gap-1.5 overflow-x-auto p-2" style={{ scrollbarWidth: 'none' }}>
//           {images.map((img, i) => (
//             <button key={i} onClick={() => setActive(i)}
//               className="relative flex-shrink-0 w-16 h-12 overflow-hidden transition-all rounded-lg"
//               style={{ border: `2px solid ${i === active ? 'var(--gold)' : 'transparent'}`, opacity: i === active ? 1 : 0.55 }}>
//               <img src={img.url} alt="" className="object-cover w-full h-full" />
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Lightbox */}
//       {lightbox && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.95)' }}
//           onClick={() => setLightbox(false)}>
//           <button className="absolute flex items-center justify-center rounded-full top-4 right-4 w-9 h-9"
//             style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
//             <X size={18} />
//           </button>
//           <img src={images[active].url} alt={title}
//             className="max-w-[96vw] max-h-[92vh] object-contain rounded-xl"
//             onClick={e => e.stopPropagation()} />
//           {images.length > 1 && (
//             <>
//               <button onClick={e => { e.stopPropagation(); setActive(i => (i-1+images.length)%images.length); }}
//                 className="absolute flex items-center justify-center -translate-y-1/2 rounded-full left-4 top-1/2 w-11 h-11"
//                 style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
//                 <ChevronLeft size={22} />
//               </button>
//               <button onClick={e => { e.stopPropagation(); setActive(i => (i+1)%images.length); }}
//                 className="absolute flex items-center justify-center -translate-y-1/2 rounded-full right-4 top-1/2 w-11 h-11"
//                 style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
//                 <ChevronRight size={22} />
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </>
//   );
// }

// // ── Section wrapper ────────────────────────────────────────────────────────────
// function Section({ title, accent = 'var(--gold)', children }: { title: string; accent?: string; children: React.ReactNode }) {
//   return (
//     <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-3 h-3 rounded-sm" style={{ background: accent }} />
//         <h2 className="text-[10px] font-black tracking-[0.18em] uppercase"
//           style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>{title}</h2>
//       </div>
//       {children}
//     </div>
//   );
// }

// // ── Enquiry form ───────────────────────────────────────────────────────────────
// function EnquiryForm({ shortCode, listingTitle }: { shortCode: string; listingTitle: string }) {
//   const [form, setForm]     = useState({ name: '', phone: '', message: '' });
//   const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!form.phone) return;
//     setStatus('loading');
//     try {
//       const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/enquiry/${shortCode}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...form, source: 'website' }),
//       });
//       setStatus(r.ok ? 'done' : 'error');
//     } catch { setStatus('error'); }
//   }

//   if (status === 'done') {
//     return (
//       <div className="py-10 space-y-2 text-center">
//         <div className="text-4xl">✅</div>
//         <div className="text-base font-bold" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Enquiry Sent!</div>
//         <div className="text-sm" style={{ color: 'var(--dim)' }}>The agent will contact you shortly.</div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       {[
//         { key: 'name',    placeholder: 'Your name',         type: 'text' },
//         { key: 'phone',   placeholder: '10-digit mobile *', type: 'tel',  required: true },
//       ].map(({ key, placeholder, type, required }) => (
//         <input key={key}
//           type={type} required={required}
//           placeholder={placeholder}
//           value={(form as any)[key]}
//           onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
//           className="w-full px-4 py-3 text-sm transition-all outline-none rounded-xl"
//           style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--white)' }}
//         />
//       ))}
//       <textarea rows={3} placeholder="Message (optional)"
//         value={form.message}
//         onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
//         className="w-full px-4 py-3 text-sm transition-all outline-none resize-none rounded-xl"
//         style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--white)' }}
//       />
//       {status === 'error' && <p className="text-xs" style={{ color: 'var(--red)' }}>Something went wrong. Please try again.</p>}
//       <button type="submit" disabled={status === 'loading'}
//         className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-98 disabled:opacity-60"
//         style={{ background: 'var(--gold)', color: 'var(--bg)', boxShadow: '0 4px 20px rgba(232,184,75,0.3)' }}>
//         {status === 'loading' ? 'Sending…' : 'Send Enquiry'}
//       </button>
//     </form>
//   );
// }

// // ── Main inner component ───────────────────────────────────────────────────────
// function PropertyPageInner({ listing, isUnavailable }: { listing: Listing; isUnavailable: boolean }) {
//   const { t, locale } = useLocale();
//   const [copied, setCopied] = useState(false);

//   const images  = listing.images || [];
//   const isSold  = listing.status === 'sold';
//   const isRented= listing.status === 'rented';
//   const isGone  = isSold || isRented || isUnavailable;
//   const { main: priceMain, sub: priceSub } = formatPrice(listing.price, listing.listing_type);
//   const shortUrl= typeof window !== 'undefined' ? window.location.href : `/${listing.short_code}`;

//   function handleShare() {
//     if (navigator.share) { navigator.share({ title: listing.title, url: shortUrl }).catch(() => {}); }
//     else { navigator.clipboard.writeText(shortUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
//   }

//   function handleWhatsApp() {
//     const msg = encodeURIComponent(`${listing.title}\n${listing.city}, ${listing.state}\n${priceMain}${priceSub}\n\n${shortUrl}`);
//     const ph = listing.agent_phone?.replace(/\D/g, '');
//     window.open(`https://wa.me/91${ph}?text=${msg}`, '_blank');
//   }

//   const initials = listing.agent_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

//   return (
//     <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--white)' }}>

//       {/* ── Sold/Rented Banner ──────────────────────────────────────────── */}
//       {isGone && (
//         <div className="sticky top-0 z-40 py-2.5 text-center text-sm font-bold"
//           style={{ background: isSold ? 'var(--gold)' : 'var(--red)', color: '#000' }}>
//           {isSold ? '🏷 This property has been SOLD' : isRented ? '🔑 This property is RENTED' : '⚠ This listing is no longer available'}
//         </div>
//       )}

//       {/* ── Top navigation bar ──────────────────────────────────────────── */}
//       <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
//         style={{ background: 'rgba(7,9,13,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
//         <button onClick={() => window.history.back()}
//           className="flex items-center justify-center w-8 h-8 transition-all rounded-xl"
//           style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--dim)' }}>
//           <ChevronLeft size={16} />
//         </button>

//         <div className="flex items-center flex-1 min-w-0 gap-2 mx-3">
//           <div className="flex-shrink-0 w-5 h-5 rounded" style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold3))' }}>
//             <QrCode size={12} style={{ margin: '3.5px auto', display: 'block', color: 'var(--bg)' }} />
//           </div>
//           <span className="text-xs font-bold truncate" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
//             qrestate.in/p/{listing.short_code}
//           </span>
//         </div>

//         <div className="flex items-center flex-shrink-0 gap-2">
//           <LanguagePicker />
//           <button onClick={handleShare}
//             className="flex items-center justify-center w-8 h-8 transition-all rounded-xl"
//             style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--dim)' }}>
//             <Share2 size={14} />
//           </button>
//           {listing.id && <SaveButton listingId={listing.id} listingTitle={listing.title} listingPrice={listing.price} variant="icon" />}
//         </div>
//       </div>

//       {/* ── Content ─────────────────────────────────────────────────────── */}
//       <div className="max-w-xl mx-auto pb-28">

//         {/* Image carousel */}
//         <ImageCarousel images={images} title={listing.title} />

//         {/* ── Hero info ──────────────────────────────────────────────────── */}
//         <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
//           {/* Status + type tags */}
//           <div className="flex flex-wrap items-center gap-2 mb-3">
//             <span className="text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
//               style={{ background: listing.listing_type === 'sale' ? 'rgba(232,184,75,0.1)' : 'rgba(24,212,200,0.1)', color: listing.listing_type === 'sale' ? 'var(--gold)' : 'var(--teal)', border: `1px solid ${listing.listing_type === 'sale' ? 'rgba(232,184,75,0.25)' : 'rgba(24,212,200,0.25)'}`, fontFamily: 'var(--font-mono)' }}>
//               For {listing.listing_type === 'sale' ? 'Sale' : 'Rent'}
//             </span>
//             <span className="text-[8px] font-bold px-2.5 py-1 rounded-full capitalize"
//               style={{ background: 'var(--surface)', color: 'var(--dim)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
//               {listing.property_type}
//             </span>
//             {listing.furnishing && (
//               <span className="text-[8px] font-bold px-2.5 py-1 rounded-full capitalize"
//                 style={{ background: 'var(--surface)', color: 'var(--dim)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
//                 {listing.furnishing}
//               </span>
//             )}
//           </div>

//           {/* Title */}
//           <h1 className="mb-3 text-xl font-black leading-tight"
//             style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>
//             {listing.title}
//           </h1>

//           {/* Price */}
//           <div className="flex items-baseline gap-1.5 mb-2">
//             <span className="text-3xl font-black" style={{ color: 'var(--gold)', fontFamily: 'var(--font-syne)', textShadow: '0 0 24px rgba(232,184,75,0.3)' }}>
//               {priceMain}
//             </span>
//             <span className="text-sm" style={{ color: 'var(--dim)' }}>{priceSub}</span>
//             {listing.price_negotiable && (
//               <span className="text-[9px] font-bold ml-1 px-2 py-0.5 rounded-full"
//                 style={{ background: 'rgba(40,216,144,0.1)', color: 'var(--green)', border: '1px solid rgba(40,216,144,0.2)' }}>
//                 Negotiable
//               </span>
//             )}
//           </div>

//           {/* Location */}
//           <div className="flex items-start gap-1.5 mb-4">
//             <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--red)' }} />
//             <span className="text-sm" style={{ color: 'var(--muted)' }}>
//               {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
//               {listing.pincode ? ` - ${listing.pincode}` : ''}
//             </span>
//           </div>

//           {/* Key specs */}
//           <div className="grid grid-cols-3 gap-2">
//             {listing.bedrooms != null && (
//               <div className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//                 <BedDouble size={16} style={{ color: 'var(--teal)' }} />
//                 <span className="text-sm font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{listing.bedrooms}</span>
//                 <span className="text-[9px]" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Bedrooms</span>
//               </div>
//             )}
//             {listing.bathrooms != null && (
//               <div className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//                 <Bath size={16} style={{ color: 'var(--purple)' }} />
//                 <span className="text-sm font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{listing.bathrooms}</span>
//                 <span className="text-[9px]" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Bathrooms</span>
//               </div>
//             )}
//             {listing.area_sqft && (
//               <div className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//                 <Maximize2 size={16} style={{ color: 'var(--gold)' }} />
//                 <span className="text-sm font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{listing.area_sqft.toLocaleString()}</span>
//                 <span className="text-[9px]" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>sqft</span>
//               </div>
//             )}
//           </div>

//           {/* Additional specs */}
//           <div className="flex flex-wrap gap-2 mt-3">
//             {listing.floor_number != null && listing.total_floors && (
//               <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
//                 🏢 Floor {listing.floor_number}/{listing.total_floors}
//               </span>
//             )}
//             {listing.facing && (
//               <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
//                 🧭 {listing.facing} Facing
//               </span>
//             )}
//           </div>
//         </div>

//         {/* ── Description ─────────────────────────────────────────────────── */}
//         {listing.description && (
//           <Section title="About This Property">
//             <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', whiteSpace: 'pre-line' }}>
//               {listing.description}
//             </p>
//           </Section>
//         )}

//         {/* ── Amenities ───────────────────────────────────────────────────── */}
//         {listing.amenities?.length > 0 && (
//           <Section title="Amenities & Features" accent="var(--green)">
//             <div className="flex flex-wrap gap-2">
//               {listing.amenities.map(a => (
//                 <span key={a} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
//                   style={{ background: 'rgba(40,216,144,0.07)', color: 'var(--green)', border: '1px solid rgba(40,216,144,0.18)' }}>
//                   {AMENITY_ICONS[a] || <CheckCircle2 size={10} />}
//                   {a}
//                 </span>
//               ))}
//             </div>
//           </Section>
//         )}

//         {/* ── Neighbourhood ───────────────────────────────────────────────── */}
//         {listing.id && (
//           <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--purple)' }} />
//               <h2 className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Neighbourhood</h2>
//             </div>
//             <NeighbourhoodPanel listingId={listing.id} />
//           </div>
//         )}

//         {/* ── Virtual Tour ─────────────────────────────────────────────────── */}
//         {listing.tour_url && listing.embed_url && (
//           <Section title="360° Virtual Tour" accent="var(--teal)">
//             <VirtualTourEmbed tourUrl={listing.tour_url} embedUrl={listing.embed_url} shortCode={listing.short_code} apiBase={process.env.NEXT_PUBLIC_API_URL || ''} />
//           </Section>
//         )}

//         {/* ── Agent card ──────────────────────────────────────────────────── */}
//         <Section title="Listed By" accent="var(--teal)">
//           <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
//             <div className="flex items-center justify-center flex-shrink-0 text-xl font-black w-14 h-14 rounded-2xl"
//               style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold3))', color: 'var(--bg)', fontFamily: 'var(--font-syne)' }}>
//               {initials}
//             </div>
//             <div className="min-w-0">
//               <div className="text-base font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{listing.agent_name}</div>
//               {listing.agent_phone && (
//                 <div className="text-sm mt-0.5" style={{ color: 'var(--dim)' }}>+91 {listing.agent_phone}</div>
//               )}
//               {listing.agent_rera && (
//                 <div className="flex items-center gap-1 mt-1">
//                   <CheckCircle2 size={10} style={{ color: 'var(--green)' }} />
//                   <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--green)' }}>
//                     RERA: {listing.agent_rera}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </Section>

//         {/* ── Callback button ──────────────────────────────────────────────── */}
//         {!isGone && listing.agent_phone && listing.id && (
//           <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
//             <CallbackButton listingId={listing.id} agentName={listing.agent_name} apiBaseUrl={process.env.NEXT_PUBLIC_API_URL || ''} />
//           </div>
//         )}

//         {/* ── Enquiry form ─────────────────────────────────────────────────── */}
//         {!isGone && (
//           <Section title="Send Enquiry" accent="var(--gold)">
//             <EnquiryForm shortCode={listing.short_code} listingTitle={listing.title} />
//           </Section>
//         )}

//         {/* ── Stats + Share ─────────────────────────────────────────────────── */}
//         <div className="px-4 py-4 flex items-center flex-wrap gap-4 text-[10px]" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
//           <span className="flex items-center gap-1"><Eye size={11} /> {listing.view_count?.toLocaleString() || 0} views</span>
//           {listing.qr_scans != null && <span className="flex items-center gap-1"><QrCode size={11} /> {listing.qr_scans} scans</span>}
//           <button onClick={handleShare} className="flex items-center gap-1 hover:text-[var(--white)] transition-colors ml-auto">
//             <Share2 size={11} /> {copied ? 'Copied!' : 'Share'}
//           </button>
//         </div>

//         {/* ── Powered by ───────────────────────────────────────────────────── */}
//         <div className="py-8 space-y-1 text-center" style={{ borderTop: '1px solid var(--border)' }}>
//           <div className="text-[8px] uppercase tracking-[0.25em]" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>Powered by</div>
//           <div className="text-sm font-black" style={{ color: 'var(--gold)', fontFamily: 'var(--font-syne)' }}>QR Estate</div>
//           <div className="text-[9px]" style={{ color: 'var(--dim)' }}>India's Smart Real Estate Platform</div>
//         </div>
//       </div>

//       {/* ── Sticky CTA ───────────────────────────────────────────────────── */}
//       {!isGone && listing.agent_phone && (
//         <div className="fixed bottom-0 left-0 right-0 z-40 flex max-w-xl gap-3 px-4 py-3 mx-auto"
//           style={{ background: 'rgba(7,9,13,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
//           <a href={`tel:+91${listing.agent_phone.replace(/\D/g,'')}`}
//             className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-97"
//             style={{ background: 'var(--surface)', color: 'var(--white)', border: '1px solid var(--border)' }}>
//             <Phone size={15} /> Call Agent
//           </a>
//           <button onClick={handleWhatsApp}
//             className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-97"
//             style={{ background: '#25D366', color: '#fff', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}>
//             <MessageCircle size={15} /> WhatsApp
//           </button>
//         </div>
//       )}

//       {/* ── AI Chat Widget ───────────────────────────────────────────────── */}
//       {!isGone && listing.id && (
//         <AIChatWidget listingId={listing.id} listingTitle={listing.title} agentName={listing.agent_name} />
//       )}
//     </div>
//   );
// }

// // ── Exported wrapper ───────────────────────────────────────────────────────────
// export function PropertyPageClient({ listing, isUnavailable }: { listing: any; isUnavailable: boolean }) {
//   return (
//     <LocaleProvider>
//       <PropertyPageInner listing={listing} isUnavailable={isUnavailable} />
//     </LocaleProvider>
//   );
// }


'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin, BedDouble, Bath, Maximize2, Phone, MessageCircle,
  Share2, ChevronLeft, ChevronRight, CheckCircle2, Heart,
  Home, Layers, Eye, Star, QrCode, Zap, ArrowDown,
  Building2, Compass, Calendar, AlertTriangle,
} from 'lucide-react';
import { LocaleProvider, useLocale, formatPriceLocalized } from '@/i18n';

const LanguagePicker  = dynamic(() => import('@/components/property/LanguagePicker').then(m => m.LanguagePicker),  { ssr: false, loading: () => <div className="w-[72px] h-[28px]" /> });
const CallbackButton  = dynamic(() => import('@/components/property/CallbackButton').then(m => m.CallbackButton),  { ssr: false, loading: () => null });
const VirtualTourEmbed = dynamic(() => import('@/components/property/VirtualTourEmbed').then(m => m.VirtualTourEmbed), { ssr: false, loading: () => null });
const AIChatWidget    = dynamic(() => import('@/components/chat/AIChatWidget').then(m => m.AIChatWidget),          { ssr: false, loading: () => null });

interface Listing {
  id: string; title: string; description?: string;
  property_type: string; listing_type: string;
  price: number; price_negotiable: boolean;
  bedrooms?: number; bathrooms?: number; area_sqft?: number;
  floor_number?: number; total_floors?: number;
  furnishing?: string; facing?: string;
  address: string; locality?: string; city: string; state: string; pincode?: string;
  images: { url: string; is_primary: boolean }[];
  amenities: string[];
  status: string; view_count: number; short_code: string;
  agent_name: string; agent_phone?: string; agent_rera?: string; agent_photo?: string;
  qr_scans?: number; tour_url?: string | null; embed_url?: string | null;
}

// ── 3D Particle Canvas ────────────────────────────────────────────────────────
function ParticleField({ color = '#18D4C8' }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = 520;

    // Parse color to rgb
    const hexR = parseInt(color.slice(1,3),16), hexG = parseInt(color.slice(3,5),16), hexB = parseInt(color.slice(5,7),16);

    interface P { x:number; y:number; z:number; vx:number; vy:number; vz:number; size:number }
    const PARTICLES: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 400 + 50,
      vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.2,
      vz: (Math.random()-.5)*1.2,
      size: Math.random() * 2.5 + .5,
    }));

    // Connection lines
    function drawLines() {
      for (let i = 0; i < PARTICLES.length; i++) {
        const a = PARTICLES[i];
        const projA = { x: (a.x - W/2) * (400/a.z) + W/2, y: (a.y - H/2) * (400/a.z) + H/2 };
        for (let j = i+1; j < PARTICLES.length; j++) {
          const b = PARTICLES[j];
          const projB = { x: (b.x - W/2) * (400/b.z) + W/2, y: (b.y - H/2) * (400/b.z) + H/2 };
          const dist = Math.hypot(projA.x - projB.x, projA.y - projB.y);
          if (dist < 110) {
            ctx.globalAlpha = (1 - dist/110) * .12;
            ctx.strokeStyle = `rgb(${hexR},${hexG},${hexB})`;
            ctx.lineWidth = .5;
            ctx.beginPath();
            ctx.moveTo(projA.x, projA.y);
            ctx.lineTo(projB.x, projB.y);
            ctx.stroke();
          }
        }
      }
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      t++;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#07090D');
      grad.addColorStop(1, 'rgba(7,9,13,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Ambient blob
      const bg = ctx.createRadialGradient(W*.5, H*.4, 0, W*.5, H*.4, Math.min(W,H)*.6);
      bg.addColorStop(0, `rgba(${hexR},${hexG},${hexB},0.06)`);
      bg.addColorStop(1, 'transparent');
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawLines();

      PARTICLES.forEach(p => {
        // 3D perspective projection
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (p.z <= 1) p.z = 400;
        if (p.z >= 450) p.z = 20;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        const scale = 400 / p.z;
        const px = (p.x - W/2) * scale + W/2;
        const py = (p.y - H/2) * scale + H/2;
        const sr = p.size * scale;
        const alpha = Math.min(1, scale * 0.5);

        const pulse = 0.6 + Math.sin(t * 0.02 + p.z * 0.01) * 0.4;

        ctx.globalAlpha = alpha * pulse * 0.8;
        ctx.fillStyle = `rgb(${hexR},${hexG},${hexB})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.3, sr), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', onResize); };
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full" style={{ height: 520, pointerEvents: 'none' }} />;
}

// ── GSAP Scroll reveal hook ───────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Reveal wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={className}
      style={{ opacity: 0, transform: 'translateY(28px)', transition: `opacity .7s ${delay}ms cubic-bezier(.22,1,.36,1), transform .7s ${delay}ms cubic-bezier(.22,1,.36,1)` }}>
      {children}
    </div>
  );
}

// ── Image carousel with parallax ──────────────────────────────────────────────
function ImageCarousel({ images, title }: { images: { url: string; is_primary: boolean }[]; title: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir]       = useState(0);
  const imgs = images.length > 0 ? images : [{ url: '/placeholder.jpg', is_primary: true }];

  const go = (n: number) => {
    setDir(n);
    setActive(i => (i + n + imgs.length) % imgs.length);
  };

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[#07090D] select-none">
      {/* Images */}
      {imgs.map((img, i) => (
        <div key={img.url + i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 2 : 1 }}>
          <img
            src={img.url || '/placeholder.jpg'}
            alt={`${title} ${i + 1}`}
            className="object-cover w-full h-full"
            style={{ transform: i === active ? 'scale(1.03)' : 'scale(1)', transition: 'transform 8s ease' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090D]/30 via-transparent to-transparent" />
        </div>
      ))}

      {/* Sold/Rented banner */}
      {/* Navigation */}
      {imgs.length > 1 && (
        <>
          <button onClick={() => go(-1)}
            className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition-all -translate-y-1/2 border rounded-full left-3 sm:left-5 top-1/2 bg-black/40 backdrop-blur-sm border-white/10 hover:bg-black/60 hover:scale-105">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(1)}
            className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition-all -translate-y-1/2 border rounded-full right-3 sm:right-5 top-1/2 bg-black/40 backdrop-blur-sm border-white/10 hover:bg-black/60 hover:scale-105">
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`rounded-full transition-all ${i === active ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
        </>
      )}

      {/* Count pill */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
        <span className="text-[10px] font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>{active + 1} / {imgs.length}</span>
      </div>
    </div>
  );
}

// ── Stat pill ──────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm min-w-[72px]">
      <Icon size={15} style={{ color }} />
      <span className="text-[15px] font-extrabold text-white leading-none" style={{ fontFamily: 'var(--font-syne)' }}>{value || '—'}</span>
      <span className="text-[9px] uppercase tracking-wide text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>{label}</span>
    </div>
  );
}

// ── Amenity chip ───────────────────────────────────────────────────────────────
function AmenityChip({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-[12px] text-white/70 hover:text-white hover:border-white/20 transition-colors">
      <CheckCircle2 size={11} className="text-[var(--teal)] flex-shrink-0" />
      {label}
    </span>
  );
}

// ── Main inner page ────────────────────────────────────────────────────────────
// function PropertyPageInner({ listing, isUnavailable }: { listing: Listing; isUnavailable: boolean }) {
function PropertyPageInner({
  listing,
  shortCode,
  isUnavailable,
}: {
  listing: Listing;
  shortCode: string;
  isUnavailable: boolean;
}){
  const { t, locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [eoiOpen, setEoiOpen] = useState(false);

  const images   = listing.images || [];
  const isSold   = listing.status === 'sold';
  const isRented = listing.status === 'rented';
  const isGone   = isSold || isRented || isUnavailable;

  const { main: priceMain, unit: priceUnit } = formatPriceLocalized(listing.price, listing.listing_type, t, locale);
  const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? ''}/${listing.short_code}`;

  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v1$/, '').replace(/\/api$/, '');

  function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : shortUrl;
    if (navigator.share) { navigator.share({ title: listing.title, url }).catch(() => {}); }
    else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }
  function handleWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : shortUrl;
    const msg = encodeURIComponent(`${listing.title}\n${listing.city}, ${listing.state}\n₹${listing.price.toLocaleString('en-IN')}\n\n${url}`);
    const phone = listing.agent_phone?.replace(/\D/g, '');
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white overflow-x-hidden">

      {/* ── HERO — Full-width 3D canvas + image ── */}
      <section className="relative w-full" style={{ minHeight: 520 }}>
        <ParticleField color={isGone ? '#566070' : '#18D4C8'} />

        {/* Image carousel over canvas */}
        <div className="relative z-10">
          <ImageCarousel images={images} title={listing.title} />
        </div>

        {/* Floating header bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)' }}>
              <QrCode size={14} className="text-[#07090D]" strokeWidth={2.5} />
            </div>
            <span className="hidden sm:block text-[13px] font-extrabold text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-syne)' }}>
              QR<span style={{ color: '#E8B84B' }}>Estate</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <LanguagePicker />
            <button onClick={() => setSaved(v => !v)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${saved ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-black/30 border-white/10 text-white/60 hover:text-white'}`}>
              <Heart size={15} className={saved ? 'fill-current' : ''} />
            </button>
            <button onClick={handleShare}
              className="flex items-center justify-center transition-all border rounded-full w-9 h-9 bg-black/30 border-white/10 text-white/60 hover:text-white">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Sold/Rented overlay */}
        {isGone && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center px-6 py-5 rounded-2xl bg-[#07090D]/80 border border-white/10">
              <AlertTriangle size={28} className="mx-auto mb-2 text-[#E8B84B]" />
              <div className="text-[18px] font-extrabold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                {isSold ? 'This property has been sold' : isRented ? 'This property has been rented' : 'Listing removed'}
              </div>
              <p className="text-[13px] text-white/50 mt-1">Contact the agent for similar properties</p>
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute z-20 flex flex-col items-center gap-1 -translate-x-1/2 bottom-8 left-1/2 animate-bounce opacity-60">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>scroll</span>
          <ArrowDown size={14} className="text-white/40" />
        </div>
      </section>

      {/* ── PRICE + QUICK STATS bar ── */}
      <Reveal>
        <section className="relative z-10 w-full bg-[#0C0F14]/90 backdrop-blur-xl border-y border-white/5">
          <div className="flex flex-col items-start justify-between max-w-6xl gap-4 px-4 py-5 mx-auto sm:px-8 sm:flex-row sm:items-center">
            {/* Price */}
            <div>
              <div className="text-[9px] font-black tracking-[0.2em] uppercase text-white/30 mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                {listing.listing_type === 'rent' ? 'Monthly Rent' : 'Sale Price'}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[2.2rem] font-extrabold leading-none" style={{ fontFamily: 'var(--font-syne)', color: '#E8B84B' }}>
                  {priceMain}
                </span>
                {priceUnit && <span className="text-[15px] text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>{priceUnit}</span>}
                {listing.price_negotiable && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#28D890]/30 text-[#28D890] bg-[#28D890]/08 ml-1" style={{ fontFamily: 'var(--font-mono)' }}>
                    Negotiable
                  </span>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-2">
              {listing.bedrooms  && <StatPill icon={BedDouble}  value={listing.bedrooms}  label="Beds"    color="#18D4C8" />}
              {listing.bathrooms && <StatPill icon={Bath}       value={listing.bathrooms} label="Baths"   color="#A870F8" />}
              {listing.area_sqft && <StatPill icon={Maximize2}  value={`${listing.area_sqft.toLocaleString()}`} label="Sq.ft" color="#E8B84B" />}
              {listing.floor_number != null && (
                <StatPill icon={Layers} value={`${listing.floor_number}/${listing.total_floors ?? '?'}`} label="Floor" color="#28D890" />
              )}
              <StatPill icon={Eye} value={listing.view_count} label="Views" color="#4898F8" />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── MAIN CONTENT — 2-col layout ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">

          {/* Title + location */}
          <Reveal>
            <div>
              <h1 className="text-[1.8rem] sm:text-[2.2rem] font-extrabold text-white leading-tight mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-white/50 text-[13px]">
                <MapPin size={14} className="text-[#18D4C8] flex-shrink-0" />
                <span>{listing.address}{listing.locality ? `, ${listing.locality}` : ''}, {listing.city}, {listing.state}{listing.pincode ? ` - ${listing.pincode}` : ''}</span>
              </div>
            </div>
          </Reveal>

          {/* Property details grid */}
          <Reveal delay={60}>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                <Home size={14} className="text-[#18D4C8]" />
                <span className="text-[11px] font-black tracking-[0.18em] uppercase text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>Property Details</span>
              </div>
              <div className="grid grid-cols-2 gap-px sm:grid-cols-3 bg-white/5">
                {[
                  { label: 'Type',        value: listing.property_type },
                  { label: 'Purpose',     value: listing.listing_type  },
                  { label: 'Furnishing',  value: listing.furnishing    },
                  { label: 'Facing',      value: listing.facing        },
                  { label: 'Status',      value: listing.status        },
                  { label: 'RERA',        value: listing.agent_rera    },
                ].filter(d => d.value).map(({ label, value }) => (
                  <div key={label} className="bg-[#0C0F14] px-4 py-3.5">
                    <div className="text-[9px] font-black tracking-[0.15em] uppercase text-white/25 mb-1" style={{ fontFamily: 'var(--font-mono)' }}>{label}</div>
                    <div className="text-[13px] font-semibold text-white capitalize">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Description */}
          {listing.description && (
            <Reveal delay={100}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6">
                <div className="text-[11px] font-black tracking-[0.18em] uppercase text-white/30 mb-3" style={{ fontFamily: 'var(--font-mono)' }}>About this property</div>
                <p className="text-[14px] text-white/60 leading-[1.85] whitespace-pre-line">{listing.description}</p>
              </div>
            </Reveal>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <Reveal delay={120}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6">
                <div className="text-[11px] font-black tracking-[0.18em] uppercase text-white/30 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                  Amenities ({listing.amenities.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map(a => <AmenityChip key={a} label={a} />)}
                </div>
              </div>
            </Reveal>
          )}

          {/* Virtual tour */}
          {(listing.tour_url || listing.embed_url) && (
            <Reveal delay={140}>
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                  <Compass size={14} className="text-[#A870F8]" />
                  <span className="text-[11px] font-black tracking-[0.18em] uppercase text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>Virtual Tour</span>
                </div>
                <div className="p-5">
                  <VirtualTourEmbed  shortCode={shortCode} tourUrl={listing.tour_url || ''} embedUrl={listing.embed_url || ''} />
                </div>
              </div>
            </Reveal>
          )}

          {/* Map placeholder */}
          <Reveal delay={160}>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                <MapPin size={14} className="text-[#F04060]" />
                <span className="text-[11px] font-black tracking-[0.18em] uppercase text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>Location</span>
              </div>
              <div className="aspect-[16/7] bg-[#11161E] flex items-center justify-center">
                <div className="text-center text-white/20">
                  <MapPin size={32} className="mx-auto mb-2" />
                  <p className="text-[12px]" style={{ fontFamily: 'var(--font-mono)' }}>{listing.city}, {listing.state}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── RIGHT COLUMN — sticky agent card ── */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">

          {/* Agent card */}
          <Reveal delay={80}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
              {/* Accent top */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#E8B84B,transparent)' }} />
              <div className="p-5">
                <div className="text-[9px] font-black tracking-[0.2em] uppercase text-white/25 mb-4" style={{ fontFamily: 'var(--font-mono)' }}>Listed By</div>
                <div className="flex items-center gap-3 mb-5">
                  {listing.agent_photo ? (
                    <img src={listing.agent_photo} alt={listing.agent_name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E8B84B]/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-black text-[#07090D] flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#18D4C8,#A870F8)' }}>
                      {listing.agent_name?.charAt(0)?.toUpperCase() ?? 'A'}
                    </div>
                  )}
                  <div>
                    <div className="text-[15px] font-bold text-white">{listing.agent_name}</div>
                    {listing.agent_rera && (
                      <div className="text-[9px] text-white/30 mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>RERA: {listing.agent_rera}</div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-[#E8B84B] text-[#E8B84B]" />)}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {!isGone && listing.agent_phone && (
                  <div className="space-y-2.5">
                    <a href={`tel:+91${listing.agent_phone.replace(/\D/g,'')}`}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-[13px] text-[#07090D] transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)', fontFamily: 'var(--font-syne)' }}>
                      <Phone size={15} /> Call Agent
                    </a>
                    <button onClick={handleWhatsApp}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-[13px] text-[#07090D] bg-[#25D366] hover:opacity-90 transition-all"
                      style={{ fontFamily: 'var(--font-syne)' }}>
                      <MessageCircle size={15} /> WhatsApp
                    </button>
                    <CallbackButton listingId={listing.id} agentName={listing.agent_name} apiBaseUrl={apiBase} />
                    <button onClick={() => setEoiOpen(true)}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-[13px] text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                      style={{ fontFamily: 'var(--font-syne)' }}>
                      <Zap size={15} className="text-[#18D4C8]" /> Express Interest (EOI)
                    </button>
                    <button onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] text-white/40 border border-white/5 hover:border-white/15 hover:text-white/70 transition-all"
                      style={{ fontFamily: 'var(--font-mono)' }}>
                      <Share2 size={12} /> {copied ? 'Link copied!' : 'Share listing'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* QR scan stats */}
          <Reveal delay={120}>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(24,212,200,0.1)] border border-[rgba(24,212,200,0.2)] flex items-center justify-center flex-shrink-0">
                <QrCode size={18} className="text-[#18D4C8]" />
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-[#18D4C8]" style={{ fontFamily: 'var(--font-syne)' }}>{listing.qr_scans ?? 0}</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>QR Scans</div>
              </div>
            </div>
          </Reveal>

          {/* Property type badge */}
          <Reveal delay={140}>
            <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4">
              <div className="text-[9px] font-black tracking-[0.2em] uppercase text-white/25 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>Listing ID</div>
              <div className="font-mono text-[11px] text-white/40 break-all" style={{ fontFamily: 'var(--font-mono)' }}>
                {listing.short_code}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── AI Chat widget ── */}
      <AIChatWidget listingId={listing.id} />

      {/* ── EOI Modal ── */}
      {eoiOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center bg-black/70 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setEoiOpen(false); }}>
          <div className="w-full max-w-lg bg-[#0C0F14] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="w-full h-1" style={{ background: 'linear-gradient(90deg,#18D4C8,#E8B84B)' }} />
            <div className="p-6">
              <div className="text-[9px] font-black tracking-[0.2em] uppercase text-[#18D4C8] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>Expression of Interest</div>
              <div className="text-[17px] font-extrabold text-white mb-5" style={{ fontFamily: 'var(--font-syne)' }}>{listing.title}</div>
              {/* EOIForm would go here — import from @/components/eoi/EOIForm */}
              <p className="text-[13px] text-white/40 text-center py-8">EOI form integrates here via <code className="text-[#18D4C8]">EOIForm</code> component</p>
              <button onClick={() => setEoiOpen(false)}
                className="w-full py-3 rounded-xl border border-white/10 text-[13px] font-semibold text-white/40 hover:text-white hover:border-white/20 transition-all mt-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="px-4 py-8 mt-16 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md" style={{ background: 'linear-gradient(135deg,#E8B84B,#B89030)' }}>
            <QrCode size={12} className="text-[#07090D]" strokeWidth={2.5} />
          </div>
          <span className="text-[12px] font-bold text-white/40" style={{ fontFamily: 'var(--font-syne)' }}>QR<span style={{ color: '#E8B84B' }}>Estate</span></span>
        </div>
        <p className="text-[10px] text-white/20" style={{ fontFamily: 'var(--font-mono)' }}>
          Powered by QR Estate · India's QR-native property platform
        </p>
      </footer>
    </div>
  );
}

// ── Default export wrapped with LocaleProvider ────────────────────────────────
export default function PropertyPageClient({
  listing,
  shortCode,
  isUnavailable = false,
}: {
  listing: Listing;
  shortCode: string;
  isUnavailable?: boolean;
}) {
  return (
    <LocaleProvider>
      <PropertyPageInner
        listing={listing}
        shortCode={shortCode}
        isUnavailable={isUnavailable}
      />
    </LocaleProvider>
  );
}