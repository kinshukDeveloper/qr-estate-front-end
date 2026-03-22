import api from './api';

export const agencyAPI = {
  // ── Agency CRUD ──────────────────────────────────────────────────────────
  create: (data: { name: string; website?: string; logo_url?: string }) =>
    api.post('/agencies', data),

  getMe: () => api.get('/agencies/me'),

  update: (data: { name?: string; website?: string; logo_url?: string }) =>
    api.patch('/agencies/me', data),

  // ── Members ──────────────────────────────────────────────────────────────
  getMembers: () => api.get('/agencies/members'),

  removeMember: (userId: string) => api.delete(`/agencies/members/${userId}`),

  updateMemberRole: (userId: string, role: string) =>
    api.patch(`/agencies/members/${userId}/role`, { role }),

  // ── Invites ──────────────────────────────────────────────────────────────
  invite: (email: string, role: string) =>
    api.post('/agencies/invite', { email, role }),

  getPendingInvites: () => api.get('/agencies/invites'),

  cancelInvite: (inviteId: string) => api.delete(`/agencies/invites/${inviteId}`),

  resendInvite: (inviteId: string) => api.patch(`/agencies/invites/${inviteId}/resend`),

  // Public — no auth
  validateToken: (token: string) =>
    api.get(`/agencies/invite/validate?token=${token}`),

  acceptInvite: (token: string) =>
    api.post('/agencies/invite/accept', { token }),
};
