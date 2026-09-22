"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/form-controls";

/** DSGVO consent line — unchecked by default, required (frontend §10.4). */
export function ConsentCheckbox({
  id,
  name = "consent",
  error,
  purpose = "zu diesem Zweck",
  children,
}: {
  id: string;
  name?: string;
  error?: string;
  purpose?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <Checkbox id={id} name={name} required aria-required="true" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
        <label htmlFor={id} className="text-sm leading-relaxed text-muted-foreground">
          {children ?? (
            <>
              Ich habe die{" "}
              <Link href="/datenschutz" className="font-medium text-brand-dark underline underline-offset-2" target="_blank">
                Datenschutzerklärung
              </Link>{" "}
              gelesen und willige in die Verarbeitung meiner Daten {purpose} ein.
            </>
          )}
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="pl-8 text-xs font-medium text-destructive" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

/** Invisible honeypot — bots fill it, humans never see it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="firma_website">Website (bitte leer lassen)</label>
      <input id="firma_website" name="firma_website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function RequiredNote() {
  return (
    <p className="text-xs text-muted-foreground">
      <span className="text-destructive" aria-hidden="true">
        *
      </span>{" "}
      Pflichtfeld
    </p>
  );
}
