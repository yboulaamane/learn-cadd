import Link from "next/link";

interface ModuleInfo {
  slug: string;
  title: string;
}

interface ChapterNavProps {
  prev?: ModuleInfo | null;
  next?: ModuleInfo | null;
}

export function ChapterNav({ prev, next }: ChapterNavProps) {
  return (
    <nav className="mt-16 flex flex-col items-stretch gap-3 border-t border-border pt-8 sm:flex-row sm:gap-4">
      {prev ? (
        <Link
          href={`/${prev.slug}`}
          className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:border-accent/40 hover:bg-accent/5"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
            Previous
          </span>
          <p className="mt-1 font-medium text-foreground group-hover:text-accent-dark">
            {prev.title.split(/ — |: /).slice(1).join(": ") || prev.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/${next.slug}`}
          className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:border-accent/40 hover:bg-accent/5 sm:text-right"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-slate-600">
            Next
          </span>
          <p className="mt-1 font-medium text-foreground group-hover:text-accent-dark">
            {next.title.split(/ — |: /).slice(1).join(": ") || next.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
