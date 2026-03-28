'use client';
import { useState, useRef, useEffect } from 'react';
import { PenLine, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { eoiAPI } from '@/lib/features';

interface EOIFormProps {
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  onClose: () => void;
}

function formatPrice(p: number) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${p.toLocaleString('en-IN')}`;
}

export function EOIForm({ listingId, listingTitle, listingPrice, onClose }: EOIFormProps) {
  const [step, setStep]       = useState<1 | 2 | 3>(1);
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({ name: '', phone: '', email: '', offerPrice: String(listingPrice), message: '' });
  const [hasSig, setHasSig]   = useState(false);
  const canvasRef             = useRef<HTMLCanvasElement>(null);
  const drawing               = useRef(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Canvas signature
  useEffect(() => {
    if (step !== 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#00D4C8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const src = 'touches' in e ? e.touches[0] : e;
      return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
    };

    const start = (e: MouseEvent | TouchEvent) => { e.preventDefault(); drawing.current = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
    const move  = (e: MouseEvent | TouchEvent) => { e.preventDefault(); if (!drawing.current) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setHasSig(true); };
    const end   = () => { drawing.current = false; };

    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); canvas.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); canvas.addEventListener('touchend', end);
    return () => {
      canvas.removeEventListener('mousedown', start); canvas.removeEventListener('mousemove', move); canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start); canvas.removeEventListener('touchmove', move); canvas.removeEventListener('touchend', end);
    };
  }, [step]);

  const clearSig = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) { ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); setHasSig(false); }
  };

  const submit = async () => {
    if (!hasSig) { setError('Please draw your signature'); return; }
    setStatus('loading'); setError('');
    try {
      const signatureData = canvasRef.current!.toDataURL('image/png');
      await eoiAPI.submit({
        listingId,
        buyerName:  form.name,
        buyerPhone: form.phone,
        buyerEmail: form.email || undefined,
        offerPrice: parseFloat(form.offerPrice),
        message:    form.message || undefined,
        signatureData,
      });
      setStatus('success');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0C1018]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <PenLine size={14} className="text-cyan-400" />
              <span className="text-sm font-bold text-white">Expression of Interest</span>
            </div>
            <div className="text-[10px] text-white/30 truncate max-w-[240px]">{listingTitle}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"><X size={14} /></button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-5 pt-4 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-cyan-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 1 && !status.includes('success') && (
          <div className="px-5 py-5 space-y-3">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">1 / 3 — Your Details</div>
            {[
              { k: 'name',   label: 'Full Name *',      type: 'text',  ph: 'Rajesh Kumar' },
              { k: 'phone',  label: 'Phone *',           type: 'tel',   ph: '+91 98765 43210' },
              { k: 'email',  label: 'Email (optional)',  type: 'email', ph: 'you@example.com' },
            ].map(({ k, label, type, ph }) => (
              <div key={k}>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
                <input type={type} value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">Your Offer Price *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
                <input type="number" value={form.offerPrice} onChange={(e) => set('offerPrice', e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40 transition-all" />
              </div>
              <div className="text-[10px] text-white/25 mt-1">Listed at {formatPrice(listingPrice)}</div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">Message (optional)</label>
              <textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={2} placeholder="Any specific requirements or questions..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 transition-all resize-none" />
            </div>
            <button onClick={() => {
              if (!form.name || !form.phone || !form.offerPrice) { setError('Name, phone and offer price are required'); return; }
              setError(''); setStep(2);
            }} className="w-full py-3 rounded-xl bg-cyan-500 text-black text-sm font-bold hover:bg-cyan-400 transition-all active:scale-95">
              Next: Sign EOI →
            </button>
            {error && <div className="text-xs text-red-400 text-center">{error}</div>}
          </div>
        )}

        {/* Step 2: Signature */}
        {step === 2 && status !== 'success' && (
          <div className="px-5 py-5">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">2 / 3 — Draw Your Signature</div>
            <div className="relative border border-white/10 rounded-xl overflow-hidden bg-[#06080A] mb-3">
              <canvas ref={canvasRef} width={400} height={150} className="w-full touch-none cursor-crosshair" />
              {!hasSig && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/15 text-sm italic">Sign here with your finger or mouse</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              <button onClick={clearSig} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/40 text-xs hover:text-white/60 transition-all">
                <RotateCcw size={12} /> Clear
              </button>
            </div>
            <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-3 mb-4 text-[11px] text-amber-400/80 leading-relaxed">
              By signing, you express intent to purchase <strong className="text-amber-400">{listingTitle}</strong> at{' '}
              <strong className="text-amber-400">{form.offerPrice ? formatPrice(parseFloat(form.offerPrice)) : '—'}</strong>. This is not a legally binding contract.
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/50 text-sm hover:bg-white/[0.06] transition-all">Back</button>
              <button onClick={submit} disabled={!hasSig || status === 'loading'}
                className="flex-1 py-3 rounded-xl bg-cyan-500 text-black text-sm font-bold hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {status === 'loading' ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting...</> : 'Submit EOI →'}
              </button>
            </div>
            {error && <div className="text-xs text-red-400 text-center mt-2">{error}</div>}
          </div>
        )}

        {/* Step 3: Success */}
        {status === 'success' && (
          <div className="px-5 py-10 text-center">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
            <div className="text-lg font-bold text-white mb-2">EOI Submitted!</div>
            <div className="text-sm text-white/50 mb-6">The agent will review your offer and contact you within 24 hours. A PDF confirmation will be emailed shortly.</div>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 text-sm font-medium hover:bg-white/[0.08] transition-all">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
