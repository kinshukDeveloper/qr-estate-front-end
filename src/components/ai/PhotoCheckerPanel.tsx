'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, CheckCircle2, RefreshCw, ChevronDown } from 'lucide-react';
import { aiAPI, type PhotoResult } from '@/lib/ai';

interface Props {
  listingId: string;
  hasPhotos: boolean;
}

const ISSUE_LABELS: Record<string, string> = {
  blurry:           '🌀 Blurry',
  dark_lighting:    '🌑 Dark',
  watermark:        '⚠️ Watermark',
  cluttered:        '📦 Cluttered',
  poor_angle:       '📐 Bad angle',
  small_room_effect:'🔍 Looks small',
  exterior_only:    '🏗 Exterior only',
  no_natural_light: '☁️ No daylight',
  few_photos:       '📸 Few photos',
};

function ScoreDot({ score }: { score: number }) {
  const color = score >= 8 ? '#2ECC8A' : score >= 6 ? '#FFB830' : '#FF4D6A';
  const label = score >= 8 ? 'Good'     : score >= 6 ? 'Fair'    : 'Poor';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="font-mono text-[10px]" style={{ color }}>{label} ({score}/10)</span>
    </div>
  );
}

export function PhotoCheckerPanel({ listingId, hasPhotos }: Props) {
  const [results, setResults]   = useState<PhotoResult[] | null>(null);
  const [loading, setLoading]   = useState(false);
  const [source, setSource]     = useState('');
  const [error, setError]       = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  async function check() {
    if (!hasPhotos) return;
    setLoading(true);
    setError('');
    try {
      const res = await aiAPI.checkPhotos(listingId);
      setResults(res.data.data.results);
      setSource(res.data.data.source);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to check photos');
    } finally {
      setLoading(false);
    }
  }

  const avgScore = results?.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : null;

  return (
    <div className="bg-[#0D1821] border border-[#1A2D40]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2D40] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-[#60A5FA]" />
          <span className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">
            Photo Quality Check
          </span>
          {source === 'openai' && (
            <span className="text-[9px] font-bold font-mono text-[#60A5FA] bg-[rgba(96,165,250,0.08)] border border-[rgba(96,165,250,0.2)] px-1.5 py-0.5 uppercase tracking-widest">
              GPT-4o Vision
            </span>
          )}
        </div>
        {avgScore !== null && (
          <div className="font-mono text-xs text-[#4A6580]">
            Avg score: <span className="text-white font-bold">{avgScore}/10</span>
          </div>
        )}
      </div>

      <div className="px-5 py-4">
        {!hasPhotos && (
          <div className="py-5 text-center text-xs text-[#4A6580] font-mono">
            Upload photos first to run the quality check.
          </div>
        )}

        {hasPhotos && !results && !loading && (
          <button
            type="button"
            onClick={check}
            className="w-full border border-dashed border-[#1A2D40] hover:border-[#60A5FA]/40 text-[#4A6580] hover:text-[#60A5FA] py-5 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={15} />
            Check photo quality with AI
          </button>
        )}

        {loading && (
          <div className="py-8 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#60A5FA] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#4A6580] font-mono">Analysing photos…</span>
          </div>
        )}

        {error && (
          <div className="py-3 text-xs text-[#FF4D6A] font-mono">{error}</div>
        )}

        <AnimatePresence>
          {results && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-[#1A2D40] overflow-hidden"
                >
                  {/* Row header */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#111C28] transition-colors text-left"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                  >
                    {/* Thumb */}
                    <div className="w-14 h-12 bg-[#111C28] flex-shrink-0 overflow-hidden">
                      <img src={r.url} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <ScoreDot score={r.score} />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {r.issues.length === 0
                          ? <span className="text-[9px] font-mono text-[#2ECC8A]">✓ Looks good</span>
                          : r.issues.map(issue => (
                            <span key={issue} className="text-[9px] font-mono bg-[rgba(255,77,106,0.08)] text-[#FF4D6A] border border-[rgba(255,77,106,0.2)] px-1.5 py-0.5">
                              {ISSUE_LABELS[issue] ?? issue}
                            </span>
                          ))
                        }
                      </div>
                    </div>

                    <ChevronDown
                      size={12}
                      className={`text-[#4A6580] flex-shrink-0 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Suggestion */}
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 border-t border-[#1A2D40] bg-[#111C28]">
                          <div className="flex gap-2 text-xs text-[#7A95AE] leading-relaxed">
                            {r.issues.length === 0
                              ? <CheckCircle2 size={13} className="text-[#2ECC8A] flex-shrink-0 mt-0.5" />
                              : <AlertCircle size={13} className="text-[#FFB830] flex-shrink-0 mt-0.5" />
                            }
                            <span>{r.suggestion}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Recheck button */}
              <button
                type="button"
                onClick={check}
                className="w-full flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#4A6580] hover:text-[#60A5FA] py-2 transition-colors"
              >
                <RefreshCw size={10} /> Re-check photos
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
