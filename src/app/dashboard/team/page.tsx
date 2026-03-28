// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { agencyAPI } from '@/lib/agency';
// import {
//   Users, UserPlus, Mail, Trash2, RefreshCw, Crown,
//   Shield, Eye, UserCheck, AlertTriangle, Copy, Check,
//   Building2, ChevronDown,
// } from 'lucide-react';

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface Member {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   agency_role: 'owner' | 'agency_admin' | 'agent' | 'viewer';
//   joined_at: string;
//   invited_by_name?: string;
//   listing_count: number;
//   lead_count: number;
// }

// interface Invite {
//   id: string;
//   email: string;
//   role: string;
//   expires_at: string;
//   created_at: string;
//   invited_by_name?: string;
// }

// interface Agency {
//   id: string;
//   name: string;
//   plan: string;
//   max_agents: number;
//   owner_name: string;
//   member_count: string;
// }

// // ── Role helpers ──────────────────────────────────────────────────────────────
// const ROLE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
//   owner:        { label: 'Owner',       icon: Crown,     color: 'text-[#FFB830]' },
//   agency_admin: { label: 'Admin',       icon: Shield,    color: 'text-[#A78BFA]' },
//   agent:        { label: 'Agent',       icon: UserCheck, color: 'text-[#00D4C8]' },
//   viewer:       { label: 'Viewer',      icon: Eye,       color: 'text-[#4A6580]' },
// };

// function RoleBadge({ role }: { role: string }) {
//   const meta = ROLE_META[role] ?? { label: role, icon: UserCheck, color: 'text-white' };
//   const Icon = meta.icon;
//   return (
//     <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
//       <Icon size={10} /> {meta.label}
//     </span>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────
// export default function TeamPage() {
//   const [agency, setAgency]     = useState<Agency | null>(null);
//   const [members, setMembers]   = useState<Member[]>([]);
//   const [invites, setInvites]   = useState<Invite[]>([]);
//   const [loading, setLoading]   = useState(true);
//   const [noAgency, setNoAgency] = useState(false);

//   // Invite form
//   const [inviteEmail, setInviteEmail]   = useState('');
//   const [inviteRole, setInviteRole]     = useState('agent');
//   const [inviting, setInviting]         = useState(false);
//   const [inviteResult, setInviteResult] = useState<{ url: string } | null>(null);
//   const [inviteErr, setInviteErr]       = useState('');

//   // Create agency form
//   const [agencyName, setAgencyName]     = useState('');
//   const [creating, setCreating]         = useState(false);
//   const [createErr, setCreateErr]       = useState('');

//   // Copied link
//   const [copiedId, setCopiedId] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [agRes, memRes, invRes] = await Promise.all([
//         agencyAPI.getMe(),
//         agencyAPI.getMembers(),
//         agencyAPI.getPendingInvites(),
//       ]);
//       setAgency(agRes.data.data.agency);
//       setMembers(memRes.data.data.members);
//       setInvites(invRes.data.data.invites);
//       setNoAgency(false);
//     } catch (err: any) {
//       if (err?.response?.status === 404) setNoAgency(true);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   async function handleCreateAgency() {
//     if (!agencyName.trim()) return;
//     setCreating(true); setCreateErr('');
//     try {
//       await agencyAPI.create({ name: agencyName });
//       await load();
//     } catch (e: any) {
//       setCreateErr(e?.response?.data?.message ?? 'Failed to create agency');
//     } finally {
//       setCreating(false);
//     }
//   }

//   async function handleInvite(e: React.FormEvent) {
//     e.preventDefault();
//     if (!inviteEmail) return;
//     setInviting(true); setInviteErr(''); setInviteResult(null);
//     try {
//       const res = await agencyAPI.invite(inviteEmail, inviteRole);
//       setInviteResult({ url: res.data.data.inviteUrl });
//       setInviteEmail('');
//       await load();
//     } catch (e: any) {
//       setInviteErr(e?.response?.data?.message ?? 'Failed to send invite');
//     } finally {
//       setInviting(false);
//     }
//   }

//   async function handleRemove(userId: string, name: string) {
//     if (!confirm(`Remove ${name} from the team?`)) return;
//     try {
//       await agencyAPI.removeMember(userId);
//       await load();
//     } catch (e: any) {
//       alert(e?.response?.data?.message ?? 'Failed to remove member');
//     }
//   }

//   async function handleRoleChange(userId: string, role: string) {
//     try {
//       await agencyAPI.updateMemberRole(userId, role);
//       await load();
//     } catch (e: any) {
//       alert(e?.response?.data?.message ?? 'Failed to update role');
//     }
//   }

//   async function handleCancelInvite(inviteId: string) {
//     try {
//       await agencyAPI.cancelInvite(inviteId);
//       await load();
//     } catch (e: any) {
//       alert(e?.response?.data?.message ?? 'Failed to cancel');
//     }
//   }

//   async function handleResend(inviteId: string) {
//     try {
//       const res = await agencyAPI.resendInvite(inviteId);
//       copyToClipboard(res.data.data.inviteUrl, inviteId);
//       await load();
//     } catch (e: any) {
//       alert(e?.response?.data?.message ?? 'Failed to resend');
//     }
//   }

//   function copyToClipboard(text: string, id: string) {
//     navigator.clipboard.writeText(text);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 2000);
//   }

//   const seatsFull = agency && Number(agency.member_count) >= agency.max_agents;
//   const myRole = members.find(m => m.agency_role === 'owner')?.id;
//   const canManage = true; // actual check uses req.user.agency_role on backend

//   // ── Loading ──────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="w-6 h-6 border-2 border-[#00D4C8] border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // ── No Agency — Create one ────────────────────────────────────────────────
//   if (noAgency) {
//     return (
//       <div className="max-w-md mx-auto mt-16">
//         <div className="bg-[#0D1821] border border-[#1A2D40] p-8">
//           <Building2 size={32} className="text-[#00D4C8] mb-4" />
//           <h1 className="mb-2 text-xl font-bold text-white">Create your Agency</h1>
//           <p className="text-[#4A6580] text-sm mb-6">
//             Set up a workspace to invite your team, manage listings together, and access agency analytics.
//           </p>
//           {createErr && (
//             <div className="px-3 py-2 mb-4 text-xs text-red-400 border bg-red-900/20 border-red-500/30">
//               {createErr}
//             </div>
//           )}
//           <input
//             className="w-full bg-[#080F17] border border-[#1A2D40] text-white text-sm px-3 py-2.5 mb-3 outline-none focus:border-[#00D4C8] transition-colors"
//             placeholder="Agency / Brokerage name"
//             value={agencyName}
//             onChange={e => setAgencyName(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && handleCreateAgency()}
//           />
//           <button
//             onClick={handleCreateAgency}
//             disabled={creating || !agencyName.trim()}
//             className="w-full bg-[#00D4C8] text-[#080F17] font-bold text-sm py-2.5 hover:bg-[#00B8AD] transition-colors disabled:opacity-50"
//           >
//             {creating ? 'Creating…' : 'Create Agency →'}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── Main ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="max-w-3xl mx-auto space-y-6">

//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-white">{agency?.name}</h1>
//           <p className="text-[#4A6580] text-xs mt-1 font-mono tracking-wide uppercase">
//             {agency?.plan} plan · {agency?.member_count}/{agency?.max_agents} seats used
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className={`text-[10px] font-bold tracking-widest px-2.5 py-1.5 uppercase border ${
//             seatsFull
//               ? 'text-[#FF4D6A] border-[#FF4D6A]/30 bg-[#FF4D6A]/08'
//               : 'text-[#00D4C8] border-[#00D4C8]/30 bg-[#00D4C8]/08'
//           }`}>
//             {seatsFull ? '⚠ Seats Full' : `${Number(agency?.max_agents) - Number(agency?.member_count)} seat(s) left`}
//           </div>
//         </div>
//       </div>

//       {/* Seat progress bar */}
//       <div className="h-1.5 bg-[#1A2D40] overflow-hidden">
//         <div
//           className={`h-full transition-all ${seatsFull ? 'bg-[#FF4D6A]' : 'bg-[#00D4C8]'}`}
//           style={{ width: `${(Number(agency?.member_count) / (agency?.max_agents ?? 1)) * 100}%` }}
//         />
//       </div>

//       {/* Invite form */}
//       <div className="bg-[#0D1821] border border-[#1A2D40] p-5">
//         <h2 className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase mb-4 flex items-center gap-2">
//           <UserPlus size={12} /> Invite Team Member
//         </h2>

//         {seatsFull && (
//           <div className="flex items-center gap-2 bg-[#FF4D6A]/08 border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs px-3 py-2 mb-3">
//             <AlertTriangle size={12} /> Seat limit reached. Upgrade to Agency plan to add more agents.
//           </div>
//         )}

//         <form onSubmit={handleInvite} className="flex flex-wrap gap-2">
//           <input
//             type="email"
//             required
//             disabled={seatsFull ?? false}
//             className="flex-1 min-w-[200px] bg-[#080F17] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] disabled:opacity-40 transition-colors"
//             placeholder="teammate@email.com"
//             value={inviteEmail}
//             onChange={e => setInviteEmail(e.target.value)}
//           />
//           <select
//             disabled={seatsFull ?? false}
//             className="bg-[#080F17] border border-[#1A2D40] text-white text-sm px-3 py-2 outline-none focus:border-[#00D4C8] disabled:opacity-40"
//             value={inviteRole}
//             onChange={e => setInviteRole(e.target.value)}
//           >
//             <option value="agent">Agent</option>
//             <option value="agency_admin">Admin</option>
//             <option value="viewer">Viewer</option>
//           </select>
//           <button
//             type="submit"
//             disabled={inviting || (seatsFull ?? false)}
//             className="bg-[#00D4C8] text-[#080F17] font-bold text-sm px-5 py-2 hover:bg-[#00B8AD] disabled:opacity-50 transition-colors"
//           >
//             {inviting ? 'Sending…' : 'Send Invite'}
//           </button>
//         </form>

//         {inviteErr && (
//           <p className="text-[#FF4D6A] text-xs mt-2">{inviteErr}</p>
//         )}

//         {inviteResult && (
//           <div className="mt-3 bg-[#00D4C8]/08 border border-[#00D4C8]/30 p-3 flex items-center justify-between gap-3">
//             <div>
//               <div className="text-[10px] font-bold text-[#00D4C8] uppercase tracking-widest mb-1">Invite link generated</div>
//               <div className="text-xs text-[#7A95AE] font-mono truncate max-w-sm">{inviteResult.url}</div>
//             </div>
//             <button
//               onClick={() => copyToClipboard(inviteResult.url, 'result')}
//               className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#00D4C8] hover:text-white transition-colors"
//             >
//               {copiedId === 'result' ? <Check size={12} /> : <Copy size={12} />}
//               {copiedId === 'result' ? 'Copied!' : 'Copy Link'}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Members table */}
//       <div className="bg-[#0D1821] border border-[#1A2D40]">
//         <div className="px-5 py-4 border-b border-[#1A2D40] flex items-center gap-2">
//           <Users size={14} className="text-[#00D4C8]" />
//           <h2 className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase">
//             Team Members ({members.length})
//           </h2>
//         </div>

//         <div className="divide-y divide-[#1A2D40]">
//           {members.map(m => (
//             <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#111C28] transition-colors">
//               {/* Avatar */}
//               <div className="w-9 h-9 bg-[#1A2D40] flex items-center justify-center text-sm font-bold text-[#00D4C8] flex-shrink-0">
//                 {m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
//               </div>

//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-semibold text-white">{m.name}</span>
//                   <RoleBadge role={m.agency_role} />
//                 </div>
//                 <div className="text-xs text-[#4A6580] mt-0.5">{m.email}</div>
//               </div>

//               {/* Stats */}
//               <div className="hidden gap-4 text-center sm:flex">
//                 <div>
//                   <div className="text-sm font-bold text-white">{m.listing_count}</div>
//                   <div className="text-[9px] text-[#4A6580] uppercase tracking-wide">Listings</div>
//                 </div>
//                 <div>
//                   <div className="text-sm font-bold text-white">{m.lead_count}</div>
//                   <div className="text-[9px] text-[#4A6580] uppercase tracking-wide">Leads</div>
//                 </div>
//               </div>

//               {/* Actions — only for non-owners */}
//               {m.agency_role !== 'owner' && (
//                 <div className="flex items-center flex-shrink-0 gap-2">
//                   <div className="relative group">
//                     <button className="flex items-center gap-1 text-xs text-[#4A6580] border border-[#1A2D40] px-2 py-1 hover:border-[#00D4C8]/30 transition-colors">
//                       Role <ChevronDown size={10} />
//                     </button>
//                     <div className="absolute right-0 top-full mt-1 bg-[#0D1821] border border-[#1A2D40] z-10 hidden group-hover:block min-w-[120px]">
//                       {['agency_admin', 'agent', 'viewer'].map(r => (
//                         <button
//                           key={r}
//                           onClick={() => handleRoleChange(m.id, r)}
//                           className={`block w-full text-left px-3 py-2 text-xs hover:bg-[#1A2D40] transition-colors ${
//                             m.agency_role === r ? 'text-[#00D4C8]' : 'text-[#7A95AE]'
//                           }`}
//                         >
//                           {r === 'agency_admin' ? 'Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
//                           {m.agency_role === r ? ' ✓' : ''}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleRemove(m.id, m.name)}
//                     className="p-1.5 text-[#4A6580] hover:text-[#FF4D6A] hover:bg-[#FF4D6A]/08 transition-colors"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Pending invites */}
//       {invites.length > 0 && (
//         <div className="bg-[#0D1821] border border-[#1A2D40]">
//           <div className="px-5 py-4 border-b border-[#1A2D40] flex items-center gap-2">
//             <Mail size={14} className="text-[#FFB830]" />
//             <h2 className="text-[10px] font-bold tracking-[2px] text-[#4A6580] uppercase">
//               Pending Invites ({invites.length})
//             </h2>
//           </div>
//           <div className="divide-y divide-[#1A2D40]">
//             {invites.map(inv => (
//               <div key={inv.id} className="flex items-center gap-4 px-5 py-3">
//                 <Mail size={16} className="text-[#4A6580] flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <div className="text-sm text-white">{inv.email}</div>
//                   <div className="text-[10px] text-[#4A6580] font-mono mt-0.5">
//                     {inv.role} · expires {new Date(inv.expires_at).toLocaleDateString('en-IN')}
//                     {inv.invited_by_name ? ` · by ${inv.invited_by_name}` : ''}
//                   </div>
//                 </div>
//                 <div className="flex items-center flex-shrink-0 gap-2">
//                   <button
//                     onClick={() => handleResend(inv.id)}
//                     className="flex items-center gap-1 text-xs text-[#4A6580] hover:text-[#00D4C8] border border-[#1A2D40] px-2 py-1 transition-colors"
//                   >
//                     <RefreshCw size={10} /> Resend
//                   </button>
//                   <button
//                     onClick={() => handleCancelInvite(inv.id)}
//                     className="flex items-center gap-1 text-xs text-[#4A6580] hover:text-[#FF4D6A] border border-[#1A2D40] px-2 py-1 transition-colors"
//                   >
//                     <Trash2 size={10} /> Cancel
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Mail, Trash2, Crown, Shield,
  Eye, UserCheck, Copy, Check, Building2, RefreshCw,
  AlertTriangle, Loader2, X,
} from 'lucide-react';
import { agencyAPI } from '@/lib/agency';

