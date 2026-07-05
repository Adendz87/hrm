"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, LockKeyhole, Mail } from "lucide-react";
import { login } from "@/lib/api";
import { getToken, setToken, setUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@local.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập cả email và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await login({ email, password });
      setToken(data.access_token);
      setUser(data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_35%),linear-gradient(180deg,_#f8f7ff_0%,_#f4f6ff_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_35%),linear-gradient(180deg,_#09090b_0%,_#111118_100%)]">
      <div className="w-full max-w-md rounded-[32px] border border-zinc-200/70 bg-white/75 p-7 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/75">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-semibold text-white">HR</div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Chào mừng trở lại</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Đăng nhập vào Northstar HRM bằng tài khoản demo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">{error}</div> : null}
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"><Mail className="h-4 w-4" /> Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="you@northstar.io" />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"><LockKeyhole className="h-4 w-4" /> Mật khẩu</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950" placeholder="••••••••" />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Tài khoản demo: admin@local.com / 123456</div>
        </div>
      </div>
    </main>
  );
}
