'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { useMagnetic } from '@/lib/animations';

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'About',        href: '/about' },
];

export default function NavbarV3() {
  const [open,        setOpen]       = useState(false);
  const [scrolled,    setScrolled]   = useState(false);
  const { scrollY }                  = useScroll();
  const bgOpacity    = useTransform(scrollY, [0, 80], [0, 1]);
  const blurStrength = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(20px)']);
  const { ref: ctaRef, springX, springY } = useMagnetic(0.3);

  useEffect(() => {
    return scrollY.onChange(v => setScrolled(v > 20));
  }, [scrollY]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backdropFilter: blurStrength } as any}
      >
        {/* Background layer */}
        <motion.div
          className="absolute inset-0 bg-[var(--bg2)] border-b border-[var(--border)]"
          style={{ opacity: bgOpacity }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center"
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <QrCode size={16} className="text-bg font-bold" strokeWidth={2.5} />
            </motion.div>
            <span
              className="font-display font-800 text-[15px] tracking-tight text-[var(--white)]"
              style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
            >
              QR<span className="text-gradient-gold">Estate</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="relative px-4 py-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--white)] transition-colors duration-200 group"
              >
                {label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-[13px] font-medium text-[var(--muted)] hover:text-[var(--white)] transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>

            <motion.div
              ref={ctaRef as any}
              style={{ x: springX, y: springY }}
            >
              <Link href="/auth/register">
                <motion.button
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #E8B84B, #B89030)' }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 text-bg font-bold">Start free</span>
                  <ArrowRight size={14} className="relative z-10 text-bg group-hover:translate-x-0.5 transition-transform" />
                  {/* Shimmer */}
                  <span className="absolute inset-0 bg-shimmer bg-[length:200%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)]"
            onClick={() => setOpen(o => !o)}
            whileTap={{ scale: 0.93 }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-bg/80 backdrop-blur-lg" onClick={() => setOpen(false)} />

            {/* Panel */}
            <motion.div
              className="absolute top-16 left-4 right-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-card"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-[var(--muted)] hover:text-[var(--white)] hover:bg-[var(--card)] transition-colors font-medium"
                    >
                      {label}
                      <ArrowRight size={14} className="opacity-40" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted)] text-[13px] font-medium hover:border-[var(--border2)] hover:text-[var(--white)] transition-all">
                    Sign in
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  <button
                    className="w-full py-2.5 rounded-xl text-[13px] font-bold text-bg"
                    style={{ background: 'linear-gradient(135deg, #E8B84B, #B89030)' }}
                  >
                    Start free →
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
