'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Mounts once in RootLayout.
 * 1. Triggers Zustand rehydration from localStorage (client-only).
 * 2. After hydration, if no token exists it clears the stale
 *    qr_estate_auth cookie — this is what caused the login/register
 *    pages to keep redirecting to /dashboard.
 */
export function AuthHydration() {
  useEffect(() => {
    // Manually trigger rehydration now that we are in the browser.
    useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const unsub = useAuthStore.subscribe((state) => {
      if (!state._hasHydrated) return;
      if (!state.accessToken) {
        // No valid token — nuke the middleware cookie so /auth/login
        // is no longer intercepted and redirected to /dashboard.
        document.cookie = 'qr_estate_auth=; path=/; max-age=0; SameSite=Lax';
      }
    });
    return unsub;
  }, []);

  return null;
}
