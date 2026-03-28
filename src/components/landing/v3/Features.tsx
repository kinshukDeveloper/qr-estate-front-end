'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  QrCode, BarChart2, MessageSquare, Globe, Brain, Layers,
  Phone, Palette, Key, TrendingUp, Users, Shield, Zap, Map,
} from 'lucide-react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ── Feature card data ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: QrCode, title: 'Instant QR Generation',
    desc: 'Every listing gets a print-ready QR code in under 2 minutes. Perfect for hoardings, standees, and site boards.',
    color: '#18D4C8', size: 'tall',
    label: 'Core feature',
  },
  {
    icon: BarChart2, title: 'Scan Analytics',
    desc: 'See exactly how many buyers scanned your QR, which listing performs best, and when peak scan hours are.',
    color: '#E8B84B', size: 'normal',
    label: 'Analytics',
  },
  {
    icon: Brain, title: 'AI Listing Optimizer',
    desc: 'AI scores your listing 0–100, suggests better titles, flags missing amenities, and predicts conversion rate.',
    color: '#A870F8', size: 'normal',
    label: 'AI Powered',
  },
  {
    icon: Globe, title: '5 Regional Languages',
    desc: 'Buyer-facing property pages in Hindi, Punjabi, Marathi, and Tamil. Every buyer reads in their language.',
    color: '#28D890', size: 'wide',
    label: 'India-first',
  },
  {
    icon: Phone, title: '60-Second Callback',
    desc: 'Buyer taps "Call me" on the property page → agent gets a call within 60 seconds via Twilio Voice.',
    color: '#F04060', size: 'normal',
    label: 'Live calling',
  },
  {
    icon: Users, title: 'Agency Workspace',
    desc: 'Multi-agent teams with role-based access. Owner, admin, agent, viewer roles. Shared listings and leads.',
    color: '#4898F8', size: 'normal',
    label: 'Team feature',
  },
  {
    icon: Palette, title: 'White-label Branding',
    desc: 'Brand buyer pages with your logo, colors, custom font, and domain. Buyers never see "QR Estate".',
    color: '#E8B84B', size: 'normal',
    label: 'Agency plan',
  },
  {
    icon: Key, title: 'Portal API + Webhooks',
    desc: 'Push listings to MagicBricks, 99acres, or your own CRM via API keys. Get notified on every lead via webhook.',
    color: '#18D4C8', size: 'normal',
    label: 'Developer',
  },
  {
    icon: Map, title: 'Virtual Tour Embed',
    desc: 'Add Matterport, YouTube, or Vimeo tours to any listing. Buyers explore the property from their phone.',
    color: '#A870F8', size: 'wide',
    label: 'Immersive',
  },
];

// ── Individual card ───────────────────────────────────────────────────────────
function FeatureCard({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useSpring(mx, { stiffness: 150, damping: 20 });
  const glowY = useSpring(my, { stiffness: 150, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onMouseLeave = () => { mx.set(0.5); my.set(0.5); };

  const isWide = feat.size === 'wide';
  const isTall = feat.size === 'tall';

  return (
    <motion.div
      ref={cardRef}
      className={`feature-card relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden group cursor-default
        ${isWide ? 'col-span-2' : 'col-span-1'}
        ${isTall ? 'row-span-2' : 'row-span-1'}
      `}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ borderColor: `${feat.color}40` }}
      transition={{ duration: 0.2 }}
    >
      {/* Radial glow follows cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: glowX.get() + glowY.get() > 0 ? undefined : undefined,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at calc(${glowX}*100%) calc(${glowY}*100%), ${feat.color}14 0%, transparent 60%)`,
          }}
        />
      </motion.div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)` }}
      />

      {/* Content */}
      <div className={`relative p-6 flex flex-col h-full ${isTall ? 'min-h-[280px]' : 'min-h-[148px]'}`}>
        {/* Label pill */}
        <div
          className="self-start font-code text-[9px] font-medium tracking-[2px] uppercase px-2.5 py-1 rounded-full mb-4 border"
          style={{
            color: feat.color,
            borderColor: `${feat.color}30`,
            background: `${feat.color}0E`,
          }}
        >
          {feat.label}
        </div>

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ background: `${feat.color}14`, border: `1px solid ${feat.color}25` }}
        >
          <feat.icon size={18} style={{ color: feat.color }} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-[15px] text-[var(--white)] mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-syne)', fontWeight: 700 }}
        >
          {feat.title}
        </h3>

        {/* Desc */}
        <p className="text-[12.5px] text-[var(--muted)] leading-relaxed">
          {feat.desc}
        </p>

        {/* Arrow — appears on hover */}
        <div
          className="absolute bottom-5 right-5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
          style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}30` }}
        >
          <span style={{ color: feat.color, fontSize: 12 }}>→</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function FeaturesV3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.feature-card');

    // Header
    gsap.fromTo(headRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 85%' } }
    );

    // Cards stagger
    gsap.fromTo(cards,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="features" className="relative py-28 px-5 sm:px-8 overflow-hidden" ref={sectionRef}>
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
            <span className="font-code text-[11px] tracking-[3px] uppercase text-gold">Everything you need</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2
            className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--white)] mb-4"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            Built for Indian agents.{' '}
            <span className="text-gradient-gold">Built to close deals.</span>
          </h2>
          <p className="text-[var(--muted)] text-[15px] leading-relaxed">
            From QR generation to AI-powered lead scoring — every feature your real estate business needs, in one platform.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">
          {FEATURES.map((feat, i) => (
            <FeatureCard key={feat.title} feat={feat} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[var(--dim)] font-code text-[12px] tracking-wide mb-3">
            + Virtual tours · E-signature · Commission calculator · Market intelligence · And 18 more features in V3
          </p>
        </motion.div>
      </div>
    </section>
  );
}
