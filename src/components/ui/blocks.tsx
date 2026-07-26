import type { ReactNode } from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "inline-flex items-center justify-center font-medium transition-all shadow-sm";
  const sizes = {
    default: "rounded-2xl px-4 py-2.5 text-sm",
    sm: "rounded-xl px-3 py-1.5 text-xs",
    lg: "rounded-2xl px-5 py-3 text-base",
  };
  const variants = {
    default: "bg-zinc-950 text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950",
    outline: "border border-zinc-200 bg-white/80 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
  };
  return (
    <button className={[base, sizes[size], variants[variant], className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={["rounded-[30px] border border-zinc-200/70 bg-white/80 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/80", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={["inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300", className].filter(Boolean).join(" ")}>{children}</span>;
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Preparing your workspace" }: { label?: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mb-3 h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">This view is rendering from local mock data.</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950/40">
      <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
      <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description = "The content could not be loaded.", action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
      <p className="text-base font-semibold text-rose-700 dark:text-rose-300">{title}</p>
      <p className="mt-1 max-w-md text-sm text-rose-600 dark:text-rose-400">{description}</p>
      {action}
    </div>
  );
}
