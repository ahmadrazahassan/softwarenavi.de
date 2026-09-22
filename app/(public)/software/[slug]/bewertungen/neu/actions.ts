"use server";

import { headers } from "next/headers";
import { str, type FormState } from "@/lib/forms";
import { COMPANY_SIZES, COUNTRIES, DURATIONS, INDUSTRIES, LEGAL_FORMS } from "@/lib/i18n/options";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { clientMeta, CONSENT_VERSIONS, withinRateLimit } from "@/lib/server/privacy";

const DIMENSIONS = ["overall_rating", "ease_of_use", "value_for_money", "customer_service", "functionality"] as const;

/**
 * Review submission (backend spec §5.2). Validates, applies a per-IP-hash rate limit (3 per hour) and stores
 * the review as `pending` with its consent trail. Nothing is published until the Redaktion approves it, and
 * pending reviews never move a rating (the trigger only counts published rows).
 */
export async function submitReview(_prev: FormState, fd: FormData): Promise<FormState> {
  const values: Record<string, string> = {};
  for (const k of [
    "software_id", "reviewer_name", "reviewer_job_title", "reviewer_company", "reviewer_industry",
    "reviewer_company_size", "reviewer_country", "reviewer_legal_form", "used_for_duration",
    "review_title", "summary", "pros", "cons", ...DIMENSIONS,
  ]) values[k] = str(fd, k);

  if (str(fd, "firma_website")) return { ok: true, message: "Vielen Dank, Ihre Bewertung wurde übermittelt." };

  const errors: Record<string, string> = {};
  if (values.reviewer_name.length < 2 || values.reviewer_name.length > 60)
    errors.reviewer_name = "Bitte geben Sie einen Anzeigenamen mit 2 bis 60 Zeichen an, z. B. „Katrin M.“.";
  if (values.review_title.length < 5 || values.review_title.length > 120)
    errors.review_title = "Der Titel muss zwischen 5 und 120 Zeichen lang sein.";
  if (values.summary.length > 2000) errors.summary = "Die Zusammenfassung darf höchstens 2.000 Zeichen lang sein.";
  if (values.pros.length < 20) errors.pros = "Bitte beschreiben Sie in mindestens 20 Zeichen, was Ihnen gefällt.";
  if (values.cons.length < 20) errors.cons = "Bitte beschreiben Sie in mindestens 20 Zeichen, was Ihnen nicht gefällt.";
  if (values.pros.length > 2000) errors.pros = "Höchstens 2.000 Zeichen.";
  if (values.cons.length > 2000) errors.cons = "Höchstens 2.000 Zeichen.";

  for (const d of DIMENSIONS) {
    const n = Number(values[d]);
    if (!Number.isInteger(n) || n < 1 || n > 5) errors[d] = "Bitte vergeben Sie 1 bis 5 Sterne.";
  }

  const inPool = (v: string, pool: readonly string[]) => !v || pool.includes(v);
  if (!inPool(values.reviewer_country, COUNTRIES)) errors.reviewer_country = "Bitte wählen Sie ein Land aus der Liste.";
  if (!inPool(values.reviewer_industry, INDUSTRIES)) errors.reviewer_industry = "Bitte wählen Sie eine Branche aus der Liste.";
  if (!inPool(values.reviewer_company_size, COMPANY_SIZES.map((c) => c.value))) errors.reviewer_company_size = "Bitte wählen Sie eine Unternehmensgröße.";
  if (!inPool(values.reviewer_legal_form, LEGAL_FORMS)) errors.reviewer_legal_form = "Bitte wählen Sie eine Rechtsform aus der Liste.";
  if (!values.used_for_duration || !DURATIONS.includes(values.used_for_duration as (typeof DURATIONS)[number]))
    errors.used_for_duration = "Bitte geben Sie an, wie lange Sie die Software nutzen.";

  if (fd.get("consent") !== "on")
    errors.consent = "Ohne Ihre Einwilligung können wir die Bewertung nicht verarbeiten. Bitte setzen Sie das Häkchen.";
  if (fd.get("truthful") !== "on")
    errors.truthful = "Bitte bestätigen Sie, dass die Bewertung auf Ihren eigenen Erfahrungen beruht.";

  if (Object.keys(errors).length) return { ok: false, message: "Bitte prüfen Sie die markierten Felder.", errors, values };

  if (!isAdminConfigured() || !/^[0-9a-f-]{36}$/.test(values.software_id)) {
    return { ok: false, message: "Bewertungen können gerade nicht gespeichert werden. Bitte versuchen Sie es später noch einmal.", values };
  }

  const meta = clientMeta(await headers());
  if (!(await withinRateLimit("reviews", "consent_ip_hash", meta.ipHash, 3))) {
    return { ok: false, message: "Sie haben in der letzten Stunde bereits mehrere Bewertungen eingereicht. Bitte versuchen Sie es später erneut.", values };
  }

  const opt = (v: string) => (v ? v : null);
  const { error } = await createAdminClient().from("reviews").insert({
    software_id: values.software_id,
    reviewer_name: values.reviewer_name,
    reviewer_job_title: opt(values.reviewer_job_title),
    reviewer_company: opt(values.reviewer_company),
    reviewer_industry: opt(values.reviewer_industry),
    reviewer_company_size: opt(values.reviewer_company_size),
    reviewer_country: values.reviewer_country || "Deutschland",
    reviewer_legal_form: opt(values.reviewer_legal_form),
    used_for_duration: values.used_for_duration,
    overall_rating: Number(values.overall_rating),
    ease_of_use: Number(values.ease_of_use),
    value_for_money: Number(values.value_for_money),
    customer_service: Number(values.customer_service),
    functionality: Number(values.functionality),
    review_title: values.review_title,
    summary: opt(values.summary),
    pros: values.pros,
    cons: values.cons,
    status: "pending",
    consent_given: true,
    consent_text_version: CONSENT_VERSIONS.review,
    consent_ip_hash: meta.ipHash,
    consent_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: "Ihre Bewertung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.", values };

  return {
    ok: true,
    message: "Vielen Dank. Ihre Bewertung wird geprüft und in der Regel innerhalb von zwei Werktagen veröffentlicht.",
  };
}
