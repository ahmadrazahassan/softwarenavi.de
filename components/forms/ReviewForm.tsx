"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitReview } from "@/app/(public)/software/[slug]/bewertungen/neu/actions";
import { initialFormState } from "@/lib/forms";
import { COMPANY_SIZES, COUNTRIES, DEFAULT_COUNTRY, DURATIONS, INDUSTRIES, LEGAL_FORMS, rangeLabel } from "@/lib/i18n/options";
import { Field, Input, NativeSelect, Textarea, Checkbox } from "@/components/ui/form-controls";
import { StarSelector } from "./StarSelector";
import { ConsentCheckbox, Honeypot, RequiredNote } from "./ConsentCheckbox";
import { CONSENT_TEXT_VERSION } from "@/lib/site";

export function ReviewForm({ softwareId, softwareName, slug }: { softwareId: string; softwareName: string; slug: string }) {
  const [state, action, pending] = useActionState(submitReview, initialFormState);
  const errRef = useRef<HTMLDivElement>(null);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.ok) toast.success("Vielen Dank, Ihre Bewertung wurde übermittelt.", { description: "Sie wird geprüft und in der Regel innerhalb von zwei Werktagen veröffentlicht." });
    else if (state.message) errRef.current?.focus();
  }, [state]);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-brand bg-brand-light p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-brand-dark" aria-hidden="true" />
        <h2 className="mt-4 font-heading text-2xl font-semibold">Vielen Dank für Ihre Bewertung</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">{state.message}</p>
        <Link href={`/software/${slug}`} className="mt-6 inline-flex h-11 items-center rounded-[7px] btn-glossy px-6 text-sm font-medium">
          Zurück zu {softwareName}
        </Link>
      </div>
    );
  }

  const describedBy = (k: string) => (e[k] ? `${k}-error` : undefined);

  return (
    <form action={action} noValidate className="relative flex flex-col gap-10">
      <Honeypot />
      <input type="hidden" name="software_id" value={softwareId} />
      <input type="hidden" name="consent_text_version" value={CONSENT_TEXT_VERSION} />

      {state.message && !state.ok && (
        <div ref={errRef} tabIndex={-1} role="alert" className="rounded-lg border border-destructive/30 bg-red-50 p-4 text-sm font-medium text-destructive outline-none">
          {state.message}
        </div>
      )}

      <fieldset className="flex flex-col gap-5">
        <legend className="font-heading text-xl font-semibold">1. Ihre Bewertung</legend>
        <StarSelector name="overall_rating" label="Gesamtbewertung" size="lg" defaultValue={Number(v.overall_rating) || 0} error={e.overall_rating} />
        <div className="grid gap-5 sm:grid-cols-2">
          <StarSelector name="ease_of_use" label="Bedienbarkeit" defaultValue={Number(v.ease_of_use) || 0} error={e.ease_of_use} />
          <StarSelector name="value_for_money" label="Preis-Leistung" defaultValue={Number(v.value_for_money) || 0} error={e.value_for_money} />
          <StarSelector name="customer_service" label="Kundenservice" defaultValue={Number(v.customer_service) || 0} error={e.customer_service} />
          <StarSelector name="functionality" label="Funktionsumfang" defaultValue={Number(v.functionality) || 0} error={e.functionality} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-heading text-xl font-semibold">2. Ihre Erfahrungen</legend>
        <Field id="review_title" label="Titel der Bewertung" required error={e.review_title} hint="5 bis 120 Zeichen, z. B. „Die UStVA ist jetzt in zehn Minuten erledigt“">
          <Input id="review_title" name="review_title" required aria-required="true" maxLength={120} defaultValue={v.review_title} aria-invalid={!!e.review_title} aria-describedby={describedBy("review_title") ?? "review_title-hint"} />
        </Field>
        <Field id="summary" label="Zusammenfassung" error={e.summary} hint="Wofür nutzen Sie die Software? (optional, höchstens 2.000 Zeichen)">
          <Textarea id="summary" name="summary" maxLength={2000} defaultValue={v.summary} aria-invalid={!!e.summary} aria-describedby={describedBy("summary") ?? "summary-hint"} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="pros" label="Was gefällt Ihnen?" required error={e.pros}>
            <Textarea id="pros" name="pros" required aria-required="true" maxLength={2000} defaultValue={v.pros} aria-invalid={!!e.pros} aria-describedby={describedBy("pros")} />
          </Field>
          <Field id="cons" label="Was gefällt Ihnen nicht?" required error={e.cons}>
            <Textarea id="cons" name="cons" required aria-required="true" maxLength={2000} defaultValue={v.cons} aria-invalid={!!e.cons} aria-describedby={describedBy("cons")} />
          </Field>
        </div>
        <Field id="used_for_duration" label="Nutzungsdauer" required error={e.used_for_duration}>
          <NativeSelect id="used_for_duration" name="used_for_duration" required aria-required="true" defaultValue={v.used_for_duration ?? ""} aria-invalid={!!e.used_for_duration} aria-describedby={describedBy("used_for_duration")}>
            <option value="" disabled>
              Bitte wählen
            </option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {rangeLabel(d)}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="font-heading text-xl font-semibold">3. Über Sie</legend>
        <p className="-mt-2 text-sm text-muted-foreground">
          Wir fragen nur, was für die Einordnung Ihrer Bewertung nötig ist. Ihr Unternehmen anzugeben ist freiwillig. Als Anzeigename genügt Vorname und erster
          Buchstabe des Nachnamens.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="reviewer_name" label="Ihr Name (Anzeigename)" required error={e.reviewer_name} hint="z. B. „Katrin M.“">
            <Input id="reviewer_name" name="reviewer_name" required aria-required="true" autoComplete="nickname" maxLength={60} defaultValue={v.reviewer_name} aria-invalid={!!e.reviewer_name} aria-describedby={describedBy("reviewer_name") ?? "reviewer_name-hint"} />
          </Field>
          <Field id="reviewer_job_title" label="Position" hint="optional">
            <Input id="reviewer_job_title" name="reviewer_job_title" autoComplete="organization-title" maxLength={80} defaultValue={v.reviewer_job_title} placeholder="z. B. Buchhalterin" />
          </Field>
          <Field id="reviewer_company" label="Unternehmen" hint="optional">
            <Input id="reviewer_company" name="reviewer_company" autoComplete="organization" maxLength={120} defaultValue={v.reviewer_company} />
          </Field>
          <Field id="reviewer_legal_form" label="Rechtsform" hint="optional" error={e.reviewer_legal_form}>
            <NativeSelect id="reviewer_legal_form" name="reviewer_legal_form" defaultValue={v.reviewer_legal_form ?? ""}>
              <option value="">Keine Angabe</option>
              {LEGAL_FORMS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field id="reviewer_industry" label="Branche" hint="optional" error={e.reviewer_industry}>
            <NativeSelect id="reviewer_industry" name="reviewer_industry" defaultValue={v.reviewer_industry ?? ""}>
              <option value="">Keine Angabe</option>
              {INDUSTRIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field id="reviewer_company_size" label="Unternehmensgröße" hint="optional" error={e.reviewer_company_size}>
            <NativeSelect id="reviewer_company_size" name="reviewer_company_size" defaultValue={v.reviewer_company_size ?? ""}>
              <option value="">Keine Angabe</option>
              {COMPANY_SIZES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field id="reviewer_country" label="Land" error={e.reviewer_country}>
            <NativeSelect id="reviewer_country" name="reviewer_country" defaultValue={v.reviewer_country || DEFAULT_COUNTRY}>
              {COUNTRIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-3">
            <Checkbox id="truthful" name="truthful" required aria-required="true" aria-invalid={!!e.truthful} aria-describedby={e.truthful ? "truthful-error" : undefined} />
            <label htmlFor="truthful" className="text-sm leading-relaxed text-muted-foreground">
              Ich bestätige, dass diese Bewertung auf meinen eigenen Erfahrungen mit {softwareName} beruht und ich weder für den Anbieter noch für einen
              Wettbewerber tätig bin oder eine Gegenleistung erhalte.
              <span className="ml-0.5 text-destructive" aria-hidden="true">
                *
              </span>
            </label>
          </div>
          {e.truthful && (
            <p id="truthful-error" className="pl-8 text-xs font-medium text-destructive">
              {e.truthful}
            </p>
          )}
        </div>
        <ConsentCheckbox id="consent" error={e.consent} purpose="zur Prüfung und Veröffentlichung meiner Bewertung" />
        <RequiredNote />
      </div>

      <div className="flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-[7px] btn-glossy px-7 font-medium disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          Bewertung absenden
        </button>
        <p className="text-xs text-muted-foreground">
          Bewertungen werden vor der Veröffentlichung geprüft, in der Regel innerhalb von zwei Werktagen. Mehr in unseren{" "}
          <Link href="/redaktionelle-grundsaetze" className="underline underline-offset-2">
            redaktionellen Grundsätzen
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
