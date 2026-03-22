import api from './api';

// ── Feature 4: Callbacks ──────────────────────────────────────────────────────
export const callbackAPI = {
  request:  (listingId: string, phone: string) =>
    api.post(`/callbacks/request/${listingId}`, { phone }),
  getStats: () => api.get('/callbacks/stats'),
  getAll:   (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/callbacks', { params }),
};

// ── Feature 5: Tours ──────────────────────────────────────────────────────────
export const tourAPI = {
  setUrl:      (listingId: string, tour_url: string | null) =>
    api.patch(`/tours/${listingId}`, { tour_url }),
  trackView:   (shortCode: string) =>
    api.post(`/tours/view/${shortCode}`).catch(() => {}), // fire-and-forget
  getAnalytics: () => api.get('/tours/analytics'),
};

// ── Feature 6: Brand/White-label ──────────────────────────────────────────────
export const brandAPI = {
  get:          () => api.get('/brand'),
  update:       (data: BrandConfig) => api.put('/brand', data),
  setupDomain:  (domain: string) => api.post('/brand/domain', { domain }),
  verifyDomain: () => api.post('/brand/domain/verify'),
};

export interface BrandConfig {
  brand_name:        string;
  logo_url?:         string | null;
  favicon_url?:      string | null;
  primary_color?:    string;
  secondary_color?:  string;
  font_choice?:      string;
  support_email?:    string;
  support_phone?:    string;
  website?:          string;
  footer_text?:      string;
  hide_powered_by?:  boolean;
  custom_email_from?: string;
  custom_domain?:    string;
  domain_verified?:  boolean;
  verify_token?:     string;
}

export interface CallbackStats {
  connected:           number;
  missed:              number;
  pending:             number;
  total:               number;
  missed_today:        number;
  avg_response_seconds: number | null;
}

export interface CallbackRequest {
  id:           string;
  listing_id:   string;
  buyer_phone:  string;
  status:       'pending' | 'calling' | 'connected' | 'missed' | 'failed';
  requested_at: string;
  connected_at: string | null;
  title:        string;
  short_code:   string;
  city:         string;
}
