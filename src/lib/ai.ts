'use client';

import api from './api';

export const aiAPI = {
  getScore:         (listingId: string) => api.get(`/ai/score/${listingId}`),
  getTips:          (listingId: string) => api.post(`/ai/tips/${listingId}`),
  writeDescription: (listingId: string) => api.post(`/ai/write-description/${listingId}`),
  checkPhotos:      (listingId: string) => api.post(`/ai/photo-check/${listingId}`),
  clearCache:       (listingId: string) => api.delete(`/ai/cache/${listingId}`),
};

export interface QualityBreakdown {
  photos:      number;
  description: number;
  floor:       number;
  furnishing:  number;
  amenities:   number;
  area:        number;
  active_qr:   number;
}

export interface QualityScore {
  score:     number;
  breakdown: QualityBreakdown;
  max:       number;
}

export interface AITip {
  icon: string;
  tip:  string;
}

export interface DescriptionVariant {
  label: string;
  words: number;
  text:  string;
}

export interface PhotoResult {
  url:        string;
  score:      number;
  issues:     string[];
  suggestion: string;
}
