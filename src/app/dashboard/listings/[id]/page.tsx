'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Trash2, QrCode, FileDown, Cpu } from 'lucide-react';
import Link from 'next/link';
import { listingsAPI, type Listing } from '@/lib/listings';
import { aiAPI, type QualityScore, type AITip } from '@/lib/ai';
import { ListingForm, type ListingFormData } from '@/components/listings/ListingForm';
import { Button } from '@/components/ui/Button';
import { QualityScoreRing } from '@/components/ai/QualityScoreRing';
import { TourUrlEditor }    from '@/components/ai/TourUrlEditor';
import { AITipsPanel } from '@/components/ai/AITipsPanel';
import { DescriptionWriterModal } from '@/components/ai/DescriptionWriterModal';
import { PhotoCheckerPanel } from '@/components/ai/PhotoCheckerPanel';
import axios from 'axios';

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isNew        = searchParams.get('created') === 'true';

  const [listing, setListing]     = useState<Listing | null>(null);
  const [isFetching, setFetching] = useState(true);
  const [isLoading, setLoading]   = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [successMsg, setSuccess]  = useState<string | null>(isNew ? '🎉 Listing created! Add images or generate a QR code.' : null);

  // AI state
  const [qs, setQs]               = useState<QualityScore | null>(null);
  const [aiTab, setAiTab]         = useState<'score' | 'tips' | 'photos' | 'tour'>('score');

  // Ref to description textarea (for one-click apply)
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  // ── Data loading ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetch() {
      try {
        const [listingRes, scoreRes] = await Promise.all([
          listingsAPI.getOne(params.id),
          aiAPI.getScore(params.id).catch(() => null),
        ]);
        setListing(listingRes.data.data.listing);
        if (scoreRes) setQs(scoreRes.data.data);
      } catch {
        setError('Listing not found or you do not have access.');
      } finally {
        setFetching(false);
      }
    }
    fetch();
  }, [params.id]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleSubmit(data: ListingFormData, amenities: string[]) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await listingsAPI.update(params.id, {
        ...data,
        bedrooms:     data.bedrooms     ? Number(data.bedrooms)     : undefined,
        bathrooms:    data.bathrooms    ? Number(data.bathrooms)    : undefined,
        area_sqft:    data.area_sqft    ? Number(data.area_sqft)    : undefined,
        floor_number: data.floor_number ? Number(data.floor_number) : undefined,
        total_floors: data.total_floors ? Number(data.total_floors) : undefined,
        furnishing:   data.furnishing   || undefined,
        amenities,
      });
      setListing(res.data.data.listing);
      setSuccess('✓ Changes saved.');
      // Refresh quality score after save
      const scoreRes = await aiAPI.getScore(params.id).catch(() => null);
      if (scoreRes) setQs(scoreRes.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this listing permanently?')) return;
    try {
      await listingsAPI.delete(params.id);
      router.push('/dashboard/listings');
    } catch {
      setError('Failed to delete listing.');
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    try {
      const res = await listingsAPI.uploadImages(params.id, files);
      setListing(prev => prev ? { ...prev, images: res.data.data.listing.images } : prev);
      setSuccess(`✓ ${files.length} image(s) uploaded.`);
      // Refresh score (photos affect it)
      const scoreRes = await aiAPI.getScore(params.id).catch(() => null);
      if (scoreRes) setQs(scoreRes.data.data);
    } catch {
      setError('Image upload failed. Check Cloudinary config in .env');
    }
  }

  // Apply description from AI writer into the form
  function handleDescriptionApply(text: string) {
    // Walk DOM to find the description textarea and set its value
    const ta = document.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    if (ta) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      nativeSetter?.call(ta, text);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setSuccess('✓ Description applied from AI. Save to persist.');
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="max-w-4xl grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="bg-[#111C28] border border-[#1A2D40] h-32 animate-pulse" />)}
        </div>
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="bg-[#111C28] border border-[#1A2D40] h-48 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="max-w-2xl">
        <div className="px-4 py-8 text-center text-[#FF4D6A] border border-[rgba(255,77,106,0.2)] bg-[rgba(255,77,106,0.05)]">{error}</div>
      </div>
    );
  }

  const hasPhotos = (listing?.images?.length ?? 0) > 0;

  return (
    <div className="max-w-4xl space-y-0 animate-fade-in">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/listings" className="text-[#4A6580] hover:text-white transition-colors mt-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Edit Listing</h1>
            <p className="text-[#7A95AE] text-sm truncate max-w-xs">{listing?.title}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0 flex-wrap">
          <Link href={`/dashboard/qr?listing=${params.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <QrCode size={13} /> QR Code
            </Button>
          </Link>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/brochure/${params.id}/pdf`} target="_blank" rel="noopener noreferrer" download>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <FileDown size={13} /> Brochure
            </Button>
          </a>
          <Button variant="danger" size="sm" onClick={handleDelete} className="flex items-center gap-1.5">
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      </div>

      {/* ── Messages ── */}
      {successMsg && (
        <div className="mb-4 px-4 py-3 bg-[rgba(46,204,138,0.08)] border border-[rgba(46,204,138,0.2)] text-[#2ECC8A] text-sm">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.2)] text-[#FF4D6A] text-sm">
          ⚠ {error}
        </div>
      )}

      {/* ── Two-column layout: form | AI panel ── */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Left: photos + form ── */}
        <div className="space-y-6">
          {/* Photo section */}
          <div className="bg-[#111C28] border border-[#1A2D40] p-5">
            <div className="text-[10px] font-bold tracking-widest text-[#FFB830] uppercase mb-1">Photos</div>
            <h2 className="text-sm font-bold text-white mb-4">Property Images</h2>

            {hasPhotos && (
              <div className="flex gap-2 flex-wrap mb-4">
                {listing!.images.map(img => (
                  <div key={img.public_id} className="relative group w-20 h-20">
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                    {img.is_primary && (
                      <div className="absolute bottom-0 left-0 right-0 bg-[#00D4C8] text-[#080F17] text-[8px] font-bold text-center py-0.5">PRIMARY</div>
                    )}
                    <button
                      onClick={async () => {
                        await listingsAPI.deleteImage(params.id, img.public_id);
                        setListing(prev => prev ? { ...prev, images: prev.images.filter(i => i.public_id !== img.public_id) } : prev);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-[#FF4D6A] text-white text-xs items-center justify-center hidden group-hover:flex"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="px-4 py-2 border border-dashed border-[#1A2D40] text-xs text-[#7A95AE] hover:border-[#00D4C8] hover:text-[#00D4C8] transition-colors">
                + Upload Images (JPEG, PNG, WebP — max 10MB each)
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImageUpload} />
            </label>
            <p className="text-xs text-[#4A6580] mt-2">{listing?.images?.length || 0} / 10 images uploaded.</p>
          </div>

          {/* Listing form — with AI description writer trigger */}
          {listing && (
            <ListingForm
              defaultValues={listing}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isEdit
              descriptionExtra={
                <DescriptionWriterModal
                  listingId={params.id}
                  onApply={handleDescriptionApply}
                />
              }
            />
          )}
        </div>

        {/* ── Right: AI sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* AI tab bar */}
          <div className="bg-[#0D1821] border border-[#1A2D40]">
            <div className="flex border-b border-[#1A2D40]">
              {([
                { key: 'score', label: 'Score',  icon: '◎' },
                { key: 'tips',  label: 'Tips',   icon: '✦' },
                { key: 'photos',label: 'Photos', icon: '📷' },
                { key: 'tour',  label: 'Tour',   icon: '🎬' },
              ] as const).map(t => (
                <button
                  key={t.key}
                  onClick={() => setAiTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold font-mono transition-colors ${
                    aiTab === t.key
                      ? 'text-[#00D4C8] border-b-2 border-[#00D4C8] -mb-px bg-[rgba(0,212,200,0.04)]'
                      : 'text-[#4A6580] hover:text-[#7A95AE]'
                  }`}
                >
                  <span className="text-[11px]">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* AI tab badge */}
            <div className="px-4 py-2 flex items-center gap-2 border-b border-[#1A2D40]">
              <Cpu size={10} className="text-[#4A6580]" />
              <span className="text-[9px] font-mono text-[#4A6580] uppercase tracking-widest">
                Conversion Intelligence — updates on save
              </span>
            </div>
          </div>

          {/* Score tab */}
          {aiTab === 'score' && qs && <QualityScoreRing qs={qs} />}
          {aiTab === 'score' && !qs && (
            <div className="bg-[#0D1821] border border-[#1A2D40] px-5 py-8 text-center text-xs text-[#4A6580] font-mono">
              Save the listing to compute quality score.
            </div>
          )}

          {/* Tips tab */}
          {aiTab === 'tips' && <AITipsPanel listingId={params.id} />}

          {/* Photos tab */}
          {aiTab === 'photos' && (
            <PhotoCheckerPanel listingId={params.id} hasPhotos={hasPhotos} />
          )}

          {/* Tour tab */}
          {aiTab === 'tour' && (
            <TourUrlEditor
              listingId={params.id}
              currentUrl={(listing as any)?.tour_url || null}
              onSaved={(url) => setListing(prev => prev ? { ...prev, tour_url: url } as any : prev)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
