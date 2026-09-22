"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import type { Category, Software } from "@/lib/types";
import { CardActions, CategoryIcon, OfferBadges, PartnerLinkNote, PriceTag, RatingMeter } from "@/components/public/Cards";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatRating } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { ratingCaption } from "@/lib/rating";

const ALL = "__all";

function RankCard({ software: s, rank }: { software: Software; rank: number }) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-white p-5 text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-30px_rgba(21,19,30,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <SoftwareLogo software={s} size={44} rounded="rounded-lg" />
        <span className="font-heading text-sm font-medium tabular-nums text-muted-foreground" aria-label={`Platz ${rank}`}>
          #{String(rank).padStart(2, "0")}
        </span>
      </div>
      <h3 className="card-title mt-4 font-heading text-lg font-medium leading-tight tracking-[-0.02em]">
        <Link href={`/software/${s.slug}`} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
          {s.name}
        </Link>
      </h3>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.category?.name ?? s.vendor_name}</p>

      <div className="mt-4 flex items-center gap-3">
        <span className="font-heading text-xl font-medium tabular-nums tracking-[-0.03em]">{formatRating(s.overall_rating)}</span>
        <div className="min-w-0 flex-1">
          <RatingMeter rating={s.overall_rating} />
          <span className="mt-1 block text-[11px] text-muted-foreground">{ratingCaption(s)}</span>
        </div>
      </div>
      <OfferBadges software={s} max={2} className="mt-4" />

      <div className="mt-auto border-t border-border pt-4 [&]:mt-5">
        <PriceTag software={s} />
        <CardActions software={s} className="mt-4" />
      </div>
    </article>
  );
}

/**
 * „Top bewertet": light band, tab strip with sliding ink indicator, ranked grid with profile + partner-link actions.
 * „Alle" shows the overall top list; each category tab shows its full ranking.
 */
export function HomepageExplore({
  categories,
  byCategory,
  overall,
}: {
  categories: Category[];
  byCategory: Record<string, Software[]>;
  overall: Software[];
}) {
  const tabs = [
    { id: ALL, name: "Alle", slug: "", icon: null as string | null, count: overall.length },
    ...categories.filter((c) => (byCategory[c.id] ?? []).length > 0).map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon, count: c.software_count })),
  ];
  const [active, setActive] = useState(ALL);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);

  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const items = current.id === ALL ? overall : (byCategory[current.id] ?? []);

  useLayoutEffect(() => {
    const i = tabs.findIndex((t) => t.id === current.id);
    const el = refs.current[i];
    const box = strip.current;
    if (!el || !box) return;
    const place = () => setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    place();
    const ro = new ResizeObserver(place);
    ro.observe(box);
    if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div className="rounded-2xl border border-border bg-white p-1.5 shadow-[0_1px_0_rgba(21,19,30,0.04)]">
        <div ref={strip} role="tablist" aria-label="Kategorien" className="scrollbar-none relative flex overflow-x-auto">
          <span
            aria-hidden="true"
            className={cn("absolute inset-y-0 rounded-xl bg-ink transition-[left,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", !pill.ready && "opacity-0")}
            style={{ left: pill.left, width: pill.width }}
          />
          {tabs.map((t, i) => {
            const selected = t.id === current.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                role="tab"
                id={`${id}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative z-[1] flex h-14 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-4 text-[14.5px] font-medium transition-colors duration-300",
                  selected ? "text-white" : "text-muted-foreground hover:text-ink",
                )}
              >
                {t.id === ALL ? (
                  <LayoutGrid className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <CategoryIcon icon={t.icon} className="size-[18px]" />
                )}
                {t.name}
                <span className={cn("text-xs tabular-nums transition-colors", selected ? "text-lime" : "text-muted-foreground/60")}>{t.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${current.id}`} className="mt-8">
        <div key={current.id} className="grid animate-[reveal_.5s_cubic-bezier(0.22,1,0.36,1)_both] gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((s, i) => (
            <RankCard key={s.id} software={s} rank={i + 1} />
          ))}
        </div>
        <PartnerLinkNote className="mt-8" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {current.id === ALL ? `Die ${items.length} bestbewerteten Programme` : `${items.length} von ${current.count} Programmen`} · Nutzerbewertungen
            vor Redaktionsnote
          </p>
          <Link
            href={current.id === ALL ? "/software?sortierung=rating" : `/kategorie/${current.slug}`}
            className="inline-flex h-11 items-center gap-2 rounded-[7px] bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink/85"
          >
            {current.id === ALL ? "Gesamtes Ranking" : `Alle in „${current.name}“`} <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
