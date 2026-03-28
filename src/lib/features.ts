"use client";

import api from "./api";

// ── Feature 4: Callbacks ──────────────────────────────────────────────────────
export const callbackAPI = {
  request: (listingId: string, phone: string) =>
    api.post(`/callbacks/request/${listingId}`, { phone }),
  getStats: () => api.get("/callbacks/stats"),
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get("/callbacks", { params }),
};

// ── Feature 5: Tours ──────────────────────────────────────────────────────────
export const tourAPI = {
  setUrl: (listingId: string, tour_url: string | null) =>
    api.patch(`/tours/${listingId}`, { tour_url }),
  trackView: (shortCode: string) =>
    api.post(`/tours/view/${shortCode}`).catch(() => {}), // fire-and-forget
  getAnalytics: () => api.get("/tours/analytics"),
};

// ── Feature 6: Brand/White-label ──────────────────────────────────────────────
export const brandAPI = {
  getConfig: () => api.get("/brand"),
  updateConfig: (data: BrandConfig) => api.put("/brand", data),
  setupDomain: (domain: string) => api.post("/brand/domain", { domain }),
  verifyDomain: () => api.post("/brand/domain/verify"),
};
// ── F05: Videos ───────────────────────────────────────────────────────────────
export const videoAPI = {
  upload: (
    listingId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ) => {
    const form = new FormData();
    form.append("video", file);
    return api.post(`/v3/listings/${listingId}/videos`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total)
          onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
  },
  list: (listingId: string) => api.get(`/v3/listings/${listingId}/videos`),
  delete: (videoId: string) => api.delete(`/v3/videos/${videoId}`),
  updateLabel: (videoId: string, label: string) =>
    api.patch(`/v3/videos/${videoId}/label`, { label }),
};

// ── F06: EOI ──────────────────────────────────────────────────────────────────
export const eoiAPI = {
  submit: (data: {
    listingId: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail?: string;
    offerPrice: number;
    message?: string;
    signatureData: string;
  }) => api.post("/v3/eoi", data),

  list: (listingId: string) => api.get(`/v3/listings/${listingId}/eoi`),
  updateStatus: (eoiId: string, status: "accepted" | "rejected" | "expired") =>
    api.patch(`/v3/eoi/${eoiId}/status`, { status }),
};

// ── F07: Commission ───────────────────────────────────────────────────────────
export const commissionAPI = {
  calculate: (params: {
    price: number;
    state?: string;
    buyerGender?: string;
    customCommissionRate?: number;
    isRent?: boolean;
  }) => api.get("/v3/commission/calculate", { params }),

  getStates: () => api.get("/v3/commission/states"),
};

// ── F08: Follow-ups ───────────────────────────────────────────────────────────
export const followUpAPI = {
  getSequence: (leadId: string) => api.get(`/v3/leads/${leadId}/followups`),
  toggle: (leadId: string, pause: boolean) =>
    api.patch(`/v3/leads/${leadId}/followups/toggle`, { pause }),
};

export interface BrandConfig {
  brand_name: string;
  tagline?: string; // ✅ add
  whatsapp_message?: string; // ✅ add
  logo_url?: string | null;
  favicon_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  font_choice?: string;
  support_email?: string;
  support_phone?: string;
  website?: string;
  footer_text?: string;
  hide_powered_by?: boolean;
  custom_email_from?: string;
  custom_domain?: string;
  domain_verified?: boolean;
  verify_token?: string;
}

export interface CallbackStats {
  connected: number;
  missed: number;
  pending: number;
  total: number;
  missed_today: number;
  avg_response_seconds: number | null;
}

export interface CallbackRequest {
  id: string;
  listing_id: string;
  buyer_phone: string;
  status: "pending" | "calling" | "connected" | "missed" | "failed";
  requested_at: string;
  connected_at: string | null;
  title: string;
  short_code: string;
  city: string;
}
// ── Types ─────────────────────────────────────────────────────────────────────
export interface ListingVideo {
  id: string;
  listing_id: string;
  url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  size_bytes?: number;
  label: string;
  sort_order: number;
}

export interface EOI {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string;
  offer_price: number;
  message?: string;
  pdf_url?: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  created_at: string;
}

export interface CommissionResult {
  price: number;
  listing_type: "sale" | "rent";
  commission: { rate: number; amount: number; gst: number; total: number };
  stamp_duty?: { rate: number; amount: number };
  registration?: { rate: number; amount: number };
  tds?: { applicable: boolean; rate: number; amount: number };
  totals?: { buyer_total_cost: number; agent_receives: number };
  breakdown: { label: string; amount: number; highlight?: boolean }[];
}

export interface FollowUpStep {
  id: string;
  step: number;
  channel: "whatsapp" | "email" | "sms";
  template_key: string;
  scheduled_at: string;
  sent_at?: string;
  status: "scheduled" | "sent" | "failed" | "skipped" | "paused";
  error_msg?: string;
}
