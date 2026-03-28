'use client';

import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

const MAX_COMPARE = 3;

interface CompareItem {
  id: string;
  title: string;
  price: number;
  city: string;
  property_type: string;
  images: { url: string; is_primary: boolean }[];
}

interface CompareContextValue {
  items: CompareItem[];
  isInCompare: (id: string) => boolean;
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  canAdd: boolean;
  goToComparePage: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const router = useRouter();

  // Persist to sessionStorage (compare context dies when tab closes — intentional)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('qre_compare');
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const persist = (newItems: CompareItem[]) => {
    try {
      sessionStorage.setItem('qre_compare', JSON.stringify(newItems));
    } catch { /* ignore */ }
  };

  const isInCompare = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const addToCompare = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      if (prev.length >= MAX_COMPARE) {
        // Replace oldest
        const next = [...prev.slice(1), item];
        persist(next);
        return next;
      }
      const next = [...prev, item];
      persist(next);
      return next;
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setItems([]);
    persist([]);
  }, []);

  const goToComparePage = useCallback(() => {
    if (items.length < 2) return;
    const ids = items.map((i) => i.id).join(',');
    router.push(`/compare?ids=${ids}`);
  }, [items, router]);

  return (
    <CompareContext.Provider value={{
      items,
      isInCompare,
      addToCompare,
      removeFromCompare,
      clearCompare,
      canAdd: items.length < MAX_COMPARE,
      goToComparePage,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
