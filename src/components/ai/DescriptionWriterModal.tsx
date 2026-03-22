'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, Copy, Check, ChevronRight, RefreshCw } from 'lucide-react';
import { aiAPI, type DescriptionVariant } from '@/lib/ai';

interface Props {
  listingId:  string;
  onApply:    (text: string) => void;
}

const LABEL_COLORS: Record<string, string> = {
  Short:    'text-[#00D4C8] border-[#00D4C8]/30 bg-[#00D4C8]/08',
  Medium:   'text-[#FFB830] border-[#FFB830]/30 bg-[#FFB830]/08',
  Detailed: 'text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/08',
};

export function DescriptionWriterModal({ listingId, onApply }: Props) {
  const [open, setOpen]           = useState(false);
  const [variants, setVariants]   = useState<DescriptionVariant[] | null>(null);
  const [loading, setLoading]     = useState(false);
  const [source, setSource]       = useState('');
  const [selected, setSelected]   = useState<number | null>(null);
  const [copied, setCopied]       = useState<number | null>(null);
  const [error, setError]         = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    setVariants(null);
    setSelected(null);
    try {
      const res = await aiAPI.writeDescription(listingId);
      setVariants(res.data.data.variants);
      setSource(res.data.data.source);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to generate');
    } finally {
      setLoading(false);
    }
  }

  function openModal() {
    setOpen(true);
    if (!variants) generate();
  }

  function handleApply(idx: number) {
    if (!variants) return;
    onApply(variants[idx].text);
    setOpen(false);
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-1.5 text-xs font-bold text-[#A78BFA] hover:text-white border border-[rgba(167,139,250,0.2)] hover:border-[rgba(167,139,250,0.6)] px-3 py-1.5 transition-colors"
      >
        <Wand2 size={12} />
        AI Write
      </button>

      {/* Modal backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-[#0D1821] border border-[#1A2D40] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2D40] sticky top-0 bg-[#0D1821] z-10">
                <div className="flex items-center gap-2">
                  <Wand2 size={15} className="text-[#A78BFA]" />
                  <span className="font-bold text-white text-sm">AI Description Writer</span>
                  {source === 'openai' && (
                    <span className="text-[9px] font-bold font-mono text-[#A78BFA] bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.2)] px-1.5 py-0.5 uppercase tracking-widest">GPT-4o mini</span>
                  )}
                  {source === 'cache' && (
                    <span className="text-[9px] font-mono text-[#4A6580] px-1.5">cached</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={generate}
                    disabled={loading}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#4A6580] hover:text-[#A78BFA] disabled:opacity-40 transition-colors"
                  >
                    <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-[#4A6580] hover:text-white transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5">
                {loading && (
                  <div className="py-12 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[#4A6580] font-mono">
                      {source === 'openai' ? 'Writing with GPT-4o mini…' : 'Generating descriptions…'}
                    </span>
                  </div>
                )}

                {error && (
                  <div className="py-4 text-sm text-[#FF4D6A] font-mono text-center">{error}</div>
                )}

                <AnimatePresence>
                  {variants && !loading && (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs text-[#4A6580] font-mono mb-4">
                        Pick a variant and click &quot;Use this&quot; to paste it into the description field.
                      </p>

                      {variants.map((v, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`border rounded-none transition-all cursor-pointer ${
                            selected === i
                              ? 'border-[#A78BFA] bg-[rgba(167,139,250,0.06)]'
                              : 'border-[#1A2D40] hover:border-[#1A2D40]/80 hover:bg-[#111C28]'
                          }`}
                          onClick={() => setSelected(selected === i ? null : i)}
                        >
                          {/* Variant header */}
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1A2D40]">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold tracking-widest uppercase font-mono px-2 py-0.5 border ${LABEL_COLORS[v.label] ?? 'text-white border-white/20'}`}>
                                {v.label}
                              </span>
                              <span className="text-[10px] text-[#4A6580] font-mono">~{v.words} words</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleCopy(v.text, i); }}
                                className="flex items-center gap-1 text-[10px] font-mono text-[#4A6580] hover:text-[#00D4C8] transition-colors"
                              >
                                {copied === i ? <Check size={10} /> : <Copy size={10} />}
                                {copied === i ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          {/* Variant text */}
                          <div className="px-4 py-3">
                            <p className="text-sm text-[#7A95AE] leading-relaxed">{v.text}</p>
                          </div>

                          {/* Apply button (only when selected) */}
                          <AnimatePresence>
                            {selected === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-3">
                                  <button
                                    type="button"
                                    onClick={() => handleApply(i)}
                                    className="w-full flex items-center justify-center gap-2 bg-[#A78BFA] text-[#0D1821] font-bold text-sm py-2.5 hover:bg-[#9571F7] transition-colors"
                                  >
                                    <ChevronRight size={14} />
                                    Use this description
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
