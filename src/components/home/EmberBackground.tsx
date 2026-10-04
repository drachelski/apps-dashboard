'use client';

import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { REDUCED_MOTION_QUERY, usePrefersReducedMotion } from '@/lib/useMediaQueryMatch';

const PARTICLE_COUNT = 60;
const MAX_DPR = 2;
// RGB triplets: brand purple, gold, light gold
const PALETTE = ['142, 68, 196', '245, 181, 36', '255, 214, 120'];
const STATIC_BG = [
  'radial-gradient(ellipse at 50% 100%, rgba(142,68,196,0.35), transparent 60%)',
  'radial-gradient(ellipse at 80% 20%, rgba(245,181,36,0.12), transparent 50%)',
].join(', ');

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  color: string;
}

function spawn(width: number, height: number, anywhere: boolean): Particle {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : height + 10,
    r: 0.8 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * 0.3,
    vy: 0.2 + Math.random() * 0.6,
    phase: Math.random(),
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
  };
}

export function EmberBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check matchMedia directly too: the hook reports false on the very first render.
    if (reducedMotion || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const pointer = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles = Array.from({ length: PARTICLE_COUNT }, () => spawn(width, height, true));

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.y -= p.vy;
        p.x += p.vx + pointer.x * 0.15 * p.r;
        p.phase += 0.004;
        if (p.y < -10 || p.x < -10 || p.x > width + 10) particles[i] = spawn(width, height, false);
        const alpha = 0.35 + 0.35 * Math.sin(p.phase * Math.PI * 2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.shadowBlur = 8 * p.r;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.arc(p.x, p.y + pointer.y * 4 * p.r, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!frame && inView && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });

    observer.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return (
    <Box
      aria-hidden
      sx={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundImage: STATIC_BG }}
    >
      <canvas
        ref={canvasRef}
        data-testid="ember-canvas"
        style={{ width: '100%', height: '100%', display: reducedMotion ? 'none' : 'block' }}
      />
    </Box>
  );
}
