"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useHideOnScroll } from "./useHideOnScroll";

export function SiteHeader() {
  const hidden = useHideOnScroll();
  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:bg-black dark:supports-[backdrop-filter]:bg-black transition-transform duration-200 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } lg:!translate-y-0`}
    >
      <div className="mx-auto flex h-14 max-w-[90rem] items-center pl-16 pr-4 sm:pr-6 lg:px-6">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 font-semibold tracking-tight text-foreground focus-visible:rounded-md"
        >
          <span className="text-base md:text-lg">
            Learn CADD
          </span>
        </Link>
        <nav aria-label="Utility navigation" className="ml-auto flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 sm:gap-3">
          <a
            href="https://github.com/yboulaamane/learn-cadd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center transition-colors hover:text-foreground focus-visible:rounded-md"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
