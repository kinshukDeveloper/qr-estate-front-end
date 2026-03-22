'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { QRVisual } from './QRVisual';

// ── GSAP particle burst on CTA click ─────────────────────────────────────────
function useBurst(ref: React.RefObject<HTMLElement>) {
  function burst(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    for (let i = 0; i < 16; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;width:6px;height:6px;background:#00D4C8;border-radius:50%;left:${cx}px;top:${cy}px;pointer-events:none;z-index:50`;
      el.appendChild(dot);

      const angle = (i / 16) * Math.PI * 2;
      const dist = 50 + Math.random() * 60;
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => dot.remove(),
      });
    }
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('click', burst as EventListener);
    return () => el.removeEventListener('click', burst as EventListener);
  }, []);
}

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  useBurst(btnRef as React.RefObject<HTMLElement>);

  return (
    <section className="py-32 px-6 border-t border-brand-border relative overflow-hidden" ref={sectionRef}>
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(to right, #00D4C8 1px, transparent 1px), linear-gradient(to bottom, #00D4C8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Radial glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,200,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating QR modules in background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-brand-teal/20"
          style={{
            left: `${5 + i * 8}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Animated mini QR */}
        <motion.div
          className="inline-flex w-16 h-16 border-2 border-brand-teal/30 items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          whileHover={{ rotate: 15, scale: 1.1, borderColor: 'rgba(0,212,200,0.8)' }}
        >
          <QRVisual size={48} />
        </motion.div>

        <motion.h2
          className="font-black text-5xl lg:text-6xl text-white tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Ready to scan<br />
          <span className="text-brand-teal">your first deal?</span>
        </motion.h2>

        <motion.p
          className="text-brand-gray-light text-lg mb-10 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          Free forever for solo agents. 5 listings, unlimited QR scans, full property pages. No credit card.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.a
            ref={btnRef as any}
            href="/auth/register"
            className="relative inline-flex items-center gap-2 bg-brand-teal text-brand-bg font-black text-base px-9 py-4 overflow-hidden"
            whileHover={{ scale: 1.06, backgroundColor: '#00B8AD' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">Create free account</span>
            <ArrowRight size={18} className="relative" />
          </motion.a>

          <motion.a
            href="/auth/login"
            className="inline-flex items-center gap-2 border border-brand-border text-brand-gray-light px-9 py-4 text-base"
            whileHover={{ scale: 1.04, borderColor: 'rgba(0,212,200,0.4)', color: '#F0F6FF' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Log in
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
