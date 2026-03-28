import type { Metadata } from 'next';
import Link from 'next/link';
import { QrCode } from 'lucide-react';

export const metadata: Metadata = {
  title: { default: 'QR Estate', template: '%s | QR Estate' },
};

const NAV_LINKS = [
  { label: 'Features',     href: '/#features'    },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Pricing',      href: '/#pricing'      },
  { label: 'About',        href: '/about'         },
];

const FOOTER_LINKS = {
  Product:  [{ label:'Features', href:'/#features' }, { label:'Pricing', href:'/#pricing' }, { label:'API Docs', href:'/dashboard/portal' }],
  Company:  [{ label:'About', href:'/about' }, { label:'Contact', href:'/contact' }, { label:'Blog', href:'/blog' }],
  Legal:    [{ label:'Privacy Policy', href:'/privacy' }, { label:'Terms & Conditions', href:'/terms' }, { label:'Cookie Policy', href:'/cookies' }],
  Support:  [{ label:'Help Centre', href:'/help' }, { label:'Status', href:'https://status.qrestate.in' }, { label:'Email Us', href:'mailto:hello@qrestate.in' }],
};

export default function StaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)' }}>
              <QrCode size={15} className="text-[var(--bg)]" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] tracking-tight text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
              QR<span className="text-gradient-gold">Estate</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href}
                className="px-4 py-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--white)] transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.04)]">
                {label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link href="/auth/login"
              className="hidden sm:block px-4 py-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--white)] transition-colors">
              Sign in
            </Link>
            <Link href="/auth/register">
              <button
                className="px-4 py-2 rounded-xl text-[13px] font-bold text-[var(--bg)]"
                style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)', fontFamily: 'var(--font-syne)' }}
              >
                Start free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="flex-1 mt-16">{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg2)] mt-auto">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">

          {/* Top: brand + links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#F5D280,#E8B84B,#B89030)' }}>
                  <QrCode size={15} className="text-[var(--bg)]" strokeWidth={2.5} />
                </div>
                <span className="text-[15px] tracking-tight text-[var(--white)]" style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}>
                  QR<span className="text-gradient-gold">Estate</span>
                </span>
              </Link>
              <p className="text-[12.5px] text-[var(--muted)] leading-relaxed max-w-[200px]">
                India's QR-native real estate platform. Scan. See. Close.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['RERA-ready','AI-powered','India-first'].map(t => (
                  <span key={t} className="text-[9px] font-mono font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--dim)]"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <div className="font-mono text-[9px] font-black tracking-[0.2em] uppercase text-[var(--dim)] mb-3"
                  style={{ fontFamily: 'var(--font-mono)' }}>
                  {section}
                </div>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href}
                        className="text-[12.5px] text-[var(--muted)] hover:text-[var(--white)] transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]">
            <p className="text-[11px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
              © 2026 QR Estate Technologies Pvt. Ltd. · Chandigarh, India
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>
                CIN: U74999CH2026PTC123456
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                <span className="text-[10px] text-[var(--green)]" style={{ fontFamily: 'var(--font-mono)' }}>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
