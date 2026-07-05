"use client";

import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { profile } from "@/mock/profile";
import { Camera, KeyRound, UserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <AppShell title="Hồ sơ của bạn" description="Quản lý sở thích cá nhân và bảo mật trong không gian làm việc hiện đại.">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-semibold text-white">AL</div>
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">{profile.name}</p>
              <p className="text-sm text-zinc-500">{profile.role}</p>
              <Badge className="mt-2">{profile.location}</Badge>
            </div>
          </div>
          <div className="mt-5 rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
            <div className="flex items-center gap-2"><Camera className="h-4 w-4 text-indigo-500" /> Avatar upload ready</div>
            <p className="mt-2">{profile.bio}</p>
            <Button className="mt-4">Upload avatar</Button>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Bảo mật" description="Cập nhật thông tin đăng nhập với sự tự tin cao." />
          <div className="space-y-4">
            <div className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white"><UserRound className="h-4 w-4" /> Thông tin liên hệ</div>
              <p className="mt-2 text-sm text-zinc-500">{profile.email}</p>
              <p className="text-sm text-zinc-500">{profile.phone}</p>
            </div>
            <div className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white"><KeyRound className="h-4 w-4" /> Mật khẩu</div>
              <p className="mt-2 text-sm text-zinc-500">Thay đổi mật khẩu thường xuyên để giữ tài khoản an toàn.</p>
              <Button className="mt-4">Đổi mật khẩu</Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
