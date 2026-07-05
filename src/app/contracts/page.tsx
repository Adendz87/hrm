"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { contracts } from "@/mock/contracts";
import { FileText, Plus } from "lucide-react";

export default function ContractsPage() {
  return (
    <AppShell title="Quản lý hợp đồng" description="Xem hợp đồng đang hiệu lực, gia hạn và tình trạng tài liệu tại một nơi.">
      <Card>
        <SectionHeader title="Hợp đồng đang hiệu lực" description="Danh sách mẫu sẵn sàng cho việc gia hạn và tải lên tài liệu." action={<Button><Plus className="mr-2 h-4 w-4" />Tải lên hợp đồng</Button>} />
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><FileText className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{contract.employee}</p>
                  <p className="text-sm text-zinc-500">{contract.title}</p>
                </div>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                <p>Hết hạn {contract.end}</p>
                <p className="text-xs text-zinc-500">Từ {contract.start}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{contract.status}</Badge>
                <Button variant="ghost">Gia hạn</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
