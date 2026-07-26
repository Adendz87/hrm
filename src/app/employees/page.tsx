"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingState,
  SectionHeader,
} from "@/components/ui/blocks";
import { getDepartments, getRoles, getUserDetail, getUsers, registerEmployee } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { DepartmentRecord, RoleRecord, UserRecord } from "@/lib/types";
import { employeeFilters } from "@/mock/employees";
import { CalendarDays, Search, Sparkles, UserPlus, X } from "lucide-react";

type EmployeeRow = {
  id: string | number;
  name: string;
  role: string;
  department: string;
  status: string;
  email?: string;
};

const initialForm = {
  employee_code: "",
  name: "",
  gender: "male",
  birthday: "",
  identity_number: "",
  email: "",
  phone: "",
  address: "",
  hire_date: "",
  status: "active",
  password: "",
  department_id: "",
  position: "EMPLOYEE",
  role_id: "",
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "resigned":
      return "Resigned";
    default:
      return status;
  }
};

export default function EmployeesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!getUser()) return;

    const loadData = async () => {
      setLoading(true);

      try {
        const [departmentData, userData, roleData] = await Promise.all([
          getDepartments(),
          getUsers(),
          getRoles(),
        ]);

        setDepartments(departmentData);
        setRoles(roleData);

        setEmployees(
          userData.map((user: UserRecord) => ({
            id: user.id,
            name: user.name,
            role: user.role?.name ?? user.position ?? "EMPLOYEE",
            department:
              departmentData.find(
                (item) => item.id === user.department_id,
              )?.name ?? "Chưa phân công",
            status: getStatusLabel(user.status ?? "active"),
            email: user.email,
          })),
        );
      } catch {
        setError("Không thể tải dữ liệu nhân viên.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const visibleEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesQuery = [employee.name, employee.role, employee.department]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesFilter =
        filter === "Tất cả" ||
        employee.status.toLowerCase() === filter.toLowerCase() ||
        (filter === "Active" && employee.status.toLowerCase() === "active") ||
        (filter === "Inactive" && employee.status.toLowerCase() === "inactive") ||
        (filter === "Pending" && employee.status.toLowerCase() === "pending");

      return matchesQuery && matchesFilter;
    });
  }, [employees, filter, query]);

  const handleOpenDetail = async (employeeId: string | number) => {
    if (!employeeId) {
      return;
    }
    setDetailLoading(true);
    setSelectedUser(null);
    try {
      const detail = await getUserDetail(String(employeeId));
      setSelectedUser(detail);
    } catch {
      setError("Không thể tải chi tiết nhân viên.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.employee_code || !form.name || !form.email || !form.password || !form.department_id || !form.role_id) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc (bao gồm Phòng ban và Vai trò).");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const created = await registerEmployee(
        {
          employee_code: form.employee_code,
          avatar: "https://example.com/avatar.jpg",
          name: form.name,
          gender: form.gender,
          birthday: form.birthday,
          identity_number: form.identity_number,
          email: form.email,
          phone: form.phone,
          address: form.address,
          hire_date: form.hire_date,
          status: form.status,
          password: form.password,
          department_id: form.department_id,
          role_id: form.role_id,
          position: form.position,
        },
      );

      const departmentName = departments.find((item) => item.id === form.department_id)?.name ?? "Chưa phân công";
      const roleName = roles.find((r) => r.id === form.role_id)?.name ?? form.position;

      setEmployees((prev) => [
        {
          id: created.user.id ?? created.user.email,
          name: created.user.name,
          role: roleName,
          department: departmentName,
          status: getStatusLabel(form.status),
          email: created.user.email,
        },
        ...prev,
      ]);
      setForm(initialForm);
      setSuccess("Tạo nhân viên thành công.");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo nhân viên thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AppShell
      title="Quản lý nhân viên"
      description="Quản lý danh sách nhân viên, tìm kiếm, lọc và theo dõi thông tin nhân sự một cách nhanh chóng."
    >
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-zinc-200/70 p-5 dark:border-zinc-800">
            <SectionHeader
              title="Danh sách nhân viên"
              description="Quản lý thông tin nhân viên với dữ liệu mẫu và các thao tác nhanh."
              action={
                <Button onClick={() => setOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Thêm nhân viên
                </Button>
              }
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                <Search className="h-4 w-4" />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm kiếm nhân viên..."
                  className="w-48 bg-transparent outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {employeeFilters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={[
                      "rounded-full px-3 py-2 text-sm transition",
                      filter === item
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-zinc-600 dark:bg-zinc-950/40 dark:text-zinc-300">
                <tr>
                  <th className="px-5 py-3 font-medium">Nhân viên</th>
                  <th className="px-5 py-3 font-medium">Phòng ban</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {visibleEmployees.length ? (
                  visibleEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t border-zinc-200/70 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
                            {employee.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{employee.name}</p>
                            <p className="text-xs text-zinc-500">{employee.role}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">{employee.department}</td>

                      <td className="px-5 py-4">
                        <Badge>{employee.status}</Badge>
                      </td>

                      <td className="px-5 py-4">
                        <Button variant="ghost" onClick={() => handleOpenDetail(employee.id)}>Xem chi tiết</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-6">
                      <EmptyState
                        title="Không tìm thấy nhân viên"
                        description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Thêm nhân viên mới</p>
                <p className="text-sm text-zinc-500">Tạo hồ sơ nhân viên chỉ trong vài phút.</p>
              </div>
            </div>

            <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
              Mở biểu mẫu
            </Button>
          </Card>

          <Card>
            <SectionHeader
              title="Sự kiện sắp diễn ra"
              description="Theo dõi các mốc thời gian quan trọng của nhân viên."
            />

            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2 rounded-2xl bg-zinc-50/70 p-3 dark:bg-zinc-950/40">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                <span>Đánh giá hiệu suất sau 5 ngày</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-zinc-50/70 p-3 dark:bg-zinc-950/40">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                <span>Hoàn thành quy trình hội nhập vào ngày mai</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Chi tiết nhân viên</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Thông tin chi tiết từ API users/detail.</p>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="mt-6 text-sm text-zinc-500">Đang tải thông tin...</div>
            ) : selectedUser ? (
              <div className="mt-6 space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="font-medium">Mã nhân viên:</span> {selectedUser.employee_code}</div>
                  <div><span className="font-medium">Họ tên:</span> {selectedUser.name}</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                  <div><span className="font-medium">Số điện thoại:</span> {selectedUser.phone}</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="font-medium">Giới tính:</span> {selectedUser.gender}</div>
                  <div><span className="font-medium">Ngày sinh:</span> {selectedUser.birthday}</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="font-medium">Ngày tuyển dụng:</span> {selectedUser.hire_date}</div>
                  <div><span className="font-medium">Trạng thái:</span> {selectedUser.status}</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><span className="font-medium">Phòng ban:</span> {selectedUser.department?.name ?? "Chưa phân công"}</div>
                  <div><span className="font-medium">Vị trí:</span> {selectedUser.position}</div>
                </div>
                <div>
                  <span className="font-medium">Địa chỉ:</span> {selectedUser.address}
                </div>
                <div>
                  <span className="font-medium">CCCD/CMND:</span> {selectedUser.identity_number}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Thêm nhân viên</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Nhập thông tin nhân viên mới để đăng ký vào hệ thống.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">{error}</div> : null}
              {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">{success}</div> : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mã nhân viên
                  <input value={form.employee_code} onChange={(event) => setForm((prev) => ({ ...prev, employee_code: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="EMP0001" />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Họ và tên
                  <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="Nguyễn Văn A" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Giới tính
                  <select value={form.gender} onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ngày sinh
                  <input type="date" value={form.birthday} onChange={(event) => setForm((prev) => ({ ...prev, birthday: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  CCCD/CMND
                  <input value={form.identity_number} onChange={(event) => setForm((prev) => ({ ...prev, identity_number: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="012345678901" />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Số điện thoại
                  <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="0987654321" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                  <input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="nhanvien@example.com" />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Mật khẩu
                  <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="Ít nhất 8 ký tự" />
                </label>
              </div>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Địa chỉ
                <textarea value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} rows={3} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="Hà Nội, Việt Nam" />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Phòng ban <span className="text-rose-500">*</span>
                  <select value={form.department_id} onChange={(event) => setForm((prev) => ({ ...prev, department_id: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
                    <option value="">-- Chọn phòng ban --</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>{department.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Vai trò (Role) <span className="text-rose-500">*</span>
                  <select value={form.role_id} onChange={(event) => setForm((prev) => ({ ...prev, role_id: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
                    <option value="">-- Chọn vai trò --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name} ({role.code})</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ngày tuyển dụng
                  <input type="date" value={form.hire_date} onChange={(event) => setForm((prev) => ({ ...prev, hire_date: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" />
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Trạng thái
                  <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="resigned">Nghỉ việc</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Vị trí (Position)
                  <select value={form.position} onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
                    <option value="EMPLOYEE">Employee</option>
                    <option value="LEADER">Leader</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DIRECTOR">Director</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Đang lưu..." : "Lưu nhân viên"}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
