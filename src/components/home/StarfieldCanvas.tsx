"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
  drift: number;
}

const COLORS = {
  stars: ["#ffffff", "#fed7aa", "#fde68a", "#ffedd5", "#ff7a1a", "#c4b5fd", "#67e8f9"],
  nebula: [
    "rgba(255, 122, 26, 0.09)",   // solar orange
    "rgba(245, 158, 11, 0.08)",   // amber
    "rgba(139, 92, 246, 0.07)",   // violet
    "rgba(6, 182, 212, 0.06)",    // cyan
    "rgba(236, 72, 153, 0.05)",   // magenta
  ],
};

export default function StarfieldCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let mouse = { x: 0.5, y: 0.5 };
    let smoothMouse = { x: 0.5, y: 0.5 };
    let raf = 0;
    let stars: Star[] = [];
    let nebulae: Nebula[] = [];

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 80 : 200;
    const nebulaCount = isMobile ? 3 : 6;

    function resize() {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function init() {
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        size: 0.5 + Math.random() * 2,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
        color: COLORS.stars[Math.floor(Math.random() * COLORS.stars.length)],
      }));
      nebulae = Array.from({ length: nebulaCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 80 + Math.random() * 200,
        color: COLORS.nebula[Math.floor(Math.random() * COLORS.nebula.length)],
        pulseSpeed: 0.3 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.15,
      }));
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // smooth mouse
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;

      const mx = (smoothMouse.x - 0.5) * 2;
      const my = (smoothMouse.y - 0.5) * 2;
      const t = time * 0.001;

      // Draw nebula clouds
      for (const n of nebulae) {
        const pulse = 1 + Math.sin(t * n.pulseSpeed + n.pulsePhase) * 0.15;
        const ox = mx * 20 * (1 + n.drift);
        const oy = my * 15 * (1 + n.drift);
        const r = n.radius * pulse;

        const grad = ctx.createRadialGradient(
          n.x + ox, n.y + oy, 0,
          n.x + ox, n.y + oy, r
        );
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(n.x + ox - r, n.y + oy - r, r * 2, r * 2);
      }

      // Draw stars
      for (const star of stars) {
        const parallax = star.z * 0.6 + 0.4;
        const sx = star.x + mx * 15 * parallax;
        const sy = star.y + my * 10 * parallax;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * star.twinkleSpeed + star.twinklePhase));
        const size = star.size * twinkle;

        ctx.globalAlpha = twinkle * (0.4 + star.z * 0.6);
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.2) {
          ctx.globalAlpha = twinkle * 0.15;
          ctx.beginPath();
          ctx.arc(sx, sy, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      mouse = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    }

    resize();
    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { resize(); init(); });
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
