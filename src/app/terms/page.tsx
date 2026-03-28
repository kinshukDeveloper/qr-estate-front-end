import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms & Conditions — QR Estate' };

const SECTIONS = [
  {
    title: '1. Definitions',
    list: [
      'Platform: The QR Estate website, agent dashboard, mobile experience, and API at qrestate.in.',
      'Agent: A registered real estate professional or agency with an active QR Estate account.',
      'Buyer: Any person accessing property pages via QR codes, direct links, or the search feature.',
      'Listing: A property entry created and managed by an agent on the platform.',
      'QR Code: The unique, scannable code generated for each listing that links to the property page.',
    ],
  },
  {
    title: '2. Eligibility',
    body: 'To create an agent account, you must be at least 18 years old and legally authorised to carry out real estate transactions in your state. Agents are strongly encouraged to include their RERA registration number — it is displayed on all buyer-facing property pages and verified by QR Estate on a best-effort basis. QR Estate does not independently verify RERA registrations; accuracy is the agent\'s sole responsibility.',
  },
  {
    title: '3. Agent Responsibilities',
    list: [
      'All listing information — price, area, amenities, location, legal status — must be accurate and not misleading to buyers.',
      'Documents uploaded to the Document Vault must be authentic. Uploading forged documents is a criminal offence under the Indian Penal Code and may result in immediate account termination and referral to law enforcement.',
      'EOI (Expression of Interest) signatures collected via the platform are not legally binding sale agreements. A valid sale agreement requires proper stamp duty, notarisation, and sub-registrar registration.',
      'Agents must obtain written consent from property owners before listing properties they do not personally own.',
      'The Commission Calculator provides estimates based on publicly available stamp duty rates. Always verify exact amounts with a qualified legal advisor before advising clients.',
      'Follow-up sequences (F08) must only be sent to buyers who have interacted with your listings. Sending unsolicited messages violates our anti-spam policy and applicable TRAI regulations.',
    ],
  },
  {
    title: '4. Subscription Plans and Payments',
    list: [
      'Free Plan: 5 active listings. Basic QR generation. No AI features. No credit card required.',
      'Pro Plan (₹999/month): Unlimited listings, all AI features, analytics, document vault, EOI, follow-ups. Auto-renews monthly. Cancel anytime — no refund for the current billing period.',
      'Agency Plan (₹4,999/month): All Pro features + team management (unlimited agents), white-label branding, Portal API access. Same cancellation policy as Pro.',
      'Featured Boost: One-time payment per listing promotion (₹499–₹2,499). Non-refundable once the listing has been promoted.',
      'All payments are processed by Razorpay. QR Estate does not store card, UPI, or net banking credentials.',
      'GST at 18% is applicable on all subscription and boost payments as per Indian tax law.',
    ],
  },
  {
    title: '5. AI Features — Disclaimers',
    list: [
      'AVM Valuation (F12): AI-generated property valuations are estimates based on comparable data. They are not professional appraisals and must not be used as the sole basis for sale or purchase decisions without independent verification.',
      'AI Chat (F15): The AI assistant provides general information based on listing data. It may make errors. Always verify critical facts directly with the agent.',
      'Lead Scoring (F13): AI lead scores are probabilistic and may be inaccurate. Agents should use their own judgment and not solely rely on scores.',
      'Photo Advisor (F14): AI photo feedback is for improvement guidance only and does not constitute professional real estate photography advice.',
      'Voice Search (F04): Voice search results are AI-parsed and may not perfectly match spoken intent. Always verify search results.',
    ],
  },
  {
    title: '6. Document Vault (F09)',
    body: 'QR Estate provides document storage as a convenience tool for real estate professionals.',
    list: [
      'We are not responsible for the legal validity, authenticity, or completeness of documents uploaded by agents.',
      'We are not liable for any disputes arising from document access, approval, or download.',
      'Buyers who receive approved document access must not share, redistribute, publish, or use documents for any purpose other than their own property evaluation without express written consent from the agent.',
      'Agents should maintain independent backups of all documents. Deletion of an account removes all associated documents.',
    ],
  },
  {
    title: '7. White-label and Agency Plan',
    body: 'Agency Plan subscribers may brand their QR Estate-powered property pages with their own logo, colors, and domain. The underlying platform technology, code, and infrastructure remain the exclusive property of QR Estate Technologies Pvt. Ltd. White-label agreements do not transfer any intellectual property rights to the agency.',
  },
  {
    title: '8. Portal API',
    body: 'API keys (F07 — Portal API) grant programmatic access to your listings and leads. You are responsible for keeping API keys secure. QR Estate is not liable for unauthorised access resulting from exposed keys. Rate limits apply per key. Exceeding rate limits may result in temporary suspension of API access.',
  },
  {
    title: '9. Intellectual Property',
    list: [
      'QR Estate owns all platform code, design, branding, trademarks, and the QR Estate name and logo.',
      'Agents retain full ownership of their listing content and uploaded media.',
      'By uploading content to the platform, agents grant QR Estate a non-exclusive, royalty-free, worldwide licence to display, reproduce, and distribute it solely for the purpose of providing the platform services.',
      'This licence terminates when the content is deleted from the platform.',
    ],
  },
  {
    title: '10. Prohibited Uses',
    list: [
      'Listing properties you are not authorised to sell or rent.',
      'Creating fake listings, fake buyer enquiries, or fake reviews.',
      'Automated or scripted access to the platform beyond the documented API.',
      'Using AI-generated content (titles, descriptions) without review — you are responsible for accuracy.',
      'Harvesting buyer contact data from the platform for purposes other than the specific listing interaction.',
      'Using the platform to facilitate money laundering, benami transactions, or any other illegal property transactions.',
    ],
  },
  {
    title: '11. Limitation of Liability',
    body: 'QR Estate is a technology platform. We are not a party to any property transaction and have no role in the negotiation, execution, or registration of any sale or rental.',
    list: [
      'We are not liable for disputes between buyers and agents arising from listings or transactions.',
      'We are not liable for financial loss arising from inaccurate listing information, AI outputs, or market intelligence data.',
      'We are not liable for delays in government processes (stamp duty, sub-registrar registration, mutation) even if our V4 document tools are used to prepare for them.',
      'Our maximum total liability to any agent for any claim is limited to the total subscription fees paid by that agent in the 3 months preceding the claim.',
    ],
  },
  {
    title: '12. Termination',
    body: 'QR Estate may suspend or permanently terminate accounts that violate these Terms, without prior notice, for serious violations (document fraud, spam, illegal activity). For minor violations, we will typically issue a warning before suspension. Agents may delete their account at any time by contacting support@qrestate.in. Listing data is soft-deleted immediately and permanently purged within 30 days.',
  },
  {
    title: '13. Governing Law and Disputes',
    body: 'These Terms are governed by the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of courts in Chandigarh, Punjab. We encourage resolving disputes through our support team at legal@qrestate.in before initiating legal proceedings.',
  },
  {
    title: '14. Changes to These Terms',
    body: 'We will notify registered agents by email at least 7 days before material changes to these Terms take effect. The effective date at the top of this page reflects the last update. Continued use of the platform after the effective date constitutes acceptance of the updated Terms.',
  },
  {
    title: '15. Contact',
    body: 'Legal queries: legal@qrestate.in\nQR Estate Technologies Pvt. Ltd.\nSector 17, Chandigarh — 160017, Punjab, India',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">

      {/* ── Hero ── */}
      <section className="pt-32 pb-12 px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[rgba(232,184,75,0.08)] border border-[rgba(232,184,75,0.2)] rounded-full px-4 py-1.5 mb-6">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">Legal</span>
        </div>
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--white)] mb-3" style={{ fontFamily: 'var(--font-syne)' }}>Terms &amp; Conditions</h1>
        <p className="font-mono text-[11px] text-[var(--dim)]" style={{ fontFamily: 'var(--font-mono)' }}>Effective: March 2026 · Governing law: India · Jurisdiction: Chandigarh</p>
      </section>

      {/* ── Highlight box ── */}
      <section className="pb-6 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[rgba(232,184,75,0.06)] border border-[rgba(232,184,75,0.2)] rounded-2xl px-6 py-4">
            <p className="text-[13px] text-[var(--white)] leading-relaxed">
              By creating a QR Estate account or using the platform in any capacity, you agree to these Terms. Please read them carefully — they govern the relationship between QR Estate Technologies Pvt. Ltd. and every agent, agency, and buyer who uses our services.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="pb-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {SECTIONS.map(({ title, body, list }) => (
            <div key={title} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
              <h2 className="text-[15px] font-bold text-[var(--gold)] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h2>
              {body && <p className="text-[13px] text-[var(--muted)] leading-relaxed whitespace-pre-line mb-3">{body}</p>}
              {list && (
                <ul className="space-y-2.5">
                  {list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--muted)] leading-relaxed">
                      <span className="text-[var(--gold)] flex-shrink-0 mt-0.5 font-bold" style={{ fontFamily: 'var(--font-mono)' }}>→</span>
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
