"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Waves } from "@/components/home/Decor";
import { EVENT } from "@/config/event";

/**
 * The `has-intro` class is set on <html> by an inline script in the document
 * head before first paint (see layout.tsx), so this overlay is already visible
 * when the page first renders and the site never flashes underneath it.
 */
export default function IntroPreloader() {
  const [done, setDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("has-intro")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intro was skipped by the head script
      setDone(true);
      return;
    }

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("has-intro");
        setDone(true);
      },
    });

    tl.fromTo(logoRef.current, { scale: 0.6, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "back.out(1.8)" })
      .fromTo(
        contentRef.current?.querySelectorAll("[data-stagger]") ?? [],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
        "-=0.3"
      )
      .to(
        counter,
        {
          val: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (pctRef.current) pctRef.current.textContent = String(Math.round(counter.val));
          },
        },
        "-=0.2"
      )
      .to(barRef.current, { width: "100%", duration: 1.4, ease: "power2.inOut" }, "<")
      .to(contentRef.current, { opacity: 0, y: -20, scale: 0.96, duration: 0.4, ease: "power2.in" }, "+=0.15")
      .to(topRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1")
      .to(bottomRef.current, { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<");

    return () => {
      tl.kill();
      document.documentElement.classList.remove("has-intro");
    };
  }, []);

  if (done) return null;

  return (
    <div role="status" aria-label="Loading Pragyam 2.0" className="intro fixed inset-0 z-[100] overflow-hidden">
      <div ref={topRef} className="intro-panel intro-top" />
      <div ref={bottomRef} className="intro-panel intro-bottom" />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div ref={logoRef} className="relative flex items-center justify-center opacity-0 mb-3">
          {/* IIT Bombay Techfest-inspired dashing white semicircle loading ring */}
          <div className="pointer-events-none absolute -inset-8 sm:-inset-10 flex items-center justify-center">
            <svg
              className="h-full w-full animate-[spin_2.2s_linear_infinite]"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <filter id="tf-white-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary Glowing White Semicircle (180-deg arc) */}
              <path
                d="M 24 100 A 76 76 0 0 1 176 100"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#tf-white-glow)"
              />

              {/* Leading glowing node at semicircle tip */}
              <circle
                cx="176"
                cy="100"
                r="3.5"
                fill="#ffffff"
                filter="url(#tf-white-glow)"
              />

              {/* Concentric Dashed White Semicircle Arc (dashing tech detail) */}
              <path
                d="M 14 100 A 86 86 0 0 1 186 100"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
                filter="url(#tf-white-glow)"
              />
            </svg>
          </div>

          {/* Secondary counter-rotating fine dashed telemetry arc */}
          <div className="pointer-events-none absolute -inset-5 sm:-inset-7 flex items-center justify-center">
            <svg
              className="h-full w-full animate-[spin_4s_linear_infinite_reverse]"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 36 100 A 64 64 0 0 1 164 100"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
                strokeDasharray="4 8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Ambient fiery orange glow behind the logo */}
          <div className="absolute inset-1 rounded-full bg-orange-500/25 blur-xl animate-pulse" />

          {/* Clean Central Metallic 3D P Badge - 100% transparent background, no outer circle border */}
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center">
            <Image
              src="/images/pragyam-p-mark.png"
              alt="Pragyam 2.0"
              width={120}
              height={120}
              priority
              className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]"
            />
          </div>
        </div>
        <p data-stagger className="font-display text-5xl leading-none text-ink opacity-0 sm:text-7xl">
          Pragyam <span className="text-orange">2.0</span>
        </p>
        <div data-stagger className="opacity-0">
          <Waves className="h-3 w-40 text-orange" />
        </div>
        <div data-stagger className="mt-2 h-1.5 w-56 overflow-hidden rounded-sm bg-ink/10 opacity-0">
          <div ref={barRef} className="h-full w-0 bg-orange" />
        </div>
        <p data-stagger className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-ink opacity-0">
          Loading <span ref={pctRef}>0</span>%
        </p>
        <p data-stagger className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/55 opacity-0">
          {EVENT.dateShort} · CURAJ
        </p>
      </div>
    </div>
  );
}
