// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowLeft } from 'lucide-react';
// import Link from 'next/link';
// import { listingsAPI } from '@/lib/listings';
// import { ListingForm, type ListingFormData } from '@/components/listings/ListingForm';
// import axios from 'axios';

// export default function NewListingPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(data: ListingFormData, amenities: string[]) {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const res = await listingsAPI.create({
//         ...data,
//         bedrooms: data.bedrooms ? Number(data.bedrooms) : undefined,
//         bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
//         area_sqft: data.area_sqft ? Number(data.area_sqft) : undefined,
//         floor_number: data.floor_number ? Number(data.floor_number) : undefined,
//         total_floors: data.total_floors ? Number(data.total_floors) : undefined,
//         furnishing: data.furnishing || undefined,
//         locality: data.locality || undefined,
//         pincode: data.pincode || undefined,
//         description: data.description || undefined,
//         amenities,
//       });

//       const listingId = res.data.data.listing.id;
//       router.push(`/dashboard/listings/${listingId}?created=true`);
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const data = err.response?.data;
//         if (data?.errors?.length) {
//           setError(data.errors.map((e: { message: string }) => e.message).join(' · '));
//         } else {
//           setError(data?.message || 'Failed to create listing');
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-2xl space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Link href="/dashboard/listings" className="text-[#4A6580] hover:text-white transition-colors">
//           <ArrowLeft size={20} />
//         </Link>
//         <div>
//           <h1 className="text-2xl font-black text-white">New Listing</h1>
//           <p className="text-[#7A95AE] text-sm">Fill in property details to create a listing</p>
//         </div>
//       </div>

//       {error && (
//         <div className="px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.2)] text-[#FF4D6A] text-sm">
//           ⚠ {error}
//         </div>
//       )}

//       <ListingForm onSubmit={handleSubmit} isLoading={isLoading} />
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Building2, MapPin, IndianRupee,
  Bed, Bath, Ruler, Layers, Sparkles, CheckCircle2, ChevronRight,
} from 'lucide-react';
import { listingsAPI } from '@/lib/listings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// ── Schema ─────────────────────────────────────────────────────────────────────
const schema = z.object({
  title:            z.string().min(5, 'Min 5 characters').max(200),
  description:      z.string().max(2000).optional().or(z.literal('')),
  property_type:    z.enum(['apartment', 'villa', 'plot', 'commercial', 'pg', 'house']),
  listing_type:     z.enum(['sale', 'rent']),
  price:            z.coerce.number().min(1, 'Enter a valid price'),
  price_negotiable: z.boolean().optional(),
  bedrooms:         z.coerce.number().int().min(0).max(20).optional().or(z.literal('')),
  bathrooms:        z.coerce.number().int().min(0).max(20).optional().or(z.literal('')),
  area_sqft:        z.coerce.number().min(1).optional().or(z.literal('')),
  floor_number:     z.coerce.number().int().min(0).optional().or(z.literal('')),
  total_floors:     z.coerce.number().int().min(1).optional().or(z.literal('')),
  furnishing:       z.enum(['unfurnished', 'semi-furnished', 'fully-furnished']).optional().or(z.literal('')),
  facing:           z.string().optional().or(z.literal('')),
  address:          z.string().min(5, 'Address required'),
  locality:         z.string().optional().or(z.literal('')),
  city:             z.string().min(2, 'City required'),
  state:            z.string().min(2, 'State required'),
  pincode:          z.string().regex(/^\d{6}$/, '6-digit pincode').optional().or(z.literal('')),
  status:           z.enum(['draft', 'active']).optional(),
});
type FormData = z.infer<typeof schema>;

// ── Constants ──────────────────────────────────────────────────────────────────
const PROP_TYPES = [
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'villa',     label: 'Villa',     icon: '🏘' },
  { value: 'house',     label: 'House',     icon: '🏠' },
  { value: 'plot',      label: 'Plot/Land', icon: '🗺' },
  { value: 'commercial',label: 'Commercial',icon: '🏪' },
  { value: 'pg',        label: 'PG/Hostel', icon: '🛏' },
];
type StyledTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

