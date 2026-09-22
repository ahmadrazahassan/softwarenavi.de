import { Suspense } from "react";
import type { Category, Software } from "@/lib/types";
import { DirectoryCard, PartnerLinkNote, SoftwareListRow } from "./Cards";
import { EmptyState, Pagination } from "./Layout";
import { FilterSidebar, SortAndView } from "./FilterSidebar";
import { formatCount, NET_PRICE_NOTE } from "@/lib/utils/format";

/** Shared directory body for /software and /kategorie/[slug]: filters, toolbar, grid/list, pagination. */
export function DirectoryResults({
  items,
  total,
  page,
  perPage,
  view,
  categories,
  activeCount,
  basePath,
  params,
  hideCategory,
}: {
  items: Software[];
  total: number;
  page: number;
  perPage: number;
  view: "grid" | "list";
  categories: Category[];
  activeCount: number;
  basePath: string;
  params: Record<string, string | undefined>;
  hideCategory?: boolean;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:gap-14">
      <Suspense>
        <FilterSidebar categories={categories} activeCount={activeCount} hideCategory={hideCategory} />
      </Suspense>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <strong className="font-heading text-lg font-medium tabular-nums text-foreground">{formatCount(total)}</strong>{" "}
            {total === 1 ? "Programm" : "Programme"} gefunden
          </p>
          <Suspense>
            <SortAndView view={view} />
          </Suspense>
        </div>
        {items.length === 0 ? (
          <EmptyState title="Keine Treffer" className="mt-6">
            Keine Programme entsprechen Ihren Filtern. Setzen Sie einzelne Filter zurück.
          </EmptyState>
        ) : view === "list" ? (
          <div className="mt-6 flex flex-col gap-3">
            {items.map((s) => (
              <SoftwareListRow key={s.id} software={s} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {items.map((s) => (
              <DirectoryCard key={s.id} software={s} />
            ))}
          </div>
        )}
        {view !== "list" && items.length > 0 && <PartnerLinkNote className="mt-6" />}
        <Pagination page={page} total={total} perPage={perPage} basePath={basePath} params={params} />
        <p className="mt-12 max-w-3xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          {NET_PRICE_NOTE} Die Sortierung „Beste Bewertung“ nutzt geprüfte Nutzerbewertungen und, solange keine vorliegen, die Redaktionsnote; Provisionen beeinflussen die
          Reihenfolge nicht.
        </p>
      </div>
    </div>
  );
}
