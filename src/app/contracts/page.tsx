"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, EmptyState, LoadingState, SectionHeader } from "@/components/ui/blocks";
import { createContract, getContracts, getUsers } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { ContractRecord, ContractType, CreateContractParams, UserRecord } from "@/lib/types";
import { Calendar, Download, FileCheck, FileText, Plus, Search, Upload, User, X } from "lucide-react";

const CONTRACT_TYPE_LABELS: Record<ContractType, { label: string; color: string }> = {
  OFFICIAL: { label: "Chính thức", color: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300" },
  PROBATION: { label: "Thử việc", color: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300" },
  INTERN: { label: "Thực tập", color: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300" },
  FIXED_TERM: { label: "Xác định thời hạn", color: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300" },
  INDEFINITE: { label: "Vô thời hạn", color: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300" },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Hiệu lực", color: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300" },
  EXPIRING: { label: "Sắp hết hạn", color: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300" },
  EXPIRED: { label: "Đã hết hạn", color: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300" },
  DRAFT: { label: "Nháp", color: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300" },
  TERMINATED: { label: "Đã chấm dứt", color: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300" },
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState<Omit<CreateContractParams, "file">>({
    employee_id: "",
    contract_number: "",
    contract_name: "",
    type: "PROBATION",
    salary: 10000000,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    signed_date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [contractList, userList] = await Promise.all([
        getContracts().catch(() => []),
        getUsers().catch(() => []),
      ]);
      setContracts(contractList);
      setUsers(userList);
    } catch {
      setError("Không thể tải danh sách hợp đồng hoặc nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getUser()) return;
    loadData();
  }, []);

  const handleAutoGenerateContractNumber = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    setForm((prev) => ({ ...prev, contract_number: `HD-${year}-${randomCode}` }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employee_id || !form.contract_number || !form.contract_name || !form.start_date || !form.end_date) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc (Nhân viên, Mã HĐ, Tên HĐ, Ngày bắt đầu & Ngày kết thúc).");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const created = await createContract({
        ...form,
        salary: Number(form.salary),
        file: selectedFile,
      });

      setSuccess("Tạo hợp đồng thành công!");
      setContracts((prev) => [created, ...prev]);
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
        setSelectedFile(null);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo hợp đồng thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contract_number?.toLowerCase().includes(search.toLowerCase()) ||
      contract.contract_name?.toLowerCase().includes(search.toLowerCase()) ||
      (contract.employee?.name && contract.employee.name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === "ALL" || contract.type === filterType;

    return matchesSearch && matchesType;
  });

  const formatCurrency = (val?: number | null) => {
    if (val == null) return "Chưa cập nhật";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  if (loading) return <LoadingState label="Đang tải danh sách hợp đồng..." />;

  return (
    <AppShell
      title="Quản lý hợp đồng"
      description="Xem hợp đồng đang hiệu lực, gia hạn và tình trạng tài liệu tại một nơi."
    >
      {/* ─── Header Action & Search Bar ─────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo số HĐ, tên HĐ hoặc nhân viên..."
              className="w-full rounded-2xl border border-zinc-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:focus:ring-indigo-950/50"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200"
          >
            <option value="ALL">Tất cả loại hợp đồng</option>
            <option value="OFFICIAL">Chính thức (OFFICIAL)</option>
            <option value="PROBATION">Thử việc (PROBATION)</option>
            <option value="INTERN">Thực tập (INTERN)</option>
            <option value="FIXED_TERM">Xác định thời hạn (FIXED_TERM)</option>
            <option value="INDEFINITE">Vô thời hạn (INDEFINITE)</option>
          </select>
        </div>
      </div>

      {/* ─── Contracts Card ─────────────────────────────────────────────────── */}
      <Card>
        <SectionHeader
          title="Hợp đồng đang hiệu lực"
          description="Danh sách hợp đồng lao động đã tạo và tải lên hệ thống."
          action={
            <Button onClick={() => { setError(""); setOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Tải lên hợp đồng
            </Button>
          }
        />

        {filteredContracts.length === 0 ? (
          <EmptyState
            title="Chưa có hợp đồng nào"
            description="Hãy nhấn nút 'Tải lên hợp đồng' để tạo và đính kèm file hợp đồng mới."
          />
        ) : (
          <div className="space-y-3">
            {filteredContracts.map((contract) => {
              const typeInfo = CONTRACT_TYPE_LABELS[contract.type] || { label: contract.type, color: "border-zinc-200 bg-zinc-50" };
              const statusInfo = STATUS_LABELS[contract.status] || { label: contract.status, color: "border-zinc-200 bg-zinc-50" };
              const empName = contract.employee?.name || "Nhân viên chưa đặt tên";

              return (
                <div
                  key={contract.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 transition hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3 min-w-[260px]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                          {contract.contract_number}
                        </span>
                        <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                      </div>
                      <p className="font-semibold text-zinc-900 dark:text-white line-clamp-1">
                        {contract.contract_name}
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <User className="h-3 w-3" /> {empName}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(contract.salary)}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> Từ {formatDate(contract.start_date)} đến {formatDate(contract.end_date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    {contract.file_url ? (
                      <a
                        href={contract.file_url.startsWith("http") ? contract.file_url : `http://localhost:8000/${contract.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Tải file
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Đang tải file...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ─── Popup Modal Tải lên Hợp đồng ───────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Tải lên & Tạo Hợp đồng mới
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Nhập thông tin hợp đồng và tải lên file đính kèm (PDF/DOCX).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nhân viên <span className="text-rose-500">*</span>
                <select
                  value={form.employee_id}
                  onChange={(e) => setForm((prev) => ({ ...prev, employee_id: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  required
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.employee_code || u.email})
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mã hợp đồng <span className="text-rose-500">*</span>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={form.contract_number}
                      onChange={(e) => setForm((prev) => ({ ...prev, contract_number: e.target.value }))}
                      placeholder="VD: HD-2026-001"
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAutoGenerateContractNumber}
                      title="Sinh mã ngẫu nhiên"
                    >
                      Sinh mã
                    </Button>
                  </div>
                </label>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Loại hợp đồng <span className="text-rose-500">*</span>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as ContractType }))}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="PROBATION">PROBATION (Thử việc)</option>
                    <option value="OFFICIAL">OFFICIAL (Chính thức)</option>
                    <option value="INTERN">INTERN (Thực tập)</option>
                    <option value="FIXED_TERM">FIXED_TERM (Xác định thời hạn)</option>
                    <option value="INDEFINITE">INDEFINITE (Không xác định thời hạn)</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Tên hợp đồng <span className="text-rose-500">*</span>
                  <input
                    type="text"
                    value={form.contract_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, contract_name: e.target.value }))}
                    placeholder="Hop dong thu viec Nguyen Van A"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mức lương (VNĐ) <span className="text-rose-500">*</span>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={(e) => setForm((prev) => ({ ...prev, salary: e.target.value }))}
                    placeholder="10000000"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ngày bắt đầu <span className="text-rose-500">*</span>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ngày kết thúc <span className="text-rose-500">*</span>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ngày ký
                  <input
                    type="date"
                    value={form.signed_date || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, signed_date: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  />
                </label>
              </div>

              {/* ─── File Attachment Input ───────────────────────────────────── */}
              <div className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                File hợp đồng (PDF / DOC / DOCX)
                <div className="mt-2 flex flex-col gap-2">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-4 text-sm font-medium text-indigo-700 hover:bg-indigo-100/60 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300 transition">
                    <Upload className="h-5 w-5" />
                    <span>{selectedFile ? selectedFile.name : "Nhấn để chọn file tài liệu..."}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <div className="flex items-center justify-between text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                      <span className="truncate">File đã chọn: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button type="button" onClick={() => setSelectedFile(null)} className="text-rose-500 hover:underline">Xóa file</button>
                    </div>
                  )}
                </div>
              </div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Ghi chú
                <textarea
                  value={form.note || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                  rows={2}
                  placeholder="Hop dong thu viec 2 thang..."
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang tạo & tải hợp đồng..." : "Tạo & Tải lên hợp đồng"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