const AMENITIES = [
  'Lift', 'Parking', 'Power Backup', 'Security / Guard', 'CCTV',
  'Gym', 'Swimming Pool', 'Clubhouse', 'Garden / Park',
  'Play Area', 'Intercom', 'Fire Safety', 'Gas Pipeline',
  'Water Storage', 'Rainwater Harvesting', 'Solar Panels', 'Servant Room',
  'Visitor Parking', 'Gated Community', 'Temple / Prayer Hall',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh',
  'Dadra & Nagar Haveli', 'Daman & Diu', 'Lakshadweep', 'Puducherry',
];

const STEPS = [
  { id: 1, label: 'Type',     icon: Building2, desc: 'Property & listing type' },
  { id: 2, label: 'Details',  icon: Layers,    desc: 'Rooms, area, furnishing' },
  { id: 3, label: 'Price',    icon: IndianRupee,desc: 'Pricing & title'       },
  { id: 4, label: 'Location', icon: MapPin,    desc: 'Address & locality'      },
  { id: 5, label: 'Amenities',icon: Sparkles,  desc: 'Features & extras'      },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[9px] font-black uppercase tracking-[0.18em] mb-1.5"
      style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
      {children}
    </label>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-[10px]" style={{ color: 'var(--red)' }}>{error}</p>}
    </div>
  );
}

function StyledInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 text-sm transition-all outline-none rounded-xl"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${error ? 'rgba(240,64,96,0.4)' : 'var(--border)'}`,
        color: 'var(--white)',
        fontFamily: 'inherit',
      }}
      onFocus={e  => { e.target.style.borderColor = 'rgba(232,184,75,0.45)'; e.target.style.background = 'rgba(232,184,75,0.02)'; }}
      onBlur={e   => { e.target.style.borderColor = error ? 'rgba(240,64,96,0.4)' : 'var(--border)'; e.target.style.background = 'var(--surface)'; }}
    />
  );
}