interface Member { id:string; name:string; email:string; phone?:string; agency_role:'owner'|'agency_admin'|'agent'|'viewer'; joined_at:string; listing_count:number; lead_count:number; invited_by_name?:string }
interface Invite  { id:string; email:string; role:string; expires_at:string; created_at:string; invited_by_name?:string }
interface Agency  { id:string; name:string; plan:string; max_agents:number; owner_name:string; member_count:string }

const ROLE_META: Record<string, { label:string; icon:React.ElementType; color:string }> = {
  owner:        { label:'Owner',  icon:Crown,     color:'var(--gold)'   },
  agency_admin: { label:'Admin',  icon:Shield,    color:'var(--purple)' },
  agent:        { label:'Agent',  icon:UserCheck, color:'var(--teal)'   },
  viewer:       { label:'Viewer', icon:Eye,       color:'var(--muted)'  },
};
const ROLES = ['agent','agency_admin','viewer'];

function RoleBadge({ role }: { role:string }) {
  const m = ROLE_META[role] || { label:role, icon:UserCheck, color:'var(--muted)' };
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1 text-[8px] font-black tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border"
      style={{ color:m.color, background:`${m.color}10`.replace('var(--','rgba(').replace(')',''), borderColor:`${m.color}30`, fontFamily:'var(--font-mono)' }}>
      <Icon size={8} />{m.label}
    </span>
  );
}

