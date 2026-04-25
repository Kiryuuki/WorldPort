"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about-section" },
  { name: "Work", href: "/work" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const GlassNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] px-10 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
        WP<span className="text-accent">.</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 glass px-8 py-3 rounded-full">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-white ${
                isActive ? "text-white" : "text-white/40"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold tracking-widest text-white/30">
          <span className="text-white">EN</span>
          <span>FR</span>
          <span>PH</span>
        </div>
        <Link
          href="/contact"
          className="px-6 py-2 glass text-white text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-white hover:text-background transition-all"
        >
          LET'S TALK
        </Link>
      </div>
    </nav>
  );
};

export default GlassNav;
