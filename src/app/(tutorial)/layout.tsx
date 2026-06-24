"use client";

import React from "react";
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

  const prevModule = currentIndex > 0 ? curriculum[currentIndex - 1] : null;
  const nextModule = currentIndex < curriculum.length - 1 ? curriculum[currentIndex + 1] : null;

  return (
    <div className="mx-auto flex max-w-7xl">
      <SideNav />
      <MobileChapterNav />
      <main className="min-w-0 flex-1 px-6 py-10 lg:px-12">
        <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none w-full overflow-x-hidden">
          {children}
        </article>
        <ChapterNav prev={prevModule} next={nextModule} />
      </main>
    </div>
  );
}
