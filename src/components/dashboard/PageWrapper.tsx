'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
  actions?: ReactNode;
}

const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
};

export function PageHeader({ eyebrow, title, subtitle, accentColor = 'var(--gold)', actions }: PageHeaderProps) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div
            className="text-[8px] font-black uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2"
            style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}
          >
            <div className="w-4 h-px" style={{ background: accentColor }} />
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-black" style={{ color: 'var(--white)', fontFamily: 'var(--font-syne)' }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--dim)' }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </motion.div>
  );
}

export function PageCard({
  children,
  className = '',
  padding = true,
  accentColor,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  accentColor?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'var(--card)',
        border: `1px solid ${accentColor ? `${accentColor}20` : 'var(--border)'}`,
        ...(accentColor ? { boxShadow: `0 0 30px ${accentColor}06 inset` } : {}),
      }}
    >
      {padding ? <div className="p-5">{children}</div> : children}
    </motion.div>
  );
}

export function SectionLabel({ children, color = 'var(--dim)' }: { children: ReactNode; color?: string }) {
  return (
    <div className="text-[8px] font-black uppercase tracking-[0.2em] mb-1" style={{ color, fontFamily: 'var(--font-mono)' }}>
      {children}
    </div>
  );
}

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      {children}
    </motion.div>
  );
}

export { fadeUp, stagger };
