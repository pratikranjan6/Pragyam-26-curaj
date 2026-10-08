"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ResizableNavbar } from "@/components/velora/resizable-navbar";

const ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Check Status", href: "/status" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <ResizableNavbar
      items={ITEMS}
      activeHref={pathname}
      threshold={40}
      compactWidth={760}
      maxWidth={1280}
      label="Main"
      logo={
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-orange-500/40 bg-black/60 shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:border-orange-400 group-hover:shadow-[0_0_18px_rgba(249,115,22,0.7)]">
            <Image
              src="/images/pragyam-p-logo.png"
              alt="Pragyam 2.0"
              width={36}
              height={36}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <span className="leading-none">
            <span className="font-display block text-xl text-white tracking-wide">Pragyam</span>
            <span className="mt-0.5 block text-[8px] font-extrabold uppercase tracking-[0.28em] text-orange">2.0 · Tech Fest</span>
          </span>
        </Link>
      }
    />
  );
}
