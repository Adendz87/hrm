"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
}

export default function PageHeader({
  title,
  description,
  badge = "Bản demo trực tiếp",
}: PageHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-zinc-200/70 bg-white/75 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/75"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Bộ công cụ HRM
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
          {badge}
        </div>
      </div>
    </motion.section>
  );
}