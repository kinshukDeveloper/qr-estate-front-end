'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

/* ─────────────────────────────────────────────
   useTextScramble
   Scrambles text from noise → final string
   ───────────────────────────────────────────── */
const CHARS = 'アイウエオカキクケコ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';

export function useTextScramble(finalText: string, delay = 0) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = finalText.split('');
    let frame = 0;
    let raf: number;

    const scramble = () => {
      if (!ref.current) return;
      ref.current.textContent = chars
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i <= frame / 2.5) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');
      frame++;
      if (frame < chars.length * 3) {
        raf = requestAnimationFrame(scramble);
      } else if (ref.current) {
        ref.current.textContent = finalText;
      }
    };

    const timer = setTimeout(() => { raf = requestAnimationFrame(scramble); }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [finalText, delay]);

  return ref;
}

/* ─────────────────────────────────────────────
   useCountUp
   Animates a number from 0 to target
   ───────────────────────────────────────────── */
export function useCountUp(to: number, duration = 2, delay = 0) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !ref.current) return;
    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start - delay * 1000) / 1000;
      if (elapsed < 0) { raf = requestAnimationFrame(step); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      if (ref.current) {
        const val = Math.round(eased * to);
        ref.current.textContent = val.toLocaleString('en-IN');
      }
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, to, duration, delay]);

  return ref;
}

/* ─────────────────────────────────────────────
   useMagnetic
   Makes an element magnetically follow cursor
   ───────────────────────────────────────────── */
export function useMagnetic(strength = 0.4) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    };

    const onLeave = () => { x.set(0); y.set(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, x, y]);

  return { ref, springX, springY };
}

/* ─────────────────────────────────────────────
   useParallax
   Returns MotionValue offset based on scroll
   ───────────────────────────────────────────── */
export function useParallax(scrollY: MotionValue<number>, factor = 0.3) {
  return useTransform(scrollY, (v) => v * factor);
}

/* ─────────────────────────────────────────────
   useInView
   Fires callback when element enters viewport
   ───────────────────────────────────────────── */
export function useInView(callback: () => void, threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { callback(); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [callback, threshold]);

  return ref;
}

/* ─────────────────────────────────────────────
   useTilt
   3D tilt effect tracking mouse position within element
   ───────────────────────────────────────────── */
export function useTilt(maxDeg = 8) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 30 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 30 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width  - 0.5;
    const ny = (e.clientY - rect.top)  / rect.height - 0.5;
    rotateY.set(nx * maxDeg * 2);
    rotateX.set(-ny * maxDeg * 2);
  }, [maxDeg, rotateX, rotateY]);

  const onMouseLeave = useCallback(() => {
    rotateX.set(0); rotateY.set(0);
  }, [rotateX, rotateY]);

  return { springRX, springRY, onMouseMove, onMouseLeave };
}
