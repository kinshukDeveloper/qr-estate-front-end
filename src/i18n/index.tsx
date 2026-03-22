'use client';

import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react';

// ── Locale definitions ────────────────────────────────────────────────────────
import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';
import mr from './mr.json';
import ta from './ta.json';

export type LocaleCode = 'en' | 'hi' | 'pa' | 'mr' | 'ta';

const MESSAGES: Record<LocaleCode, typeof en> = { en, hi, pa, mr, ta } as any;

export const LOCALES: { code: LocaleCode; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English',  nativeLabel: 'English',  flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिन्दी',   flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi',  nativeLabel: 'ਪੰਜਾਬੀ',  flag: '🌾' },
  { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी',    flag: '🌺' },
  { code: 'ta', label: 'Tamil',    nativeLabel: 'தமிழ்',    flag: '🏛' },
];

// ── Context ───────────────────────────────────────────────────────────────────
interface LocaleContextValue {
  locale:    LocaleCode;
  t:         typeof en;           // full translations object
  setLocale: (l: LocaleCode) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale:    'en',
  t:          en,
  setLocale: () => {},
});

// ── Storage key ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'qr_estate_locale';

// ── Provider ──────────────────────────────────────────────────────────────────
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
      if (saved && MESSAGES[saved]) setLocaleState(saved);
    } catch {}
  }, []);

  const setLocale = useCallback((l: LocaleCode) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: MESSAGES[locale] as typeof en, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useLocale() {
  return useContext(LocaleContext);
}

// ── Price formatter — returns { main, unit } in the active locale ─────────────
export function formatPriceLocalized(
  price: number,
  listingType: string,
  t: typeof en,
  locale: LocaleCode
): { main: string; unit: string } {
  const isRent  = listingType === 'rent';
  const suffix  = isRent ? t.price.perMonth : '';

  // Indian number system: lakh = 1,00,000 / crore = 1,00,00,000
  if (price >= 10_000_000) {
    const val = (price / 10_000_000).toFixed(2);
    return { main: `₹${val}`, unit: `${t.price.crore}${suffix}` };
  }
  if (price >= 100_000) {
    const val = (price / 100_000).toFixed(2);
    return { main: `₹${val}`, unit: `${t.price.lakh}${suffix}` };
  }
  // Format with Indian locale commas
  return { main: `₹${price.toLocaleString('en-IN')}`, unit: suffix };
}
