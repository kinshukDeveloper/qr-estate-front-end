'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free', price: '₹0', period: 'forever',
    desc: 'For solo agents starting out',
    color: '#00D4C8', highlight: false, cta: 'Start free',
    features: ['5 active listings','QR per listing','Public property page','Lead capture form','Basic analytics','—','—'],
  },
  {
    name: 'Pro', price: '₹999', period: '/month',
    desc: 'For active agents with a pipeline',
    color: '#FFB830', highlight: true, cta: 'Try Pro',
    features: ['Unlimited listings','QR per listing','Public property page','Lead capture form','Full analytics + devices','5 team seats','QR health monitor'],
  },
  {
    name: 'Agency', price: '₹4,999', period: '/month',
    desc: 'For brokerages and teams',
    color: '#A78BFA', highlight: false, cta: 'Try Agency',
    features: ['Unlimited listings','QR per listing','Public property page','Lead capture form','Full analytics + devices','25 team seats','White-label (v2)'],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-brand-border">
      <div className="max-w-6xl mx-auto">

        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-[10px] font-bold tracking-[3px] text-brand-teal uppercase mb-3">Pricing</div>
          <h2 className="font-black text-4xl text-white tracking-tight">
            Simple, flat pricing.{' '}
            <span className="text-brand-gray-light font-light">No per-listing fees.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-px bg-brand-border"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PLANS.map((p) => (
            <motion.div
              key={p.name}
              variants={card}
              className="bg-brand-bg p-8 relative"
              whileHover={{
                backgroundColor: 'rgba(0,212,200,0.02)',
                y: p.highlight ? -6 : -4,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              style={p.highlight ? { boxShadow: `0 0 0 2px ${p.color}` } : {}}
            >
              {p.highlight && (
                <motion.div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 font-mono font-bold text-[10px] px-4 py-1 tracking-widest uppercase"
                  style={{ background: p.color, color: '#080F17' }}
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Most popular
                </motion.div>
              )}

              <div className="font-mono text-xs font-bold tracking-widest uppercase mb-2" style={{ color: p.color }}>
                {p.name}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-black text-4xl text-white">{p.price}</span>
                <span className="text-brand-gray text-sm">{p.period}</span>
              </div>
              <p className="text-brand-gray-light text-xs mb-6">{p.desc}</p>

              <motion.a
                href="/auth/register"
                className="block text-center font-bold text-sm py-2.5 mb-6 transition-colors"
                style={p.highlight ? { background: p.color, color: '#080F17' } : { border: '1px solid rgba(26,45,64,1)', color: '#7A95AE' }}
                whileHover={{ scale: 1.03, ...(p.highlight ? {} : { borderColor: '#00D4C8', color: '#F0F6FF' }) }}
                whileTap={{ scale: 0.97 }}
              >
                {p.cta}
              </motion.a>

              <ul className="space-y-2.5">
                {p.features.map((f, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {f === '—'
                      ? <span className="text-brand-border">—</span>
                      : <Check size={13} style={{ color: p.color, flexShrink: 0 }} />
                    }
                    <span className={f === '—' ? 'text-brand-border' : 'text-brand-gray-light'}>{f}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-brand-gray text-xs font-mono mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          All plans include SSL, Neon DB backups, and Vercel global CDN. No hidden fees.
        </motion.p>
      </div>
    </section>
  );
}
