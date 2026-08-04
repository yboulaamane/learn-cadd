export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-1 px-4 py-6 text-sm leading-relaxed text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>
          Learn CADD — created and maintained by{" "}
          <a
            href="https://yboulaamane.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-blue-700 hover:decoration-blue-400"
          >
            Yassir Boulaamane
          </a>
          .
        </p>
        <p>Educational content for computational drug discovery.</p>
      </div>
    </footer>
  );
}
