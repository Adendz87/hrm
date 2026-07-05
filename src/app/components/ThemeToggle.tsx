"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex cursor-pointer items-center justify-center rounded-full bg-white py-2 text-zinc-800 transition-all duration-200 hover:bg-zinc-100 focus:outline-none dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
      aria-label="Toggle theme"
    >
      {isDark ? (
        // cleaner sun icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 text-amber-500"
        >
          <path d="M12 2.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3.5a.75.75 0 01.75-.75zm0 14.5a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5zm8.5-6a.75.75 0 010 1.5H19a.75.75 0 010-1.5h1.5zm-15.5 0a.75.75 0 010 1.5H3.5a.75.75 0 010-1.5H5zm11.657-5.157a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.061l-1.06-1.06a.75.75 0 010-1.061zm-10.374 10.374a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.061l-1.06-1.06a.75.75 0 010-1.061zm12.495 1.06a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.061l1.06 1.06a.75.75 0 010 1.061zM7.343 7.343a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.061l1.06 1.06a.75.75 0 010 1.061zM12 19a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 19z" />
        </svg>
      ) : (
        // moon icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4 text-indigo-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      )}
    </button>
  );
}