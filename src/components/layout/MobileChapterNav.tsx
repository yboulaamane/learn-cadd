"use client";

import { useEffect, useState } from "react";
import { ChapterList } from "./ChapterList";
import { useHideOnScroll } from "./useHideOnScroll";

export function MobileChapterNav() {
  const [open, setOpen] = useState(false);
  const hidden = useHideOnScroll();

  // Close on ESC.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chapter list"
        aria-expanded={open}
        className={`fixed left-2 top-1.5 z-[55] flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-transform duration-200 hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden ${
          hidden && !open ? "-translate-y-[calc(100%+0.375rem)]" : "translate-y-0"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close chapter list"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-course-nav-title"
            className="absolute bottom-0 left-0 top-0 w-80 max-w-[88vw] overflow-y-auto border-r border-border bg-background py-5 pr-4 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between pl-3">
              <div>
                <p id="mobile-course-nav-title" className="font-extrabold text-slate-950">Course modules</p>
                <p className="text-xs text-slate-600">Choose any lesson</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chapter list"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ChapterList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
