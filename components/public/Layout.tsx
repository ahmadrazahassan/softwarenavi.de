import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronRight as Sep } from "lucide-react";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { JsonLd } from "./JsonLd";
import { hy } from "@/lib/utils/hyphenate";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb + BreadcrumbList JSON-LD. */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Startseite", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Brotkrumennavigation" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          {all.map((c, i) => (
            <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 && <Sep className="size-3.5 opacity-60" aria-hidden="true" />}
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className="rounded hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={i === all.length - 1 ? "page" : undefined} className="font-medium text-foreground">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: absoluteUrl(c.href) } : {}),
          })),
        }}
      />
    </>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground", className)}>
      <span className="size-2 bg-brand" aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  action,
  id,
  className,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <H id={id} className="mt-4 font-heading text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-[3.25rem]">
          {hy(title)}
        </H>
        {sub && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/** „Zurück" / „Weiter", „Seite 2 von 9". Links preserve the other query parameters. */
export function Pagination({
  page,
  total,
  perPage,
  basePath,
  params = {},
}: {
  page: number;
  total: number;
  perPage: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (pages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "seite") q.set(k, v);
    if (p > 1) q.set("seite", String(p));
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const window = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);
  const item = "inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-medium";
  return (
    <nav aria-label="Seitennavigation" className="mt-10 flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link href={href(page - 1)} className={cn(item, "gap-1 border border-border hover:border-ink")} rel="prev">
            <ChevronLeft className="size-4" aria-hidden="true" /> Zurück
          </Link>
        ) : (
          <span className={cn(item, "gap-1 border border-border text-muted-foreground")} aria-disabled="true">
            <ChevronLeft className="size-4" aria-hidden="true" /> Zurück
          </span>
        )}
        <span className="hidden items-center gap-1 sm:flex">
          {window.map((p, i) => (
            <span key={p} className="inline-flex items-center gap-1">
              {i > 0 && window[i - 1] !== p - 1 && <span className="px-1 text-muted-foreground">…</span>}
              <Link
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(item, p === page ? "btn-glossy" : "hover:bg-paper")}
              >
                {p}
              </Link>
            </span>
          ))}
        </span>
        {page < pages ? (
          <Link href={href(page + 1)} className={cn(item, "gap-1 border border-border hover:border-ink")} rel="next">
            Weiter <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className={cn(item, "gap-1 border border-border text-muted-foreground")} aria-disabled="true">
            Weiter <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Seite {page} von {pages}
      </p>
    </nav>
  );
}

export function EmptyState({ title, children, className }: { title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-paper px-6 py-14 text-center", className)}>
      <p className="font-heading text-lg font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
