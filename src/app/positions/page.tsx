"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { positions } from "@/mock/positions";
import { Plus } from "lucide-react";

export default function PositionsPage() {
  return (
    <AppShell title="Quản lý vị trí" description="Xây dựng mô hình vận hành bằng bản thiết kế vai trò hiện đại.">
      <Card>
        <SectionHeader title="Vị trí đang mở" description="Bề mặt nhẹ, sẵn sàng cho tuyển dụng và thiết kế tổ chức." action={<Button><Plus className="mr-2 h-4 w-4" />Thêm vị trí</Button>} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {positions.map((position) => (
            <div key={position.id} className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{position.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{position.department}</p>
                </div>
                <Badge>{position.level}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
                <span>{position.type}</span>
                <Button variant="ghost">Quản lý</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
