import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import type { SP } from "@/lib/filters";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/** Confirms a pending subscription if the token exists and is younger than 48 hours; clears the token either way. */
async function confirmToken(token: string): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const db = createAdminClient();
  const { data } = await db
    .from("newsletter_subscribers")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString(), confirm_token: null, confirm_token_expires_at: null })
    .eq("confirm_token", token)
    .eq("status", "pending")
    .gt("confirm_token_expires_at", new Date().toISOString())
    .select("id");
  return (data?.length ?? 0) > 0;
}

export const metadata: Metadata = { title: "Newsletter-Anmeldung bestätigen", robots: { index: false, follow: false } };

/** Double-opt-in confirmation landing (backend spec §5.3). */
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token;
  const valid = !!token && /^[A-Za-z0-9_-]{16,128}$/.test(token) && (await confirmToken(token));
  return (
    <div className="container-site flex min-h-[50vh] items-center justify-center pt-16">
      <div className="max-w-lg rounded-xl border border-border bg-white p-8 text-center">
        {valid ? (
          <>
            <CheckCircle2 className="mx-auto size-12 text-brand-dark" aria-hidden="true" />
            <h1 className="mt-4 font-heading text-2xl font-medium">Anmeldung bestätigt</h1>
            <p className="mt-2 text-muted-foreground">Vielen Dank. Sie erhalten den Softwarebrief ab der nächsten Ausgabe. Abmelden können Sie sich jederzeit über den Link in jeder E-Mail.</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto size-12 text-destructive" aria-hidden="true" />
            <h1 className="mt-4 font-heading text-2xl font-medium">Link ungültig oder abgelaufen</h1>
            <p className="mt-2 text-muted-foreground">
              Bestätigungslinks sind 48 Stunden gültig. Unbestätigte Anmeldungen löschen wir danach automatisch. Bitte melden Sie sich erneut an.
            </p>
            <Link href="/softwarebrief" className="mt-6 inline-flex h-11 items-center rounded-[7px] btn-glossy px-6 text-sm font-medium">
              Erneut anmelden
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
