import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getSoftwareBySlug } from "@/lib/supabase/queries";
import { Breadcrumb } from "@/components/public/Layout";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { ReviewForm } from "@/components/forms/ReviewForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  return {
    title: s ? `${s.name} bewerten` : "Bewertung schreiben",
    robots: { index: false, follow: true },
  };
}

export default async function NewReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();
  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Software", href: "/software" }, { label: s.name, href: `/software/${slug}` }, { label: "Bewertung schreiben" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <SoftwareLogo software={s} size={56} />
            <h1 className="font-heading text-[1.7rem] font-medium tracking-tight sm:text-3xl md:text-4xl">{s.name} bewerten</h1>
          </div>
          <p className="mt-4 text-muted-foreground">
            Ihre Erfahrungen helfen anderen Unternehmen bei der Auswahl. Bitte bewerten Sie ehrlich und konkret: Was funktioniert im Alltag, was nicht?
          </p>
          <div className="mt-10">
            <ReviewForm softwareId={s.id} softwareName={s.name} slug={s.slug} />
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-white p-5 text-sm">
            <p className="flex items-center gap-2 font-heading font-semibold">
              <ShieldCheck className="size-5 text-brand-dark" aria-hidden="true" /> So prüfen wir Bewertungen
            </p>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-muted-foreground">
              <li>Jede Bewertung wird vor der Veröffentlichung von unserer Redaktion geprüft.</li>
              <li>Bewertungen von Anbietern, Beschäftigten oder Wettbewerbern werden nicht veröffentlicht.</li>
              <li>Wir speichern keine rohe IP-Adresse, sondern nur einen pseudonymisierten Hash zur Missbrauchsabwehr.</li>
              <li>Sie können die Löschung Ihrer Bewertung jederzeit verlangen.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
