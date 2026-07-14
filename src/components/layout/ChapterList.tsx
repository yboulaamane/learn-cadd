"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { curriculum } from "@/lib/curriculum";

interface ChapterItemProps {
  slug: string;
  title: string;
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
}

function ChapterItem({ slug, title, isActive, label, onNavigate }: ChapterItemProps) {
  const href = `/${slug}`;

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
          isActive
            ? "bg-accent/10 text-accent-dark font-medium"
            : "text-slate-600 hover:text-foreground hover:bg-surface"
        }`}
      >
        <span className="mt-0.5 shrink-0 w-5 text-right font-mono text-xs text-slate-550">
          {label}
        </span>
        <span className="leading-snug">
          {title.split(/ — |: /).slice(1).join(": ") || title}
        </span>
      </Link>
    </li>
  );
}

interface ChapterListProps {
  onNavigate?: () => void;
}

export function ChapterList({ onNavigate }: ChapterListProps) {
  const pathname = usePathname();
  const currentSlug = pathname ? pathname.split("/").pop() : "";

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
        Chapters
      </h2>
      <ul className="space-y-0.5">
        {curriculum.map((ch, index) => (
          <ChapterItem
            key={ch.slug}
            slug={ch.slug}
            title={ch.title}
            isActive={currentSlug === ch.slug}
            label={String(index + 1)}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}
