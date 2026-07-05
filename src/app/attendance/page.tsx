"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { attendanceData, attendanceTable } from "@/mock/attendance";
import { CheckCircle2, Clock3, Plus } from "lucide-react";

export default function AttendancePage() {
  return (
    <AppShell title="Theo dõi chấm công" description="Giám sát hiện diện, đúng giờ và nhịp làm việc hàng ngày một cách mượt mà.">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <SectionHeader title="Chấm công tuần" description="Tổng quan nhẹ về xu hướng đúng giờ." />
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {attendanceData.map((item) => (
              <div key={item.day} className="rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.day}</p>
                <p className="mt-2 text-xs text-zinc-500">Present {item.present}%</p>
                <p className="text-xs text-zinc-500">Late {item.late}%</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Check-in" description="Hành động nhanh cho bản ghi chấm công hôm nay." action={<Button><Plus className="mr-2 h-4 w-4" />Check-in</Button>} />
          <div className="rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bạn đã sẵn sàng cho hôm nay.</div>
            <div className="mt-2 flex items-center gap-2"><Clock3 className="h-4 w-4 text-indigo-500" /> Đánh giá tiếp theo lúc 16:00.</div>
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <SectionHeader title="Chấm công hôm nay" description="Bảng xem nhanh để rà soát dễ dàng." />
        <div className="space-y-2">
          {attendanceTable.map((entry) => (
            <div key={entry.name} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <p className="font-medium text-zinc-900 dark:text-white">{entry.name}</p>
              <p className="text-sm text-zinc-500">{entry.checkIn}</p>
              <Badge>{entry.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
