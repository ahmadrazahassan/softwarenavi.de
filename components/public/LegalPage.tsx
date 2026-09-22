import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { getPageBySlug } from "@/lib/supabase/queries";
import { Breadcrumb } from "./Layout";
import { formatDateLong } from "@/lib/utils/format";
import { hy } from "@/lib/utils/hyphenate";

export async function legalMetadata(slug: string): Promise<Metadata> {
  const p = await getPageBySlug(slug);
  if (!p) return {};
  return { title: p.meta_title ?? p.title, description: p.meta_description ?? undefined, alternates: { canonical: `/${slug}` } };
}

/** Escapes nothing — content is admin-authored HTML from the `pages` table; placeholders are highlighted. */
function highlightPlaceholders(html: string) {
  return html.replace(
    /\{\{([A-Z0-9_]+)\}\}/g,
    '<mark class="rounded bg-amber-100 px-1 font-mono text-[0.85em] text-amber-900">{{$1}}</mark>',
  );
}

export async function LegalPage({ slug }: { slug: string }) {
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  const hasPlaceholders = /\{\{[A-Z0-9_]+\}\}/.test(page.content);

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: page.title }]} />
      <article className="mx-auto mt-8 max-w-3xl">
        <h1 className="font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">{hy(page.title)}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Stand: {formatDateLong(page.updated_at)}</p>

        {slug === "impressum" && hasPlaceholders && (
          <div role="alert" className="mt-8 flex gap-3 rounded-lg border-2 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>
              <strong>Bitte vor Veröffentlichung vervollständigen.</strong> Dieses Impressum enthält noch Platzhalter. Ein unvollständiges Impressum verstößt gegen
              § 5 DDG und kann mit Bußgeld bis 50.000 € geahndet sowie abgemahnt werden.
            </p>
          </div>
        )}
        {page.requires_legal_review && (
          <div role="note" className="mt-4 flex gap-3 rounded-lg border border-amber-300 bg-amber-50/60 p-4 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>
              <strong>Entwurf:</strong> Bitte vor Veröffentlichung durch die Rechtsberatung prüfen.
            </p>
          </div>
        )}

        <div className="legal-content mt-10" dangerouslySetInnerHTML={{ __html: highlightPlaceholders(page.content) }} />
      </article>
    </div>
  );
}