function CopyBtn({ text }: { text:string }) {
  const [c,setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(()=>setC(false),1600); }}
      className="flex items-center gap-1 text-[10px] text-[var(--dim)] hover:text-[var(--teal)] transition-colors flex-shrink-0" style={{ fontFamily:'var(--font-mono)' }}>
      {c ? <><Check size={10}/>Copied</> : <><Copy size={10}/>Copy</>}
    </button>
  );
}

export default function TeamPage() {
  const [agency,    setAgency]    = useState<Agency|null>(null);
  const [members,   setMembers]   = useState<Member[]>([]);
  const [invites,   setInvites]   = useState<Invite[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [noAgency,  setNoAgency]  = useState(false);
  const [tab,       setTab]       = useState<'members'|'invites'>('members');
  const [showInvite,setShowInvite]= useState(false);
  const [inviteEmail,setInviteEmail] = useState('');
  const [inviteRole, setInviteRole]  = useState('agent');
  const [inviting,   setInviting]    = useState(false);
  const [inviteResult,setInviteResult] = useState<{url:string}|null>(null);
  const [inviteErr,  setInviteErr]   = useState('');
  const [agencyName, setAgencyName]  = useState('');
  const [creating,   setCreating]    = useState(false);
  const [createErr,  setCreateErr]   = useState('');

  // const load = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const [aRes, mRes, iRes] = await Promise.all([
  //       agencyAPI.getMyAgency(), agencyAPI.getMembers(), agencyAPI.getInvites(),
  //     ]);
  //     setAgency(aRes.data.data.agency);
  //     setMembers(mRes.data.data.members);
  //     setInvites(iRes.data.data.invites);
  //     setNoAgency(false);
  //   } catch (e:any) {
  //     if (e?.response?.status === 404) setNoAgency(true);
  //   } finally { setLoading(false); }
  // }, []);

  // useEffect(() => { load(); }, [load]);

  // async function createAgency() {
  //   if (!agencyName.trim()) return;
  //   setCreating(true); setCreateErr('');
  //   try {
  //     await agencyAPI.create({ name: agencyName.trim() });
  //     setNoAgency(false);
  //     await load();
  //   } catch (e:any) { setCreateErr(e?.response?.data?.message || 'Failed'); }
  //   finally { setCreating(false); }
  // }

  // async function sendInvite() {
  //   if (!inviteEmail.trim()) return;
  //   setInviting(true); setInviteErr(''); setInviteResult(null);
  //   try {
  //     const r = await agencyAPI.inviteMember({ email: inviteEmail.trim(), role: inviteRole });
  //     setInviteResult(r.data.data);
  //     setInviteEmail('');
  //     await load();
  //   } catch (e:any) { setInviteErr(e?.response?.data?.message || 'Failed'); }
  //   finally { setInviting(false); }
  // }

  // async function removeMember(id:string) {
  //   if (!confirm('Remove this member?')) return;
  //   await agencyAPI.removeMember(id); load();
  // }
  // async function revokeInvite(id:string) {
  //   await agencyAPI.revokeInvite(id); load();
  // }

  // ── Loading ──
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
    </div>
  );

  // ── No agency yet ──
  if (noAgency) return (
    <div className="max-w-md pt-16 mx-auto space-y-5">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
          <Building2 size={28} className="text-[var(--dim)]" />
        </div>
        <h1 className="text-[1.4rem] font-extrabold text-[var(--white)] mb-2" style={{ fontFamily:'var(--font-syne)' }}>Create your agency</h1>
        <p className="text-[13px] text-[var(--muted)]">Set up a workspace so you can invite agents, share listings, and collaborate.</p>
      </div>
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 space-y-4">
        <div>
          <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] mb-2" style={{ fontFamily:'var(--font-mono)' }}>Agency Name</label>
          <input value={agencyName} onChange={e=>setAgencyName(e.target.value)} placeholder="e.g. Sharma Properties"
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--white)] outline-none focus:border-[var(--teal)] transition-colors placeholder:text-[var(--dim)]" />
        </div>
        {createErr && <p className="text-[11px] text-[var(--red)]">{createErr}</p>}
        <motion.button disabled={creating || !agencyName.trim()}
        // <motion.button onClick={createAgency} disabled={creating || !agencyName.trim()}
          whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
          className="w-full py-3 rounded-xl text-[13px] font-bold text-[var(--bg)] disabled:opacity-50"
          style={{ background:'linear-gradient(135deg,#F5D280,#E8B84B)', fontFamily:'var(--font-syne)' }}>
          {creating ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin"/>Creating…</span> : 'Create Agency →'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="pb-8 space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily:'var(--font-syne)' }}>Team</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            {agency ? `${agency.name} · ${agency.member_count} members` : 'Agency workspace'}
          </p>
        </div>
        <div className="flex gap-2">
          <button  className="p-2 rounded-xl border border-[var(--border)] text-[var(--dim)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all">
          {/* <button onClick={load} className="p-2 rounded-xl border border-[var(--border)] text-[var(--dim)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all"> */}
            <RefreshCw size={14} />
          </button>
          <motion.button onClick={() => setShowInvite(v=>!v)}
            whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-[var(--bg)]"
            style={{ background:'linear-gradient(135deg,#5EEEE8,#18D4C8)', fontFamily:'var(--font-syne)' }}>
            <UserPlus size={14} /> Invite
          </motion.button>
        </div>
      </div>

      {/* ── Agency card ── */}
      {agency && (
        <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
          className="rounded-2xl bg-[var(--surface)] border border-[rgba(232,184,75,0.2)] p-5 flex items-center gap-4">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl" style={{ background:'rgba(232,184,75,0.08)', border:'1px solid rgba(232,184,75,0.2)' }}>
            <Building2 size={20} className="text-[var(--gold)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-[var(--white)] truncate" style={{ fontFamily:'var(--font-syne)' }}>{agency.name}</div>
            <div className="text-[10px] text-[var(--dim)] mt-0.5" style={{ fontFamily:'var(--font-mono)' }}>
              {agency.member_count} / {agency.max_agents} agents · {agency.plan} plan · Owner: {agency.owner_name}
            </div>
          </div>
          {/* Capacity bar */}
          <div className="flex-shrink-0 hidden sm:block w-28">
            <div className="text-[9px] text-[var(--dim)] mb-1 text-right" style={{ fontFamily:'var(--font-mono)' }}>Capacity</div>
            <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width:`${Math.min(100,(parseInt(agency.member_count)/agency.max_agents)*100)}%`, background:'var(--gold)' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Invite form ── */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }}
            className="rounded-2xl bg-[var(--surface)] border border-[rgba(24,212,200,0.25)] p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--teal)]" style={{ fontFamily:'var(--font-mono)' }}>Invite a team member</div>
              <button onClick={()=>setShowInvite(false)} className="text-[var(--dim)] hover:text-[var(--muted)]"><X size={14}/></button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} type="email" placeholder="colleague@example.com"
                className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--white)] outline-none focus:border-[var(--teal)] placeholder:text-[var(--dim)]" />
              <select value={inviteRole} onChange={e=>setInviteRole(e.target.value)}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--white)] outline-none focus:border-[var(--teal)] cursor-pointer sm:w-36">
                {ROLES.map(r=><option key={r} value={r}>{ROLE_META[r]?.label||r}</option>)}
              </select>
              <motion.button  disabled={inviting||!inviteEmail.trim()}
              // <motion.button onClick={sendInvite} disabled={inviting||!inviteEmail.trim()}
                whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-[var(--bg)] disabled:opacity-50 sm:w-auto"
                style={{ background:'linear-gradient(135deg,#F5D280,#E8B84B)', fontFamily:'var(--font-syne)' }}>
                {inviting ? <Loader2 size={13} className="animate-spin"/> : <UserPlus size={13}/>} Send
              </motion.button>
            </div>
            {inviteErr && <p className="mt-2 text-[11px] text-[var(--red)]">{inviteErr}</p>}
            {inviteResult && (
              <div className="mt-3 flex items-center gap-3 bg-[rgba(40,216,144,0.06)] border border-[rgba(40,216,144,0.2)] rounded-xl px-4 py-2.5">
                <Check size={13} className="text-[var(--green)] flex-shrink-0" />
                <span className="text-[11px] text-[var(--green)] flex-1 truncate" style={{ fontFamily:'var(--font-mono)' }}>{inviteResult.url}</span>
                <CopyBtn text={inviteResult.url} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1">
        {(['members','invites'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`flex-1 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${tab===t?'bg-[rgba(24,212,200,0.1)] text-[var(--teal)] border border-[rgba(24,212,200,0.2)]':'text-[var(--dim)] hover:text-[var(--muted)]'}`}
            style={{ fontFamily:'var(--font-mono)' }}>
            {t} ({t==='members'?members.length:invites.length})
          </button>
        ))}
      </div>

      {/* ── Members ── */}
      {tab==='members' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
          {members.length===0 ? (
            <div className="p-12 text-center">
              <Users size={28} className="mx-auto mb-3 text-[var(--dim)]" />
              <p className="text-[13px] text-[var(--muted)]">No team members yet — invite your first colleague</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-[12px]">
                  <thead><tr className="border-b border-[var(--border)]">
                    {['Member','Role','Listings','Leads','Joined',''].map(h=>(
                      <th key={h} className="px-5 py-3 text-left text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {members.map((m,i)=>(
                      <motion.tr key={m.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
                        className="border-b border-[var(--border)] last:border-0 hover:bg-[rgba(255,255,255,0.015)] group transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-[var(--bg)] flex-shrink-0"
                              style={{ background:'linear-gradient(135deg,var(--teal),var(--purple))' }}>
                              {m.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--white)] truncate max-w-[140px]">{m.name}</div>
                              <div className="text-[10px] text-[var(--dim)] truncate max-w-[140px]" style={{ fontFamily:'var(--font-mono)' }}>{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3"><RoleBadge role={m.agency_role}/></td>
                        <td className="px-5 py-3 text-[var(--muted)]" style={{ fontFamily:'var(--font-mono)' }}>{m.listing_count}</td>
                        <td className="px-5 py-3 text-[var(--muted)]" style={{ fontFamily:'var(--font-mono)' }}>{m.lead_count}</td>
                        <td className="px-5 py-3 text-[var(--dim)]" style={{ fontFamily:'var(--font-mono)' }}>
                          {new Date(m.joined_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'})}
                        </td>
                        <td className="px-5 py-3">
                          {m.agency_role!=='owner' && (
                            <button  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--red)] hover:bg-[rgba(240,64,96,0.08)] transition-all">
                            {/* <button onClick={()=>removeMember(m.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--dim)] hover:text-[var(--red)] hover:bg-[rgba(240,64,96,0.08)] transition-all"> */}
                              <Trash2 size={12}/>
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-[var(--border)]">
                {members.map((m,i)=>(
                  <motion.div key={m.id} initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.04 }}
                    className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black text-[var(--bg)] flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,var(--teal),var(--purple))' }}>
                      {m.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-bold text-[var(--white)] truncate">{m.name}</span>
                        <RoleBadge role={m.agency_role}/>
                      </div>
                      <div className="text-[10px] text-[var(--dim)] truncate" style={{ fontFamily:'var(--font-mono)' }}>{m.email}</div>
                      <div className="text-[9px] text-[var(--dim)] mt-0.5" style={{ fontFamily:'var(--font-mono)' }}>
                        {m.listing_count} listings · {m.lead_count} leads
                      </div>
                    </div>
                    {m.agency_role!=='owner' && (
                      <button  className="p-2 text-[var(--dim)] hover:text-[var(--red)] flex-shrink-0">
                      {/* <button onClick={()=>removeMember(m.id)} className="p-2 text-[var(--dim)] hover:text-[var(--red)] flex-shrink-0"> */}
                        <Trash2 size={13}/>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* ── Invites ── */}
      {tab==='invites' && (
        <div className="space-y-2">
          {invites.length===0 ? (
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-12 text-center">
              <Mail size={28} className="mx-auto mb-3 text-[var(--dim)]"/><p className="text-[13px] text-[var(--muted)]">No pending invites</p>
            </div>
          ) : invites.map((inv,i)=>(
            <motion.div key={inv.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 rounded-xl" style={{ background:'rgba(72,152,248,0.08)', border:'1px solid rgba(72,152,248,0.15)' }}>
                <Mail size={15} className="text-[var(--blue)]"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[var(--white)] truncate">{inv.email}</div>
                <div className="text-[9px] text-[var(--dim)] mt-0.5" style={{ fontFamily:'var(--font-mono)' }}>
                  {ROLE_META[inv.role]?.label||inv.role} · expires {new Date(inv.expires_at).toLocaleDateString('en-IN')}
                </div>
              </div>
              <CopyBtn text={inv.email}/>
              <button  className="p-1.5 text-[var(--dim)] hover:text-[var(--red)] rounded-lg hover:bg-[rgba(240,64,96,0.08)] transition-all flex-shrink-0">
              {/* <button onClick={()=>revokeInvite(inv.id)} className="p-1.5 text-[var(--dim)] hover:text-[var(--red)] rounded-lg hover:bg-[rgba(240,64,96,0.08)] transition-all flex-shrink-0"> */}
                <Trash2 size={13}/>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
