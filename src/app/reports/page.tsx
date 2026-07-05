"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/blocks";
import { reportSummary } from "@/mock/reports";
import { BarChart3, FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <AppShell title="Báo cáo" description="Xem các chỉ số nhân sự quan trọng và bản tổng hợp sẵn sàng xuất file.">
      <div className="grid gap-4 md:grid-cols-3">
        {reportSummary.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><BarChart3 className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-zinc-500">{item.detail}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge>{item.tone}</Badge>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300"><FileText className="h-4 w-4" /> Xuất file</div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
