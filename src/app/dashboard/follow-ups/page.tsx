'use client';
import { useState, useEffect } from 'react';
import { Mail, MessageCircle, CheckCircle2, Clock, XCircle, PauseCircle, PlayCircle } from 'lucide-react';

const STEP_META = [
  { step: 1, icon: MessageCircle, label: 'Instant WhatsApp',  desc: 'Sent immediately on new lead', color: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20'  },
  { step: 2, icon: Mail,          label: '24h Email',         desc: 'Property details + brochure',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'   },
  { step: 3, icon: MessageCircle, label: '72h WhatsApp',      desc: 'Market analysis nudge',        color: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20'  },
  { step: 4, icon: Mail,          label: '7-day Check-in',    desc: 'Re-engagement email',          color: 'text-violet-400', bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
];


// ── Follow-ups overview page ───────────────────────────────────────────────────
export default function FollowUpsPage() {
  return (
    <div className="max-w-3xl pb-16 mx-auto">
      <div className="mb-6">
        <div className="text-[9px] font-black tracking-widest text-green-400/70 uppercase mb-1">F08 · Automation</div>
        <h1 className="text-2xl font-black text-white font-['Syne',sans-serif]">Follow-up Sequences</h1>
        <p className="mt-1 text-sm text-white/40">Automatic 4-step WhatsApp + email sequence fires for every new lead.</p>
      </div>

      {/* Sequence diagram */}
      <div className="bg-[#0C0F14] border border-white/[0.06] rounded-3xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <div className="text-sm font-bold text-white">Default Sequence</div>
          <div className="text-[11px] text-white/30 mt-0.5">Triggers automatically when a new lead is created</div>
        </div>
        <div className="p-5">
          {STEP_META.map(({ step, icon: Icon, label, desc, color, bg, border }, i) => (
            <div key={step} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0 relative z-10`}>
                  <Icon size={16} className={color} />
                </div>
                {i < STEP_META.length - 1 && (
                  <div className="w-px flex-1 bg-white/[0.06] my-1" style={{ minHeight: 28 }} />
                )}
              </div>
              <div className={`flex-1 pb-${i < STEP_META.length - 1 ? '6' : '0'} pt-2`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-white">{label}</span>
                  <span className="text-[8px] font-bold text-white/20 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">Step {step}</span>
                </div>
                <div className="text-[11px] text-white/40">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
          <MessageCircle size={18} className="mb-3 text-green-400" />
          <div className="mb-1 text-sm font-bold text-white">WhatsApp (Steps 1 & 3)</div>
          <div className="text-[11px] text-white/40 leading-relaxed mb-3">
            Sent via WhatsApp Business Cloud API. Set <code className="text-cyan-400">WHATSAPP_API_TOKEN</code> and <code className="text-cyan-400">WHATSAPP_PHONE_ID</code> in your env. Falls back to manual log if not configured.
          </div>
          <div className="text-[9px] font-bold text-green-400/60 uppercase tracking-widest">Meta Cloud API</div>
        </div>
        <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl p-5">
          <Mail size={18} className="mb-3 text-cyan-400" />
          <div className="mb-1 text-sm font-bold text-white">Email (Steps 2 & 4)</div>
          <div className="text-[11px] text-white/40 leading-relaxed mb-3">
            Sent via Nodemailer using <code className="text-cyan-400">SMTP_HOST/USER/PASS</code>. Gmail app passwords work. Step 2 includes brochure link. Step 4 is a check-in.
          </div>
          <div className="text-[9px] font-bold text-cyan-400/60 uppercase tracking-widest">Nodemailer · SMTP</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-500/[0.05] border border-amber-500/20 rounded-2xl">
        <div className="mb-1 text-xs font-bold text-amber-400">Cron Setup Required</div>
        <div className="text-[11px] text-amber-400/60 leading-relaxed">
          Add this to your Railway / cron scheduler every 15 minutes:
        </div>
        <code className="block mt-2 text-[10px] text-amber-300/80 bg-black/30 px-3 py-2 rounded-lg">
          */15 * * * * node src/jobs/followUpCron.js
        </code>
        <div className="text-[10px] text-amber-400/40 mt-1.5">
          Or hit <code>POST /api/v1/v3/followups/trigger</code> with <code>x-cron-secret</code> header via Vercel cron.
        </div>
      </div>
    </div>
  );
}
