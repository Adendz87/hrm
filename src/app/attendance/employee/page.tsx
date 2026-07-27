"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { checkInAttendance, checkOutAttendance, createAttendance } from "@/lib/api";
import { getUser } from "@/lib/auth";
import type { AttendancePayload, AttendanceRecord } from "@/lib/types";
import { CalendarClock, CheckCircle2, Clock3, Plus, X } from "lucide-react";

interface ScheduleFormState {
  work_date: string;
  check_in: string;
  check_out: string;
  status: string;
  type: string;
  note: string;
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function toDateOnlyIso(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString();
}

function toDateTimeIso(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0)).toISOString();
}

export default function EmployeeAttendancePage() {
  const currentUser = getUser();
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mySchedules, setMySchedules] = useState<AttendanceRecord[]>([]);
  const [form, setForm] = useState<ScheduleFormState>({
    work_date: formatDateInput(new Date()),
    check_in: "08:00",
    check_out: "17:30",
    status: "PRESENT",
    type: "OFFICE",
    note: "Lịch làm việc của tôi",
  });

  const handleChange = (field: keyof ScheduleFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckIn = async () => {
    if (!currentUser?.id) {
      setError("Vui lòng đăng nhập trước khi check-in.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const created = await checkInAttendance();
      setMySchedules((prev) => [created, ...prev]);
      setMessage("Check-in thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentUser?.id) {
      setError("Vui lòng đăng nhập trước khi check-out.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const created = await checkOutAttendance();
      setMySchedules((prev) => [created, ...prev]);
      setMessage("Check-out thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-out thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser?.id) {
      setError("Vui lòng đăng nhập trước khi tạo lịch làm việc.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload: AttendancePayload = {
        user_id: currentUser.id,
        work_date: toDateOnlyIso(form.work_date),
        check_in: toDateTimeIso(form.work_date, form.check_in),
        check_out: toDateTimeIso(form.work_date, form.check_out),
        status: form.status,
        type: form.type,
        note: form.note,
      };

      const created = await createAttendance(payload);
      setMySchedules((prev) => [created, ...prev]);
      setMessage("Đã tạo lịch làm việc thành công.");
      setOpenModal(false);
      setForm((prev) => ({ ...prev, note: "", check_in: "08:00", check_out: "17:30", status: "PRESENT", type: "OFFICE" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo lịch làm việc thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Check-in nhân viên" description="Ghi nhận check-in và xem lịch làm việc cá nhân.">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionHeader
            title="Check-in hôm nay"
            description="Ghi nhận thời gian bắt đầu làm việc cho hôm nay."
            action={
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void handleCheckIn()} disabled={submitting}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {submitting ? "Đang xử lý..." : "Check-in"}
                </Button>
                <Button variant="outline" onClick={() => void handleCheckOut()} disabled={submitting}>
                  <Clock3 className="mr-2 h-4 w-4" />
                  Check-out
                </Button>
              </div>
            }
          />

          <div className="rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-indigo-500" />
              Bấm nút để ghi nhận thời gian làm việc ngay lập tức.
            </div>
            <div className="mt-2 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-emerald-500" />
              Mỗi lần check-in sẽ được lưu vào lịch làm việc cá nhân của bạn.
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
              {message}
            </div>
          ) : null}
        </Card>

        <Card>
          <SectionHeader
            title="Lịch làm việc của tôi"
            description="Xem các ca làm việc và lịch trình đã tạo."
            action={
              <Button variant="outline" onClick={() => setOpenModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo lịch
              </Button>
            }
          />

          <div className="space-y-2">
            {mySchedules.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
                Chưa có lịch làm việc nào. Hãy tạo ca đầu tiên cho bản thân.
              </div>
            ) : (
              mySchedules.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {new Date(entry.work_date).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {entry.check_in ? `Check-in: ${new Date(entry.check_in).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : "Chưa có check-in"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{entry.type}</Badge>
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                      {entry.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {openModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-[28px] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Tạo lịch làm việc</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Đặt ca làm việc, giờ check-in và giờ check-out cho bản thân.</p>
              </div>
              <button type="button" onClick={() => setOpenModal(false)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Ngày làm việc
                <input
                  type="date"
                  value={form.work_date}
                  onChange={(event) => handleChange("work_date", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Loại ca
                <select
                  value={form.type}
                  onChange={(event) => handleChange("type", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="OFFICE">Office</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Check-in
                <input
                  type="time"
                  value={form.check_in}
                  onChange={(event) => handleChange("check_in", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Check-out
                <input
                  type="time"
                  value={form.check_out}
                  onChange={(event) => handleChange("check_out", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Trạng thái
                <select
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <option value="PRESENT">Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LEAVE">Leave</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 md:col-span-2">
                Ghi chú
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(event) => handleChange("note", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                  placeholder="Ví dụ: làm việc từ xa, đi công tác..."
                />
              </label>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang lưu..." : "Lưu lịch làm việc"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
