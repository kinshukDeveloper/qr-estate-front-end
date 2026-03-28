'use client';

import { useState } from 'react';
import {
  MapPin, BedDouble, Bath, Maximize2,
  Phone, MessageCircle, Share2, ChevronLeft, ChevronRight,
  CheckCircle2, AlertTriangle, Home, Layers,
} from 'lucide-react';
import { LocaleProvider, useLocale, formatPriceLocalized } from '@/i18n';
import { CallbackButton }   from '@/components/property/CallbackButton';
import { VirtualTourEmbed } from '@/components/property/VirtualTourEmbed';
import { LanguagePicker } from '@/components/property/LanguagePicker';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Listing {
  id:               string;
  title:            string;
  description?:     string;
  property_type:    string;
  listing_type:     string;
  price:            number;
  price_negotiable: boolean;
  bedrooms?:        number;
  bathrooms?:       number;
  area_sqft?:       number;
  floor_number?:    number;
  total_floors?:    number;
  furnishing?:      string;
  facing?:          string;
  address:          string;
  locality?:        string;
  city:             string;
  state:            string;
  pincode?:         string;
  images:           { url: string; is_primary: boolean }[];
  amenities:        string[];
  status:           string;
  view_count:       number;
  short_code:       string;
  agent_name:       string;
  agent_phone?:     string;
  agent_rera?:      string;
  agent_photo?:     string;
  qr_scans?:        number;
  tour_url?:        string | null;
  embed_url?:       string | null;
}

