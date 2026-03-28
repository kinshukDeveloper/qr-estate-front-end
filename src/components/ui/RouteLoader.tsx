'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/* ─────────────────────────────────────────────────────────────────────────────
   TopBarLoader — thin gradient progress bar at the very top of the viewport.
   Automatically triggers on every Next.js route change via usePathname().
   ───────────────────────────────────────────────────────────────────────────── */
export function TopBarLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  const run = useCallback(() => {
    clear();
    setProgress(0);
    setVisible(true);

    // Fast start, slow middle, instant end
    timerRef.current.push(setTimeout(() => setProgress(25),  50));
    timerRef.current.push(setTimeout(() => setProgress(50), 200));
    timerRef.current.push(setTimeout(() => setProgress(72), 500));
    timerRef.current.push(setTimeout(() => setProgress(90), 900));
    timerRef.current.push(setTimeout(() => {
      setProgress(100);
      timerRef.current.push(setTimeout(() => { setVisible(false); setProgress(0); }, 350));
    }, 1300));
  }, []);

  useEffect(() => { run(); return clear; }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none">
      <div
        style={{
          height: '100%',
          width:  `${progress}%`,
          background: 'linear-gradient(90deg, #18D4C8, #E8B84B, #18D4C8)',
          backgroundSize: '200% 100%',
          boxShadow: '0 0 12px rgba(24,212,200,0.6), 0 0 4px rgba(232,184,75,0.4)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          animation: 'shimmer 2s linear infinite',
        }}
      />
      {/* Glow dot at tip */}
      <div
        style={{
          position: 'absolute',
          right: `${100 - progress}%`,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#E8B84B',
          boxShadow: '0 0 8px 2px rgba(232,184,75,0.8)',
          transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PageTransitionOverlay — full-screen dark overlay that appears briefly
   when navigating between pages, creating a cinematic cut effect.
   ───────────────────────────────────────────────────────────────────────────── */
export function PageTransitionOverlay() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'hidden' | 'in' | 'out'>('hidden');
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    setPhase('in');
    const t1 = setTimeout(() => setPhase('out'), 120);
    const t2 = setTimeout(() => setPhase('hidden'), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname]);

  if (phase === 'hidden') return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(24,212,200,0.04), rgba(7,9,13,0.7))',
        opacity: phase === 'in' ? 1 : 0,
        transition: phase === 'out' ? 'opacity 0.38s ease' : 'opacity 0.08s ease',
      }}
    />
  );
}
