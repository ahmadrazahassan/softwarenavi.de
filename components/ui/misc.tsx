import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "brand" | "outline" | "success" | "warning" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-paper text-muted-foreground",
        variant === "brand" && "bg-brand-light text-brand-dark",
        variant === "outline" && "border border-border text-muted-foreground",
        variant === "success" && "border border-brand text-ink",
        variant === "warning" && "border border-amber-400 text-amber-900",
        className,
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-xl bg-paper", className)} {...props} />;
}

export function Separator({ className, dashed }: { className?: string; dashed?: boolean }) {
  return (
    <hr
      className={cn(
        "border-t border-border",
        dashed && "",
        className,
      )}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.22)]",
        className,
      )}
      {...props}
    />
  );
}

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