function StyledSelect({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      className="w-full px-4 py-3 text-sm outline-none appearance-none cursor-pointer rounded-xl"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${error ? 'rgba(240,64,96,0.4)' : 'var(--border)'}`,
        color: props.value ? 'var(--white)' : 'var(--dim)',
      }}
    >
      {children}
    </select>
  );
}

function StyledTextarea({ error, ...props }: StyledTextareaProps) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-3 text-sm transition-all outline-none resize-none rounded-xl"
      style={{
        background: 'var(--surface)',
        border: error ? '1px solid #F04060' : '1px solid var(--border)', // ✅ use error
        color: 'var(--white)',
        fontFamily: 'inherit',
      }}
      onFocus={e => {
        e.target.style.borderColor = error
          ? '#F04060'
          : 'rgba(232,184,75,0.45)';
      }}
      onBlur={e => {
        e.target.style.borderColor = error
          ? '#F04060'
          : 'var(--border)';
      }}
    />
  );
}

function ToggleChip({ value, selected, onClick, children }: { value: string; selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
      style={{
        background:   selected ? 'rgba(232,184,75,0.1)'  : 'var(--surface)',
        color:        selected ? 'var(--gold)'            : 'var(--muted)',
        borderColor:  selected ? 'rgba(232,184,75,0.3)'  : 'var(--border)',
        boxShadow:    selected ? '0 0 14px rgba(232,184,75,0.08)' : 'none',
      }}>
      {selected && <Check size={12} className="flex-shrink-0" />}
      {children}
    </button>
  );
}

function PriceDisplay({ price, type }: { price?: number; type: 'sale' | 'rent' }) {
  if (!price || price < 1) return null;
  let fmt = '';
  if (type === 'sale') {
    if (price >= 10000000) fmt = `₹${(price / 10000000).toFixed(2)} Crore`;
    else if (price >= 100000) fmt = `₹${(price / 100000).toFixed(1)} Lakh`;
    else fmt = `₹${price.toLocaleString('en-IN')}`;
  } else {
    fmt = `₹${price.toLocaleString('en-IN')} / month`;
  }
  return (
    <div className="px-4 py-2.5 rounded-xl text-sm font-black text-center"
      style={{ background: 'rgba(232,184,75,0.08)', color: 'var(--gold)', border: '1px solid rgba(232,184,75,0.15)' }}>
      {fmt}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function NewListingPage() {
  const router = useRouter();
  const [step,       setStep]      = useState(1);
  const [amenities,  setAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting]= useState(false);
  const [apiError,   setApiError]  = useState<string | null>(null);
  const [done,       setDone]      = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, trigger, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      property_type: 'apartment',
      listing_type:  'sale',
      price_negotiable: false,
      status: 'draft',
    },
    mode: 'onChange',
  });

  const watchType    = watch('property_type');
  const watchListing = watch('listing_type');
  const watchPrice   = watch('price');
  const showRooms    = !['plot', 'commercial'].includes(watchType);

  // Step validation fields
  const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
    1: ['property_type', 'listing_type'],
    2: [],
    3: ['price', 'title'],
    4: ['address', 'city', 'state'],
    5: [],
  };

  async function nextStep() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length ? await trigger(fields) : true;
    if (valid) setStep(s => Math.min(s + 1, 5));
  }

  function prevStep() { setStep(s => Math.max(s - 1, 1)); }

  function toggleAmenity(a: string) {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true); setApiError(null);
    try {
      const res = await listingsAPI.create({
        ...data,
        bedrooms:     data.bedrooms     ? Number(data.bedrooms)     : undefined,
        bathrooms:    data.bathrooms    ? Number(data.bathrooms)    : undefined,
        area_sqft:    data.area_sqft    ? Number(data.area_sqft)    : undefined,
        floor_number: data.floor_number ? Number(data.floor_number) : undefined,
        total_floors: data.total_floors ? Number(data.total_floors) : undefined,
        furnishing:   data.furnishing   || undefined,
        facing:       data.facing       || undefined,
        locality:     data.locality     || undefined,
        pincode:      data.pincode      || undefined,
        description:  data.description  || undefined,
        amenities,
      });
      setDone(true);
      setTimeout(() => router.push(`/dashboard/listings/${res.data.data.listing.id}?created=true`), 1200);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const d = err.response?.data;
        setApiError(d?.errors?.map((e: { message: string }) => e.message).join(' · ') || d?.message || 'Failed to create listing');
      }
    } finally { setSubmitting(false); }
  };

  const fadeSlide = {
    initial:  { opacity: 0, x: 24 },
    animate:  { opacity: 1, x: 0 },
    exit:     { opacity: 0, x: -24 },
    transition: { duration: 0.22, ease: 'easeOut' },
  };

  // ── Success screen ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full"
            style={{ background: 'rgba(40,216,144,0.1)', border: '1px solid rgba(40,216,144,0.25)', boxShadow: '0 0 40px rgba(40,216,144,0.2)' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--green)' }} />
          </div>
          <div className="text-xl font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>Listing Created!</div>
          <div className="text-sm" style={{ color: 'var(--dim)' }}>Redirecting to your listing…</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl pb-24 mx-auto space-y-6">

      {/* ── Back + Title ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/listings"
          className="flex items-center justify-center transition-all w-9 h-9 rounded-xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--dim)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--white)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--dim)'; }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <div className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
            New Listing
          </div>
          <h1 className="text-xl font-black leading-tight" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>
            Add Property
          </h1>
        </div>
      </div>

      {/* ── Step indicator ───────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const done  = step > s.id;
            const active= step === s.id;
            const Icon  = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1 gap-1">
                  <div
                    className="flex items-center justify-center flex-shrink-0 w-8 h-8 transition-all duration-300 rounded-full"
                    style={{
                      background: done ? 'var(--green)' : active ? 'var(--gold)' : 'var(--surface)',
                      border: `1px solid ${done ? 'var(--green)' : active ? 'rgba(232,184,75,0.4)' : 'var(--border)'}`,
                      boxShadow: active ? '0 0 16px rgba(232,184,75,0.3)' : 'none',
                    }}
                  >
                    {done
                      ? <Check size={13} style={{ color: 'var(--bg)' }} />
                      : <Icon size={13} style={{ color: active ? 'var(--bg)' : 'var(--dim)' }} />}
                  </div>
                  <span className="text-[8px] font-bold hidden sm:block" style={{ color: active ? 'var(--gold)' : done ? 'var(--green)' : 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-1 transition-all duration-500" style={{ background: step > s.id ? 'var(--green)' : 'var(--border)' }} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
          Step {step} of {STEPS.length} — <span style={{ color: 'var(--gold)' }}>{STEPS[step - 1].desc}</span>
        </div>
      </div>

      {/* ── Form card ────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <AnimatePresence mode="wait">

            {/* ── Step 1: Type ─────────────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1" {...fadeSlide} className="p-6 space-y-6">
                <Field label="Listing Purpose" error={errors.listing_type?.message}>
                  <div className="flex gap-3">
                    {(['sale', 'rent'] as const).map(t => (
                      <ToggleChip key={t} value={t} selected={watchListing === t}
                        onClick={() => { /* register handles via hidden input but we use direct setValue */ }}>
                        {t === 'sale' ? '🏷 For Sale' : '🔑 For Rent'}
                      </ToggleChip>
                    ))}
                  </div>
                  <input type="hidden" {...register('listing_type')} />
                </Field>
                {/* Inject real radio values via register */}
                <Field label="Property Type" error={errors.property_type?.message}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PROP_TYPES.map(pt => (
                      <label key={pt.value} className="cursor-pointer">
                        <input type="radio" value={pt.value} {...register('property_type')} className="sr-only" />
                        <div
                          className="flex items-center gap-3 p-3 transition-all border rounded-xl"
                          style={{
                            background: watchType === pt.value ? 'rgba(232,184,75,0.08)' : 'var(--surface)',
                            borderColor: watchType === pt.value ? 'rgba(232,184,75,0.3)' : 'var(--border)',
                            color: watchType === pt.value ? 'var(--gold)' : 'var(--muted)',
                          }}
                        >
                          <span className="text-xl">{pt.icon}</span>
                          <span className="text-sm font-semibold">{pt.label}</span>
                          {watchType === pt.value && <Check size={12} className="ml-auto" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* ── Step 2: Details ──────────────────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2" {...fadeSlide} className="p-6 space-y-5">
                {showRooms && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Bedrooms">
                      <div className="flex flex-wrap gap-2">
                        {[1,2,3,4,'5+'].map(n => (
                          <label key={n} className="cursor-pointer">
                            <input type="radio" value={n === '5+' ? 5 : n} {...register('bedrooms')} className="sr-only" />
                            <div
                              className="flex items-center justify-center w-10 h-10 text-sm font-bold transition-all border rounded-xl"
                              style={{
                                background: String(watch('bedrooms')) === String(n === '5+' ? 5 : n) ? 'rgba(24,212,200,0.1)' : 'var(--surface)',
                                borderColor: String(watch('bedrooms')) === String(n === '5+' ? 5 : n) ? 'rgba(24,212,200,0.3)' : 'var(--border)',
                                color: String(watch('bedrooms')) === String(n === '5+' ? 5 : n) ? 'var(--teal)' : 'var(--dim)',
                              }}
                            >{n}</div>
                          </label>
                        ))}
                      </div>
                    </Field>
                    <Field label="Bathrooms">
                      <div className="flex flex-wrap gap-2">
                        {[1,2,3,4].map(n => (
                          <label key={n} className="cursor-pointer">
                            <input type="radio" value={n} {...register('bathrooms')} className="sr-only" />
                            <div
                              className="flex items-center justify-center w-10 h-10 text-sm font-bold transition-all border rounded-xl"
                              style={{
                                background: String(watch('bathrooms')) === String(n) ? 'rgba(24,212,200,0.1)' : 'var(--surface)',
                                borderColor: String(watch('bathrooms')) === String(n) ? 'rgba(24,212,200,0.3)' : 'var(--border)',
                                color: String(watch('bathrooms')) === String(n) ? 'var(--teal)' : 'var(--dim)',
                              }}
                            >{n}</div>
                          </label>
                        ))}
                      </div>
                    </Field>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Area (sqft)">
                    <StyledInput type="number" placeholder="e.g. 1200" {...register('area_sqft')} />
                  </Field>
                  <Field label="Furnishing">
                    <StyledSelect {...register('furnishing')} value={watch('furnishing') || ''}>
                      <option value="">Not specified</option>
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-furnished</option>
                      <option value="fully-furnished">Fully Furnished</option>
                    </StyledSelect>
                  </Field>
                </div>
                {showRooms && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Floor Number">
                      <StyledInput type="number" placeholder="e.g. 5" {...register('floor_number')} />
                    </Field>
                    <Field label="Total Floors">
                      <StyledInput type="number" placeholder="e.g. 12" {...register('total_floors')} />
                    </Field>
                  </div>
                )}
                <Field label="Facing Direction">
                  <StyledSelect {...register('facing')} value={watch('facing') || ''}>
                    <option value="">Not specified</option>
                    {['North','South','East','West','North-East','North-West','South-East','South-West'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </StyledSelect>
                </Field>
                <Field label="Description (optional)">
                  <StyledTextarea rows={4} placeholder="Describe the property — views, recent renovations, proximity to landmarks…" {...register('description')} />
                </Field>
              </motion.div>
            )}

            {/* ── Step 3: Price & Title ─────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="step3" {...fadeSlide} className="p-6 space-y-5">
                <Field label="Listing Title *" error={errors.title?.message}>
                  <StyledInput
                    placeholder={watchType === 'apartment' ? 'e.g. Spacious 3BHK Sea-facing in Andheri West' : 'e.g. Prime Commercial Space in BKC'}
                    error={!!errors.title}
                    {...register('title')}
                  />
                </Field>
                <Field label={`Price (₹) ${watchListing === 'rent' ? '— Monthly Rent' : '— Sale Price'} *`} error={errors.price?.message}>
                  <StyledInput
                    type="number" placeholder={watchListing === 'rent' ? 'e.g. 45000' : 'e.g. 18000000'}
                    error={!!errors.price}
                    {...register('price')}
                  />
                </Field>
                {watchPrice > 0 && <PriceDisplay price={Number(watchPrice)} type={watchListing as 'sale' | 'rent'} />}
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="neg" {...register('price_negotiable')}
                    className="w-4 h-4 rounded" style={{ accentColor: 'var(--gold)' }} />
                  <label htmlFor="neg" className="text-sm cursor-pointer" style={{ color: 'var(--muted)' }}>
                    Price is negotiable
                  </label>
                </div>
                <Field label="Publish Status">
                  <div className="flex gap-3">
                    {(['draft','active'] as const).map(s => (
                      <label key={s} className="flex-1 cursor-pointer">
                        <input type="radio" value={s} {...register('status')} className="sr-only" />
                        <div className="p-3 text-center transition-all border rounded-xl"
                          style={{
                            background: watch('status') === s ? (s === 'active' ? 'rgba(40,216,144,0.08)' : 'rgba(86,96,112,0.08)') : 'var(--surface)',
                            borderColor: watch('status') === s ? (s === 'active' ? 'rgba(40,216,144,0.3)' : 'rgba(86,96,112,0.25)') : 'var(--border)',
                            color: watch('status') === s ? (s === 'active' ? 'var(--green)' : 'var(--dim)') : 'var(--muted)',
                          }}>
                          <div className="text-sm font-bold capitalize">{s}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: 'var(--dim)' }}>
                            {s === 'draft' ? 'Save for later' : 'Publish immediately'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* ── Step 4: Location ─────────────────────────────────────── */}
            {step === 4 && (
              <motion.div key="step4" {...fadeSlide} className="p-6 space-y-5">
                <Field label="Full Address *" error={errors.address?.message}>
                  <StyledTextarea rows={2} placeholder="Plot 14, Versova Road, Near Metro Station" error={!!errors.address} {...register('address')} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Locality / Area">
                    <StyledInput placeholder="e.g. Andheri West" {...register('locality')} />
                  </Field>
                  <Field label="Pincode">
                    <StyledInput placeholder="400058" maxLength={6} {...register('pincode')} error={!!errors.pincode} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City *" error={errors.city?.message}>
                    <StyledInput placeholder="e.g. Mumbai" error={!!errors.city} {...register('city')} />
                  </Field>
                  <Field label="State *" error={errors.state?.message}>
                    <StyledSelect error={!!errors.state} {...register('state')} value={watch('state') || ''}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </StyledSelect>
                  </Field>
                </div>
                {/* Map placeholder */}
                <div className="flex items-center justify-center text-sm rounded-xl"
                  style={{ height: 120, background: 'var(--surface)', border: '1px dashed var(--border2)', color: 'var(--dim)' }}>
                  📍 Map integration — lat/lng auto-detected from address
                </div>
              </motion.div>
            )}

            {/* ── Step 5: Amenities ────────────────────────────────────── */}
            {step === 5 && (
              <motion.div key="step5" {...fadeSlide} className="p-6 space-y-5">
                <div>
                  <Label>Select Amenities ({amenities.length} selected)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AMENITIES.map(a => {
                      const sel = amenities.includes(a);
                      return (
                        <button key={a} type="button" onClick={() => toggleAmenity(a)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                          style={{
                            background: sel ? 'rgba(24,212,200,0.1)' : 'var(--surface)',
                            borderColor: sel ? 'rgba(24,212,200,0.3)' : 'var(--border)',
                            color: sel ? 'var(--teal)' : 'var(--muted)',
                          }}>
                          {sel && <Check size={10} />}
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 space-y-2 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
                    Listing Summary
                  </div>
                  {[
                    ['Type',     `${PROP_TYPES.find(p => p.value === watchType)?.label} · For ${watchListing === 'sale' ? 'Sale' : 'Rent'}`],
                    ['Price',    watchPrice ? (watchPrice >= 10000000 ? `₹${(watchPrice/10000000).toFixed(2)}Cr` : watchPrice >= 100000 ? `₹${(watchPrice/100000).toFixed(1)}L` : `₹${watchPrice.toLocaleString('en-IN')}`) : '—'],
                    ['Location', `${watch('city') || '—'}${watch('state') ? `, ${watch('state')}` : ''}`],
                    ['Amenities',amenities.length ? `${amenities.length} selected` : 'None'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--dim)' }}>{k}</span>
                      <span className="font-semibold" style={{ color: 'var(--white)' }}>{v}</span>
                    </div>
                  ))}
                </div>

                {apiError && (
                  <div className="p-3 text-sm rounded-xl" style={{ background: 'rgba(240,64,96,0.08)', color: 'var(--red)', border: '1px solid rgba(240,64,96,0.2)' }}>
                    ⚠ {apiError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation buttons ──────────────────────────────────────── */}
          <div className="flex items-center justify-between p-5" style={{ borderTop: '1px solid var(--border)' }}>
            <button type="button" onClick={prevStep} disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              <ArrowLeft size={14} /> Back
            </button>

            {step < 5 ? (
              <button type="button" onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'var(--gold)', color: 'var(--bg)', boxShadow: '0 4px 20px rgba(232,184,75,0.3)' }}>
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                style={{ background: submitting ? 'var(--surface)' : 'var(--gold)', color: submitting ? 'var(--dim)' : 'var(--bg)', boxShadow: submitting ? 'none' : '0 4px 20px rgba(232,184,75,0.3)' }}>
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-[var(--bg)]/30 border-t-[var(--bg)] rounded-full animate-spin" /> Creating…</>
                ) : (
                  <><CheckCircle2 size={14} /> Create Listing</>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}