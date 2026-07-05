"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { rewardsData } from "@/mock/rewards";
import { Plus, ShieldCheck } from "lucide-react";

export default function RewardsPage() {
  return (
    <AppShell title="Khen thưởng và kỷ luật" description="Đánh giá tiến bộ và xử lý các tình huống theo hướng thấu hiểu và có hệ thống.">
      <Card>
        <SectionHeader title="Hồ sơ" description="Danh sách rõ ràng, có cấu trúc để quản lý khen thưởng và kỷ luật nhân viên." action={<Button><Plus className="mr-2 h-4 w-4" />Tạo hồ sơ</Button>} />
        <div className="space-y-3">
          {rewardsData.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{item.employee}</p>
                  <p className="text-sm text-zinc-500">{item.detail}</p>
                </div>
              </div>
              <Badge>{item.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
