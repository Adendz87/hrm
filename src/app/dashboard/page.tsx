"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarClock, CircleDollarSign, Users, Workflow } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/blocks";
import { attendanceSummary, companyAnnouncements, contractExpirations, dashboardStats, departmentDistribution, growthData, leaveRequests, recentEmployees, upcomingBirthdays } from "@/mock/dashboard";

export default function DashboardPage() {
  return (
    <AppShell title="Bảng điều khiển vận hành nhân sự" description="Tổng quan hiện đại về quy mô nhân sự, chấm công, nghỉ phép và các sự kiện HR quan trọng.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{item.value}</p>
                <Badge className="text-emerald-600 dark:text-emerald-400">{item.change}</Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{item.hint}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <SectionHeader title="Tăng trưởng nhân sự" description="Xu hướng quy mô nhân sự trong 6 tháng gần nhất." action={<Button variant="ghost">Xem báo cáo <ArrowUpRight className="ml-2 h-4 w-4" /></Button>} />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="employees" stroke="#8b5cf6" fill="url(#growth)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Phân bố phòng ban" description="Các phòng ban đang tập trung nhiều nhân sự nhất." />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentDistribution} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {departmentDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeader title="Tóm tắt chấm công" description="Tổng quan cân bằng về hiện diện và đúng giờ hôm nay." />
          <div className="grid gap-3 md:grid-cols-3">
            {attendanceSummary.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-sm text-zinc-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">{item.value}%</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Đơn nghỉ phép" description="Các đơn chờ duyệt và quyết định gần đây." />
          <div className="space-y-3">
            {leaveRequests.map((request) => (
              <div key={request.name} className="flex items-center justify-between rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{request.name}</p>
                  <p className="text-sm text-zinc-500">{request.role} • {request.days}</p>
                </div>
                <Badge>{request.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
        <Card>
          <SectionHeader title="Sinh nhật sắp tới" description="Chúc mừng các cột mốc của đội ngũ." />
          <div className="space-y-3">
            {upcomingBirthdays.map((person) => (
              <div key={person.name} className="flex items-center justify-between rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{person.name}</p>
                  <p className="text-sm text-zinc-500">{person.role}</p>
                </div>
                <Badge>{person.date}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Nhân viên mới" description="Những người mới tham gia gần đây." />
          <div className="space-y-3">
            {recentEmployees.map((person) => (
              <div key={person.name} className="flex items-center justify-between rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{person.name}</p>
                  <p className="text-sm text-zinc-500">{person.role}</p>
                </div>
                <Badge>{person.joined}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Thông báo công ty" description="Giữ đội ngũ luôn cập nhật những thông tin quan trọng." />
          <div className="space-y-3">
            {companyAnnouncements.map((item) => (
              <div key={item.title} className="rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-zinc-900 dark:text-white">{item.title}</p>
                  <Badge>{item.tag}</Badge>
                </div>
                <p className="mt-2 text-sm text-zinc-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeader title="Hợp đồng sắp hết hạn" description="Các lần gia hạn và mốc thời gian quan trọng." />
          <div className="space-y-3">
            {contractExpirations.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-[22px] border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-zinc-500">{item.role}</p>
                </div>
                <Badge>{item.expires}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Hành động nhanh" description="Truy cập nhanh vào các quy trình hay dùng nhất." />
          <div className="grid gap-3 sm:grid-cols-2">
            <Button className="justify-start"><Users className="mr-2 h-4 w-4" /> Thêm nhân viên</Button>
            <Button variant="outline" className="justify-start"><CalendarClock className="mr-2 h-4 w-4" /> Lên lịch đánh giá</Button>
            <Button variant="outline" className="justify-start"><Workflow className="mr-2 h-4 w-4" /> Duyệt nghỉ phép</Button>
            <Button variant="outline" className="justify-start"><CircleDollarSign className="mr-2 h-4 w-4" /> Chạy bảng lương</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}