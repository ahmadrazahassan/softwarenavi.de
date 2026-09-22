import type { Metadata } from "next";
import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";
import { getSoftwareBySlug, searchContent } from "@/lib/supabase/queries";
import { Breadcrumb, EmptyState } from "@/components/public/Layout";
import { SoftwareCard } from "@/components/public/Cards";
import { SearchCommand } from "@/components/public/SearchCommand";
import type { Software } from "@/lib/types";
import type { SP } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Suche",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 100) ?? "";
  const res = q ? await searchContent(q, 24) : { software: [], articles: [], categories: [] };
  const full = (await Promise.all(res.software.map((s) => getSoftwareBySlug(s.slug)))).filter((s): s is Software => Boolean(s));
  const total = res.software.length + res.articles.length + res.categories.length;

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Suche" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">{q ? <>Suchergebnisse für „{q}“</> : "Suche"}</h1>
        {q && (
          <p className="mt-3 text-muted-foreground" aria-live="polite">
            {total} {total === 1 ? "Treffer" : "Treffer"}
          </p>
        )}
        <div className="mt-6">
          <SearchCommand size="lg" inputId="search-page-input" />
        </div>
      </header>

      {q && total === 0 && (
        <EmptyState title="Keine Treffer" className="mt-10">
          Zu „{q}“ haben wir nichts gefunden. Versuchen Sie einen allgemeineren Begriff wie „Buchhaltung“, „Lohn“ oder „DATEV“.
        </EmptyState>
      )}

      {res.categories.length > 0 && (
        <section aria-labelledby="s-cat" className="mt-12">
          <h2 id="s-cat" className="font-heading text-xl font-semibold">
            Kategorien
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {res.categories.map((c) => (
              <li key={c.id}>
                <Link href={`/kategorie/${c.slug}`} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand-dark">
                  <FolderOpen className="size-4" aria-hidden="true" /> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {full.length > 0 && (
        <section aria-labelledby="s-sw" className="mt-12">
          <h2 id="s-sw" className="font-heading text-xl font-semibold">
            Software
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {full.map((s) => (
              <SoftwareCard key={s.id} software={s} />
            ))}
          </div>
        </section>
      )}

      {res.articles.length > 0 && (
        <section aria-labelledby="s-ar" className="mt-12">
          <h2 id="s-ar" className="font-heading text-xl font-semibold">
            Ratgeber
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {res.articles.map((a) => (
              <li key={a.id}>
                <Link href={`/ratgeber/${a.slug}`} className="flex gap-3 rounded-lg border border-border p-4 hover:border-brand">
                  <FileText className="mt-0.5 size-5 shrink-0 text-brand-dark" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">{a.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{a.excerpt}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
