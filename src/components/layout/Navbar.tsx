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
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
            {/* Ambient orange aura behind the metallic P */}
            <div className="absolute -inset-1 rounded-full bg-orange-500/25 blur-md opacity-70 transition-opacity duration-300 group-hover:opacity-100 group-hover:bg-orange-500/50" />
            <Image
              src="/images/pragyam-p-mark.png"
              alt="Pragyam 2.0"
              width={40}
              height={40}
              priority
              className="relative h-9 w-9 object-contain drop-shadow-[0_0_10px_rgba(249,115,22,0.65)]"
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
