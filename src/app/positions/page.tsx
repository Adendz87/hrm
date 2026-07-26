"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, EmptyState, LoadingState, SectionHeader } from "@/components/ui/blocks";
import { createRole, deleteRole, getRoles, updateRole } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { RoleRecord } from "@/lib/types";
import { Plus, Power, Shield, Trash2, X } from "lucide-react";

export default function PositionsPage() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Form tạo vai trò mới
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    is_active: true,
  });

  // State chỉnh sửa vai trò (Quản lý)
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [editForm, setEditForm] = useState({
    code: "",
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (!getUser()) return;

    const loadRoles = async () => {
      setLoading(true);
      try {
        const data = await getRoles();
        setRoles(data);
      } catch {
        setError("Không thể tải danh sách vai trò / vị trí.");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!getUser()) {
      setError("Bạn cần đăng nhập trước khi thực hiện.");
      return;
    }

    if (!form.code || !form.name) {
      setError("Vui lòng nhập đầy đủ mã và tên vai trò.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const created = await createRole({
        code: form.code,
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      });

      setRoles((prev) => [created, ...prev]);
      setForm({ code: "", name: "", description: "", is_active: true });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo vai trò thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (role: RoleRecord) => {
    setError("");
    setEditingRole(role);
    setEditForm({
      code: role.code,
      name: role.name,
      description: role.description || "",
      is_active: role.is_active,
    });
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingRole) return;

    if (!editForm.code || !editForm.name) {
      setError("Vui lòng nhập đầy đủ mã và tên vai trò.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const updated = await updateRole(editingRole.id, {
        code: editForm.code,
        name: editForm.name,
        description: editForm.description,
        is_active: editForm.is_active,
      });

      setRoles((prev) =>
        prev.map((item) => (item.id === editingRole.id ? { ...item, ...updated } : item))
      );
      setEditingRole(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật vai trò thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (role: RoleRecord) => {
    setActionLoadingId(role.id);
    setError("");
    try {
      const updated = await updateRole(role.id, {
        is_active: !role.is_active,
      });

      setRoles((prev) =>
        prev.map((item) => (item.id === role.id ? { ...item, is_active: updated.is_active } : item))
      );

      if (editingRole?.id === role.id) {
        setEditingRole((prev) => (prev ? { ...prev, is_active: updated.is_active } : null));
        setEditForm((prev) => ({ ...prev, is_active: updated.is_active }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thay đổi trạng thái thất bại.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteRole = async (role: RoleRecord) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.name}" không?`)) {
      return;
    }

    setActionLoadingId(role.id);
    setError("");
    try {
      await deleteRole(role.id);
      setRoles((prev) => prev.filter((item) => item.id !== role.id));
      if (editingRole?.id === role.id) {
        setEditingRole(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa vai trò thất bại.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AppShell
      title="Quản lý vị trí & Vai trò"
      description="Xây dựng mô hình vận hành và phân quyền bằng bản thiết kế vai trò hiện đại."
    >
      <Card>
        <SectionHeader
          title="Danh sách vai trò & vị trí"
          description="Các vị trí và vai trò đã được thiết lập trong hệ thống."
          action={
            <Button onClick={() => { setError(""); setOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm vai trò mới
            </Button>
          }
        />

        {error && !open && !editingRole ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        {roles.length === 0 ? (
          <EmptyState
            title="Chưa có vai trò nào"
            description="Hãy bấm vào nút trên để tạo vai trò đầu tiên cho hệ thống."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-indigo-500" />
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {role.code}
                        </p>
                      </div>
                      <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-white">
                        {role.name}
                      </h3>
                    </div>
                    {role.is_active ? (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge className="border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
                        Ngừng hoạt động
                      </Badge>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {role.description || "Chưa có mô tả"}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-200/50 pt-3 dark:border-zinc-800/50">
                  <div className="flex items-center gap-1.5">
                    {/* Button Bật/Tắt ngoài card */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(role)}
                      disabled={actionLoadingId === role.id}
                      title={role.is_active ? "Tắt hoạt động" : "Bật hoạt động"}
                      className={`p-1.5 rounded-lg border transition ${
                        role.is_active
                          ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950"
                          : "border-zinc-200 text-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>

                    {/* Button Xóa ngoài card */}
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(role)}
                      disabled={actionLoadingId === role.id}
                      title="Xóa vai trò"
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(role)}>
                    Quản lý
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── Modal Thêm Vai Trò (Create Role) ────────────────────────────────────────── */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Thêm vai trò / vị trí mới
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Nhập thông tin vai trò mới để gửi lên hệ thống.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mã vai trò (Code)
                  <input
                    value={form.code}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, code: event.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                    placeholder="HR"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Tên vai trò (Name)
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                    placeholder="Human Resources"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Mô tả (Description)
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                  placeholder="Quản lý nhân sự"
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                Kích hoạt (Active)
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang lưu..." : "Lưu vai trò"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* ─── Popup Quản lý / Chỉnh sửa Vai Trò (Edit Role Modal) ──────────────── */}
      {editingRole ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Quản lý vai trò
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Cập nhật thông tin vai trò hoặc bật/tắt, xóa vai trò khỏi hệ thống.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-5 space-y-4">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mã vai trò (Code)
                  <input
                    value={editForm.code}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, code: event.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Tên vai trò (Name)
                  <input
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Mô tả (Description)
                <textarea
                  value={editForm.description}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </label>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(event) =>
                      setEditForm((prev) => ({
                        ...prev,
                        is_active: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Kích hoạt (Active)
                </label>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  onClick={() => handleDeleteRole(editingRole)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Xóa vai trò
                </Button>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRole(null)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang lưu..." : "Cập nhật vai trò"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
