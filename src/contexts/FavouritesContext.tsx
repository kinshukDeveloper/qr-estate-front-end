'use client';

import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react';
import { savedAPI } from '@/lib/buyer';

interface FavouritesContextValue {
  savedIds: Set<string>;
  saveCounts: Record<string, number>;
  isSaved: (id: string) => boolean;
  toggle: (id: string, email?: string) => Promise<void>;
  getSaveCount: (id: string) => number;
  isLoading: (id: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [saveCounts, setSaveCounts] = useState<Record<string, number>>({});
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  // Hydrate from localStorage on mount (optimistic pre-load before API)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qre_saved_ids');
      if (stored) setSavedIds(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  const persistLocally = (ids: Set<string>) => {
    try {
      localStorage.setItem('qre_saved_ids', JSON.stringify([...ids]));
    } catch { /* ignore */ }
  };

  const toggle = useCallback(async (listingId: string, email?: string) => {
    // Optimistic update
    const wasSaved = savedIds.has(listingId);
    const newIds = new Set(savedIds);
    if (wasSaved) newIds.delete(listingId);
    else newIds.add(listingId);
    setSavedIds(newIds);
    persistLocally(newIds);

    // Mark as loading
    setPendingIds((prev) => new Set([...prev, listingId]));

    try {
      const res = await savedAPI.toggle(listingId, email);
      const { saved, saveCount } = res.data.data;

      // Reconcile with server truth
      setSavedIds((prev) => {
        const updated = new Set(prev);
        if (saved) updated.add(listingId);
        else updated.delete(listingId);
        persistLocally(updated);
        return updated;
      });

      setSaveCounts((prev) => ({ ...prev, [listingId]: saveCount }));
    } catch (err) {
      // Roll back on error
      setSavedIds((prev) => {
        const rolled = new Set(prev);
        if (wasSaved) rolled.add(listingId);
        else rolled.delete(listingId);
        persistLocally(rolled);
        return rolled;
      });
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(listingId);
        return next;
      });
    }
  }, [savedIds]);

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);
  const getSaveCount = useCallback((id: string) => saveCounts[id] ?? 0, [saveCounts]);
  const isLoading = useCallback((id: string) => pendingIds.has(id), [pendingIds]);

  return (
    <FavouritesContext.Provider value={{ savedIds, saveCounts, isSaved, toggle, getSaveCount, isLoading }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
