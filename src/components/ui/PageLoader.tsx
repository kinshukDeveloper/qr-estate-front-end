'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * PageLoader — immersive 3D loading screen with QR particle field.
 * Renders a canvas-based particle animation that assembles into a QR pattern.
 * Auto-dismisses after content loads.
 */

interface PageLoaderProps {
  /** If false, starts fade-out. Controls from parent via route change. */
  loading?: boolean;
}

export function PageLoader({ loading = true }: PageLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const [visible, setVisible] = useState(true);
  const [fading,  setFading]  = useState(false);

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // QR grid target positions (7×7 finder pattern + data)
    const GRID = 28;
    const CELL = Math.min(W, H) * 0.012;
    const GAP  = CELL * 1.4;
    const offsetX = W / 2 - (GRID * GAP) / 2;
    const offsetY = H / 2 - (GRID * GAP) / 2;

    // Which cells are filled (QR-like pattern)
    const FILLED = new Set<string>();
    const fillRect = (x: number, y: number, w: number, h: number) => {
      for (let dx = 0; dx < w; dx++)
        for (let dy = 0; dy < h; dy++)
          FILLED.add(`${x + dx},${y + dy}`);
    };
    // Finder patterns
    fillRect(0, 0, 7, 7);
    fillRect(21, 0, 7, 7);
    fillRect(0, 21, 7, 7);
    // Inner fill
    for (let x = 2; x < 5; x++) for (let y = 2; y < 5; y++) FILLED.delete(`${x},${y}`);
    for (let x = 23; x < 26; x++) for (let y = 2; y < 5; y++) FILLED.delete(`${x},${y}`);
    for (let x = 2; x < 5; x++) for (let y = 23; y < 26; y++) FILLED.delete(`${x},${y}`);
    // Re-add center pixels
    for (let x = 2; x < 5; x++) for (let y = 2; y < 5; y++) FILLED.add(`${x+1},${y+1}`);
    for (let x = 23; x < 26; x++) for (let y = 2; y < 5; y++) FILLED.add(`${x+0},${y+1}`);
    for (let x = 2; x < 5; x++) for (let y = 23; y < 26; y++) FILLED.add(`${x+1},${y+0}`);
    // Timing pattern
    for (let i = 8; i < 21; i += 2) { FILLED.add(`${i},6`); FILLED.add(`6,${i}`); }
    // Random data modules
    const rng = (s: number) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
    for (let x = 8; x < 27; x++)
      for (let y = 8; y < 27; y++)
        if (rng(x * 31 + y * 17) > 0.55) FILLED.add(`${x},${y}`);

    // Build target array
    const targets: { tx: number; ty: number; gold: boolean }[] = [];
    for (let gx = 0; gx < GRID; gx++)
      for (let gy = 0; gy < GRID; gy++)
        if (FILLED.has(`${gx},${gy}`))
          targets.push({
            tx: offsetX + gx * GAP + GAP / 2,
            ty: offsetY + gy * GAP + GAP / 2,
            gold: gx < 7 && gy < 7 || gx >= 21 && gy < 7 || gx < 7 && gy >= 21,
          });

    // Particles — start scattered, converge to QR
    interface Particle {
      x: number; y: number; vx: number; vy: number;
      tx: number; ty: number; size: number;
      gold: boolean; alpha: number; phase: number;
    }
    const particles: Particle[] = targets.map((t) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      tx: t.tx, ty: t.ty, size: CELL * (0.7 + Math.random() * 0.5),
      gold: t.gold, alpha: 0,
      phase: Math.random() * Math.PI * 2,
    }));

    // Extra ambient particles
    const ambient: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 80; i++)
      ambient.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.3 });

    let t = 0;
    const CONVERGENCE_START = 60;
    const CONVERGENCE_SPEED = 0.04;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      grad.addColorStop(0, 'rgba(18,24,32,1)');
      grad.addColorStop(1, 'rgba(7,9,13,1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(30,42,56,0.4)';
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 48) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 48) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      // Ambient particles
      ambient.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(24,212,200,${p.a * 0.5})`;
        ctx.fill();
      });

      // Convergence progress
      const progress = t < CONVERGENCE_START ? 0 : Math.min(1, (t - CONVERGENCE_START) * CONVERGENCE_SPEED);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      particles.forEach((p, i) => {
        // Move toward target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.03 * eased + (Math.random() - 0.5) * 0.1 * (1 - eased);
        p.vy += dy * 0.03 * eased + (Math.random() - 0.5) * 0.1 * (1 - eased);
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.min(1, p.alpha + 0.02);

        const dist = Math.sqrt(dx * dx + dy * dy);
        const settled = dist < 2;
        const pulse = settled ? Math.sin(t * 0.05 + p.phase) * 0.15 + 0.85 : 1;

        const color = p.gold ? `rgba(232,184,75,${p.alpha * pulse})` : `rgba(24,212,200,${p.alpha * 0.85 * pulse})`;

        ctx.fillStyle = color;
        const s = p.size * (settled ? pulse : 1);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);

        // Glow on settled gold particles
        if (settled && p.gold) {
          ctx.shadowColor = 'rgba(232,184,75,0.6)';
          ctx.shadowBlur  = 8;
          ctx.fillStyle   = `rgba(232,184,75,${p.alpha * 0.3})`;
          ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
          ctx.shadowBlur = 0;
        }
      });

      // Center label — appears after convergence
      if (progress > 0.7) {
        const a = (progress - 0.7) / 0.3;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = `700 ${Math.min(W * 0.018, 13)}px 'DM Mono', monospace`;
        ctx.fillStyle = '#E8B84B';
        ctx.letterSpacing = '4px';
        ctx.textAlign = 'center';
        ctx.fillText('QR ESTATE', W / 2, H / 2 + GRID * GAP / 2 + 40);
        ctx.font = `400 ${Math.min(W * 0.012, 10)}px 'DM Mono', monospace`;
        ctx.fillStyle = 'rgba(136,153,170,0.8)';
        ctx.fillText('LOADING YOUR DASHBOARD', W / 2, H / 2 + GRID * GAP / 2 + 58);
        ctx.restore();
      }

      t++;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Fade out when loading becomes false
  useEffect(() => {
    if (!loading && visible) {
      setFading(true);
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading, visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity:    fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
        background: '#07090D',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Scanning line effect */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(24,212,200,0.6), transparent)',
          animation: 'scan-line 2.5s linear infinite',
          boxShadow: '0 0 12px rgba(24,212,200,0.4)',
        }}
      />

      {/* Corner brackets */}
      {[
        'top-6 left-6 border-t-2 border-l-2',
        'top-6 right-6 border-t-2 border-r-2',
        'bottom-6 left-6 border-b-2 border-l-2',
        'bottom-6 right-6 border-b-2 border-r-2',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 ${cls}`}
          style={{ borderColor: 'rgba(232,184,75,0.4)' }}
        />
      ))}
    </div>
  );
}

/**
 * RouteLoader — thin top bar progress indicator on route changes.
 * Drop this once inside DashboardLayout.
 */
export function RouteLoader() {
  const [progress, setProgress] = useState(0);
  const [show,     setShow]     = useState(false);

  useEffect(() => {
    // Simulate progress bar on mount
    setShow(true);
    setProgress(20);
    const t1 = setTimeout(() => setProgress(60),  200);
    const t2 = setTimeout(() => setProgress(85),  500);
    const t3 = setTimeout(() => setProgress(100), 900);
    const t4 = setTimeout(() => setShow(false),  1100);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] h-[2px]">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--gold), var(--teal))',
          boxShadow: '0 0 8px var(--gold)',
        }}
      />
    </div>
  );
}
