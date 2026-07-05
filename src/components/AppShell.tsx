"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import PageHeader from "@/app/components/PageHeader";
import { getToken } from "@/lib/auth";

export function AppShell({ children, title, description }: { children: ReactNode; title: string; description?: string }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!getToken()) {
            router.replace("/login");
            return;
        }

        setReady(true);
    }, [router]);

    if (!ready) {
        return null;
    }

    return (
        <div className="bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
            <div className="flex w-full flex-col gap-4 px-3 sm:px-4 lg:px-6 lg:py-6">
                <Header />
                <div className="grid min-h-[calc(100vh-110px)] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="rounded-[28px] bg-white/75 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/75 lg:sticky lg:top-4 lg:self-start">
                        <Sidebar />
                    </aside>

                    <main className="space-y-4">
                        <PageHeader
                            title={title}
                            description={description}
                        />
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
