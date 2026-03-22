'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { LOCALES, useLocale, type LocaleCode } from '@/i18n';

export function LanguagePicker() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LOCALES.find(l => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/15 text-white text-xs px-3 py-1.5 hover:border-white/30 transition-colors"
        aria-label="Change language"
      >
        <Globe size={12} className="opacity-70" />
        <span className="font-medium">{current.nativeLabel}</span>
        <span className="opacity-50 text-[10px]">▾</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-1.5 bg-[#0D1821] border border-[#1A2D40] shadow-2xl shadow-black/50 z-50 min-w-[160px] overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {LOCALES.map((l, i) => (
              <motion.button
                key={l.code}
                onClick={() => { setLocale(l.code as LocaleCode); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                  locale === l.code
                    ? 'bg-[rgba(0,212,200,0.08)] text-[#00D4C8]'
                    : 'text-[#7A95AE] hover:bg-[#111C28] hover:text-white'
                }`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="text-base flex-shrink-0">{l.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium leading-none">{l.nativeLabel}</div>
                  <div className="text-[10px] opacity-50 mt-0.5 font-mono">{l.label}</div>
                </div>
                {locale === l.code && <Check size={12} className="flex-shrink-0" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
