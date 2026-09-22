import type { Metadata } from "next";
import { NewsletterUnsubscribeForm } from "@/components/forms/NewsletterUnsubscribeForm";
import type { SP } from "@/lib/filters";

export const metadata: Metadata = { title: "Newsletter abbestellen", robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const token = (Array.isArray(sp.token) ? sp.token[0] : sp.token) ?? "";
  return (
    <div className="container-site flex min-h-[50vh] items-center justify-center pt-16">
      <div className="w-full max-w-lg rounded-xl border border-border bg-white p-8">
        <h1 className="font-heading text-2xl font-medium">Newsletter abbestellen</h1>
        <p className="mt-2 text-muted-foreground">
          {token ? "Mit einem Klick abmelden. Sie erhalten danach keine weiteren Ausgaben." : "Geben Sie die E-Mail-Adresse an, mit der Sie den Newsletter erhalten."}
        </p>
        <div className="mt-6">
          <NewsletterUnsubscribeForm token={token} />
        </div>
      </div>
    </div>
  );
}
