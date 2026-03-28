// 'use client';

// import { useState, useEffect } from 'react';
// import { Check, Zap, Building2, Crown, AlertTriangle, Clock } from 'lucide-react';
// import api from '@/lib/api';
// import { Button } from '@/components/ui/Button';
// import { useAuthStore } from '@/store/authStore';

// const PLAN_ICONS: Record<string, React.ReactNode> = {
//   free: <Zap size={20} />,
//   pro: <Crown size={20} />,
//   agency: <Building2 size={20} />,
// };

// const PLAN_COLORS: Record<string, string> = {
//   free: '#7A95AE',
//   pro: '#00D4C8',
//   agency: '#FFB830',
// };

// function formatAmount(paise: number) {
//   return `₹${(paise / 100).toLocaleString('en-IN')}`;
// }

// function formatDate(date: string) {
//   return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
// }

// declare global {
//   interface Window { Razorpay: any; }
// }

// export default function BillingPage() {
//   const { user } = useAuthStore();
//   const [currentPlan, setCurrentPlan] = useState<any>(null);
//   const [plans, setPlans] = useState<any>(null);
//   const [payments, setPayments] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [upgrading, setUpgrading] = useState<string | null>(null);
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [planRes, plansRes, histRes] = await Promise.all([
//           api.get('/billing/me'),
//           api.get('/billing/plans'),
//           api.get('/billing/history'),
//         ]);
//         setCurrentPlan(planRes.data.data);
//         setPlans(plansRes.data.data.plans);
//         setPayments(histRes.data.data.payments);
//       } catch { /* silent */ }
//       finally { setIsLoading(false); }
//     }
//     load();

//     // Load Razorpay script
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     document.body.appendChild(script);
//     return () => { document.body.removeChild(script); };
//   }, []);

//   async function handleUpgrade(planKey: string) {
//     setUpgrading(planKey);
//     setError(null);
//     try {
//       const orderRes = await api.post('/billing/order', { plan: planKey });
//       const { order_id, amount, currency, key_id, plan_name } = orderRes.data.data;

//       const options = {
//         key: key_id,
//         amount,
//         currency,
//         name: 'QR Estate',
//         description: `${plan_name} Plan — Annual`,
//         order_id,
//         handler: async (response: any) => {
//           try {
//             const verifyRes = await api.post('/billing/verify', {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               plan: planKey,
//             });
//             setCurrentPlan((prev: any) => ({ ...prev, plan: planKey }));
//             setSuccessMsg(verifyRes.data.data.message);
//             const histRes = await api.get('/billing/history');
//             setPayments(histRes.data.data.payments);
//           } catch {
//             setError('Payment verification failed. Contact support.');
//           }
//         },
//         prefill: {
//           name: user?.name || '',
//           email: user?.email || '',
//           contact: user?.phone ? `+91${user.phone}` : '',
//         },
//         theme: { color: '#00D4C8' },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on('payment.failed', () => setError('Payment failed. Please try again.'));
//       rzp.open();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to initiate payment');
//     } finally {
//       setUpgrading(null);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div className="h-8 w-32 bg-[#111C28]" />
//         <div className="grid grid-cols-3 gap-4">
//           {[1,2,3].map(i => <div key={i} className="h-80 bg-[#111C28]" />)}
//         </div>
//       </div>
//     );
//   }

//   const activePlan = currentPlan?.plan || 'free';

//   return (
//     <div className="max-w-4xl space-y-8 animate-fade-in">
//       <div>
//         <h1 className="text-2xl font-black text-white">Billing & Plans</h1>
//         <p className="text-[#7A95AE] text-sm mt-0.5">Manage your subscription</p>
//       </div>

//       {/* Current plan banner */}
//       <div className="bg-[#111C28] border border-[#1A2D40] p-5 flex items-center justify-between gap-4">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center justify-center w-10 h-10" style={{ background: `${PLAN_COLORS[activePlan]}15`, color: PLAN_COLORS[activePlan] }}>
//             {PLAN_ICONS[activePlan]}
//           </div>
//           <div>
//             <div className="text-sm font-bold text-white capitalize">
//               {activePlan} Plan {activePlan !== 'free' && '✓ Active'}
//             </div>
//             {currentPlan?.plan_expires_at && (
//               <div className="text-xs text-[#4A6580] flex items-center gap-1 mt-0.5">
//                 <Clock size={10} />
//                 Renews {formatDate(currentPlan.plan_expires_at)}
//               </div>
//             )}
//             {currentPlan?.is_expired && (
//               <div className="text-xs text-[#FF4D6A] flex items-center gap-1 mt-0.5">
//                 <AlertTriangle size={10} />
//                 Plan expired — downgraded to Free
//               </div>
//             )}
//           </div>
//         </div>
//         {activePlan !== 'free' && (
//           <button
//             onClick={async () => {
//               if (!confirm('Cancel subscription and downgrade to Free?')) return;
//               await api.delete('/billing/cancel');
//               setCurrentPlan((p: any) => ({ ...p, plan: 'free' }));
//             }}
//             className="text-xs text-[#FF4D6A] hover:underline"
//           >
//             Cancel subscription
//           </button>
//         )}
//       </div>

//       {/* Messages */}
//       {successMsg && (
//         <div className="px-4 py-3 bg-[rgba(46,204,138,0.08)] border border-[rgba(46,204,138,0.2)] text-[#2ECC8A] text-sm">
//           🎉 {successMsg}
//         </div>
//       )}
//       {error && (
//         <div className="px-4 py-3 bg-[rgba(255,77,106,0.08)] border border-[rgba(255,77,106,0.2)] text-[#FF4D6A] text-sm">
//           ⚠ {error}
//         </div>
//       )}

//       {/* Plan cards */}
//       {plans && (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           {Object.entries(plans).map(([key, plan]: [string, any]) => {
//             const isActive = activePlan === key;
//             const color = PLAN_COLORS[key];

//             return (
//               <div
//                 key={key}
//                 className={`bg-[#111C28] border-2 p-6 relative transition-all ${
//                   isActive ? 'border-[#00D4C8]' : 'border-[#1A2D40] hover:border-[#4A6580]'
//                 } ${key === 'pro' ? 'ring-1 ring-[#00D4C8] ring-offset-2 ring-offset-[#080F17]' : ''}`}
//               >
//                 {key === 'pro' && (
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4C8] text-[#080F17] text-[9px] font-black tracking-widest uppercase px-3 py-1">
//                     Most Popular
//                   </div>
//                 )}
//                 {isActive && (
//                   <div className="absolute top-3 right-3 text-[9px] font-black tracking-widest text-[#00D4C8] uppercase">
//                     Current
//                   </div>
//                 )}

//                 {/* Icon + name */}
//                 <div className="flex items-center gap-2 mb-4" style={{ color }}>
//                   {PLAN_ICONS[key]}
//                   <span className="text-sm font-black tracking-wide uppercase">{plan.name}</span>
//                 </div>

//                 {/* Price */}
//                 <div className="mb-5">
//                   {plan.price === 0 ? (
//                     <div className="text-3xl font-black text-white">Free</div>
//                   ) : (
//                     <div>
//                       <span className="text-3xl font-black text-white">{formatAmount(plan.price)}</span>
//                       <span className="text-[#4A6580] text-sm">/year</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Features */}
//                 <div className="mb-6 space-y-2">
//                   {plan.features?.map((f: string) => (
//                     <div key={f} className="flex items-center gap-2 text-xs text-[#7A95AE]">
//                       <Check size={12} style={{ color }} className="flex-shrink-0" />
//                       {f}
//                     </div>
//                   ))}
//                 </div>

//                 {/* CTA */}
//                 {isActive ? (
//                   <div className="py-2.5 text-center text-xs font-bold text-[#4A6580] border border-[#1A2D40]">
//                     Current Plan
//                   </div>
//                 ) : key === 'free' ? (
//                   <div className="py-2.5 text-center text-xs text-[#4A6580]">
//                     Cancel to downgrade
//                   </div>
//                 ) : (
//                   <Button
//                     fullWidth
//                     onClick={() => handleUpgrade(key)}
//                     isLoading={upgrading === key}
//                     style={{ background: color, color: '#080F17' }}
//                   >
//                     Upgrade to {plan.name}
//                   </Button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Payment history */}
//       {payments.length > 0 && (
//         <div className="bg-[#111C28] border border-[#1A2D40] p-6">
//           <h2 className="mb-4 text-sm font-bold text-white">Payment History</h2>
//           <div className="space-y-2">
//             {payments.map(p => (
//               <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-[#1A2D40] last:border-0">
//                 <div>
//                   <div className="text-xs font-semibold text-white capitalize">{p.plan} Plan</div>
//                   <div className="text-[10px] text-[#4A6580] mt-0.5">{formatDate(p.created_at)}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm font-bold text-white">{formatAmount(p.amount)}</div>
//                   <div className={`text-[10px] font-bold uppercase tracking-wide ${
//                     p.status === 'success' ? 'text-[#2ECC8A]' : p.status === 'failed' ? 'text-[#FF4D6A]' : 'text-[#FFB830]'
//                   }`}>{p.status}</div>
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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Building2, AlertTriangle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

declare global { interface Window { Razorpay: any } }

// ── Plan data ─────────────────────────────────────────────────────────────────
const PLANS = [
  {
    key: 'free', name: 'Free', price: 0, icon: Zap, color: 'var(--muted)',
    desc: 'Get started for free — no card required.',
    features: ['5 active listings', 'QR code generation', 'Basic lead capture', 'Property page in 5 languages', 'WhatsApp share'],
  },
  {
    key: 'pro', name: 'Pro', price: 999, icon: Crown, color: 'var(--teal)',
    desc: 'Everything you need to close more deals.',
    features: ['Unlimited listings', 'All AI features (scoring, optimizer, chat)', 'Analytics dashboard', 'Document vault (F09)', 'EOI e-signature (F06)', 'Follow-up sequences (F08)', 'AVM valuation (F12)', 'Photo advisor (F14)', 'Featured boosts'],
    badge: 'Most popular',
  },
  {
    key: 'agency', name: 'Agency', price: 4999, icon: Building2, color: 'var(--gold)',
    desc: 'Full-stack for teams and agencies.',
    features: ['Everything in Pro', 'Unlimited agents', 'Role-based access (owner / admin / agent / viewer)', 'White-label branding', 'Portal API + webhooks', 'Commission auto-splits (V4)', 'Priority support'],
  },
];

function fmtAmount(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Plan card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, isCurrent, onUpgrade, loading }: {
  plan: typeof PLANS[0]; isCurrent: boolean; onUpgrade: (key: string) => void; loading: boolean;
}) {
  const Icon = plan.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl bg-[var(--surface)] border overflow-hidden transition-all ${
        isCurrent ? 'border-[var(--teal)] shadow-[0_0_30px_rgba(24,212,200,0.08)]' : 'border-[var(--border)] hover:border-[var(--border2)]'
      }`}
      style={isCurrent ? { borderColor: plan.color } : {}}
    >
      {/* Top accent */}
      {isCurrent && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} />
      )}

      {/* Badge */}
      {(plan as any).badge && (
        <div className="absolute top-4 right-4 font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border"
          style={{ color: plan.color, background: `${plan.color}10`, borderColor: `${plan.color}30`, fontFamily: 'var(--font-mono)' }}>
          {(plan as any).badge}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: `${plan.color}12`, border: `1px solid ${plan.color}25` }}>
            <Icon size={18} style={{ color: plan.color }} strokeWidth={1.8} />
          </div>
          <div>
            <div className="text-[15px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>{plan.name}</div>
            <div className="text-[11px] text-[var(--dim)]">{plan.desc}</div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          {plan.price === 0 ? (
            <span className="text-[2rem] font-extrabold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>Free</span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[2rem] font-extrabold" style={{ color: plan.color, fontFamily: 'var(--font-syne)' }}>₹{plan.price.toLocaleString('en-IN')}</span>
              <span className="text-[12px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>/month</span>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-2">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-[12px] text-[var(--muted)]">
              <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isCurrent ? (
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[12px] font-bold"
            style={{ color: plan.color, borderColor: `${plan.color}30`, background: `${plan.color}08`, fontFamily: 'var(--font-mono)' }}>
            <Check size={13} /> Current plan
          </div>
        ) : plan.price === 0 ? null : (
          <motion.button
            onClick={() => onUpgrade(plan.key)}
            disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}bb)`, color: 'var(--bg)', fontFamily: 'var(--font-syne)' }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <>Upgrade to {plan.name} <ArrowRight size={13} /></>}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function BillingPage() {
  const { user } = useAuthStore();
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [payments,    setPayments]    = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [upgrading,   setUpgrading]   = useState<string | null>(null);
  const [msg,         setMsg]         = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [planRes, histRes] = await Promise.all([
          api.get('/billing/me'),
          api.get('/billing/history'),
        ]);
        setCurrentPlan(planRes.data.data);
        setPayments(histRes.data.data.payments);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    load();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  async function handleUpgrade(planKey: string) {
    setUpgrading(planKey); setMsg(null);
    try {
      const orderRes = await api.post('/billing/create-order', { plan: planKey });
      const { order_id, amount, key_id } = orderRes.data.data;
      const rzp = new window.Razorpay({
        key: key_id, amount, currency: 'INR', order_id,
        name: 'QR Estate', description: `${planKey} plan subscription`,
        handler: async (response: any) => {
          await api.post('/billing/verify', response);
          setMsg({ type: 'success', text: `Upgraded to ${planKey} plan successfully!` });
          const r = await api.get('/billing/me');
          setCurrentPlan(r.data.data);
        },
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#18D4C8' },
      });
      rzp.open();
    } catch (e: any) {
      setMsg({ type: 'error', text: e?.response?.data?.message || 'Payment failed. Please try again.' });
    } finally { setUpgrading(null); }
  }

  const activePlanKey = currentPlan?.plan || 'free';

  return (
    <div className="pb-8 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[1.5rem] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Billing & Plans</h1>
        <p className="text-[13px] text-[var(--muted)] mt-0.5">Manage your subscription and payment history</p>
      </motion.div>

      {/* Current plan status */}
      {!loading && currentPlan && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--dim)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>Current plan</div>
            <div className="text-[18px] font-extrabold text-[var(--white)] capitalize" style={{ fontFamily: 'var(--font-syne)' }}>{activePlanKey}</div>
            {currentPlan.next_billing_date && (
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
                <Clock size={11} /> Renews {fmtDate(currentPlan.next_billing_date)}
              </div>
            )}
          </div>
          {currentPlan.listings_used !== undefined && (
            <div className="sm:text-right">
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--dim)] mb-1.5" style={{ fontFamily: 'var(--font-mono)' }}>
                Listings used
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full transition-all rounded-full" style={{ width: `${Math.min(100, (currentPlan.listings_used / (currentPlan.listings_max || 5)) * 100)}%`, background: 'var(--teal)' }} />
                </div>
                <span className="font-mono text-[11px] text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {currentPlan.listings_used}/{currentPlan.listings_max ?? 5}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Alert / success */}
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-xl px-4 py-3 flex items-center gap-2.5 text-[13px] border ${msg.type === 'success' ? 'bg-[rgba(40,216,144,0.06)] border-[rgba(40,216,144,0.2)] text-[var(--green)]' : 'bg-[rgba(240,64,96,0.06)] border-[rgba(240,64,96,0.2)] text-[var(--red)]'}`}>
            {msg.type === 'error' ? <AlertTriangle size={14} /> : <Check size={14} />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plans grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <PlanCard
              plan={plan}
              isCurrent={activePlanKey === plan.key}
              onUpgrade={handleUpgrade}
              loading={upgrading === plan.key}
            />
          </motion.div>
        ))}
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2.5">
            <div className="w-1.5 h-4 rounded-full bg-[var(--gold)]" />
            <span className="text-[12px] font-bold text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>Payment History</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-[var(--border)]">
                {['Date', 'Plan', 'Amount', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[9px] font-black tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="px-5 py-3 text-[var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{fmtDate(p.created_at)}</td>
                    <td className="px-5 py-3 text-[var(--white)] capitalize font-semibold">{p.plan}</td>
                    <td className="px-5 py-3 text-[var(--teal)] font-bold" style={{ fontFamily: 'var(--font-mono)' }}>{fmtAmount(p.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${p.status === 'paid' ? 'text-[var(--green)] bg-[rgba(40,216,144,0.08)] border-[rgba(40,216,144,0.2)]' : 'text-[var(--red)] bg-[rgba(240,64,96,0.08)] border-[rgba(240,64,96,0.2)]'}`} style={{ fontFamily: 'var(--font-mono)' }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
