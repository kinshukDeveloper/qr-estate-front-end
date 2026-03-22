'use client';

interface Props {
  score: number;
  showLabel?: boolean;
}

function color(score: number) {
  if (score >= 80) return { bg: 'rgba(46,204,138,0.10)',  border: 'rgba(46,204,138,0.25)',  text: '#2ECC8A' };
  if (score >= 60) return { bg: 'rgba(0,212,200,0.10)',   border: 'rgba(0,212,200,0.25)',   text: '#00D4C8' };
  if (score >= 40) return { bg: 'rgba(255,184,48,0.10)',  border: 'rgba(255,184,48,0.25)',  text: '#FFB830' };
  return             { bg: 'rgba(255,77,106,0.10)',  border: 'rgba(255,77,106,0.25)',  text: '#FF4D6A' };
}

export function QualityBadge({ score, showLabel = false }: Props) {
  const c = color(score);
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 tracking-widest"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
    >
      {score}
      {showLabel && <span className="opacity-70">/100</span>}
    </span>
  );
}
