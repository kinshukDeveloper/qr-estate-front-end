'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, QrCode, Scan, TrendingUp } from 'lucide-react';
import { QRVisual } from './QRVisual';

// Dynamic import — no SSR for Three.js
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

// ── GSAP text scramble ────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

function useTextScramble(finalText: string, delay = 0) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = finalText.split('');
    let frame = 0;
    let raf: number;

    const scramble = () => {
      if (!ref.current) return;
      ref.current.textContent = chars
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i <= frame / 2) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      frame++;
      if (frame < chars.length * 2.5) raf = requestAnimationFrame(scramble);
      else if (ref.current) ref.current.textContent = finalText;
    };

    const timer = setTimeout(() => raf = requestAnimationFrame(scramble), delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [finalText, delay]);

  return ref;
}

// ── GSAP stat counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '', delay = 0 }: { to: number; prefix?: string; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { val: 0 };
    const tl = gsap.to(obj, {
      val: to,
      duration: 2,
      delay,
      ease: 'power2.out',
      onUpdate() {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(obj.val).toLocaleString('en-IN')}${suffix}`;
      },
    });
    return () => { tl.kill(); };
  }, [to, prefix, suffix, delay]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ── Floating stat card ────────────────────────────────────────────────────────
function FloatCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute bg-brand-card/90 backdrop-blur-sm border border-brand-border/80 px-4 py-3 z-10 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 180, damping: 18 }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(0,212,200,0.4)' }}
      style={{ animation: `float${delay > 0.5 ? 'B' : 'A'} 4s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const headRef1 = useTextScramble('Every listing', 400);
  const headRef2 = useTextScramble('gets a', 700);
  const headRef3 = useTextScramble('QR code.', 1000);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQrReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">

      {/* 3D canvas — fills section */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroScene />
      </div>

      {/* Dark radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(8,15,23,0.7) 100%)' }} />

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(to right, #00D4C8 1px, transparent 1px), linear-gradient(to bottom, #00D4C8 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative max-w-6xl mx-auto px-6 w-full z-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* ── Left: copy ── */}
          <div>
            {/* Eyebrow badge */}
            <motion.div
              className="inline-flex items-center gap-2 border border-brand-teal/30 bg-brand-teal/[0.06] px-3 py-1.5 mb-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-brand-teal rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="font-mono text-[10px] font-bold tracking-[2px] text-brand-teal uppercase">
                India&apos;s #1 QR-native listing platform
              </span>
            </motion.div>

            {/* Scramble headline */}
            <h1 className="font-black text-5xl lg:text-[3.6rem] leading-[1.02] tracking-tight text-white mb-7">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <span ref={headRef1}>Every listing</span>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <span ref={headRef2}>gets a</span>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
                <span ref={headRef3} className="text-brand-teal" />
              </motion.div>
            </h1>

            <motion.p
              className="text-brand-gray-light text-lg leading-relaxed mb-9 max-w-md font-light"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Paste on hoardings, standees, brochures. Buyers scan with any phone — no app needed. You get instant enquiries, analytics, and leads.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <motion.a
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-brand-teal text-brand-bg font-bold px-6 py-3 text-sm"
                whileHover={{ scale: 1.04, backgroundColor: '#00B8AD' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                Start free — 5 listings <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="/auth/login"
                className="inline-flex items-center gap-2 border border-brand-border text-brand-gray-light px-6 py-3 text-sm"
                whileHover={{ scale: 1.03, borderColor: 'rgba(0,212,200,0.4)', color: '#F0F6FF' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <QrCode size={15} /> Log in
              </motion.a>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              {['✓ No app for buyers', '✓ RERA support', '✓ Works on any phone', '✓ Free forever plan'].map((t, i) => (
                <motion.span
                  key={t}
                  className="font-mono text-xs text-brand-gray tracking-wide"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + i * 0.08 }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: QR card ── */}
          <div className="relative flex justify-center">
            {/* Floating stat cards */}
            <FloatCard className="-left-8 top-4" delay={1.8}>
              <div className="text-[10px] text-brand-gray font-mono uppercase tracking-wide mb-1">QR Scans today</div>
              <div className="text-2xl font-black text-brand-teal font-mono">
                <Counter to={247} delay={2} />
              </div>
              <div className="text-[10px] text-brand-green font-mono mt-0.5 flex items-center gap-1">
                <TrendingUp size={9} /> +23% vs yesterday
              </div>
            </FloatCard>

            <FloatCard className="-right-4 bottom-16" delay={2.1}>
              <div className="text-[10px] text-brand-gray font-mono uppercase tracking-wide mb-1">New enquiry</div>
              <div className="font-bold text-white text-sm">Priya K.</div>
              <div className="text-[10px] text-brand-gray-light font-mono mt-0.5">3BHK · Bandra West</div>
            </FloatCard>

            {/* Main QR printed card */}
            <motion.div
              className="bg-white p-6 shadow-[0_0_60px_rgba(0,212,200,0.15)] relative"
              initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ delay: 1.5, duration: 0.8, type: 'spring', stiffness: 120 }}
              whileHover={{ rotateY: 4, rotateX: -4, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d', perspective: 800 }}
            >
              <div className="text-brand-bg text-[10px] font-bold tracking-[3px] uppercase mb-3 text-center font-mono">
                Scan to View Property
              </div>

              <div className="relative">
                <QRVisual size={220} animate={qrReady} />
                {/* Corner brackets */}
                {(['tl','tr','bl','br'] as const).map(pos => (
                  <motion.div
                    key={pos}
                    className={`absolute w-5 h-5 ${pos === 'tl' ? 'top-0 left-0 border-t-2 border-l-2' : pos === 'tr' ? 'top-0 right-0 border-t-2 border-r-2' : pos === 'bl' ? 'bottom-0 left-0 border-b-2 border-l-2' : 'bottom-0 right-0 border-b-2 border-r-2'} border-brand-teal`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2, type: 'spring' }}
                  />
                ))}
                {/* Scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-teal to-transparent"
                  animate={{ top: ['4%', '93%', '4%'] }}
                  transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
                />
              </div>

              <div className="mt-3 text-center">
                <div className="text-brand-bg font-black text-sm">3BHK · Bandra West</div>
                <div className="text-brand-bg/60 text-xs font-mono mt-0.5">qrestate.in/p/V7xKp2Qm</div>
              </div>
            </motion.div>

            {/* Scan count badge */}
            <motion.div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-brand-teal text-brand-bg font-mono font-bold text-xs px-4 py-1.5 flex items-center gap-1.5 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, type: 'spring' }}
            >
              <Scan size={11} />
              <Counter to={1240} delay={2.5} suffix=" scans this month" />
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
        >
          {[
            { prefix: '', to: 5000, suffix: '+',   label: 'Active agents',  color: 'text-brand-teal' },
            { prefix: '₹', to: 2.4,  suffix: 'Cr+', label: 'In deals closed', color: 'text-brand-gold' },
            { prefix: '', to: 12,    suffix: '',    label: 'Cities across India', color: 'text-brand-blue' },
            { prefix: '', to: 99.9,  suffix: '%',   label: 'Uptime SLA',    color: 'text-brand-green' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-brand-bg px-6 py-6 text-center"
              whileHover={{ backgroundColor: 'rgba(0,212,200,0.04)' }}
            >
              <div className={`font-black text-3xl font-mono ${s.color}`}>
                {s.prefix}<Counter to={s.to} prefix={s.prefix} suffix={s.suffix} delay={2 + i * 0.15} />
              </div>
              <div className="text-brand-gray text-xs uppercase tracking-widest mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      `}</style>
    </section>
  );
}
