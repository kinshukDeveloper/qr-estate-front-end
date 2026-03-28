/**
 * lib/buyer.ts
 * API client for buyer features: F01 Saved, F02 Compare, F03 Alerts, F04 Voice Search
 */
import api from './api';

// ── Session token helper ──────────────────────────────────────────────────────
export function getSessionToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('qre_session');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('qre_session', token);
  }
  return token;
}

function sessionHeaders() {
  return { 'x-session-token': getSessionToken() };
}

// ── F01: Saved Listings ───────────────────────────────────────────────────────
export const savedAPI = {
  toggle: (listingId: string, email?: string) =>
    api.post(`/buyer/saved/${listingId}`, { email }, { headers: sessionHeaders() }),

  list: (page = 1, limit = 20) =>
    api.get('/buyer/saved', { headers: sessionHeaders(), params: { page, limit } }),

  status: (listingId: string) =>
    api.get(`/buyer/saved/${listingId}/status`, { headers: sessionHeaders() }),
};

// ── F02: Compare ──────────────────────────────────────────────────────────────
export const compareAPI = {
  getListings: (ids: string[]) =>
    api.get('/buyer/compare', { params: { ids: ids.join(',') } }),
};

// ── F03: Price Alerts ─────────────────────────────────────────────────────────
export const alertsAPI = {
  subscribe: (listingId: string, email: string) =>
    api.post('/buyer/alerts', { listingId, email }),
};

// ── F04: Voice Search ─────────────────────────────────────────────────────────
export const voiceSearchAPI = {
  search: (transcript: string, page = 1, limit = 20) =>
    api.post('/buyer/search/voice', { transcript }, {
      headers: sessionHeaders(),
      params: { page, limit },
    }),
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SavedListing {
  id: string;
  title: string;
  price: number;
  property_type: string;
  listing_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  address: string;
  locality?: string;
  city: string;
  state: string;
  images: { url: string; is_primary: boolean }[];
  status: string;
  short_code: string;
  view_count: number;
  saved_at: string;
  agent_name: string;
  save_count: number;
}

export interface VoiceSearchFilters {
  city?: string | null;
  locality?: string | null;
  property_type?: string | null;
  listing_type?: 'sale' | 'rent' | null;
  bedrooms?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  min_area_sqft?: number | null;
  max_area_sqft?: number | null;
  furnishing?: string | null;
}
