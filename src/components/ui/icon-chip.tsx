"use client";
import { type ComponentType } from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon?: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  variant?: "neutral" | "success" | "brand";
  className?: string;
};

export default function IconChip({ icon: Icon, children, variant = "neutral", className }: Props) {
  const base = "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-sm backdrop-blur";
  const theme =
    variant === "success"
      ? "border-emerald-300/40 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
      : variant === "brand"
      ? "border-rose-300/40 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
      : "border-neutral-200/70 bg-white/60 text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200";
  return (
    <span className={cn(base, theme, className)}>
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
      <span>{children}</span>
    </span>
  );
}
