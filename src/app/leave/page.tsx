"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { leaveRecords } from "@/mock/leave";
import { CalendarRange, Plus } from "lucide-react";

export default function LeavePage() {
  return (
    <AppShell title="Quản lý nghỉ phép" description="Xem đơn nghỉ, phê duyệt và lịch sử số ngày phép một cách dễ dàng.">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeader title="Đơn gần đây" description="Dữ liệu mẫu cho việc duyệt và theo dõi trạng thái." action={<Button><Plus className="mr-2 h-4 w-4" />Nộp đơn nghỉ</Button>} />
          <div className="space-y-3">
            {leaveRecords.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><CalendarRange className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">{item.employee}</p>
                    <p className="text-sm text-zinc-500">{item.type} • {item.range}</p>
                  </div>
                </div>
                <Badge>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Approval detail" description="A focused summary for the next decision." />
          <div className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
            <p className="font-semibold text-zinc-900 dark:text-white">Đang chờ: Nico Chen</p>
            <p className="mt-2">Đơn nghỉ ốm đã được nộp hôm qua kèm ghi chú từ quản lý.</p>
            <Button className="mt-4">Xem xét đơn</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
