'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  listingId:  string;
  agentName:  string;
  apiBaseUrl: string;
}

type Stage = 'idle' | 'form' | 'loading' | 'success' | 'error';

export function CallbackButton({ listingId, agentName, apiBaseUrl }: Props) {
  const [stage,  setStage]  = useState<Stage>('idle');
  const [phone,  setPhone]  = useState('');
  const [msg,    setMsg]    = useState('');
  const [waLink, setWaLink] = useState<string | null>(null);

  async function submit() {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setMsg('Enter a valid 10-digit number.');
      return;
    }
    setStage('loading');
    try {
      const res  = await fetch(`${apiBaseUrl}/callbacks/request/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || 'Request failed. Try again.');
        setStage('error');
        return;
      }
      setWaLink(data.data?.whatsapp_fallback || null);
      setStage('success');
    } catch {
      setMsg('Network error. Please try again.');
      setStage('error');
    }
  }

  return (
    <>
      {/* Trigger chip */}
      <button
        onClick={() => setStage('form')}
        className="w-full flex items-center justify-center gap-2 border-2 border-[#1C1C1C] bg-[#F5F2EE] text-[#1C1C1C] py-3 font-bold text-sm hover:bg-[#EEE] active:scale-95 transition-all"
      >
        <Phone size={15} />
        Get a callback in 60 seconds
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {stage !== 'idle' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setStage('idle'); }}
          >
            <motion.div
              className="bg-white w-full max-w-sm p-6 shadow-2xl"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-black text-[#1C1C1C] text-base">60-second callback</div>
                  <div className="text-xs text-[#666] mt-0.5">{agentName} will call you immediately</div>
                </div>
                <button
                  onClick={() => { setStage('idle'); setPhone(''); setMsg(''); }}
                  className="text-[#999] hover:text-[#333] p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              {(stage === 'form' || stage === 'error') && (
                <>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#666] uppercase tracking-wide block mb-1.5">
                      Your mobile number
                    </label>
                    <div className="flex">
                      <div className="bg-[#F5F2EE] border border-[#DDD] border-r-0 px-3 flex items-center text-sm font-bold text-[#333]">+91</div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setMsg(''); }}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        className="flex-1 border border-[#DDD] px-3 py-2.5 text-sm outline-none focus:border-[#1C1C1C] font-mono tracking-widest"
                      />
                    </div>
                    {msg && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                        <AlertCircle size={12} /> {msg}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={submit}
                    disabled={phone.replace(/\D/g,'').length !== 10}
                    className="w-full bg-[#1C1C1C] text-white py-3 font-bold text-sm hover:bg-[#333] disabled:opacity-40 transition-colors"
                  >
                    Call me now
                  </button>
                  <p className="text-center text-[10px] text-[#999] mt-3">
                    By submitting, you agree to be called by the agent.
                  </p>
                </>
              )}

              {/* Loading */}
              {stage === 'loading' && (
                <div className="py-8 flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-[#1C1C1C] animate-spin" />
                  <div className="text-sm font-bold text-[#1C1C1C]">Connecting to {agentName}…</div>
                  <div className="text-xs text-[#666] text-center">Keep your phone handy. Call arriving in 60 seconds.</div>
                </div>
              )}

              {/* Success */}
              {stage === 'success' && (
                <div className="py-6 flex flex-col items-center gap-3 text-center">
                  <CheckCircle2 size={40} className="text-[#2D9945]" />
                  <div className="font-black text-[#1C1C1C] text-base">You'll get a call soon!</div>
                  <div className="text-xs text-[#666] leading-relaxed">
                    {agentName} has been notified. Keep your phone available.
                    Most agents call back within 60 seconds.
                  </div>
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-xs text-[#25D366] font-bold underline"
                    >
                      Or message on WhatsApp instead →
                    </a>
                  )}
                  <button
                    onClick={() => setStage('idle')}
                    className="mt-3 text-xs text-[#999] underline"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
