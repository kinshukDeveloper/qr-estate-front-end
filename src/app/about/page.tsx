import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, Brain, Globe, Shield, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = { title: 'About — QR Estate' };

const VALUES = [
  { icon: Zap,        title: 'Speed First',    desc: 'QR code in 2 minutes. Callback in 60 seconds. Every second a buyer waits is a deal at risk.', color: 'var(--gold)'   },
  { icon: Brain,      title: 'AI-Powered',     desc: 'Lead scoring, photo analysis, price valuation, listing optimisation — all running on GPT-4o.', color: 'var(--purple)' },
  { icon: Globe,      title: 'India-First',    desc: 'Hindi, Punjabi, Marathi, Tamil on every buyer page. RERA-ready. Built for Indian cities.', color: 'var(--teal)'   },
  { icon: Shield,     title: 'Transparent',    desc: 'Price, brokerage, documents — all visible upfront. No hidden surprises at the registration table.', color: 'var(--green)'  },
  { icon: Users,      title: 'Agent-Centric',  desc: 'Not a portal. Not an aggregator. Built for the agent who does the actual work of closing deals.', color: 'var(--blue)'   },
  { icon: TrendingUp, title: 'Market-Aware',   desc: 'Market intelligence, AVM valuations, neighbourhood scores — so agents advise buyers with real data.', color: 'var(--red)'    },
];

const STACK = [
  { label: 'Frontend',  value: 'Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion' },
  { label: 'Backend',   value: 'Node.js · Express · PostgreSQL (Neon) · Redis (Upstash)' },
  { label: 'AI',        value: 'OpenAI GPT-4o · Whisper (voice search) · Vision API (photo advisor)' },
  { label: 'Media',     value: 'Cloudinary CDN — image + video storage, processing, optimisation' },
  { label: 'Payments',  value: 'Razorpay — subscriptions, listing boost, V4 transaction fees' },
  { label: 'Calling',   value: 'Twilio Voice + WhatsApp Business API (60-second callbacks & follow-ups)' },
  { label: 'Deploy',    value: 'Vercel (frontend) · Railway (backend) · Neon (database)' },
];

const FEATURES_18 = [
  'Saved Listings','Compare Tool','Price Alerts','Voice Search',
  'Listing Videos','EOI E-Signature','Commission Calc','Follow-up Sequences',
  'Document Vault','Market Intelligence','Neighbourhood Score','AVM Valuation',
  'Lead Scoring','Photo Advisor','AI Chat','NRI Mode','EMI Calculator','Featured + Reviews',
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-5 sm:px-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: 'radial-gradient(circle, var(--border2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-teal/5 blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[rgba(24,212,200,0.08)] border border-[rgba(24,212,200,0.2)] rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-teal">About QR Estate</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[var(--white)] leading-[1.1] mb-5" style={{ fontFamily: 'var(--font-syne)' }}>
            Built for Indian Agents.<br />
            <span className="text-gradient-gold">Built to Close Deals.</span>
          </h1>
          <p className="text-[16px] text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
            India has 7 lakh+ registered real estate agents. Most share property details over WhatsApp — blurry photos, unclear pricing, zero follow-up. QR Estate was built to change that.
          </p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-6 text-center" style={{ fontFamily: 'var(--font-mono)' }}>Our Story</div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 space-y-4 text-[15px] text-[var(--muted)] leading-[1.8]">
            <p>We started with one idea: every property listing should have its own QR code. Scan it, see everything — no app, no login, no friction.</p>
            <p>From that grew a complete platform. 18 features across buyer experience, agent tools, market intelligence, and AI-powered deal closing. From 60-second Twilio callbacks to GPT-4o photo analysis to a full document vault with access-controlled downloads.</p>
            <p>QR Estate is not a portal like MagicBricks or 99acres. We don't aggregate listings and sell leads back to agents. We give agents the tools to own their buyer relationships — with professional QR-linked pages, AI insights, and automation that works while they sleep.</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 px-5 sm:px-8 bg-[var(--bg2)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-teal mb-3" style={{ fontFamily: 'var(--font-mono)' }}>What We Believe</div>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border2)] transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}12`.replace('var(', '').replace(')', ''), border: `1px solid ${color}` + '25' }}>
                  <Icon size={18} style={{ color }} strokeWidth={1.8} />
                </div>
                <h3 className="text-[14px] font-bold text-[var(--white)] mb-2" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h3>
                <p className="text-[12.5px] text-[var(--muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 18 Features strip ── */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-purple mb-3" style={{ fontFamily: 'var(--font-mono)' }}>V3 Platform</div>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>18 Features. One Platform.</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {FEATURES_18.map((f, i) => (
              <span key={f} className="px-3 py-1.5 rounded-full border border-[var(--border)] text-[11px] text-[var(--muted)] hover:border-[var(--border2)] hover:text-[var(--white)] transition-colors cursor-default" style={{ fontFamily: 'var(--font-mono)' }}>
                F{String(i + 1).padStart(2, '0')} · {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="py-16 px-5 sm:px-8 bg-[var(--bg2)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Technology</div>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Built on Modern Infrastructure</h2>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            {STACK.map(({ label, value }, i) => (
              <div key={label} className={`flex flex-col sm:flex-row gap-3 sm:gap-6 px-6 py-4 ${i < STACK.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[var(--dim)] sm:w-20 flex-shrink-0 sm:pt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{label}</span>
                <span className="text-[12.5px] text-[var(--muted)]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-5 sm:px-8 text-center">
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold text-[var(--white)] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Ready to close more deals?</h2>
        <p className="text-[var(--muted)] mb-8 text-[15px]">5 free listings. No credit card. RERA-ready in minutes.</p>
        <Link href="/auth/register">
          <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[var(--bg)] text-[14px]" style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)', fontFamily: 'var(--font-syne)' }}>
            Start Free — 5 Listings →
          </button>
        </Link>
      </section>
    </main>
  );
}
