"use client";

import Link from "next/link";
import { useHideOnScroll } from "./useHideOnScroll";

export function SiteHeader() {
  const hidden = useHideOnScroll();
  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-transform duration-200 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } lg:!translate-y-0`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center pl-14 pr-6 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground">
          <span className="text-lg">Computational Drug Discovery Course</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6 text-sm text-slate-600">
          <a
            href="https://github.com/yassir/cadd-course"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
