"use server";

import { headers } from "next/headers";
import { EMAIL_RE, str, type FormState } from "@/lib/forms";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { clientMeta, CONSENT_VERSIONS, randomToken, withinRateLimit } from "@/lib/server/privacy";
import { isMailConfigured, sendMail } from "@/lib/server/mail";
import { absoluteUrl } from "@/lib/site";

/**
 * Newsletter signup with double opt-in (UWG § 7 Abs. 2 Nr. 2, Art. 7 DSGVO, backend spec §5.3).
 * 1. `pending` row with a random confirm token (48 h) and the consent trail.
 * 2. A plain confirmation mail with a single link. No content, no tracking.
 * 3. Unconfirmed rows are deleted after 48 h by purge_expired_personal_data().
 * We only tell the visitor „wir haben Ihnen eine E-Mail gesendet" when the mail really went out.
 */
export async function subscribeNewsletter(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const consent = fd.get("consent") === "on";
  const honeypot = str(fd, "firma_website");
  const source = str(fd, "source").slice(0, 40) || "newsletter";

  if (honeypot) return { ok: true, message: "Vielen Dank. Bitte prüfen Sie Ihr Postfach." };

  const errors: Record<string, string> = {};
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein, z. B. name@firma.de.";
  if (!consent) errors.consent = "Bitte bestätigen Sie die Einwilligung, damit wir Ihnen den Newsletter senden dürfen.";
  if (Object.keys(errors).length) return { ok: false, message: "Bitte prüfen Sie Ihre Eingaben.", errors, values: { email } };

  if (!isAdminConfigured() || !isMailConfigured()) {
    return { ok: false, message: "Die Newsletter-Anmeldung ist gerade nicht verfügbar. Bitte versuchen Sie es später noch einmal.", values: { email } };
  }

  const meta = clientMeta(await headers());
  if (!(await withinRateLimit("newsletter_subscribers", "consent_ip_hash", meta.ipHash, 5))) {
    return { ok: false, message: "Zu viele Anmeldungen in kurzer Zeit. Bitte versuchen Sie es später erneut.", values: { email } };
  }

  const db = createAdminClient();
  const { data: existing } = await db.from("newsletter_subscribers").select("id, status").eq("email", email).maybeSingle();
  // Same answer for known and unknown addresses, so the form does not reveal who is subscribed.
  const done: FormState = {
    ok: true,
    message: "Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung innerhalb von 48 Stunden über den Link in der E-Mail, die wir Ihnen gerade gesendet haben.",
  };
  if (existing?.status === "confirmed") return done;

  const token = randomToken();
  const row = {
    email,
    status: "pending",
    confirm_token: token,
    confirm_token_expires_at: new Date(Date.now() + 48 * 3600_000).toISOString(),
    unsubscribe_token: randomToken(),
    consent_ip_hash: meta.ipHash,
    consent_source: source,
    consent_text_version: CONSENT_VERSIONS.newsletter,
    user_agent: meta.userAgent,
  };
  const { error } = existing
    ? await db.from("newsletter_subscribers").update(row).eq("id", existing.id)
    : await db.from("newsletter_subscribers").insert(row);
  if (error) return { ok: false, message: "Ihre Anmeldung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.", values: { email } };

  const link = absoluteUrl(`/newsletter/bestaetigen?token=${token}`);
  const sent = await sendMail({
    to: email,
    subject: "Bitte bestätigen Sie Ihre Anmeldung zum Softwarenavi-Newsletter",
    text: `Guten Tag,\n\nbitte bestätigen Sie Ihre Anmeldung zum Newsletter von Softwarenavi über diesen Link:\n${link}\n\nDer Link ist 48 Stunden gültig. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach. Ihre Adresse wird dann automatisch gelöscht.\n\nSoftwarenavi`,
  });
  if (!sent) {
    await db.from("newsletter_subscribers").delete().eq("confirm_token", token).eq("status", "pending");
    return { ok: false, message: "Wir konnten Ihnen gerade keine Bestätigungsmail senden. Bitte versuchen Sie es später erneut.", values: { email } };
  }
  return done;
}

export async function unsubscribeNewsletter(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const token = str(fd, "token");
  if (!token && !EMAIL_RE.test(email)) {
    return { ok: false, message: "Bitte geben Sie die E-Mail-Adresse an, mit der Sie den Newsletter erhalten.", errors: { email: "Bitte geben Sie eine gültige E-Mail-Adresse ein." } };
  }
  const done: FormState = { ok: true, message: "Sie wurden vom Newsletter abgemeldet. Sie erhalten ab sofort keine weiteren Ausgaben." };
  if (!isAdminConfigured()) return done;

  const db = createAdminClient();
  const patch = { status: "unsubscribed", unsubscribed_at: new Date().toISOString(), confirm_token: null };
  if (token && /^[A-Za-z0-9_-]{16,128}$/.test(token)) await db.from("newsletter_subscribers").update(patch).eq("unsubscribe_token", token);
  else if (email) await db.from("newsletter_subscribers").update(patch).eq("email", email);
  // Same answer either way: an unsubscribe form must not confirm whether an address is on the list.
  return done;
}
