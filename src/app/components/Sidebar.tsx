"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  LayoutGrid,
  Settings,
  UserRound,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutGrid },
  { href: "/employees", label: "Nhân viên", icon: UserRound },
  { href: "/departments", label: "Phòng ban", icon: Compass },
  { href: "/positions", label: "Vị trí", icon: BriefcaseBusiness },
  { href: "/contracts", label: "Hợp đồng", icon: BriefcaseBusiness },
  { href: "/attendance", label: "Chấm công", icon: LayoutGrid },
  { href: "/leave", label: "Nghỉ phép", icon: Compass },
  { href: "/payroll", label: "Lương", icon: LayoutGrid },
  { href: "/rewards", label: "Khen thưởng", icon: Bell },
  { href: "/accounts", label: "Tài khoản", icon: Settings },
  { href: "/profile", label: "Hồ sơ", icon: UserRound },
  { href: "/reports", label: "Báo cáo", icon: LayoutGrid },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[270px] border-r border-zinc-200 bg-white/90 px-4 py-5 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="flex h-full flex-col">
        {/* Menu */}
        <nav className="space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>

                <ChevronRight
                  className={`h-4 w-4 ${
                    active ? "opacity-100" : "opacity-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Theme */}
        <div className="mt-6 shrink-0 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Giao diện
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Chuyển sáng/tối
              </p>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}