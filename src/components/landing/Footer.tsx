'use client';

import { motion } from 'framer-motion';

const COLS = [
  { title: 'Product',  links: ['Features', 'Pricing', 'QR Generator', 'Analytics', 'Team workspace'] },
  { title: 'Company',  links: ['About', 'Blog', 'Careers', 'Press kit'] },
  { title: 'Legal',    links: ['Privacy policy', 'Terms of service', 'RERA compliance'] },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-border px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-4 gap-10 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="w-7 h-7 border-2 border-brand-teal grid grid-cols-2 gap-px p-1.5"
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="bg-brand-teal" />
                <div className="border border-brand-teal" />
                <div className="border border-brand-teal" />
                <div className="bg-brand-teal" />
              </motion.div>
              <span className="font-black text-sm text-white">QR Estate</span>
            </div>
            <p className="text-brand-gray text-xs leading-relaxed mb-4">
              India&apos;s QR-native real estate platform. Built for agents, designed for buyers.
            </p>
            {/* Status dot */}
            <div className="flex items-center gap-2 text-xs text-brand-gray">
              <motion.div
                className="w-2 h-2 bg-brand-green rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              All systems operational
            </div>
          </div>

          {COLS.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + ci * 0.08 }}
            >
              <div className="font-mono text-[10px] font-bold tracking-[2px] text-brand-gray uppercase mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <motion.a
                      href="#"
                      className="text-brand-gray-light text-xs relative group inline-block"
                      whileHover={{ color: '#F0F6FF', x: 3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {l}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-brand-border pt-6 flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="font-mono text-[10px] text-brand-gray">© 2025 QR Estate. Made for Indian real estate agents.</div>
          <div className="font-mono text-[10px] text-brand-gray">Mumbai · Delhi · Bengaluru · Hyderabad</div>
        </motion.div>
      </div>
    </footer>
  );
}
