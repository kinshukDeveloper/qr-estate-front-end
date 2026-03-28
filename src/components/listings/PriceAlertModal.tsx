'use client';

import { useState } from 'react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { alertsAPI } from '@/lib/buyer';

interface PriceAlertModalProps {
  listingId: string;
  listingTitle?: string;
  listingPrice?: number;
  onClose: () => void;
}

function formatPrice(price?: number) {
  if (!price) return '';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function PriceAlertModal({
  listingId,
  listingTitle,
  listingPrice,
  onClose,
}: PriceAlertModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('Enter a valid email address');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await alertsAPI.subscribe(listingId, email);
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Bell size={14} className="text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Price Drop Alert</div>
              <div className="text-[10px] text-white/40">Get notified if price drops</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {status === 'success' ? (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
              <div className="text-base font-semibold text-white mb-1">You're subscribed!</div>
              <div className="text-sm text-white/50">
                We'll email you when <span className="text-white/70">{listingTitle || 'this listing'}</span> drops below{' '}
                <span className="text-amber-400 font-semibold">{formatPrice(listingPrice)}</span>.
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                {listingTitle && (
                  <span className="text-white/80 font-medium">{listingTitle}</span>
                )}{listingTitle && ' is currently '}
                {listingPrice && (
                  <span className="text-amber-400 font-semibold">{formatPrice(listingPrice)}</span>
                )}
                . We'll alert you the moment the price drops.
              </p>

              <form onSubmit={handleSubmit}>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-amber-500/40 focus:bg-amber-500/[0.02] transition-all mb-3"
                />

                {errorMsg && (
                  <div className="text-xs text-red-400 mb-3 px-1">{errorMsg}</div>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Bell size={13} />
                        Notify me
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-3 text-[10px] text-white/25 text-center">
                Unsubscribe anytime. No spam.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
