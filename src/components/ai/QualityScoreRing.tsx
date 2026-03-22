'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { type QualityScore } from '@/lib/ai';

// ── Score colour ───────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return { stroke: '#2ECC8A', text: 'text-[#2ECC8A]', label: 'Excellent', ring: '#2ECC8A' };
  if (score >= 60) return { stroke: '#00D4C8', text: 'text-[#00D4C8]', label: 'Good',      ring: '#00D4C8' };
  if (score >= 40) return { stroke: '#FFB830', text: 'text-[#FFB830]', label: 'Fair',      ring: '#FFB830' };
  return              { stroke: '#FF4D6A', text: 'text-[#FF4D6A]', label: 'Needs work', ring: '#FF4D6A' };
}

// ── Breakdown row ─────────────────────────────────────────────────────────────
const BREAKDOWN_LABELS: Record<string, { label: string; max: number; tip: string }> = {
  photos:      { label: 'Photos',       max: 20, tip: 'Add ≥1 property photo' },
  description: { label: 'Description',  max: 20, tip: 'Write >100 words' },
  floor:       { label: 'Floor number', max: 10, tip: 'Set floor / total floors' },
  furnishing:  { label: 'Furnishing',   max: 10, tip: 'Set furnishing status' },
  amenities:   { label: 'Amenities',    max: 15, tip: 'Add ≥3 amenities' },
  area:        { label: 'Area (sq.ft)', max: 10, tip: 'Enter carpet area' },
  active_qr:   { label: 'Active QR',   max: 15, tip: 'Generate a QR code' },
};

interface Props {
  qs:       QualityScore;
  compact?: boolean;
}

export function QualityScoreRing({ qs, compact = false }: Props) {
  const { score, breakdown } = qs;
  const col = scoreColor(score);

  // SVG arc params
  const r   = 38;
  const cx  = 50;
  const cy  = 50;
  const circ = 2 * Math.PI * r; // ≈ 238.76

  // Animated arc length
  const arcRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (!arcRef.current) return;
    const target = (score / 100) * circ;
    let start: number | null = null;
    const duration = 900;

    function frame(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - pct, 3);
      if (arcRef.current) {
        arcRef.current.style.strokeDashoffset = String(circ - eased * target);
      }
      if (pct < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [score, circ]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A2D40" strokeWidth="10" />
            <circle
              ref={arcRef}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={col.stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-mono font-black text-[10px] ${col.text}`}>{score}</span>
          </div>
        </div>
        <div>
          <div className={`font-bold text-xs ${col.text}`}>{col.label}</div>
          <div className="text-[10px] text-[#4A6580] font-mono">{score}/100</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1821] border border-[#1A2D40] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase font-mono">
          Listing Quality Score
        </div>
        <div className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border font-mono`}
          style={{ color: col.stroke, borderColor: col.stroke + '40', background: col.stroke + '10' }}>
          {col.label}
        </div>
      </div>

      {/* Ring + score */}
      <div className="flex items-center gap-6 mb-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A2D40" strokeWidth="10" />
            {/* Arc */}
            <circle
              ref={arcRef}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={col.stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ}
              style={{ filter: `drop-shadow(0 0 6px ${col.stroke}60)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono font-black text-2xl leading-none ${col.text}`}>{score}</span>
            <span className="text-[#4A6580] text-[9px] font-mono">/100</span>
          </div>
        </div>

        <div className="flex-1 text-sm text-[#7A95AE] leading-relaxed">
          {score >= 80
            ? 'Your listing is well-optimised. Buyers get all the info they need.'
            : score >= 60
            ? 'Good start! Fill in the missing details below to reach 80+.'
            : score >= 40
            ? 'Several key fields are missing. Complete them to boost enquiries.'
            : 'This listing needs attention. Buyers can\'t find enough info to enquire.'}
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2">
        {Object.entries(BREAKDOWN_LABELS).map(([key, meta]) => {
          const earned = (breakdown as any)[key] ?? 0;
          const pct    = (earned / meta.max) * 100;
          const done   = earned > 0;

          return (
            <div key={key}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                <span className={done ? 'text-[#7A95AE]' : 'text-[#4A6580]'}>
                  {done ? '✓' : '○'} {meta.label}
                </span>
                <span className={done ? col.text : 'text-[#4A6580]'}>
                  {earned}/{meta.max}
                </span>
              </div>
              <div className="h-1 bg-[#1A2D40] overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: done ? col.stroke : '#1A2D40' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                />
              </div>
              {!done && (
                <div className="text-[9px] text-[#4A6580] mt-0.5 font-mono">{meta.tip}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
