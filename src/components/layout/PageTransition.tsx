"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { scrollToTop } from "@/lib/lenis";

/**
 * Sun-iris page transitions. Clicking an internal link blooms an indigo disc
 * out from the pointer, a marigold sun rises in the middle, the route changes
 * underneath, and once the new page has rendered the iris closes back to the
 * same point. Back/forward navigation skips the iris and relies on the page
 * enter animation in app/template.tsx.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const origin = useRef({ x: 50, y: 50 });
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    const overlay = overlayRef.current;
    const sun = sunRef.current;
    if (!overlay || !sun) return;
    const { x, y } = origin.current;
    gsap
      .timeline({ onComplete: () => gsap.set(overlay, { visibility: "hidden" }) })
      .to(sun, { scale: 0.5, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(overlay, { clipPath: `circle(0% at ${x}% ${y}%)`, duration: 0.7, ease: "power3.inOut" }, "-=0.1");
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      if (pending.current) return;

      const href = url.pathname + url.search;
      pending.current = href;
      router.prefetch(href);

      const overlay = overlayRef.current;
      const sun = sunRef.current;
      if (!overlay || !sun) {
        router.push(href);
        return;
      }

      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      origin.current = { x, y };

      gsap.set(overlay, { visibility: "visible", clipPath: `circle(0% at ${x}% ${y}%)` });
      gsap.set(sun, { scale: 0.5, opacity: 0 });
      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // If the route never resolves (network error, aborted), don't trap the user behind the iris.
            failsafe.current = setTimeout(() => {
              if (pending.current) {
                pending.current = null;
                reveal();
              }
            }, 6000);
          },
        })
        .to(overlay, { clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.75, ease: "power3.inOut" })
        .to(sun, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reveal]);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    if (failsafe.current) clearTimeout(failsafe.current);
    scrollToTop(true);
    reveal();
  }, [pathname, reveal]);

  return (
    <>
      {children}
      <div ref={overlayRef} aria-hidden className="pt-overlay">
        <div ref={sunRef} className="pt-sun relative flex flex-col items-center justify-center">
          {/* IIT Bombay Techfest-inspired dashing white semicircle loading ring */}
          <div className="pointer-events-none absolute -inset-8 flex items-center justify-center">
            <svg
              className="h-full w-full animate-[spin_2s_linear_infinite]"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <filter id="pt-white-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary Glowing White Semicircle (180 deg) */}
              <path
                d="M 24 100 A 76 76 0 0 1 176 100"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#pt-white-glow)"
              />

              {/* Leading glowing white tip */}
              <circle
                cx="176"
                cy="100"
                r="3.5"
                fill="#ffffff"
                filter="url(#pt-white-glow)"
              />

              {/* Concentric Dashed White Semicircle Arc */}
              <path
                d="M 14 100 A 86 86 0 0 1 186 100"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
                filter="url(#pt-white-glow)"
              />
            </svg>
          </div>

          {/* Secondary counter-rotating fine dashed telemetry arc */}
          <div className="pointer-events-none absolute -inset-5 flex items-center justify-center">
            <svg
              className="h-full w-full animate-[spin_3.5s_linear_infinite_reverse]"
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
          <div className="absolute inset-2 rounded-full bg-orange-500/25 blur-2xl animate-pulse" />

          {/* New metallic 3D P badge logo - no outer circle border */}
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center">
            <Image
              src="/images/pragyam-p-mark.png"
              alt="Loading Pragyam 2.0"
              width={120}
              height={120}
              priority
              className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
