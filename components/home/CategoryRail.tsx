"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "@/components/public/Cards";
import { formatCount } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

/** Horizontal card rail (reference „Ocamba — What We Do"): first card carries a finance chart, arrows + progress. */
export function CategoryRail({ categories }: { categories: Category[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          const max = el.scrollWidth - el.clientWidth;
          setProgress(max > 0 ? el.scrollLeft / max : 0);
        }}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
        role="list"
        aria-label="Kategorien"
      >
        {categories.map((c, i) => (
          <article
            key={c.id}
            role="listitem"
            className={cn(
              "group relative flex h-[360px] w-[78vw] shrink-0 snap-start flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-ink sm:w-[300px]",
              i === 0 && "sm:w-[380px]",
            )}
          >
            {i === 0 ? (
              <div className="-mx-2 -mt-2 mb-5 flex h-36 flex-col justify-between rounded-lg bg-brand-soft p-4" aria-hidden="true">
                <p className="max-w-[14rem] font-heading text-lg font-medium leading-tight text-ink">Die Buchhaltung, die Ihre Kanzlei versteht</p>
                <div className="flex items-end gap-1.5">
                  {[30, 44, 36, 58, 50, 72, 64].map((h, k) => (
                    <span key={k} className="w-4 bg-ink" style={{ height: h * 0.8 }} />
                  ))}
                  <span className="ml-auto rounded-sm bg-white px-2 py-1 text-[11px] font-medium text-ink">DATEV ✓</span>
                </div>
              </div>
            ) : (
              <CategoryIcon icon={c.icon} className="size-7 text-brand-dark" />
            )}
            <h3 className={cn("card-title font-heading text-[1.35rem] font-medium leading-tight tracking-[-0.02em]", i === 0 ? "" : "mt-10")}>
              <Link href={`/kategorie/${c.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
                {c.name}
              </Link>
            </h3>
            <span className="mt-4 block h-px w-6 bg-ink" aria-hidden="true" />
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            <p className="mt-auto flex items-center justify-between pt-5 text-sm font-medium">
              {formatCount(c.software_count)} Programme
              <span className="grid size-8 place-items-center rounded-md border border-border transition-colors group-hover:border-ink">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </p>
          </article>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Zurück" className="grid size-10 place-items-center rounded-md border border-border hover:border-ink">
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Weiter" className="grid size-10 place-items-center rounded-md border border-border hover:border-ink">
            <ArrowRight className="size-4" />
          </button>
        </div>
        <div className="h-[2px] w-40 overflow-hidden bg-border" aria-hidden="true">
          <div className="h-full bg-ink transition-[width] duration-200" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
