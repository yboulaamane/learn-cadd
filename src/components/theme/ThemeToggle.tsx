"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const subscribeToMount = () => () => undefined;

function useMounted() {
  return useSyncExternalStore(subscribeToMount, () => true, () => false);
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Toggle color theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={label}
      title={label}
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-600 transition-colors hover:border-slate-200 hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-wait dark:text-slate-300 dark:hover:border-slate-700"
    >
      {isDark ? (
        <Sun className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
      ) : (
        <Moon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
