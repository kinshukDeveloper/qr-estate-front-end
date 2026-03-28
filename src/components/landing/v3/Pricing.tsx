'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Building2, Globe2, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    icon: Zap,
    color: '#566070',
    desc: 'Start for free. No credit card.',
    features: [
      '5 active listings',
      'Unlimited QR scans',
      'Public buyer pages',
      'Lead capture form',
      'WhatsApp & call CTAs',
      'Basic analytics',
    ],
    cta: 'Start free',
    ctaHref: '/auth/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 999, annual: 9990 },
    icon: Building2,
    color: '#E8B84B',
    desc: 'For serious agents who want to close more deals.',
    features: [
      'Unlimited listings',
      'Full analytics dashboard',
      '5 team seats',
      'AI quality score + tips',
      'Virtual tour embed',
      '60-second callback',
      'Regional languages (5)',
      'Builder suite (templates, CSV)',
      'AI Optimizer (price, title, amenity)',
      'QR health monitoring',
    ],
    cta: 'Start Pro — ₹999/mo',
    ctaHref: '/auth/register?plan=pro',
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Agency',
    price: { monthly: 4999, annual: 49990 },
    icon: Globe2,
    color: '#18D4C8',
    desc: 'For brokerages and multi-agent teams.',
    features: [
      'Everything in Pro',
      '25 team seats',
      'White-label branding',
      'Custom domain',
      'Portal API + webhooks',
      'Priority support',
      'Onboarding call',
      'Market Intelligence dashboard',
    ],
    cta: 'Contact sales',
    ctaHref: '/contact',
    highlight: false,
  },
];

export default function PricingV3() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-28 px-5 sm:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg2)]/60 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center max-w-xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
            <span className="font-code text-[11px] tracking-[3px] uppercase text-gold">Simple pricing</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2
            className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--white)] mb-4"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            Start free.{' '}
            <span className="text-gradient-gold">Scale when you're ready.</span>
          </h2>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-[13px] font-medium transition-colors ${!annual ? 'text-[var(--white)]' : 'text-[var(--dim)]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              className="relative w-12 h-6 rounded-full transition-colors duration-300"
              style={{ background: annual ? '#E8B84B' : 'var(--border2)' }}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-[var(--bg)]"
                animate={{ left: annual ? '26px' : '2px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              />
            </button>
            <span className={`text-[13px] font-medium transition-colors ${annual ? 'text-[var(--white)]' : 'text-[var(--dim)]'}`}>
              Annual
              <span className="ml-1.5 font-code text-[10px] text-green bg-green/10 border border-green/20 px-1.5 py-0.5 rounded-full">2 months free</span>
            </span>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl border flex flex-col overflow-hidden
                ${plan.highlight
                  ? 'border-[#E8B84B50] bg-gradient-to-b from-[#E8B84B08] to-[var(--surface)]'
                  : 'border-[var(--border)] bg-[var(--surface)]'
                }`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: plan.highlight ? -4 : -2, transition: { type: 'spring', stiffness: 280 } }}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="absolute top-4 right-4 font-code text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded-full border"
                  style={{ color: '#E8B84B', borderColor: '#E8B84B40', background: '#E8B84B12' }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Gold glow for highlight plan */}
              {plan.highlight && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(232,184,75,.08) inset' }} />
              )}

              <div className="p-7 flex-1">
                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${plan.color}14`, border: `1px solid ${plan.color}25` }}
                  >
                    <plan.icon size={18} style={{ color: plan.color }} strokeWidth={1.8} />
                  </div>
                  <span className="font-display font-bold text-[17px] text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>
                    {plan.name}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={annual ? 'annual' : 'monthly'}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {plan.price.monthly === 0 ? (
                        <span className="font-display font-extrabold text-[2.2rem] text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)' }}>Free</span>
                      ) : (
                        <div className="flex items-end gap-1">
                          <span className="font-code text-[var(--muted)] text-[18px] mb-1.5">₹</span>
                          <span
                            className="font-display font-extrabold text-[2.2rem] text-[var(--white)]"
                            style={{ fontFamily: 'var(--font-syne)', color: plan.highlight ? '#E8B84B' : undefined }}
                          >
                            {annual
                              ? (plan.price.annual / 12).toLocaleString('en-IN')
                              : plan.price.monthly.toLocaleString('en-IN')}
                          </span>
                          <span className="font-code text-[var(--muted)] text-[13px] mb-2">/mo</span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  {annual && plan.price.annual > 0 && (
                    <p className="font-code text-[11px] text-[var(--dim)]">₹{plan.price.annual.toLocaleString('en-IN')} billed annually</p>
                  )}
                </div>

                <p className="text-[13px] text-[var(--muted)] mb-6 leading-relaxed">{plan.desc}</p>

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={13} style={{ color: plan.color }} className="flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[13px] text-[var(--muted)]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-7 pt-0">
                <Link href={plan.ctaHref}>
                  <motion.button
                    className="w-full py-3 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 relative overflow-hidden group transition-all duration-200"
                    style={plan.highlight ? {
                      background: 'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)',
                      color: '#07090D',
                    } : {
                      background: 'transparent',
                      color: 'var(--white)',
                      border: `1px solid var(--border2)`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    {plan.highlight && (
                      <span className="absolute inset-0 bg-shimmer bg-[length:300%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center font-code text-[11px] text-[var(--dim)] mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All plans include: unlimited QR scans · buyer pages · lead capture · WhatsApp CTA · no setup fee · cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
