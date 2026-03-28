'use client';

import { useEffect, useRef } from 'react';

/**
 * DashboardCanvas — persistent Three.js-style ambient particle field.
 * Renders behind all dashboard content. Very lightweight (no Three.js dep).
 */
export function DashboardCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf = 0;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Star particles
    const STARS = Array.from({ length: 120 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r:  Math.random() * 1.2 + 0.2,
      a:  Math.random() * 0.35 + 0.05,
      gold: Math.random() < 0.15,
    }));

    // Grid nodes (connection points)
    const NODES = Array.from({ length: 25 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Very subtle radial gradient center glow
      const glow = ctx.createRadialGradient(W * 0.6, H * 0.3, 0, W * 0.6, H * 0.3, W * 0.5);
      glow.addColorStop(0, 'rgba(24,212,200,0.025)');
      glow.addColorStop(0.5, 'rgba(232,184,75,0.015)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Move + draw nodes
      NODES.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.pulse += 0.02;
      });

      // Draw connections between close nodes
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const dx = NODES[i].x - NODES[j].x;
          const dy = NODES[i].y - NODES[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const a = (1 - dist / 160) * 0.12;
            ctx.beginPath();
            ctx.moveTo(NODES[i].x, NODES[i].y);
            ctx.lineTo(NODES[j].x, NODES[j].y);
            ctx.strokeStyle = `rgba(24,212,200,${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw node dots
      NODES.forEach((n) => {
        const pulse = Math.sin(n.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(24,212,200,${0.25 * pulse})`;
        ctx.fill();
      });

      // Draw stars
      STARS.forEach((s) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        const twinkle = Math.sin(t * 0.03 + s.x) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(232,184,75,${s.a * twinkle})`
          : `rgba(24,212,200,${s.a * twinkle})`;
        ctx.fill();
      });

      // Subtle horizontal scan line every few seconds
      const scanY = ((t * 0.4) % (H + 100)) - 50;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(24,212,200,0.03)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, W, 60);

      t++;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.65 }}
    />
  );
}
