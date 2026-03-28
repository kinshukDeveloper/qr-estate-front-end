import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, MessageCircle, Headphones, Briefcase } from 'lucide-react';

export const metadata: Metadata = { title: 'Contact — QR Estate' };

const CHANNELS = [
  { icon: Mail,         title: 'General Enquiries',   value: 'hello@qrestate.in',      href: 'mailto:hello@qrestate.in',     color: 'var(--teal)'   },
  { icon: Headphones,   title: 'Technical Support',   value: 'support@qrestate.in',    href: 'mailto:support@qrestate.in',   color: 'var(--blue)'   },
  { icon: Briefcase,    title: 'Partnerships',         value: 'partner@qrestate.in',    href: 'mailto:partner@qrestate.in',   color: 'var(--gold)'   },
  { icon: MessageCircle,title: 'WhatsApp Support',    value: '+91 98765 43210',         href: 'https://wa.me/919876543210',   color: 'var(--green)'  },
];

const FAQS = [
  { q: 'How quickly can I set up a listing with a QR code?', a: 'From signup to a live QR-linked property page takes under 5 minutes. Fill in the listing details, add photos, and your print-ready QR code is generated instantly.' },
  { q: 'Can I use QR Estate without a RERA number?', a: 'Yes. RERA number is optional — adding it builds buyer trust and is displayed on your property pages. It\'s strongly recommended but not mandatory to create an account.' },
  { q: 'Does the AI chat work in Hindi?', a: 'The AI chat (F15) responds in the same language the buyer types in. Voice search (F04) supports Hindi transcript parsing. Regional language property pages (F03) support Hindi, Punjabi, Marathi, and Tamil.' },
  { q: 'What happens when my free plan hits 5 listings?', a: 'You can still view, manage, and share your existing listings. To add more, upgrade to Pro (₹999/month). You can also delete old listings to make room on the free plan.' },
  { q: 'Is the commission calculator legally accurate?', a: 'The calculator uses current state-specific stamp duty and registration fee rates and is regularly updated. It provides estimates — always verify with a legal advisor before advising clients on exact amounts.' },
  { q: 'Can multiple agents in an agency share one account?', a: 'Yes. The Agency plan (₹4,999/month) supports unlimited agents with role-based access: owner, agency admin, agent, and viewer. Each agent gets their own login with access to shared listings and leads.' },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 px-5 sm:px-8 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, var(--border2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold/5 blur-[80px]" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)] rounded-full px-4 py-1.5 mb-6">
            <Mail size={12} className="text-gold" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">Contact Us</span>
          </div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-tight text-[var(--white)] leading-[1.1] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            We&apos;re here to help
          </h1>
          <p className="text-[16px] text-[var(--muted)] leading-relaxed">
            Whether you&apos;re an agent getting started, an agency looking for a team plan, or a developer integrating our API — we respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Contact channels ── */}
      <section className="py-12 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
          {CHANNELS.map(({ icon: Icon, title, value, href, color }) => (
            <a key={title} href={href} target="_blank" rel="noreferrer"
              className="group bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border2)] transition-all flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105" style={{ background: `rgba(0,0,0,0.2)`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[11px] font-black tracking-[0.12em] uppercase text-[var(--dim)] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>{title}</div>
                <div className="text-[14px] font-semibold text-[var(--white)] group-hover:text-[var(--teal)] transition-colors">{value}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Office + hours ── */}
      <section className="py-12 px-5 sm:px-8 bg-[var(--bg2)]">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={16} className="text-teal" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Office</span>
            </div>
            <p className="text-[14px] text-[var(--muted)] leading-relaxed">
              QR Estate Technologies Pvt. Ltd.<br />
              Sector 17, Chandigarh — 160017<br />
              Punjab, India
            </p>
            <p className="text-[12px] text-[var(--dim)] mt-3" style={{ fontFamily: 'var(--font-mono)' }}>CIN: U74999CH2026PTC123456</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={16} className="text-gold" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Business Hours</span>
            </div>
            <div className="space-y-2 text-[13px] text-[var(--muted)]">
              <div className="flex justify-between">
                <span>Monday — Friday</span>
                <span className="text-[var(--white)] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>10am — 7pm IST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="text-[var(--white)] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>10am — 2pm IST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Closed</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--dim)]">Technical support email is monitored 7 days, responses within 24h.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-purple mb-3" style={{ fontFamily: 'var(--font-mono)' }}>Before You Email</div>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-[var(--white)] tracking-tight" style={{ fontFamily: 'var(--font-syne)' }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <details key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden group">
                <summary className="flex items-start justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <span className="text-[13px] font-semibold text-[var(--white)]">{q}</span>
                  <span className="text-[var(--dim)] flex-shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-6 pb-5 border-t border-[var(--border)] pt-4">
                  <p className="text-[13px] text-[var(--muted)] leading-relaxed">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
