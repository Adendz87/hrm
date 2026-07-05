"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { getUser } from "@/lib/auth";

interface HeaderProps {
  companyName?: string;
  companyDescription?: string;
  userName?: string;
  userAvatar?: string;
}

export default function Header({
  companyName = "Northstar HRM",
  companyDescription = "Không gian vận hành nhân sự hiện đại",
  userName = "Alicia",
  userAvatar = "AL",
}: HeaderProps) {
  const [displayName, setDisplayName] = useState(userName);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser?.name) {
      setDisplayName(storedUser.name);
    }
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-zinc-200/70 bg-white/75 p-3 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/75"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
            HR
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              {companyName}
            </p>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {companyDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white/80 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Search className="h-4 w-4" />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white/80 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300 dark:hover:bg-zinc-800">
            <Bell className="h-4 w-4" />
          </button>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/80 px-3 py-2 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:bg-zinc-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
              {userAvatar}
            </div>

            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {displayName}
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}