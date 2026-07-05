"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { departments as mockDepartments } from "@/mock/departments";
import { createDepartment } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { DepartmentRecord } from "@/lib/types";
import { Compass, Plus, X } from "lucide-react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Array<{ id: string | number; name: string; focus: string; headcount: number; lead: string }>>(mockDepartments as Array<{ id: string | number; name: string; focus: string; headcount: number; lead: string }>);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ code: "", name: "", description: "", is_active: true });

  useEffect(() => {
    setDepartments(mockDepartments);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      setError("Bạn cần đăng nhập trước khi tạo phòng ban.");
      return;
    }

    if (!form.code || !form.name) {
      setError("Vui lòng nhập mã phòng ban và tên phòng ban.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created: DepartmentRecord = await createDepartment({
        code: form.code,
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      }, token);

      setDepartments((prev) => [
        {
          id: created.id,
          name: created.name,
          focus: created.code,
          headcount: 0,
          lead: "Chưa phân công",
        },
        ...prev,
      ]);
      setForm({ code: "", name: "", description: "", is_active: true });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo phòng ban thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Quản lý phòng ban" description="Giữ cấu trúc tổ chức rõ ràng, gọn gàng và dễ phát triển.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => (
          <Card key={department.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-500">{department.focus}</p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{department.name}</h3>
              </div>
              <Badge>{department.headcount} người</Badge>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">Trưởng nhóm: {department.lead}</p>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-500"><Compass className="h-4 w-4" /> Tập trung vào đội nhóm</div>
              <Button variant="ghost">Chỉnh sửa</Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <SectionHeader title="Tạo phòng ban" description="Soạn cấu trúc đội nhóm mới rõ ràng và có mục tiêu." action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Phòng ban mới</Button>} />
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Thêm phòng ban</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Nhập thông tin phòng ban mới để gửi lên hệ thống.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">{error}</div> : null}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mã phòng ban
                  <input value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="HR001" />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Tên phòng ban
                  <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="Phòng Nhân sự" />
                </label>
              </div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Mô tả
                <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="Quản lý tuyển dụng, đào tạo và chế độ nhân viên" />
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                Hoạt động
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu phòng ban"}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
