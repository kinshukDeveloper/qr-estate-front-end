'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing' },
];

// ── Magnetic CTA button ────────────────────────────────────────────────────────
function MagneticButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref as any}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`text-sm font-bold px-4 py-2 transition-colors inline-block ${
        primary
          ? 'bg-brand-teal text-brand-bg hover:bg-[#00B8AD]'
          : 'text-brand-gray-light hover:text-white'
      }`}
    >
      {children}
    </motion.a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: scrolled ? 'rgba(8,15,23,0.92)' : 'rgba(8,15,23,0)',
          borderBottomColor: scrolled ? 'rgba(26,45,64,1)' : 'rgba(26,45,64,0)',
        }}
        transition={{ duration: 0.3 }}
        style={{ backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: '1px solid' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <motion.div
            className="w-8 h-8 border-2 border-brand-teal grid grid-cols-2 gap-0.5 p-1.5"
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-brand-teal" />
            <div className="border border-brand-teal" />
            <div className="border border-brand-teal" />
            <div className="bg-brand-teal" />
          </motion.div>
          <motion.span
            className="font-black text-white text-sm tracking-wide"
            whileHover={{ letterSpacing: '0.1em' }}
            transition={{ duration: 0.2 }}
          >
            QR Estate
          </motion.span>
          <motion.span
            className="font-mono text-[10px] text-brand-gold bg-brand-gold/10 border border-brand-gold/25 px-2 py-0.5 tracking-widest hidden sm:block"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            v2
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-brand-gray-light text-sm relative group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ color: '#F0F6FF' }}
            >
              {link.label}
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px bg-brand-teal"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 ml-auto">
          <MagneticButton href="/auth/login">Log in</MagneticButton>
          <MagneticButton href="/auth/register" primary>Start free →</MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
}
