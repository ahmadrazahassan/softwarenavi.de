import "server-only";

/**
 * Transactional mail through Resend (https://resend.com). Needs RESEND_API_KEY and a sender address on a domain
 * verified in the Resend account (MAIL_FROM, default hallo@softwarenavi.de).
 * Returns false instead of throwing, so callers can tell the user the truth about whether a mail went out.
 */
export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMail(opts: { to: string; subject: string; text: string; html?: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.MAIL_FROM || "hallo@softwarenavi.de";
  const fromName = process.env.MAIL_FROM_NAME || "Softwarenavi";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: `${fromName} <${from}>`,
        to: [opts.to],
        subject: opts.subject,
        text: opts.text,
        ...(opts.html ? { html: opts.html } : {}),
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
