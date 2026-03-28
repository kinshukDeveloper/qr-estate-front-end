'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, QrCode, Scan, MessageSquare } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: '01', icon: Upload, title: 'List your property',
    desc: 'Create a listing in 2 minutes. Add photos, price, amenities, and a virtual tour link. Your listing is live immediately.',
    color: '#E8B84B',
  },
  {
    step: '02', icon: QrCode, title: 'Get your QR code',
    desc: 'A print-ready QR code is automatically generated. Download as PNG or SVG. Print on hoardings, standees, brochures.',
    color: '#18D4C8',
  },
  {
    step: '03', icon: Scan, title: 'Buyers scan anywhere',
    desc: 'Any buyer with a phone camera scans the QR code and instantly sees your full listing — in their language, on any device.',
    color: '#A870F8',
  },
  {
    step: '04', icon: MessageSquare, title: 'Leads come to you',
    desc: 'Buyers enquire directly via WhatsApp or call. Or request a 60-second callback. Every lead appears in your dashboard instantly.',
    color: '#28D890',
  },
];

export default function HowItWorksV3() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: lineRef.current, start: 'top 70%' } }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="how-it-works" className="relative py-28 px-5 sm:px-8">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center max-w-xl mx-auto mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-teal" />
            <span className="font-code text-[11px] tracking-[3px] uppercase text-teal">Zero learning curve</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-teal" />
          </div>
          <h2
            className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--white)] mb-4"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            From listing to{' '}
            <span className="text-gradient-teal">live QR in 2 minutes</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px bg-[var(--border)]">
            <div ref={lineRef} className="absolute inset-0 bg-gradient-to-r from-gold via-teal to-green" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
              >
                {/* Step number + icon */}
                <div className="relative mb-6">
                  {/* Outer ring */}
                  <div
                    className="absolute inset-[-8px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ border: `1px solid ${s.color}30` }}
                  />
                  <motion.div
                    className="w-[104px] h-[104px] rounded-full flex flex-col items-center justify-center border-2 relative z-10"
                    style={{
                      background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)`,
                      borderColor: `${s.color}40`,
                    }}
                    whileHover={{ scale: 1.06, borderColor: `${s.color}90` }}
                    transition={{ type: 'spring', stiffness: 280 }}
                  >
                    <s.icon size={28} style={{ color: s.color }} strokeWidth={1.5} />
                    <span
                      className="font-code text-[10px] font-medium mt-1.5"
                      style={{ color: `${s.color}90` }}
                    >
                      Step {s.step}
                    </span>
                  </motion.div>

                  {/* Pulse ring */}
                  <div
                    className="absolute inset-[-4px] rounded-full animate-pulse-ring"
                    style={{ background: 'transparent', border: `1px solid ${s.color}` }}
                  />
                </div>

                <h3
                  className="font-display font-bold text-[15px] text-[var(--white)] mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[200px]">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