// ── Inner page (uses locale context) ─────────────────────────────────────────
function PropertyPageInner({
  listing,
  isUnavailable,
}: {
  listing: Listing;
  isUnavailable: boolean;
}) {
  const { t, locale } = useLocale();
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied]           = useState(false);

  const images   = listing.images || [];
  const isSold   = listing.status === 'sold';
  const isRented = listing.status === 'rented';
  const isGone   = isSold || isRented || isUnavailable;

  // Localised price
  const { main: priceMain, unit: priceUnit } =
    formatPriceLocalized(listing.price, listing.listing_type, t, locale);

  // Localised property type / furnishing / facing
  const propTypeLabel  = (t.propertyType as any)[listing.property_type]  ?? listing.property_type;
  const furnishLabel   = listing.furnishing ? (t.furnishing as any)[listing.furnishing] ?? listing.furnishing : null;
  const facingLabel    = listing.facing     ? (t.facing as any)[listing.facing]         ?? listing.facing     : null;
  const purposeLabel   = (t.listingType as any)[listing.listing_type]    ?? listing.listing_type;
  const statusLabel    = (t.status as any)[listing.status]               ?? listing.status;

  // Short URL for sharing
  const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? ''}/${listing.short_code}`;

  function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : shortUrl;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: listing.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : shortUrl;
    const msg = encodeURIComponent(
      `${listing.title}\n${listing.city}, ${listing.state}\n₹${listing.price.toLocaleString('en-IN')}\n\n${url}`
    );
    const phone = listing.agent_phone?.replace(/\D/g, '');
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  }

  // Banner text
  function getBannerText() {
    if (isSold)       return t.banner.sold;
    if (isRented)     return t.banner.rented;
    return t.banner.removed;
  }

  return (
    <div
      className="min-h-screen bg-[#F5F2EE]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Unavailable Banner ─────────────────────────────────── */}
      {isGone && (
        <div className="bg-[#1A0A00] text-[#FFB830] text-center py-3 px-4 text-sm font-bold tracking-wide flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          {getBannerText()}
        </div>
      )}

      {/* ── Image Gallery ──────────────────────────────────────── */}
      <div
        className="relative bg-[#1C1C1C] overflow-hidden"
        style={{ height: 'min(60vw, 420px)' }}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[activeImage]?.url}
              alt={listing.title}
              className="object-cover w-full h-full transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute flex items-center justify-center text-white transition-colors -translate-y-1/2 left-3 top-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm hover:bg-black/60"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveImage(i => (i + 1) % images.length)}
                  className="absolute flex items-center justify-center text-white transition-colors -translate-y-1/2 right-3 top-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm hover:bg-black/60"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute px-2 py-1 font-mono text-xs text-white top-4 right-4 bg-black/50 backdrop-blur-sm">
              {activeImage + 1}/{images.length}
            </div>

            {/* Language picker in image corner */}
            <div className="absolute top-4 left-4">
              <LanguagePicker />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#444]">
            <Home size={48} strokeWidth={1} />
            <span className="text-sm">{t.noPhotos}</span>
            {/* Language picker fallback position */}
            <div className="absolute top-4 left-4">
              <LanguagePicker />
            </div>
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-3 pb-2 overflow-x-auto scrollbar-none">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-12 h-12 overflow-hidden border-2 transition-all ${
                  i === activeImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <img src={img.url} className="object-cover w-full h-full" alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main Content ───────────────────────────────────────── */}
      <div className="max-w-xl px-4 pb-32 mx-auto">

        {/* Price + Status */}
        <div className="bg-white border-b-4 border-[#1C1C1C] px-5 py-5 -mx-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1C1C1C] leading-none">{priceMain}</span>
                <span className="text-sm font-semibold text-[#666]">{priceUnit}</span>
              </div>
              {listing.price_negotiable && (
                <span className="text-xs text-[#2D9945] font-semibold mt-0.5 block">
                  {t.price.negotiable}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 uppercase ${
                listing.status === 'active'
                  ? 'bg-[#E8F5E9] text-[#2D9945]'
                  : listing.status === 'sold'
                  ? 'bg-[#FFF3E0] text-[#E65100]'
                  : 'bg-[#FFF8E1] text-[#F57F17]'
              }`}>
                {statusLabel}
              </span>
              <span className="text-[10px] text-[#999] uppercase tracking-wide">
                {propTypeLabel} · {purposeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Title + Location */}
        <div className="bg-white px-5 py-5 -mx-4 mt-0 border-b border-[#EEE]">
          <h1 className="text-xl font-black text-[#1C1C1C] leading-snug mb-2">{listing.title}</h1>
          <div className="flex items-center gap-1.5 text-sm text-[#666]">
            <MapPin size={14} className="text-[#C0392B] flex-shrink-0" />
            <span>
              {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
              {listing.pincode ? ` — ${listing.pincode}` : ''}
            </span>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-4 gap-0 bg-[#1C1C1C] -mx-4 mt-3">
          {[
            { icon: BedDouble,  label: t.specs.beds,  value: listing.bedrooms    != null ? `${listing.bedrooms}`   : '—' },
            { icon: Bath,       label: t.specs.baths, value: listing.bathrooms   != null ? `${listing.bathrooms}`  : '—' },
            { icon: Maximize2,  label: t.specs.area,  value: listing.area_sqft   ? `${listing.area_sqft}`          : '—' },
            { icon: Layers,     label: t.specs.floor, value: listing.floor_number != null ? `${listing.floor_number}/${listing.total_floors ?? '?'}` : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-4 border-r border-[#333] last:border-0">
              <Icon size={16} className="text-[#00D4C8] mb-1" />
              <div className="text-sm font-bold text-white">{value}</div>
              <div className="text-[10px] text-[#666] uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Property Details */}
        <Section title={t.sections.propertyDetails}>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {[
              { label: t.details.type,       value: propTypeLabel },
              { label: t.details.purpose,    value: purposeLabel },
              furnishLabel && { label: t.details.furnishing, value: furnishLabel },
              facingLabel  && { label: t.details.facing,     value: facingLabel },
              listing.area_sqft   && { label: t.details.area,  value: `${listing.area_sqft} sq.ft` },
              listing.floor_number != null && {
                label: t.details.floor,
                value: `${listing.floor_number} ${t.details.of} ${listing.total_floors ?? '?'}`,
              },
            ].filter(Boolean).map((item: any) => (
              <div key={item.label}>
                <div className="text-[10px] text-[#999] uppercase tracking-wide mb-0.5">{item.label}</div>
                <div className="text-sm font-semibold text-[#1C1C1C]">{item.value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Property Code */}
        <div className="bg-white -mx-4 mt-3 px-5 py-3 border-b border-[#EEE] flex items-center justify-between">
          <span className="text-[10px] text-[#999] uppercase tracking-widest">{t.details.propertyCode}</span>
          <span className="font-mono text-sm font-bold text-[#1C1C1C] bg-[#F5F2EE] px-2.5 py-1 tracking-widest">
            {listing.short_code}
          </span>
        </div>

        {/* Description */}
        {listing.description && (
          <Section title={t.sections.aboutProperty}>
            <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line">{listing.description}</p>
          </Section>
        )}

        {/* Amenities */}
        {listing.amenities?.length > 0 && (
          <Section title={t.sections.amenities}>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map(a => (
                <span key={a} className="flex items-center gap-1.5 text-xs bg-[#F0FAF0] text-[#2D7A3A] px-3 py-1.5 font-medium border border-[#C8E6C9]">
                  <CheckCircle2 size={11} />
                  {a}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Location */}
        <Section title={t.sections.location}>
          <div className="flex items-start gap-2 text-sm text-[#444]">
            <MapPin size={16} className="text-[#C0392B] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#1C1C1C]">{listing.address}</div>
              <div className="text-[#666] mt-0.5">
                {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
                {listing.pincode ? ` ${listing.pincode}` : ''}
              </div>
            </div>
          </div>
        </Section>

        {/* Agent Card */}
        <Section title={t.sections.listedBy}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1C1C1C] flex items-center justify-center text-xl font-black text-white flex-shrink-0">
              {listing.agent_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="font-bold text-[#1C1C1C] text-base">{listing.agent_name}</div>
              {listing.agent_phone && (
                <div className="text-sm text-[#666] mt-0.5">+91 {listing.agent_phone}</div>
              )}
              {listing.agent_rera && (
                <div className="text-[10px] text-[#00897B] font-bold tracking-wide mt-1 uppercase">
                  {t.agent.reraLabel}: {listing.agent_rera}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Stats + Share */}
        <div className="flex items-center gap-4 mt-4 text-xs text-[#999]">
          <span>{listing.view_count} {t.stats.views}</span>
          {listing.qr_scans != null && (
            <><span>·</span><span>{listing.qr_scans} {t.stats.qrScans}</span></>
          )}
          <span>·</span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-[#1C1C1C] transition-colors"
          >
            <Share2 size={12} />
            {copied ? t.stats.copied : t.stats.share}
          </button>
        </div>

        {/* Feature 4: 60-second Callback */}
        {!isGone && listing.agent_phone && (
          <div className="bg-white -mx-4 mt-3 px-5 py-4 border-b border-[#EEE]">
            <CallbackButton
              listingId={listing.id}
              agentName={listing.agent_name}
              apiBaseUrl={process.env.NEXT_PUBLIC_API_URL || ''}
            />
          </div>
        )}

        {/* Feature 5: Virtual Tour */}
        {listing.tour_url && listing.embed_url && (
          <VirtualTourEmbed
            tourUrl={listing.tour_url}
            embedUrl={listing.embed_url}
            shortCode={listing.short_code}
            apiBase={process.env.NEXT_PUBLIC_API_URL || ''}
          />
        )}

        {/* Enquiry Form */}
        {!isGone && (
          <EnquiryForm
            shortCode={listing.short_code}
            listingTitle={listing.title}
            t={t}
          />
        )}

        {/* Powered by */}
        <div className="mt-8 text-center">
          <span className="text-[10px] text-[#CCC] uppercase tracking-widest">{t.poweredBy}</span>
          <div className="text-xs font-bold text-[#999] mt-0.5">QR Estate · {t.tagline}</div>
        </div>
      </div>

      {/* ── Sticky CTA ─────────────────────────────────────────── */}
      {!isGone && listing.agent_phone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1C1C1C] px-4 py-3 flex gap-3 max-w-xl mx-auto shadow-2xl">
          <a
            href={`tel:+91${listing.agent_phone.replace(/\D/g, '')}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1C1C1C] text-white py-3.5 font-bold text-sm hover:bg-[#333] transition-colors active:scale-95"
          >
            <Phone size={16} fill="white" />
            {t.agent.callAgent}
          </a>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 font-bold text-sm hover:bg-[#20BD5C] transition-colors active:scale-95"
          >
            <MessageCircle size={16} fill="white" />
            {t.agent.whatsapp}
          </button>
        </div>
      )}

      {!isGone && !listing.agent_phone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1C1C1C] px-4 py-3 max-w-xl mx-auto shadow-2xl">
          <div className="text-center text-sm text-[#666]">{t.noContact}</div>
        </div>
      )}
    </div>
  );
}

// ── Enquiry form ──────────────────────────────────────────────────────────────
function EnquiryForm({
  shortCode,
  listingTitle,
  t,
}: {
  shortCode: string;
  listingTitle: string;
  t: any;
}) {
  const [form, setForm]     = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone) return;
    setStatus('loading');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leads/enquiry/${shortCode}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'website' }),
        }
      );
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="bg-white -mx-4 mt-3 px-5 py-8 text-center border-b border-[#EEE]">
        <div className="mb-2 text-3xl">✅</div>
        <div className="font-bold text-[#1C1C1C] mb-1">{t.enquiry.successTitle}</div>
        <div className="text-sm text-[#666]">{t.enquiry.successDesc}</div>
      </div>
    );
  }

  return (
    <div className="bg-white -mx-4 mt-3 px-5 py-5 border-b border-[#EEE]">
      <h2 className="text-[10px] font-black tracking-[2px] text-[#999] uppercase mb-4">
        {t.sections.sendEnquiry}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1C1C1C] transition-colors"
          placeholder={t.enquiry.namePlaceholder}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          className="w-full border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1C1C1C] transition-colors"
          placeholder={t.enquiry.phonePlaceholder}
          type="tel"
          required
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
        <textarea
          className="w-full border border-[#E0E0E0] px-3 py-2.5 text-sm text-[#1C1C1C] outline-none focus:border-[#1C1C1C] transition-colors resize-none"
          placeholder={t.enquiry.messagePlaceholder}
          rows={3}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        />
        {status === 'error' && (
          <p className="text-xs text-red-500">{t.enquiry.errorMsg}</p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#1C1C1C] text-white py-3 font-bold text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? t.enquiry.submitting : t.enquiry.submit}
        </button>
      </form>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white -mx-4 mt-3 px-5 py-5 border-b border-[#EEE]">
      <h2 className="text-[10px] font-black tracking-[2px] text-[#999] uppercase mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ── Public export (wraps with LocaleProvider) ──────────────────────────────────
export function PropertyPageClient({
  listing,
  isUnavailable,
}: {
  listing: Listing;
  isUnavailable: boolean;
}) {
  return (
    <LocaleProvider>
      <PropertyPageInner listing={listing} isUnavailable={isUnavailable} />
    </LocaleProvider>
  );
}
