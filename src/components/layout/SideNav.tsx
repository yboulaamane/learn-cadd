import { ChapterList } from "./ChapterList";

export function SideNav() {
  return (
    <nav
      aria-label="Course modules"
      className="scrollbar-autohide sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-border py-6 pr-4 lg:block"
    >
      <ChapterList />
    </nav>
  );
}
