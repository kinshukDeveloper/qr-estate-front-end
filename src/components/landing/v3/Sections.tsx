'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { Star, Quote, ArrowRight, QrCode, Mail, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

/* ══════════════════════════════════════════════
   CITY STRIP (GSAP infinite ticker)
══════════════════════════════════════════════ */
const CITIES = [
  'Mumbai','Delhi','Bangalore','Hyderabad','Chennai',
  'Chandigarh','Pune','Kolkata','Ahmedabad','Jaipur',
  'Noida','Gurugram','Kochi','Indore','Bhopal',
];

export function CityStripV3() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tlRef    = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const total = trackRef.current.scrollWidth / 2;
    tlRef.current = gsap.to(trackRef.current, {
      x: -total,
      duration: 40,
      ease: 'none',
      repeat: -1,
    });

    const slow  = () => tlRef.current?.timeScale(0.3);
    const reset = () => tlRef.current?.timeScale(1);
    trackRef.current.addEventListener('mouseenter', slow);
    trackRef.current.addEventListener('mouseleave', reset);
    return () => { tlRef.current?.kill(); };
  }, []);

  const doubled = [...CITIES, ...CITIES];

  return (
    <div className="relative py-5 border-y border-[var(--border)] overflow-hidden">
      <div className="absolute inset-0 bg-[var(--bg2)]" />
      <div className="relative flex" ref={trackRef} style={{ width: 'max-content' }}>
        {doubled.map((city, i) => (
          <div key={i} className="flex items-center gap-4 mx-5 flex-shrink-0">
            <span className="font-code text-[11px] tracking-[2px] uppercase text-[var(--dim)]">{city}</span>
            <span className="w-1 h-1 rounded-full bg-gold/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Senior Agent · Chandigarh',
    avatar: 'R',
    color: '#E8B84B',
    stars: 5,
    text: 'I got 47 scan enquiries in the first 2 weeks. Put the QR on my site board and buyers started calling me the same day. Best ₹999 I\'ve spent.',
    metric: '47 scans in 14 days',
  },
  {
    name: 'Priya Sharma',
    role: 'Broker · Mumbai',
    avatar: 'P',
    color: '#18D4C8',
    stars: 5,
    text: 'The AI description writer alone saved me 3 hours a week. I manage 20 listings and QR Estate keeps everything organised.',
    metric: '3 hrs saved weekly',
  },
  {
    name: 'Vikram Patel',
    role: 'Agency Owner · Bengaluru',
    avatar: 'V',
    color: '#A870F8',
    stars: 5,
    text: 'We switched our whole team of 8 agents to QR Estate. The team workspace makes managing everyone\'s listings and leads so clean.',
    metric: '8 agents managed',
  },
  {
    name: 'Deepa Krishnan',
    role: 'Property Consultant · Chennai',
    avatar: 'D',
    color: '#28D890',
    stars: 5,
    text: 'My buyers in Tamil Nadu love that the property page is in Tamil. Conversion rate from scan to enquiry jumped from 8% to 23%.',
    metric: '23% scan-to-enquiry',
  },
];

export function TestimonialsV3() {
  return (
    <section className="relative py-28 px-5 sm:px-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
            <span className="font-code text-[11px] tracking-[3px] uppercase text-gold">Real results</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2
            className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--white)]"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            Agents who switched{' '}
            <span className="text-gradient-gold">never look back</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, borderColor: `${t.color}40` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} size={11} fill="#E8B84B" color="#E8B84B" />
                ))}
              </div>

              {/* Quote */}
              <Quote size={16} style={{ color: `${t.color}50` }} />
              <p className="text-[13px] text-[var(--muted)] leading-relaxed flex-1">"{t.text}"</p>

              {/* Metric chip */}
              <div
                className="font-code text-[10px] px-2.5 py-1 rounded-full border self-start"
                style={{ color: t.color, borderColor: `${t.color}30`, background: `${t.color}0E` }}
              >
                {t.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[13px]"
                  style={{ background: `${t.color}20`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[var(--white)]">{t.name}</div>
                  <div className="font-code text-[10px] text-[var(--dim)]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════ */
export function FinalCTAV3() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-32 px-5 sm:px-8 overflow-hidden" ref={containerRef}>
      {/* Big ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-gold/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
            <span className="font-code text-[11px] tracking-[3px] uppercase text-gold">Start today</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
          </div>

          <h2
            className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-tight text-[var(--white)] mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            Your first QR code is{' '}
            <span className="text-gradient-gold">2 minutes away.</span>
          </h2>

          <p className="text-[var(--muted)] text-[16px] leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands of Indian real estate agents using QR Estate to get more enquiries from every hoarding, standee, and site board.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <motion.button
                className="relative flex items-center gap-2.5 px-8 py-4 rounded-full text-[15px] font-bold text-bg overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <QrCode size={18} className="text-bg" />
                <span className="relative z-10">Create your free account</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 bg-shimmer bg-[length:300%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </Link>

            <p className="font-code text-[12px] text-[var(--dim)]">
              Free forever · No credit card · RERA-compliant
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Analytics', 'AI Tools', 'Virtual Tours', 'Changelog'],
  Company: ['About', 'Contact', 'Blog', 'Careers', 'Press kit'],
  Legal:   ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'GDPR'],
  Support: ['Help Center', 'API Docs', 'Status', 'WhatsApp Support'],
};

const HREF_MAP: Record<string, string> = {
  'About':'/about','Contact':'/contact','Privacy Policy':'/privacy','Terms & Conditions':'/terms',
  'Features':'#features','Pricing':'#pricing','Analytics':'/dashboard/analytics','API Docs':'#',
};

export function FooterV3() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg2)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-14">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <QrCode size={16} className="text-bg" strokeWidth={2.5} />
              </div>
              <span
                className="font-display font-extrabold text-[15px]"
                style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: 'var(--white)' }}
              >
                QR<span className="text-gradient-gold">Estate</span>
              </span>
            </div>
            <p className="text-[13px] text-[var(--dim)] leading-relaxed mb-5 max-w-[220px]">
              India's QR-native real estate platform. Built for agents. Loved by buyers.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[Instagram, Youtube, Linkedin, Twitter].map((Icon, i) => (
                <motion.a
                  key={i} href="#"
                  className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--dim)] hover:text-[var(--white)] hover:border-[var(--gold3)] transition-all"
                  whileHover={{ y: -2 }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-code text-[9px] tracking-[2px] uppercase text-[var(--dim)] mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <Link
                      href={HREF_MAP[link] || '#'}
                      className="text-[13px] text-[var(--muted)] hover:text-[var(--white)] transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-[var(--border)]">
          <p className="font-code text-[11px] text-[var(--dim)]">
            © 2025 QR Estate. Made with ♥ in India. RERA compliant.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="font-code text-[11px] text-[var(--dim)] hover:text-[var(--muted)] transition-colors">Privacy</Link>
            <Link href="/terms"   className="font-code text-[11px] text-[var(--dim)] hover:text-[var(--muted)] transition-colors">Terms</Link>
            <span className="font-code text-[11px] text-[var(--dim)]">
              🇮🇳 Chandigarh, India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
