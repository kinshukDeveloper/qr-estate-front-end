// import type { Metadata } from 'next';
// import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Sign In',
// };

// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen bg-[#080F17] flex flex-col">
//       {/* Top bar */}
//       <div className="flex items-center justify-between px-8 py-5 border-b border-[#1A2D40]">
//         <Link href="/" className="flex items-center gap-3 group">
//           {/* QR icon */}
//           <div className="w-8 h-8 border-2 border-[#00D4C8] flex items-center justify-center">
//             <div className="grid grid-cols-2 gap-0.5">
//               <div className="w-2 h-2 bg-[#00D4C8]" />
//               <div className="w-2 h-2 border border-[#00D4C8]" />
//               <div className="w-2 h-2 border border-[#00D4C8]" />
//               <div className="w-2 h-2 bg-[#00D4C8]" />
//             </div>
//           </div>
//           <span className="font-bold text-white text-base tracking-wide group-hover:text-[#00D4C8] transition-colors">
//             QR Estate
//           </span>
//         </Link>
//         <span className="text-xs text-[#4A6580] tracking-widest uppercase">
//           India&apos;s QR-Native Listing Platform
//         </span>
//       </div>

//       {/* Main content */}
//       <div className="flex items-center justify-center flex-1 px-4 py-12">
//         <div className="w-full max-w-md">
//           {children}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="px-8 py-4 border-t border-[#1A2D40] flex items-center justify-between">
//         <span className="text-xs text-[#4A6580]">© 2026 QR Estate</span>
//         <div className="flex gap-6">
//           <Link href="/privacy" className="text-xs text-[#4A6580] hover:text-white transition-colors">Privacy</Link>
//           <Link href="/terms" className="text-xs text-[#4A6580] hover:text-white transition-colors">Terms</Link>
//           <Link href="/support" className="text-xs text-[#4A6580] hover:text-white transition-colors">Support</Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import type { Metadata } from 'next';
import Link from 'next/link';
import { QrCode } from 'lucide-react';

export const metadata: Metadata = { title: 'QR Estate' };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col overflow-hidden relative">

      {/* ── Ambient background ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border2) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Teal blob top-left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal/5 blur-[100px]" />
        {/* Gold blob bottom-right */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-[100px]" />
        {/* Purple blob center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple/[0.03] blur-[120px]" />
      </div>

      {/* ── Top bar ─── */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #F5D280 0%, #E8B84B 50%, #B89030 100%)' }}
          >
            <QrCode size={16} className="text-[var(--bg)]" strokeWidth={2.5} />
          </div>
          <span
            className="text-[15px] tracking-tight text-[var(--white)]"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800 }}
          >
            QR<span className="text-gradient-gold">Estate</span>
          </span>
        </Link>
        <span
          className="hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--dim)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          India's QR-Native Platform
        </span>
      </header>

      {/* ── Main ─── */}
      <main className="relative z-10 flex items-center justify-center flex-1 px-4 py-10">
        {children}
      </main>

      {/* ── Footer ─── */}
      <footer className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-4 border-t border-[var(--border)]">
        <span
          className="text-[11px] text-[var(--dim)]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          © 2026 QR Estate
        </span>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Support'].map(l => (
            <Link
              key={l}
              href={`/${l.toLowerCase()}`}
              className="text-[11px] text-[var(--dim)] hover:text-[var(--teal)] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {l}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
