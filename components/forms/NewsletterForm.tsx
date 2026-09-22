"use client";

import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { subscribeNewsletter } from "@/app/(public)/softwarebrief/actions";
import { initialFormState } from "@/lib/forms";
import { cn } from "@/lib/utils";
import { ConsentCheckbox, Honeypot } from "./ConsentCheckbox";
import Link from "next/link";

/**
 * Double-opt-in newsletter form. States purpose, sender, frequency and the right of withdrawal
 * before the submit button (frontend §10.4).
 */
export function NewsletterForm({ variant = "full", source = "unbekannt" }: { variant?: "full" | "compact" | "dark"; source?: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialFormState);
  const id = useId();
  const dark = variant === "dark";

  useEffect(() => {
    if (state.ok && state.message) toast.success("Bitte bestätigen Sie Ihre Anmeldung", { description: state.message });
  }, [state]);

  if (state.ok) {
    return (
      <div className={cn("flex items-start gap-3 rounded-lg border p-4", dark ? "border-white/15 text-white" : "border-brand bg-white text-ink")} role="status">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p className="text-sm leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative flex flex-col gap-3" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <div className={cn("flex flex-col gap-2", variant !== "full" && "sm:flex-row")}>
        <label htmlFor={`${id}-email`} className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? `${id}-email-error` : undefined}
          defaultValue={state.values?.email}
          placeholder="Ihre geschäftliche E-Mail-Adresse"
          className={cn(
            "h-12 min-w-0 flex-1 rounded-md px-4 text-[15px] outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            dark
              ? "border border-white/20 bg-transparent text-white placeholder:text-white/60"
              : "border border-border bg-white placeholder:text-[#8f8c9b] focus:border-ink",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[7px] btn-glossy px-6 text-sm font-medium disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
          Anmelden
        </button>
      </div>
      {state.errors?.email && (
        <p id={`${id}-email-error`} className={cn("text-xs font-medium", dark ? "text-red-300" : "text-destructive")} aria-live="polite">
          {state.errors.email}
        </p>
      )}
      <div className={dark ? "[&_label]:text-white/70 [&_a]:text-white" : undefined}>
        <ConsentCheckbox id={`${id}-consent`} error={state.errors?.consent}>
          Ich möchte den Softwarebrief von Softwarenavi (höchstens zweimal im Monat, Softwaretests, Vergleiche und Fristen) per E-Mail erhalten. Die Einwilligung
          kann ich jederzeit über den Abmeldelink widerrufen. Hinweise zur Verarbeitung in der{" "}
          <Link href="/datenschutz" className="font-medium underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </ConsentCheckbox>
      </div>
      {variant === "full" && (
        <p className="text-xs text-muted-foreground">
          Absender: Softwarenavi, hallo@softwarenavi.de. Double-Opt-in: Sie erhalten zunächst eine E-Mail zur Bestätigung. Kein Tracking in der
          Bestätigungsmail.
        </p>
      )}
    </form>
  );
}
