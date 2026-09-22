"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { sendContactMessage } from "@/app/(public)/kontakt/actions";
import { initialFormState } from "@/lib/forms";
import { Field, Input, Textarea, NativeSelect } from "@/components/ui/form-controls";
import { ConsentCheckbox, Honeypot, RequiredNote } from "./ConsentCheckbox";

const SUBJECTS = ["Allgemeine Anfrage", "Korrektur einer Angabe", "Software eintragen", "Presse", "Datenschutz / Auskunft", "Barrierefreiheit"];

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initialFormState);
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.ok) toast.success("Nachricht gesendet", { description: state.message });
    else if (state.message) alertRef.current?.focus();
  }, [state]);

  if (state.ok) {
    return (
      <div role="status" className="rounded-xl border border-brand bg-brand-light p-6">
        <CheckCircle2 className="size-8 text-brand-dark" aria-hidden="true" />
        <p className="mt-3 font-heading text-xl font-semibold">Vielen Dank</p>
        <p className="mt-1 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="relative flex flex-col gap-5">
      <Honeypot />
      {state.message && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="rounded-lg border border-destructive/30 bg-red-50 p-4 text-sm font-medium text-destructive outline-none">
          {state.message}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="c-name" label="Ihr Name" required error={e.name}>
          <Input id="c-name" name="name" autoComplete="name" required aria-required="true" maxLength={120} defaultValue={v.name} aria-invalid={!!e.name} aria-describedby={e.name ? "c-name-error" : undefined} />
        </Field>
        <Field id="c-email" label="E-Mail-Adresse" required error={e.email}>
          <Input id="c-email" name="email" type="email" autoComplete="email" required aria-required="true" defaultValue={v.email} aria-invalid={!!e.email} aria-describedby={e.email ? "c-email-error" : undefined} />
        </Field>
      </div>
      <Field id="c-subject" label="Betreff" required error={e.subject}>
        <NativeSelect id="c-subject" name="subject" required aria-required="true" defaultValue={v.subject || SUBJECTS[0]} aria-invalid={!!e.subject}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
      </Field>
      <Field id="c-message" label="Ihre Nachricht" required error={e.message} hint="Höchstens 4.000 Zeichen">
        <Textarea id="c-message" name="message" required aria-required="true" maxLength={4000} rows={6} defaultValue={v.message} aria-invalid={!!e.message} aria-describedby={e.message ? "c-message-error" : "c-message-hint"} />
      </Field>
      <ConsentCheckbox id="c-consent" error={e.consent} purpose="zur Bearbeitung meiner Anfrage" />
      <RequiredNote />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-fit items-center gap-2 rounded-[7px] btn-glossy px-7 font-medium disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
        Nachricht senden
      </button>
    </form>
  );
}
