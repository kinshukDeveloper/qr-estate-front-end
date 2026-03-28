// ──────────────────────────────────────────────────────────────────────────────
// privacy/page.tsx
// ──────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy — QR Estate' };

const SECTIONS = [
  {
    title: '1. Who We Are',
    body: `QR Estate Technologies Pvt. Ltd. ("QR Estate", "we", "us") operates qrestate.in and provides a real estate technology platform for agents, agencies, and property buyers across India. Our registered office is at Sector 17, Chandigarh — 160017, Punjab, India.`,
  },
  {
    title: '2. What Data We Collect',
    list: [
      'Agent accounts: Name, email, phone, RERA number, password (bcrypt-hashed, never stored in plaintext), profile photo.',
      'Listings: Property details, images, videos, and documents uploaded by agents.',
      'Buyers: Phone number and email when submitting enquiries, EOI signatures, or price alert subscriptions. Session tokens for saved listings (no login required — not linked to personal data).',
      'Usage data: QR scan counts, page views, voice search transcripts (anonymised after 30 days).',
      'Payment data: Processed entirely by Razorpay. We do not store card or UPI details.',
      'AI data: Listing content sent to OpenAI for scoring, chat, and photo analysis. No buyer PII is sent to OpenAI.',
    ],
  },
  {
    title: '3. How We Use Your Data',
    list: [
      'Provide, maintain, and improve the QR Estate platform.',
      'Send price drop alerts and automated follow-up sequences (only when explicitly opted into).',
      'Generate anonymised market intelligence reports from aggregated listing data.',
      'Process payments and manage subscriptions.',
      'Comply with RERA regulations and applicable Indian law.',
    ],
  },
  {
    title: '4. Document Vault — Security (F09)',
    body: `Private documents (title deed, NOC, OC, sale agreement) are stored on Cloudinary with access-controlled signed URLs. Buyers can access them only after explicit agent approval via the platform. All access links are time-limited (48-hour default expiry). Every access request and download is logged with timestamp and buyer identifier.`,
  },
  {
    title: '5. Third-Party Data Sharing',
    body: `We do not sell your data to third parties. We share data only with the following service providers, each bound by their own privacy policies:`,
    list: [
      'Cloudinary (Cloudinary Inc.) — media storage, CDN, image/video processing.',
      'OpenAI (OpenAI LLC) — listing content for AI features. No buyer PII shared.',
      'Razorpay (Razorpay Software Pvt. Ltd.) — payment processing.',
      'Twilio (Twilio Inc.) — WhatsApp messages and voice callbacks.',
      'Resend (Resend Inc.) — transactional email (price alerts, follow-ups).',
      'Neon (Neon Inc.) — PostgreSQL database hosting.',
      'Upstash (Upstash Inc.) — Redis caching and session management.',
      'Google LLC — neighbourhood POI data via Places API.',
    ],
  },
  {
    title: '6. Cookies and Session Tokens',
    body: `We use a single authentication cookie (qr_estate_auth) for session management. This is an httpOnly, SameSite=Lax cookie that expires in 7 days. Buyers browsing property pages without logging in receive an anonymous session token to enable saved listings — this is not linked to any personal information. We do not use third-party advertising cookies.`,
  },
  {
    title: '7. AI Features',
    body: `Voice search transcripts (F04) are processed by OpenAI's Whisper API and anonymised within 30 days. AI chat conversations (F15) are not stored beyond 7 days. AI photo analysis (F14) processes image URLs; no raw image data is sent to OpenAI. AI valuation reports (F12) use listing data only — no buyer personal data is included.`,
  },
  {
    title: '8. NRI Buyers',
    body: `If you are accessing QR Estate from outside India, your data is processed and stored in India. Currency conversion (F16) uses ExchangeRate-API and does not store any financial details. NRI callback requests (F16) are stored securely and accessible only to the listing agent.`,
  },
  {
    title: '9. Data Retention',
    list: [
      'Agent account data: Retained while account is active + 90 days after deletion request.',
      'Buyer enquiries and EOI records: Retained 2 years (for agent compliance and dispute resolution).',
      'Voice search logs: Anonymised and purged after 30 days.',
      'Deleted listings: Soft-deleted immediately, removed from public access within 24 hours, purged from database after 1 year.',
      'Price alert subscriptions: Retained until buyer unsubscribes or listing is deleted.',
    ],
  },
  {
    title: '10. Your Rights',
    body: `Under India's Information Technology (Amendment) Act 2008 and the forthcoming DPDP Act 2023, you have the right to access, correct, or delete your personal data. Submit requests to privacy@qrestate.in. We respond within 30 days. Account deletion requests are processed within 7 business days.`,
  },
  {
    title: '11. Security Measures',
    list: [
      'All data transmitted over HTTPS/TLS 1.3.',
      'Passwords hashed with bcrypt (12 salt rounds). Never stored in plaintext.',
      'JWT access tokens expire in 15 minutes. Refresh tokens stored in Redis with 7-day TTL and can be revoked on logout.',
      'Document download links use cryptographically random 256-bit tokens with 48-hour expiry.',
      'Database encrypted at rest by Neon. Backups encrypted.',
    ],
  },
  {
    title: '12. Changes to This Policy',
    body: `We will notify registered agents by email at least 7 days before material changes to this Privacy Policy take effect. The date at the top of this page reflects the last update. Continued use of the platform after the effective date constitutes acceptance.`,
  },
  {
    title: '13. Contact for Privacy',
    body: `For privacy-related queries: privacy@qrestate.in\nQR Estate Technologies Pvt. Ltd., Sector 17, Chandigarh — 160017`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <section className="pt-32 pb-12 px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[rgba(24,212,200,0.08)] border border-[rgba(24,212,200,0.2)] rounded-full px-4 py-1.5 mb-6">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-teal">Legal</span>
        </div>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--white)] mb-3" style={{ fontFamily: 'var(--font-syne)' }}>Privacy Policy</h1>
        <p className="font-mono text-[11px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Last updated: March 2026 · Governing law: India</p>
      </section>

      <section className="pb-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {SECTIONS.map(({ title, body, list }) => (
            <div key={title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <h2 className="text-[15px] font-bold text-[var(--teal)] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h2>
              {body && <p className="text-[13px] text-[var(--muted)] leading-relaxed whitespace-pre-line">{body}</p>}
              {list && (
                <ul className="space-y-2 mt-2">
                  {list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--muted)]">
                      <span className="text-[var(--teal)] flex-shrink-0 mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
