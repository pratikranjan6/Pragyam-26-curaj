"use client";

import { useEffect, useRef } from "react";

/**
 * Floating luminous orbs that drift around a section, creating an ethereal
 * atmosphere inspired by the Techfest "Aetherial Renaissance" theme.
 */
export default function FloatingOrbs({
  count = 5,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const orbs: HTMLDivElement[] = [];
    const orbColors = [
      { bg: "rgba(255, 122, 26, 0.16)", glow: "rgba(255, 122, 26, 0.35)" },
      { bg: "rgba(245, 158, 11, 0.15)", glow: "rgba(245, 158, 11, 0.3)" },
      { bg: "rgba(255, 90, 0, 0.14)", glow: "rgba(255, 90, 0, 0.3)" },
      { bg: "rgba(139, 92, 246, 0.12)", glow: "rgba(139, 92, 246, 0.25)" },
      { bg: "rgba(6, 182, 212, 0.1)", glow: "rgba(6, 182, 212, 0.2)" },
    ];

    for (let i = 0; i < count; i++) {
      const orb = document.createElement("div");
      const color = orbColors[i % orbColors.length];
      const size = 60 + Math.random() * 140;
      const duration = 15 + Math.random() * 20;
      const delay = -Math.random() * duration;

      orb.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, ${color.bg}, transparent 70%);
        box-shadow: 0 0 ${size * 0.4}px ${color.glow};
        filter: blur(${size * 0.15}px);
        pointer-events: none;
        animation: orb-float-${i} ${duration}s ease-in-out ${delay}s infinite;
        opacity: 0.7;
      `;

      // Create unique keyframes for each orb
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const midX1 = Math.random() * 100;
      const midY1 = Math.random() * 100;
      const midX2 = Math.random() * 100;
      const midY2 = Math.random() * 100;

      const style = document.createElement("style");
      style.textContent = `
        @keyframes orb-float-${i} {
          0% { left: ${startX}%; top: ${startY}%; }
          33% { left: ${midX1}%; top: ${midY1}%; }
          66% { left: ${midX2}%; top: ${midY2}%; }
          100% { left: ${startX}%; top: ${startY}%; }
        }
      `;
      document.head.appendChild(style);
      container.appendChild(orb);
      orbs.push(orb);
    }

    return () => {
      orbs.forEach((o) => o.remove());
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    />
  );
}
