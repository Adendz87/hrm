"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { accounts } from "@/mock/accounts";
import { Plus, Shield } from "lucide-react";

export default function AccountsPage() {
  return (
    <AppShell title="Quản lý tài khoản" description="Điều phối vai trò, quyền truy cập và phân quyền một cách rõ ràng.">
      <Card>
        <SectionHeader title="Quyền truy cập" description="Quản lý vai trò tài khoản và các quyền nhạy cảm." action={<Button><Plus className="mr-2 h-4 w-4" />Tạo tài khoản</Button>} />
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><Shield className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{account.name}</p>
                  <p className="text-sm text-zinc-500">{account.role}</p>
                </div>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">{account.permissions.join(" • ")}</div>
              <Badge>{account.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
