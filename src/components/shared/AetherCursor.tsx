"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor with aetherial glow trail that follows mouse movement.
 * On mobile, it does nothing.
 */
export default function AetherCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hovered = false;

    const TRAIL_COUNT = 6;
    const trails: { x: number; y: number; el: HTMLDivElement }[] = [];
    const container = dot.parentElement!;

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const el = document.createElement("div");
      el.className = "aether-trail";
      el.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9998;
        width: ${8 + i * 2}px; height: ${8 + i * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,122,26,${0.38 - i * 0.05}), transparent 70%);
        transform: translate(-50%, -50%);
        opacity: ${0.65 - i * 0.08};
        transition: opacity 0.3s;
      `;
      container.appendChild(el);
      trails.push({ x: mx, y: my, el });
      trailsRef.current.push(el);
    }

    const loop = () => {
      dx += (mx - dx) * 0.2;
      dy += (my - dy) * 0.2;
      rx += (mx - rx) * 0.08;
      ry += (my - ry) * 0.08;

      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${hovered ? 1.6 : 1})`;

      for (let i = 0; i < trails.length; i++) {
        const t = trails[i];
        const speed = 0.06 - i * 0.007;
        t.x += (mx - t.x) * speed;
        t.y += (my - t.y) * speed;
        t.el.style.left = `${t.x}px`;
        t.el.style.top = `${t.y}px`;
      }

      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, select, textarea, .interactive")) {
        hovered = true;
        ring.style.borderColor = "rgba(255, 122, 26, 0.85)";
        ring.style.boxShadow = "0 0 24px rgba(255, 122, 26, 0.45)";
      }
    };

    const onLeave = () => {
      hovered = false;
      ring.style.borderColor = "rgba(255, 122, 26, 0.5)";
      ring.style.boxShadow = "0 0 14px rgba(255, 122, 26, 0.25)";
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onEnter, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
      trails.forEach((t) => t.el.remove());
    };
  }, []);

  return (
    <div aria-hidden className="aether-cursor-wrap">
      <div
        ref={dotRef}
        className="aether-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#ff9a3d",
          boxShadow: "0 0 12px rgba(255, 122, 26, 0.9)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ringRef}
        className="aether-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 122, 26, 0.5)",
          boxShadow: "0 0 14px rgba(255, 122, 26, 0.25)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, box-shadow 0.3s",
        }}
      />
    </div>
  );
}
