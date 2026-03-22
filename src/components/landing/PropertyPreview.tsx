'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Check, MapPin, Phone, MessageCircle } from 'lucide-react';

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg']);
  const glowX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  function onMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className="relative"
    >
      {/* Dynamic glow */}
      <motion.div
        className="absolute -inset-4 opacity-0 pointer-events-none rounded-sm"
        style={{
          background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, rgba(0,212,200,0.15), transparent 60%)`,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  );
}

const BENEFITS = [
  'Photo gallery with full-screen swipe',
  'Price in Lakh / Crore format automatically',
  'Bedrooms, bathrooms, area at a glance',
  'WhatsApp pre-filled with property details',
  'Lead enquiry form — captures buyer info',
  'View count and QR scan count visible',
];

export function PropertyPreview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-6 border-t border-brand-border bg-brand-surface" ref={ref}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-mono text-[10px] font-bold tracking-[3px] text-brand-teal uppercase mb-3">What buyers see</div>
          <h2 className="font-black text-4xl text-white tracking-tight mb-6">
            A page that<br />
            <motion.span
              className="text-brand-teal inline-block"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              converts.
            </motion.span>
          </h2>
          <p className="text-brand-gray-light leading-relaxed mb-8">
            When a buyer scans your QR, they land on a beautiful mobile page — photos, price, specs, location, and your contact. One tap to call or WhatsApp.
          </p>
          <ul className="space-y-3">
            {BENEFITS.map((item, i) => (
              <motion.li
                key={item}
                className="flex items-center gap-3 text-sm text-brand-gray-light"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.45 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Check size={14} className="text-brand-teal flex-shrink-0" />
                </motion.div>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right — 3D tilt card */}
        <motion.div
          className="relative max-w-xs mx-auto"
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          {/* URL badge */}
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-bg border border-brand-border font-mono text-[10px] text-brand-teal px-3 py-1.5 tracking-widest whitespace-nowrap z-10"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            qrestate.in/p/V7xKp2Qm
          </motion.div>

          <TiltCard>
            <div className="bg-[#F5F2EE] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.4)] border-4 border-[#1C1C1C]">
              {/* Image area */}
              <div className="h-44 bg-[#1C1C1C] relative flex items-center justify-center overflow-hidden">
                <div className="text-[#2A2A2A] text-xs font-mono">[ Property Photos ]</div>
                {/* Mock image gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-mono px-2 py-0.5">1/6</div>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-3 bg-white' : 'w-1 bg-white/40'}`} />
                  ))}
                </div>
              </div>

              {/* Price strip */}
              <div className="bg-white border-b-4 border-[#1C1C1C] px-4 py-3 flex justify-between items-start">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#1C1C1C]">₹1.85</span>
                    <span className="text-xs font-semibold text-[#666]">Crore</span>
                  </div>
                  <span className="text-[10px] text-[#2D9945] font-bold">Negotiable</span>
                </div>
                <span className="text-[9px] font-black tracking-widest bg-[#E8F5E9] text-[#2D9945] px-2 py-1 uppercase">Available</span>
              </div>

              {/* Title */}
              <div className="bg-white px-4 py-3 border-b border-[#EEE]">
                <div className="font-black text-[#1C1C1C] text-sm">3BHK Flat in Bandra West</div>
                <div className="flex items-center gap-1 text-xs text-[#666] mt-1">
                  <MapPin size={9} className="text-[#C0392B]" />Bandra West, Mumbai
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-4 bg-[#1C1C1C]">
                {[{v:'3',l:'Beds'},{v:'2',l:'Baths'},{v:'1200',l:'sq.ft'},{v:'8/14',l:'Floor'}].map(s => (
                  <div key={s.l} className="py-3 text-center border-r border-[#333] last:border-0">
                    <div className="text-xs font-bold text-white">{s.v}</div>
                    <div className="text-[9px] text-[#666] uppercase tracking-wide mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex border-t-2 border-[#1C1C1C]">
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#1C1C1C] py-3">
                  <Phone size={11} className="text-white" fill="white" /><span className="text-white font-bold text-xs">Call Agent</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] py-3">
                  <MessageCircle size={11} className="text-white" fill="white" /><span className="text-white font-bold text-xs">WhatsApp</span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Shadow card behind */}
          <div className="absolute -bottom-3 left-3 right-3 h-full bg-brand-teal/10 border border-brand-teal/20 -z-10" style={{ transform: 'translateZ(-20px)' }} />
        </motion.div>
      </div>
    </section>
  );
}
