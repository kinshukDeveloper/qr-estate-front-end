'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QrCode, BarChart2, MessageCircle, Users, Shield, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: QrCode,        title: 'QR for every listing',    desc: 'Auto-generated on create. Branded with your name and RERA. Download PNG/SVG instantly. Print on anything.', color: '#00D4C8', tag: 'Core' },
  { icon: BarChart2,     title: 'Scan analytics',          desc: 'See when, where, and how often your QR was scanned. Daily trends, device breakdown, city heatmap.', color: '#60A5FA', tag: 'Analytics' },
  { icon: MessageCircle, title: 'Lead capture',            desc: 'Buyers submit enquiries from the property page. Every lead lands in your CRM with name and phone.',  color: '#2ECC8A', tag: 'CRM' },
  { icon: Users,         title: 'Team workspace',          desc: 'Invite agents to your brokerage. Set roles (admin, agent, viewer). Track each agent\'s performance.', color: '#A78BFA', tag: 'v2 New ✦' },
  { icon: Shield,        title: 'QR health monitor',       desc: 'Daily checks confirm every QR resolves correctly. Get alerted the moment any code goes broken.',    color: '#FFB830', tag: 'Reliability' },
  { icon: Globe,         title: 'Public property pages',   desc: 'Mobile-optimised pages with photos, specs, location, and 1-tap WhatsApp. No app needed for buyers.', color: '#FF4D6A', tag: 'Buyer UX' },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.querySelectorAll('.feat-card'));

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 70, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: { each: 0.08, from: 'start' },
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" className="py-24 px-6 border-t border-brand-border" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-[10px] font-bold tracking-[3px] text-brand-teal uppercase mb-3">Features</div>
          <h2 className="font-black text-4xl text-white tracking-tight">
            Everything an agent needs.{' '}
            <span className="text-brand-gray-light font-light">Nothing they don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-border">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className="feat-card bg-brand-bg p-8 opacity-0 relative group overflow-hidden"
                whileHover={{
                  backgroundColor: 'rgba(0,212,200,0.03)',
                  transition: { duration: 0.2 },
                }}
              >
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${f.color}10, transparent 60%)` }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: -6 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon size={26} style={{ color: f.color }} />
                    </motion.div>
                    <motion.span
                      className="font-mono text-[9px] font-bold tracking-widest text-brand-gray border border-brand-border px-2 py-0.5 uppercase"
                      whileHover={{ borderColor: f.color, color: f.color }}
                      transition={{ duration: 0.2 }}
                    >
                      {f.tag}
                    </motion.span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-2">{f.title}</h3>
                  <p className="text-brand-gray-light text-sm leading-relaxed">{f.desc}</p>
                </div>

                {/* Bottom accent — revealed on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                  style={{ background: `linear-gradient(to right, ${f.color}, transparent)`, scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.35 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
