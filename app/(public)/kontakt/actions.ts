"use server";

import { headers } from "next/headers";
import { EMAIL_RE, str, type FormState } from "@/lib/forms";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { clientMeta, withinRateLimit } from "@/lib/server/privacy";
import { sendMail } from "@/lib/server/mail";

/**
 * Contact form (backend spec §5.4): rate limit per IP hash (5 per hour), stored in `contact_messages`
 * and forwarded to the editorial inbox. Retention 6 months after answering (purge_expired_personal_data).
 */
export async function sendContactMessage(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = {
    name: str(fd, "name"),
    email: str(fd, "email"),
    subject: str(fd, "subject"),
    message: str(fd, "message"),
  };
  if (str(fd, "firma_website")) return { ok: true, message: "Vielen Dank für Ihre Nachricht." };

  const errors: Record<string, string> = {};
  if (values.name.length < 2) errors.name = "Bitte geben Sie Ihren Namen an (mindestens zwei Zeichen).";
  if (values.name.length > 120) errors.name = "Der Name darf höchstens 120 Zeichen lang sein.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein, z. B. name@firma.de.";
  if (values.subject.length < 3) errors.subject = "Bitte geben Sie einen Betreff an.";
  if (values.subject.length > 160) errors.subject = "Der Betreff darf höchstens 160 Zeichen lang sein.";
  if (values.message.length < 10) errors.message = "Bitte beschreiben Sie Ihr Anliegen in mindestens zehn Zeichen.";
  if (values.message.length > 4000) errors.message = "Die Nachricht darf höchstens 4.000 Zeichen lang sein.";
  if (fd.get("consent") !== "on") errors.consent = "Bitte willigen Sie in die Verarbeitung Ihrer Daten ein, damit wir antworten können.";

  if (Object.keys(errors).length) return { ok: false, message: "Bitte prüfen Sie die markierten Felder.", errors, values };

  if (!isAdminConfigured()) {
    return { ok: false, message: "Das Kontaktformular ist gerade nicht verfügbar. Bitte schreiben Sie uns an hallo@softwarenavi.de.", values };
  }
  const meta = clientMeta(await headers());
  if (!(await withinRateLimit("contact_messages", "consent_ip_hash", meta.ipHash, 5))) {
    return { ok: false, message: "Sie haben uns in der letzten Stunde bereits mehrfach geschrieben. Bitte versuchen Sie es später erneut.", values };
  }
  const { error } = await createAdminClient().from("contact_messages").insert({
    name: values.name,
    email: values.email,
    subject: values.subject,
    message: values.message,
    consent_given: true,
    consent_ip_hash: meta.ipHash,
    user_agent: meta.userAgent,
  });
  if (error) return { ok: false, message: "Ihre Nachricht konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.", values };

  // Forward to the editorial inbox; the stored row is the record even if the mail fails.
  await sendMail({
    to: process.env.CONTACT_INBOX || "hallo@softwarenavi.de",
    replyTo: values.email,
    subject: `Kontaktformular: ${values.subject}`,
    text: `Name: ${values.name}
E-Mail: ${values.email}

${values.message}`,
  });

  return { ok: true, message: "Vielen Dank für Ihre Nachricht. Wir melden uns in der Regel innerhalb von zwei Werktagen." };
}
