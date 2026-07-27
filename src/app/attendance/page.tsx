"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { checkInAttendance, checkOutAttendance, getAttendanceDashboard, getTodayAttendanceList } from "@/lib/api";
import type { AttendanceDashboardItem, AttendanceDashboardResponse } from "@/lib/types";
import { CheckCircle2, Clock3, Plus, Search, User, X } from "lucide-react";

const getAttendanceStatusBadgeClass = (status?: string | null) => {
  switch (status?.toUpperCase()) {
    case "PRESENT":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "LATE":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300";
    case "ABSENT":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300";
    case "LEAVE":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-300";
    default:
      return "";
  }
};

export default function AttendancePage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTodayList, setLoadingTodayList] = useState(false);
  const [dashboardData, setDashboardData] = useState<AttendanceDashboardResponse | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<{ checked_in: boolean; checked_out: boolean; message?: string }>({
    checked_in: false,
    checked_out: false,
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [todayItems, setTodayItems] = useState<AttendanceDashboardItem[]>([]);
  const [todayPagination, setTodayPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboard = await getAttendanceDashboard();
        setDashboardData(dashboard);
        setAttendanceStatus({
          checked_in: dashboard.myAttendance?.checkedIn ?? false,
          checked_out: dashboard.myAttendance?.checkedOut ?? false,
          message: dashboard.myAttendance?.status ? `Trạng thái: ${dashboard.myAttendance.status}` : undefined,
        });
        setTodayItems(dashboard.todayList?.items ?? []);
        setTodayPagination(dashboard.todayList?.pagination ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu dashboard.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  // Debounced fetch for today list search
  useEffect(() => {
    if (loading) return; // Skip initial render before dashboard is loaded

    const timer = setTimeout(async () => {
      setLoadingTodayList(true);
      try {
        const res = await getTodayAttendanceList({ keyword: searchKeyword });
        setTodayItems(res.items ?? []);
        setTodayPagination(res.pagination ?? null);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm danh sách chấm công:", err);
      } finally {
        setLoadingTodayList(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, loading]);

  const refreshDashboard = async () => {
    try {
      const [dashboard, todayRes] = await Promise.all([
        getAttendanceDashboard(),
        getTodayAttendanceList({ keyword: searchKeyword }),
      ]);
      setDashboardData(dashboard);
      setAttendanceStatus({
        checked_in: dashboard.myAttendance?.checkedIn ?? false,
        checked_out: dashboard.myAttendance?.checkedOut ?? false,
        message: dashboard.myAttendance?.status ? `Trạng thái: ${dashboard.myAttendance.status}` : undefined,
      });
      setTodayItems(todayRes.items ?? []);
      setTodayPagination(todayRes.pagination ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể làm mới dashboard.");
    }
  };

  const handleCheckIn = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await checkInAttendance();
      await refreshDashboard();
      setMessage("Check-in thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await checkOutAttendance();
      await refreshDashboard();
      setMessage("Check-out thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-out thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Theo dõi chấm công" description="Giám sát hiện diện, đúng giờ và nhịp làm việc hàng ngày một cách mượt mà.">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <SectionHeader title="Chấm công tuần" description="Tổng quan nhẹ về xu hướng đúng giờ." />
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              { label: "Present", value: dashboardData?.statistics.present ?? 0 },
              { label: "Late", value: dashboardData?.statistics.late ?? 0 },
              { label: "Absent", value: dashboardData?.statistics.absent ?? 0 },
              { label: "Leave", value: dashboardData?.statistics.leave ?? 0 },
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {loading ? (
              <div className="col-span-full rounded-[22px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
                Đang tải dữ liệu dashboard...
              </div>
            ) : (dashboardData?.weeklySummary?.data?.length ?? 0) === 0 ? (
              <div className="col-span-full rounded-[22px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
                Chưa có dữ liệu tổng hợp từ server.
              </div>
            ) : (
              dashboardData?.weeklySummary?.data?.map((item) => (
                <div key={item.day} className="rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.day}</p>
                  <p className="mt-2 text-xs text-zinc-500">Present {item.present}</p>
                  <p className="text-xs text-zinc-500">Late {item.late}</p>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card>
          <SectionHeader
            title="Check-in"
            description="Hành động nhanh cho bản ghi chấm công hôm nay."
            action={
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void handleCheckIn()} disabled={submitting}>
                  <Plus className="mr-2 h-4 w-4" />
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
              <CheckCircle2 className={`h-4 w-4 ${attendanceStatus.checked_in ? "text-emerald-500" : "text-zinc-400"}`} />
              {attendanceStatus.checked_in ? "Bạn đã check-in hôm nay." : "Bạn chưa check-in hôm nay."}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Clock3 className={`h-4 w-4 ${attendanceStatus.checked_out ? "text-indigo-500" : "text-zinc-400"}`} />
              {attendanceStatus.checked_out ? "Bạn đã check-out hôm nay." : "Bạn chưa check-out hôm nay."}
            </div>
            {attendanceStatus.message ? (
              <div className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">{attendanceStatus.message}</div>
            ) : null}
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
      </div>

      <Card className="mt-4">
        <SectionHeader
          title="Chấm công hôm nay"
          description={todayPagination ? `Tổng cộng ${todayPagination.total} nhân viên` : "Bảng xem nhanh để rà soát dễ dàng."}
          action={
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm theo tên, email, mã nhân viên..."
                className="w-full rounded-2xl border border-zinc-200 bg-white/80 py-2 pl-9 pr-9 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-white dark:placeholder-zinc-500"
              />
              {searchKeyword ? (
                <button
                  type="button"
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          }
        />

        <div className="space-y-2">
          {loadingTodayList ? (
            <div className="rounded-[22px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
              Đang tìm kiếm...
            </div>
          ) : todayItems.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
              {searchKeyword ? `Không tìm thấy kết quả nào phù hợp với "${searchKeyword}".` : "Chưa có bản ghi chấm công hôm nay."}
            </div>
          ) : (
            todayItems.map((entry) => {
              const checkInTime = entry.check_in
                ? new Date(entry.check_in).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                : "--:--";
              const checkOutTime = entry.check_out
                ? new Date(entry.check_out).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                : "--:--";

              return (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3.5 transition-colors hover:bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white font-semibold text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                      {entry.user?.name ? entry.user.name.charAt(0).toUpperCase() : <User className="h-5 w-5 text-zinc-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-900 dark:text-white">{entry.user?.name ?? "Nhân viên"}</p>
                        {entry.user?.employee_code ? (
                          <span className="rounded-md bg-zinc-200/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {entry.user.employee_code}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-zinc-500">{entry.user?.email ?? ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="text-right">
                      <p className="text-[11px] text-zinc-400">Check-in / Check-out</p>
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">
                        {checkInTime} - {checkOutTime}
                      </p>
                    </div>
                    <Badge className={getAttendanceStatusBadgeClass(entry.status)}>
                      {entry.status ?? "UNKNOWN"}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </AppShell>
  );
}
