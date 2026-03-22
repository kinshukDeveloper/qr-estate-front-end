'use client';

import { useState, useEffect, useCallback } from 'react';
import { agencyAPI } from '@/lib/agency';
import {
  Users, UserPlus, Mail, Trash2, RefreshCw, Crown,
  Shield, Eye, UserCheck, AlertTriangle, Copy, Check,
  Building2, ChevronDown,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  agency_role: 'owner' | 'agency_admin' | 'agent' | 'viewer';
  joined_at: string;
  invited_by_name?: string;
  listing_count: number;
  lead_count: number;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
  invited_by_name?: string;
}

interface Agency {
  id: string;
  name: string;
  plan: string;
  max_agents: number;
  owner_name: string;
  member_count: string;
}

// ── Role helpers ──────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  owner:        { label: 'Owner',       icon: Crown,     color: 'text-[#FFB830]' },
  agency_admin: { label: 'Admin',       icon: Shield,    color: 'text-[#A78BFA]' },
  agent:        { label: 'Agent',       icon: UserCheck, color: 'text-[#00D4C8]' },
  viewer:       { label: 'Viewer',      icon: Eye,       color: 'text-[#4A6580]' },
};

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? { label: role, icon: UserCheck, color: 'text-white' };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
      <Icon size={10} /> {meta.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [agency, setAgency]     = useState<Agency | null>(null);
  const [members, setMembers]   = useState<Member[]>([]);
  const [invites, setInvites]   = useState<Invite[]>([]);
  const [loading, setLoading]   = useState(true);
  const [noAgency, setNoAgency] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail]   = useState('');
  const [inviteRole, setInviteRole]     = useState('agent');
  const [inviting, setInviting]         = useState(false);
  const [inviteResult, setInviteResult] = useState<{ url: string } | null>(null);
  const [inviteErr, setInviteErr]       = useState('');

  // Create agency form
  const [agencyName, setAgencyName]     = useState('');
  const [creating, setCreating]         = useState(false);
  const [createErr, setCreateErr]       = useState('');

  // Copied link
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [agRes, memRes, invRes] = await Promise.all([
        agencyAPI.getMe(),
        agencyAPI.getMembers(),
        agencyAPI.getPendingInvites(),
      ]);
      setAgency(agRes.data.data.agency);
      setMembers(memRes.data.data.members);
      setInvites(invRes.data.data.invites);
      setNoAgency(false);
    } catch (err: any) {
      if (err?.response?.status === 404) setNoAgency(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreateAgency() {
    if (!agencyName.trim()) return;
    setCreating(true); setCreateErr('');
    try {
      await agencyAPI.create({ name: agencyName });
      await load();
    } catch (e: any) {
      setCreateErr(e?.response?.data?.message ?? 'Failed to create agency');
    } finally {
      setCreating(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true); setInviteErr(''); setInviteResult(null);
    try {
      const res = await agencyAPI.invite(inviteEmail, inviteRole);
      setInviteResult({ url: res.data.data.inviteUrl });
      setInviteEmail('');
      await load();
    } catch (e: any) {
      setInviteErr(e?.response?.data?.message ?? 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(userId: string, name: string) {
    if (!confirm(`Remove ${name} from the team?`)) return;
    try {
      await agencyAPI.removeMember(userId);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to remove member');
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    try {
      await agencyAPI.updateMemberRole(userId, role);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to update role');
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      await agencyAPI.cancelInvite(inviteId);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to cancel');
    }
  }

  async function handleResend(inviteId: string) {
    try {
      const res = await agencyAPI.resendInvite(inviteId);
      copyToClipboard(res.data.data.inviteUrl, inviteId);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Failed to resend');
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const seatsFull = agency && Number(agency.member_count) >= agency.max_agents;
  const myRole = members.find(m => m.agency_role === 'owner')?.id;
  const canManage = true; // actual check uses req.user.agency_role on backend

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#00D4C8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── No Agency — Create one ────────────────────────────────────────────────
  if (noAgency) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <div className="bg-[#0D1821] border border-[#1A2D40] p-8">
          <Building2 size={32} className="text-[#00D4C8] mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Create your Agency</h1>
          <p className="text-[#4A6580] text-sm mb-6">
            Set up a workspace to invite your team, manage listings together, and access agency analytics.
          </p>
          {createErr && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 text-xs px-3 py-2 mb-4">
              {createErr}
            </div>
          )}
          <input
            className="w-full bg-[#080F17] border border-[#1A2D40] text-white text-sm px-3 py-2.5 mb-3 outline-none focus:border-[#00D4C8] transition-colors"
            placeholder="Agency / Brokerage name"
            value={agencyName}
            onChange={e => setAgencyName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateAgency()}
          />
          <button
            onClick={handleCreateAgency}
            disabled={creating || !agencyName.trim()}
            className="w-full bg-[#00D4C8] text-[#080F17] font-bold text-sm py-2.5 hover:bg-[#00B8AD] transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create Agency →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{agency?.name}</h1>
          <p className="text-[#4A6580] text-xs mt-1 font-mono tracking-wide uppercase">
            {agency?.plan} plan · {agency?.member_count}/{agency?.max_agents} seats used
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-[10px] font-bold tracking-widest px-2.5 py-1.5 uppercase border ${
            seatsFull
              ? 'text-[#FF4D6A] border-[#FF4D6A]/30 bg-[#FF4D6A]/08'
              : 'text-[#00D4C8] border-[#00D4C8]/30 bg-[#00D4C8]/08'
          }`}>
            {seatsFull ? '⚠ Seats Full' : `${Number(agency?.max_agents) - Number(agency?.member_count)} seat(s) left`}
          </div>
        </div>
      </div>

      {/* Seat progress bar */}
      <div className="h-1.5 bg-[#1A2D40] overflow-hidden">
        <div
          className={`h-full transition-all ${seatsFull ? 'bg-[#FF4D6A]' : 'bg-[#00D4C8]'}`}
          style={{ width: `${(Number(agency?.member_count) / (agency?.max_agents ?? 1)) * 100}%` }}
        />
      </div>

      {/* Invite form */}
      <div className="bg-[#0D1821] border border-[#1A2D40] p-5">
        <h2 className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase mb-4 flex items-center gap-2">
          <UserPlus size={12} /> Invite Team Member
        </h2>

        {seatsFull && (
          <div className="flex items-center gap-2 bg-[#FF4D6A]/08 border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs px-3 py-2 mb-3">
            <AlertTriangle size={12} /> Seat limit reached. Upgrade to Agency plan to add more agents.
          </div>
        )}

        <form onSubmit={handleInvite} className="flex gap-2 flex-wrap">
          <input
            type="email"
            required
            disabled={seatsFull ?? false}
            className="flex-1 min-w-[200px] bg-[#080F17] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] disabled:opacity-40 transition-colors"
            placeholder="teammate@email.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
          />
          <select
            disabled={seatsFull ?? false}
            className="bg-[#080F17] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] disabled:opacity-40"
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value)}
          >
            <option value="agent">Agent</option>
            <option value="agency_admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            type="submit"
            disabled={inviting || (seatsFull ?? false)}
            className="bg-[#00D4C8] text-[#080F17] font-bold text-sm px-5 py-2 hover:bg-[#00B8AD] disabled:opacity-50 transition-colors"
          >
            {inviting ? 'Sending…' : 'Send Invite'}
          </button>
        </form>

        {inviteErr && (
          <p className="text-[#FF4D6A] text-xs mt-2">{inviteErr}</p>
        )}

        {inviteResult && (
          <div className="mt-3 bg-[#00D4C8]/08 border border-[#00D4C8]/30 p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold text-[#00D4C8] uppercase tracking-widest mb-1">Invite link generated</div>
              <div className="text-xs text-[#7A95AE] font-mono truncate max-w-sm">{inviteResult.url}</div>
            </div>
            <button
              onClick={() => copyToClipboard(inviteResult.url, 'result')}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#00D4C8] hover:text-white transition-colors"
            >
              {copiedId === 'result' ? <Check size={12} /> : <Copy size={12} />}
              {copiedId === 'result' ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>

      {/* Members table */}
      <div className="bg-[#0D1821] border border-[#1A2D40]">
        <div className="px-5 py-4 border-b border-[#1A2D40] flex items-center gap-2">
          <Users size={14} className="text-[#00D4C8]" />
          <h2 className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase">
            Team Members ({members.length})
          </h2>
        </div>

        <div className="divide-y divide-[#1A2D40]">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#111C28] transition-colors">
              {/* Avatar */}
              <div className="w-9 h-9 bg-[#1A2D40] flex items-center justify-center text-sm font-bold text-[#00D4C8] flex-shrink-0">
                {m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{m.name}</span>
                  <RoleBadge role={m.agency_role} />
                </div>
                <div className="text-xs text-[#4A6580] mt-0.5">{m.email}</div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex gap-4 text-center">
                <div>
                  <div className="text-sm font-bold text-white">{m.listing_count}</div>
                  <div className="text-[9px] text-[#4A6580] uppercase tracking-wide">Listings</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{m.lead_count}</div>
                  <div className="text-[9px] text-[#4A6580] uppercase tracking-wide">Leads</div>
                </div>
              </div>

              {/* Actions — only for non-owners */}
              {m.agency_role !== 'owner' && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative group">
                    <button className="flex items-center gap-1 text-xs text-[#4A6580] border border-[#1A2D40] px-2 py-1 hover:border-[#00D4C8]/30 transition-colors">
                      Role <ChevronDown size={10} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-[#0D1821] border border-[#1A2D40] z-10 hidden group-hover:block min-w-[120px]">
                      {['agency_admin', 'agent', 'viewer'].map(r => (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(m.id, r)}
                          className={`block w-full text-left px-3 py-2 text-xs hover:bg-[#1A2D40] transition-colors ${
                            m.agency_role === r ? 'text-[#00D4C8]' : 'text-[#7A95AE]'
                          }`}
                        >
                          {r === 'agency_admin' ? 'Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
                          {m.agency_role === r ? ' ✓' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(m.id, m.name)}
                    className="p-1.5 text-[#4A6580] hover:text-[#FF4D6A] hover:bg-[#FF4D6A]/08 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="bg-[#0D1821] border border-[#1A2D40]">
          <div className="px-5 py-4 border-b border-[#1A2D40] flex items-center gap-2">
            <Mail size={14} className="text-[#FFB830]" />
            <h2 className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase">
              Pending Invites ({invites.length})
            </h2>
          </div>
          <div className="divide-y divide-[#1A2D40]">
            {invites.map(inv => (
              <div key={inv.id} className="flex items-center gap-4 px-5 py-3">
                <Mail size={16} className="text-[#4A6580] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">{inv.email}</div>
                  <div className="text-[10px] text-[#4A6580] font-mono mt-0.5">
                    {inv.role} · expires {new Date(inv.expires_at).toLocaleDateString('en-IN')}
                    {inv.invited_by_name ? ` · by ${inv.invited_by_name}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleResend(inv.id)}
                    className="flex items-center gap-1 text-xs text-[#4A6580] hover:text-[#00D4C8] border border-[#1A2D40] px-2 py-1 transition-colors"
                  >
                    <RefreshCw size={10} /> Resend
                  </button>
                  <button
                    onClick={() => handleCancelInvite(inv.id)}
                    className="flex items-center gap-1 text-xs text-[#4A6580] hover:text-[#FF4D6A] border border-[#1A2D40] px-2 py-1 transition-colors"
                  >
                    <Trash2 size={10} /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
