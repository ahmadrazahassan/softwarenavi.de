import type { Metadata } from "next";
import { getArticles } from "@/lib/supabase/queries";
import { Breadcrumb, EmptyState, Pagination } from "@/components/public/Layout";
import { ArticleCard } from "@/components/public/ArticleCard";
import type { SP } from "@/lib/filters";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ratgeber: Fachbeiträge zu Buchhaltung, Lohn, HR und IT",
  description: "E-Rechnungspflicht, GoBD, DATEV-Schnittstelle, Arbeitszeiterfassung, Serverstandort: praxisnahe Ratgeber für den deutschen Mittelstand.",
  alternates: { canonical: "/ratgeber" },
};

export default async function GuidesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(Array.isArray(sp.seite) ? sp.seite[0] : sp.seite) || 1);
  const perPage = 9;
  const { items, total } = await getArticles(page, perPage);
  const [lead, ...rest] = items;
  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Ratgeber" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">Ratgeber</h1>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Fachbeiträge für Geschäftsführung, Buchhaltung und Personalabteilung. Mit Blick auf die Details, die in Deutschland tatsächlich zählen.
        </p>
      </header>
      {!items.length ? (
        <EmptyState title="Noch keine Beiträge" className="mt-10">
          Sobald Beiträge im Admin-Bereich veröffentlicht sind, erscheinen sie hier.
        </EmptyState>
      ) : (
        <>
          {page === 1 && lead && (
            <div className="mt-10">
              <ArticleCard article={lead} large />
            </div>
          )}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(page === 1 ? rest : items).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Pagination page={page} total={total} perPage={perPage} basePath="/ratgeber" />
        </>
      )}
    </div>
  );
}
