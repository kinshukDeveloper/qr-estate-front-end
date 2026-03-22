'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const QUOTES = [
  { text: 'I put QR codes on 20 hoardings in Powai. In 2 weeks I got 140 scans and 18 enquiries. Closed 3 deals.', name: 'Rakesh Sharma', role: 'Agent · Mumbai', rating: 5 },
  { text: 'My clients can scan and forward the link on WhatsApp. The property page loads in 1 second. Really impressive.', name: 'Deepa Nair', role: 'Agent · Bengaluru', rating: 5 },
  { text: 'The team workspace is a game changer. All 8 agents in my office use it. Leads go to the right person instantly.', name: 'Anand Mehta', role: 'Agency Owner · Delhi NCR', rating: 5 },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 border-t border-brand-border bg-brand-surface">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="font-mono text-[10px] font-bold tracking-[3px] text-brand-teal uppercase">What agents say</div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-brand-border">
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.name}
              className="bg-brand-bg p-8 relative group overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -4, backgroundColor: 'rgba(0,212,200,0.02)' }}
            >
              {/* Big quote mark */}
              <motion.div
                className="absolute top-4 right-5 opacity-[0.04]"
                whileHover={{ opacity: 0.08, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Quote size={60} className="text-brand-teal" />
              </motion.div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: q.rating }).map((_, si) => (
                  <motion.div
                    key={si}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 + si * 0.06, type: 'spring', stiffness: 400 }}
                  >
                    <Star size={13} className="text-brand-gold fill-brand-gold" />
                  </motion.div>
                ))}
              </div>

              <p className="text-brand-gray-light leading-relaxed mb-6 text-sm relative z-10">
                &ldquo;{q.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 bg-brand-card border border-brand-border flex items-center justify-center font-bold text-sm text-brand-teal flex-shrink-0">
                  {q.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{q.name}</div>
                  <div className="text-brand-gray text-xs font-mono mt-0.5">{q.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
