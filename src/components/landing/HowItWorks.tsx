'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, QrCode, Scan } from 'lucide-react';

const STEPS = [
  {
    num: '01', icon: Building2, title: 'Create your listing',
    desc: 'Add property details, photos, price, amenities. Takes 2 minutes. Draft saves automatically.',
    color: '#00D4C8', dimBg: 'rgba(0,212,200,0.06)', border: 'rgba(0,212,200,0.2)',
  },
  {
    num: '02', icon: QrCode, title: 'Get your QR code',
    desc: 'One click — QR generated and uploaded to Cloudinary. Download PNG or SVG. Print anywhere.',
    color: '#FFB830', dimBg: 'rgba(255,184,48,0.06)', border: 'rgba(255,184,48,0.2)',
  },
  {
    num: '03', icon: Scan, title: 'Buyers scan, you close',
    desc: 'Any phone camera works. Buyer sees photos, price, contact. They call or WhatsApp in 1 tap.',
    color: '#2ECC8A', dimBg: 'rgba(46,204,138,0.06)', border: 'rgba(46,204,138,0.2)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 18 } },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.5, ease: 'easeOut' } },
};

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-brand-border" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="font-mono text-[10px] font-bold tracking-[3px] text-brand-teal uppercase mb-3 inline-flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <motion.span
              className="w-4 h-px bg-brand-teal inline-block"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ transformOrigin: 'left' }}
            />
            How it works
          </motion.div>
          <h2 className="font-black text-4xl text-white tracking-tight">
            Live in 3 steps.{' '}
            <span className="text-brand-gray-light font-light">No tech setup needed.</span>
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <motion.div
            className="hidden md:block absolute top-[76px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-brand-border origin-left"
            variants={lineVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          />

          <motion.div
            className="grid md:grid-cols-3 gap-px bg-brand-border"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  variants={cardVariants}
                  className="bg-brand-bg px-8 py-10 relative overflow-hidden group cursor-default"
                  style={{ borderLeft: `2px solid ${s.border}` }}
                  whileHover={{ backgroundColor: s.dimBg }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Background number */}
                  <motion.div
                    className="absolute top-4 right-4 font-mono font-black text-7xl select-none pointer-events-none"
                    style={{ color: s.color, opacity: 0.07 }}
                    whileHover={{ opacity: 0.14, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {s.num}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 flex items-center justify-center mb-6"
                    style={{ background: s.dimBg, border: `1px solid ${s.border}` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon size={24} style={{ color: s.color }} />
                  </motion.div>

                  <h3 className="font-black text-xl text-white mb-3">{s.title}</h3>
                  <p className="text-brand-gray-light leading-relaxed text-sm">{s.desc}</p>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(to right, ${s.color}, transparent)` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
