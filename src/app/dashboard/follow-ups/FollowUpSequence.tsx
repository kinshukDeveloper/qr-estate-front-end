
'use client';

import { useState, useEffect } from 'react';
import { followUpAPI, type FollowUpStep } from '@/lib/features';
import { Mail, MessageCircle, CheckCircle2, Clock, XCircle, PauseCircle, PlayCircle } from 'lucide-react';

const STEP_META = [
  { step: 1, icon: MessageCircle, label: 'Instant WhatsApp',  desc: 'Sent immediately on new lead', color: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20'  },
  { step: 2, icon: Mail,          label: '24h Email',         desc: 'Property details + brochure',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'   },
  { step: 3, icon: MessageCircle, label: '72h WhatsApp',      desc: 'Market analysis nudge',        color: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20'  },
  { step: 4, icon: Mail,          label: '7-day Check-in',    desc: 'Re-engagement email',          color: 'text-violet-400', bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
];

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  sent:       { label: 'Sent',      icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20'   },
  failed:     { label: 'Failed',    icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-500/10',     border: 'border-red-500/20'     },
  paused:     { label: 'Paused',    icon: PauseCircle,   color: 'text-white/30',   bg: 'bg-white/5',        border: 'border-white/10'       },
  skipped:    { label: 'Skipped',   icon: XCircle,       color: 'text-white/20',   bg: 'bg-white/5',        border: 'border-white/10'       },
};

// ── Sequence view for a single lead (component used inside leads page) ────────
export function FollowUpSequence({ leadId }: { leadId: string }) {
  const [steps, setSteps]   = useState<FollowUpStep[]>([]);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    followUpAPI.getSequence(leadId)
      .then((r) => {
        const s = r.data.data.steps;
        setSteps(s);
        setPaused(s.every((x: FollowUpStep) => x.status === 'paused'));
      }).finally(() => setLoading(false));
  }, [leadId]);

  const toggle = async () => {
    await followUpAPI.toggle(leadId, !paused);
    setPaused(!paused);
    setSteps((prev) => prev.map((s) =>
      ['scheduled','paused'].includes(s.status) ? { ...s, status: paused ? 'scheduled' : 'paused' } : s
    ));
  };

  if (loading) return <div className="flex items-center justify-center h-20"><div className="w-5 h-5 border-2 rounded-full border-cyan-500/30 border-t-cyan-500 animate-spin" /></div>;

  return (
    <div className="bg-[#0C0F14] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <span className="text-xs font-bold text-white">Follow-up Sequence</span>
        <button onClick={toggle} className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all
          ${paused ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20' : 'bg-white/[0.04] border-white/10 text-white/40 hover:text-white/60'}`}>
          {paused ? <><PlayCircle size={11} /> Resume</> : <><PauseCircle size={11} /> Pause</>}
        </button>
      </div>
      <div className="p-3 space-y-2">
        {STEP_META.map(({ step, icon: Icon, label, desc, color, bg, border }) => {
          const found = steps.find((s) => s.step === step);
          const status = found?.status || 'scheduled';
          const sc = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          const SC = sc.icon;
          return (
            <div key={step} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
              <div className={`w-8 h-8 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                <Icon size={13} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{label}</div>
                <div className="text-[10px] text-white/30">{desc}</div>
              </div>
              <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full border ${sc.bg} ${sc.border} ${sc.color}`}>
                <SC size={9} />
                {sc.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
