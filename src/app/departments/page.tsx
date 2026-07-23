"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, EmptyState, LoadingState, SectionHeader } from "@/components/ui/blocks";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { DepartmentRecord } from "@/lib/types";
import { Compass, Plus, X } from "lucide-react";

const emptyForm = { code: "", name: "", description: "", is_active: true };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DepartmentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!getUser()) return;

    const loadDepartments = async () => {
      setLoading(true);
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch {
        setError("Không thể tải danh sách phòng ban.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handleOpenEdit = (department: DepartmentRecord) => {
    setEditTarget(department);
    setForm({
      code: department.code,
      name: department.name,
      description: department.description ?? "",
      is_active: Boolean(department.is_active),
    });
    setError("");
  };

  const handleCloseEdit = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
  };

  // ─── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.code || !form.name) {
      setError("Vui lòng nhập mã phòng ban và tên phòng ban.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const created: DepartmentRecord = await createDepartment({
        code: form.code,
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      });

      setDepartments((prev) => [created, ...prev]);
      setForm(emptyForm);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo phòng ban thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTarget) return;
    if (!form.code || !form.name) {
      setError("Vui lòng nhập mã phòng ban và tên phòng ban.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const updated = await updateDepartment(editTarget.id, {
        code: form.code,
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      });

      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editTarget.id
            ? { ...d, ...updated, headcount: d.headcount, lead: d.lead }
            : d,
        ),
      );
      handleCloseEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật phòng ban thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editTarget) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phòng ban “${editTarget.name}”?`)) return;

    setSubmitting(true);
    setError("");

    try {
      await deleteDepartment(editTarget.id);
      setDepartments((prev) => prev.filter((d) => d.id !== editTarget.id));
      handleCloseEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa phòng ban thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Shared form fields ────────────────────────────────────────────────────
  const DepartmentFormFields = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Mã phòng ban
          <input
            value={form.code}
            onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="HR001"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tên phòng ban
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="Phòng Nhân sự"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Mô tả
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
          placeholder="Quản lý tuyển dụng, đào tạo và chế độ nhân viên"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        Hoạt động
      </label>
    </>
  );

  return (
    <AppShell title="Quản lý phòng ban" description="Giữ cấu trúc tổ chức rõ ràng, gọn gàng và dễ phát triển.">
      {departments.length === 0 ? (
        <EmptyState
          title="Chưa có phòng ban nào"
          description="Hãy tạo phòng ban đầu tiên để bắt đầu tổ chức nhân sự."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <Card key={department.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-500">{department.code}</p>
                  <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">{department.name}</h3>
                  {department.description ? (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{department.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge>{department.headcount ?? 0} người</Badge>
                  {department.is_active ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      Ngừng hoạt động
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                Trưởng nhóm: <span className="font-medium">{department.lead ?? "Chưa phân công"}</span>
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Compass className="h-4 w-4" /> Tập trung vào đội nhóm
                </div>
                <Button variant="ghost" onClick={() => handleOpenEdit(department)}>Chỉnh sửa</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-4">
        <SectionHeader
          title="Tạo phòng ban"
          description="Soạn cấu trúc đội nhóm mới rõ ràng và có mục tiêu."
          action={
            <Button onClick={() => { setForm(emptyForm); setError(""); setOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Phòng ban mới
            </Button>
          }
        />
      </Card>

      {/* ─── Modal: Tạo mới ──────────────────────────────────────────────── */}
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

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
                  {error}
                </div>
              ) : null}
              <DepartmentFormFields />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang lưu..." : "Lưu phòng ban"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* ─── Modal: Chỉnh sửa ────────────────────────────────────────────── */}
      {editTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Chỉnh sửa phòng ban</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Cập nhật thông tin phòng ban <span className="font-medium">{editTarget.name}</span>.</p>
              </div>
              <button type="button" onClick={handleCloseEdit} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
                  {error}
                </div>
              ) : null}
              <DepartmentFormFields />
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={submitting}
                  onClick={handleDelete}
                  className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                >
                  Xóa phòng ban
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleCloseEdit}>Hủy</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Đang cập nhật..." : "Cập nhật"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
