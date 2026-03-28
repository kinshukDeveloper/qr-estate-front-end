'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Scan, TrendingUp, Users, Zap } from 'lucide-react';
import { useTextScramble, useCountUp, useMagnetic } from '@/lib/animations';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

// ── Floating stat chip ────────────────────────────────────────────────────────
function StatChip({
  icon: Icon, suffix, to, label, color, delay,
}: {
  icon: any; suffix: string; to: number; label: string;
  color: string; delay: number;
}) {
  const numRef = useCountUp(to, 2, delay);
  return (
    <motion.div
      className="flex items-center gap-2.5 bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 rounded-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.8, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.04, borderColor: color }}
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div>
        <div className="font-display font-bold text-[14px] text-[var(--white)] leading-none" style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
          <span ref={numRef}>0</span>{suffix}
        </div>
        <div className="font-code text-[10px] text-[var(--dim)] mt-0.5 tracking-wide uppercase">{label}</div>
      </div>
    </motion.div>
  );
}

// ── Scan animation card ───────────────────────────────────────────────────────
function ScanCard() {
  return (
    <motion.div
      className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 z-10"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.7, ease: 'easeOut' }}
    >
      <motion.div
        className="relative w-52 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-card"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* QR code placeholder */}
        <div className="w-full aspect-square rounded-xl bg-[var(--card)] border border-[var(--border)] mb-3 relative overflow-hidden flex items-center justify-center">
          <div className="grid grid-cols-7 gap-0.5 p-3">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className="w-full aspect-square rounded-[1px]"
                style={{
                  background: [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,8,15,22,10,17,24].includes(i)
                    ? '#18D4C8' : '#18D4C81A'
                }}
              />
            ))}
          </div>
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal to-transparent opacity-80"
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="text-center">
          <div className="font-code text-[9px] text-[var(--dim)] uppercase tracking-wider mb-1">Scan to view</div>
          <div className="font-display font-bold text-[12px] text-[var(--white)] truncate" style={{ fontFamily: 'var(--font-syne)' }}>
            3BHK • Sector 17 CHD
          </div>
          <div className="font-code text-[11px] mt-1" style={{ color: '#E8B84B' }}>₹85,00,000</div>
        </div>

        {/* Live scans indicator */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green" />
            <div className="absolute inset-0 rounded-full bg-green animate-ping opacity-60" />
          </div>
          <span className="font-code text-[10px] text-[var(--dim)]">47 scans today</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function HeroV3() {
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 500], [0, -60]);
  const { ref: ctaRef, springX, springY } = useMagnetic(0.4);

  const headline1 = useTextScramble('Every listing.', 200);
  const headline2 = useTextScramble('One QR code.', 600);
  const headline3 = useTextScramble('Infinite buyers.', 1000);

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden grain">
      {/* Full-bleed R3F canvas */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Depth gradient — top */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--bg)] to-transparent z-[1]" />
      {/* Depth gradient — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg)] to-transparent z-[1]" />
      {/* Side vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/70 via-transparent to-[var(--bg)]/20 z-[1]" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 sm:px-8 pt-24 pb-16"
        style={{ y: yOffset }}
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
          <span
            className="font-code text-[11px] tracking-[3px] uppercase"
            style={{ color: 'var(--gold)' }}
          >
            India's QR-Native Property Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h1
            className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[1.04] tracking-tight text-[var(--white)]"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            <span ref={headline1} className="block" />
            <span ref={headline2} className="block text-gradient-gold" />
            <span ref={headline3} className="block" />
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="text-[clamp(.9rem,2.2vw,1.1rem)] text-[var(--muted)] max-w-lg leading-relaxed mb-10 font-medium"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          Generate a QR code for every hoarding. Buyers scan → see full listing → call or WhatsApp you — in under 30 seconds. Built for Indian agents. Hindi, Punjabi, Marathi, Tamil supported.
        </motion.p>

        {/* CTA row */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-14"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.65, duration: 0.5 }}
        >
          {/* Primary CTA */}
          <motion.div ref={ctaRef as any} style={{ x: springX, y: springY }}>
            <Link href="/auth/register">
              <motion.button
                className="relative flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[15px] font-bold text-bg overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Start free — no card</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <span className="absolute inset-0 bg-shimmer bg-[length:300%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <Link href="#how-it-works">
            <motion.button
              className="flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-semibold text-[var(--muted)] border border-[var(--border2)] hover:border-[var(--gold3)] hover:text-[var(--white)] transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Scan size={15} />
              See how it works
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          <StatChip icon={Zap}       to={2}    suffix=" min"  label="Time to first QR" color="#E8B84B" delay={0.2} />
          <StatChip icon={Scan}      to={47}   suffix="+"     label="Avg scans/listing" color="#18D4C8" delay={0.35} />
          <StatChip icon={TrendingUp} to={3}   suffix="×"     label="More enquiries"   color="#28D890" delay={0.5} />
          <StatChip icon={Users}     to={1000} suffix="+"     label="Active agents"    color="#A870F8" delay={0.65} />
        </div>
      </motion.div>

      {/* Floating scan card */}
      <ScanCard />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
      >
        <span className="font-code text-[10px] tracking-[2px] uppercase text-[var(--dim)]">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-[var(--gold3)] to-transparent"
          animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
