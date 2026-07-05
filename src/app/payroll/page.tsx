"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { payrollRecords } from "@/mock/payroll";
import { DollarSign, Sparkles } from "lucide-react";

export default function PayrollPage() {
  return (
    <AppShell title="Tổng quan lương" description="Giữ bảng lương, phân tích chi tiết và phê duyệt luôn rõ ràng, dễ kiểm tra.">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeader title="Phân tích lương" description="Xem tổng quan chu kỳ mới nhất và các con số hiển thị." />
          <div className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><DollarSign className="h-5 w-5" /></div>
              <div>
                <p className="text-sm text-zinc-500">Lương ròng</p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-white">$16,940</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300"><Sparkles className="h-4 w-4 text-indigo-500" /> Tự động tính toán bằng dữ liệu mẫu cục bộ.</div>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Danh sách lương" description="Bố cục theo trạng thái để duyệt và xem xét." />
          <div className="space-y-3">
            {payrollRecords.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{item.employee}</p>
                  <p className="text-sm text-zinc-500">{item.period}</p>
                </div>
                <p className="font-semibold text-zinc-900 dark:text-white">{item.net}</p>
                <Badge>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
