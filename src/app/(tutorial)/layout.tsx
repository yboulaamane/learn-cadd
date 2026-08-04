"use client";

import React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SideNav } from "@/components/layout/SideNav";
import { MobileChapterNav } from "@/components/layout/MobileChapterNav";
import { ChapterNav } from "@/components/layout/ChapterNav";
import { curriculum } from "@/lib/curriculum";

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentSlug = pathname ? pathname.split("/").pop() : "";
  const currentIndex = curriculum.findIndex((m) => m.slug === currentSlug);
  const currentModule = currentIndex >= 0 ? curriculum[currentIndex] : null;
  const [readingMode, setReadingMode] = useState<"learn" | "review">("learn");

  const prevModule = currentIndex > 0 ? curriculum[currentIndex - 1] : null;
  const nextModule = currentIndex < curriculum.length - 1 ? curriculum[currentIndex + 1] : null;

  return (
    <div className="mx-auto flex max-w-[90rem]">
      <SideNav />
      <MobileChapterNav />
      <main id="course-content" className="min-w-0 flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-10 xl:px-14">
        <div className="mx-auto w-full max-w-5xl">
          <aside className="mb-7 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                <span>Module {currentIndex + 1} of {curriculum.length}</span>
                {currentModule && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>{currentModule.duration}</span>
                    <span aria-hidden="true">•</span>
                    <span>{currentModule.track === "extension" ? "Applied extension" : "Core curriculum"}</span>
                  </>
                )}
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-label="Course progress"
                aria-valuemin={1}
                aria-valuemax={curriculum.length}
                aria-valuenow={currentIndex + 1}
              >
                <div
                  className="h-full rounded-full bg-blue-600 transition-[width]"
                  style={{ width: `${((currentIndex + 1) / curriculum.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex shrink-0 items-center justify-between gap-3 sm:mt-0 sm:justify-end">
              <span className="text-xs font-bold text-slate-700">Reading view</span>
              <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1" role="group" aria-label="Reading view">
                <button
                  type="button"
                  onClick={() => setReadingMode("learn")}
                  aria-pressed={readingMode === "learn"}
                  title="Larger text, shorter lines, and more spacing"
                  className={`min-h-9 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    readingMode === "learn"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  Learn
                </button>
                <button
                  type="button"
                  onClick={() => setReadingMode("review")}
                  aria-pressed={readingMode === "review"}
                  title="A more compact layout for refreshing concepts"
                  className={`min-h-9 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    readingMode === "review"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  Review
                </button>
              </div>
            </div>
          </aside>

          <article
            data-reading-mode={readingMode}
            className={`course-article w-full max-w-none overflow-x-hidden prose ${
              readingMode === "learn" ? "prose-lg" : "prose-base"
            }`}
          >
            {children}
          </article>
          <ChapterNav prev={prevModule} next={nextModule} />
        </div>
      </main>
    </div>
  );
}
