"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { navLinks, profile } from "@/data";
import Magnetic from "./Magnetic";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-white/[0.06] bg-ink/70 backdrop-blur-xl"
          : "border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-mist"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          {profile.name}
        </a>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-sm text-mist-100 transition-colors hover:text-mist"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <Magnetic className="ml-2">
            <a
              href={profile.resume}
              download="Sachin_Singh_Resume.pdf"
              data-cursor="Download"
              className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-4 py-1.5 text-sm font-medium text-signal transition-colors hover:bg-signal hover:text-ink"
            >
              Resume
              <Download className="h-3.5 w-3.5" />
            </a>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
