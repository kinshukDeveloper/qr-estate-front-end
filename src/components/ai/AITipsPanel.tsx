'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { aiAPI, type AITip } from '@/lib/ai';

interface Props {
  listingId: string;
  initialTips?: AITip[];
}

export function AITipsPanel({ listingId, initialTips }: Props) {
  const [tips, setTips]       = useState<AITip[] | null>(initialTips ?? null);
  const [loading, setLoading] = useState(false);
  const [source, setSource]   = useState<string>('');
  const [error, setError]     = useState('');

  async function loadTips() {
    setLoading(true);
    setError('');
    try {
      const res = await aiAPI.getTips(listingId);
      setTips(res.data.data.tips);
      setSource(res.data.data.source);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load tips');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0D1821] border border-[#1A2D40]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2D40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#A78BFA]" />
          <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">
            AI Coaching Tips
          </span>
          {source === 'openai' && (
            <span className="text-[9px] font-bold font-mono text-[#A78BFA] bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.2)] px-1.5 py-0.5 uppercase tracking-widest">
              GPT-4o
            </span>
          )}
          {source === 'rules' && (
            <span className="text-[9px] font-mono text-[#4A6580]">rule-based</span>
          )}
          {source === 'cache' && (
            <span className="text-[9px] font-mono text-[#4A6580]">cached</span>
          )}
        </div>
        <button
          onClick={loadTips}
          disabled={loading}
          className="flex items-center gap-1.5 text-[10px] font-mono text-[#4A6580] hover:text-[#00D4C8] disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          {tips ? 'Refresh' : 'Load tips'}
        </button>
      </div>

      <div className="px-5 py-4">
        {!tips && !loading && (
          <button
            onClick={loadTips}
            className="w-full border border-dashed border-[#1A2D40] hover:border-[#A78BFA]/40 text-[#4A6580] hover:text-[#A78BFA] py-6 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            Get AI tips to improve this listing
          </button>
        )}

        {loading && (
          <div className="py-6 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#4A6580] font-mono">Analysing listing…</span>
          </div>
        )}

        {error && (
          <div className="py-3 text-xs text-[#FF4D6A] font-mono">{error}</div>
        )}

        <AnimatePresence>
          {tips && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  className="flex gap-3 bg-[rgba(167,139,250,0.04)] border border-[rgba(167,139,250,0.1)] p-3 hover:border-[rgba(167,139,250,0.25)] transition-colors"
                >
                  <span className="text-base flex-shrink-0 mt-0.5">{tip.icon}</span>
                  <p className="text-sm text-[#7A95AE] leading-relaxed flex-1">{tip.tip}</p>
                  <ChevronRight size={12} className="text-[#4A6580] flex-shrink-0 mt-1" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
