"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { unsubscribeNewsletter } from "@/app/(public)/newsletter/actions";
import { initialFormState } from "@/lib/forms";
import { Field, Input } from "@/components/ui/form-controls";

export function NewsletterUnsubscribeForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(unsubscribeNewsletter, initialFormState);
  if (state.ok) {
    return (
      <p role="status" className="flex items-start gap-3 rounded-lg border border-brand bg-brand-light p-4 text-sm text-ink">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="token" value={token} />
      {!token && (
        <Field id="unsub-email" label="E-Mail-Adresse" required error={state.errors?.email}>
          <Input id="unsub-email" name="email" type="email" autoComplete="email" required aria-required="true" aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? "unsub-email-error" : undefined} />
        </Field>
      )}
      <button type="submit" disabled={pending} className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] btn-glossy px-6 text-sm font-medium disabled:opacity-60">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Jetzt abmelden
      </button>
    </form>
  );
}
