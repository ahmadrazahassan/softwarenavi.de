"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Cookie } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/form-controls";
import { COOKIE_POLICY_VERSION } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * TDDDG § 25 consent gate.
 * - Nothing non-essential loads before a decision.
 * - „Nur notwendige" is visually equal to „Alle akzeptieren".
 * - Decision stored in first-party cookie `sl_consent` (6 months), withdrawable via the footer link.
 * - Every interaction is POSTed to /api/consent for the Art. 7 Abs. 1 DSGVO audit trail.
 */

export type ConsentCategories = { notwendig: true; statistik: boolean; externe_medien: boolean };
type Stored = { id: string; v: string; c: ConsentCategories; t: number };

const COOKIE = "sl_consent";
const MAX_AGE = 60 * 60 * 24 * 182; // ~6 Monate

function readCookie(): Stored | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Stored;
    // A new policy version requires a fresh decision.
    return parsed.v === COOKIE_POLICY_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function writeCookie(s: Stored) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(s))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);

type Ctx = {
  consent: ConsentCategories | null;
  decided: boolean;
  openSettings: () => void;
};

const ConsentContext = createContext<Ctx>({ consent: null, decided: false, openSettings: () => {} });
export const useConsent = () => useContext(ConsentContext);

export function ConsentProvider({ children, analyticsDomain }: { children: React.ReactNode; analyticsDomain?: string }) {
  const [stored, setStored] = useState<Stored | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState({ statistik: false, externe_medien: false });

  useEffect(() => {
    // Reading a browser-only cookie after mount is the one legitimate setState-in-effect here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(readCookie());
    setReady(true);
  }, []);

  const decide = useCallback(
    (c: { statistik: boolean; externe_medien: boolean }, action: "granted" | "denied" | "updated" | "withdrawn") => {
      const next: Stored = {
        id: stored?.id ?? randomId(),
        v: COOKIE_POLICY_VERSION,
        c: { notwendig: true, ...c },
        t: Date.now(),
      };
      writeCookie(next);
      setStored(next);
      setSettingsOpen(false);
      void fetch("/api/consent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ consent_id: next.id, categories: next.c, action, policy_version: next.v }),
        keepalive: true,
      }).catch(() => {});
    },
    [stored],
  );

  const openSettings = useCallback(() => {
    setDraft({ statistik: stored?.c.statistik ?? false, externe_medien: stored?.c.externe_medien ?? false });
    setSettingsOpen(true);
  }, [stored]);

  const value = useMemo<Ctx>(() => ({ consent: stored?.c ?? null, decided: !!stored, openSettings }), [stored, openSettings]);

  const showBanner = ready && !stored && !settingsOpen;

  return (
    <ConsentContext.Provider value={value}>
      {children}

      {/* Statistik — self-hosted, cookieless Plausible. Loaded ONLY after explicit consent. */}
      {stored?.c.statistik && analyticsDomain && (
        <Script
          defer
          data-domain="softwarenavi.de"
          src={`https://${analyticsDomain}/js/script.js`}
          strategy="afterInteractive"
        />
      )}

      {showBanner && (
        <section
          role="region"
          aria-label="Cookie-Einwilligung"
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-lg border border-border bg-white p-5 shadow-[0_24px_50px_-24px_rgba(21,19,30,0.45)] md:inset-x-6 md:bottom-6 md:p-6"
        >
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 size-6 shrink-0 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">Ihre Privatsphäre-Einstellungen</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Wir verwenden technisch notwendige Speicherungen, damit die Website funktioniert. Mit Ihrer Einwilligung nutzen wir zusätzlich eine
                cookielose, selbst gehostete Reichweitenmessung und laden externe Medien. Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen“ im
                Fußbereich ändern. Mehr in der{" "}
                <Link href="/cookie-richtlinie" className="font-medium text-ink underline decoration-brand underline-offset-2">
                  Cookie-Richtlinie
                </Link>{" "}
                und der{" "}
                <Link href="/datenschutz" className="font-medium text-ink underline decoration-brand underline-offset-2">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </div>
          {/* Three equally prominent choices — same size, same contrast, same level. */}
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <ConsentButton onClick={() => decide({ statistik: true, externe_medien: true }, "granted")}>Alle akzeptieren</ConsentButton>
            <ConsentButton onClick={() => decide({ statistik: false, externe_medien: false }, "denied")}>Nur notwendige</ConsentButton>
            <ConsentButton onClick={openSettings}>Einstellungen</ConsentButton>
          </div>
        </section>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-xl">
          <DialogTitle>Cookie-Einstellungen</DialogTitle>
          <DialogDescription>
            Wählen Sie, welchen Kategorien Sie zustimmen. Ihre Auswahl wird für sechs Monate gespeichert und kann jederzeit geändert werden.
          </DialogDescription>
          <div className="mt-5 flex flex-col gap-3">
            <CategoryRow
              id="c-notwendig"
              title="Notwendig"
              checked
              disabled
              description="Erforderlich für den Betrieb der Website. Kann nicht deaktiviert werden."
              items={[
                { name: "sl_consent", purpose: "Speichert Ihre Einwilligungsentscheidung", provider: "Softwarenavi", duration: "6 Monate", basis: "§ 25 Abs. 2 Nr. 2 TDDDG" },
              ]}
            />
            <CategoryRow
              id="c-statistik"
              title="Statistik"
              checked={draft.statistik}
              onChange={(v) => setDraft((d) => ({ ...d, statistik: v }))}
              description="Cookielose, selbst gehostete Reichweitenmessung mit IP-Anonymisierung. Keine Weitergabe an Dritte."
              items={[{ name: "Plausible (selbst gehostet)", purpose: "Anonyme Zählung von Seitenaufrufen", provider: "Softwarenavi (EU)", duration: "keine Speicherung auf Ihrem Gerät", basis: "Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG" }]}
            />
            <CategoryRow
              id="c-externe"
              title="Externe Medien"
              checked={draft.externe_medien}
              onChange={(v) => setDraft((d) => ({ ...d, externe_medien: v }))}
              description="Eingebettete Videos und Produktdemos von Softwareanbietern. Diese können eigene Cookies setzen."
              items={[{ name: "Eingebettete Inhalte", purpose: "Anzeige von Videos und Demos", provider: "jeweiliger Anbieter", duration: "gemäß Anbieter", basis: "Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG" }]}
            />
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <ConsentButton onClick={() => decide(draft, stored ? (draft.statistik || draft.externe_medien ? "updated" : "withdrawn") : draft.statistik || draft.externe_medien ? "granted" : "denied")}>
              Auswahl speichern
            </ConsentButton>
            <ConsentButton onClick={() => decide({ statistik: true, externe_medien: true }, stored ? "updated" : "granted")}>Alle akzeptieren</ConsentButton>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Version {COOKIE_POLICY_VERSION}. Details in der{" "}
            <Link href="/cookie-richtlinie" className="underline" onClick={() => setSettingsOpen(false)}>
              Cookie-Richtlinie
            </Link>
            .
          </p>
        </DialogContent>
      </Dialog>
    </ConsentContext.Provider>
  );
}

function ConsentButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-[7px] btn-glossy px-4 text-sm font-medium"
    >
      {children}
    </button>
  );
}

function CategoryRow({
  id,
  title,
  description,
  checked,
  disabled,
  onChange,
  items,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  items: { name: string; purpose: string; provider: string; duration: string; basis: string }[];
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <label htmlFor={id} className="font-semibold">
            {title}
          </label>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} aria-label={`${title} ${checked ? "aktiviert" : "deaktiviert"}`} />
      </div>
      <details className="group mt-3">
        <summary className="cursor-pointer text-xs font-medium text-brand-dark">Details anzeigen</summary>
        <ul className="mt-2 flex flex-col gap-2">
          {items.map((it) => (
            <li key={it.name} className={cn("rounded-md bg-paper p-3 text-xs")}>
              <p className="font-semibold">{it.name}</p>
              <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-muted-foreground">
                <dt>Zweck</dt>
                <dd>{it.purpose}</dd>
                <dt>Anbieter</dt>
                <dd>{it.provider}</dd>
                <dt>Speicherdauer</dt>
                <dd>{it.duration}</dd>
                <dt>Rechtsgrundlage</dt>
                <dd>{it.basis}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

/** Footer link that re-opens the dialog — the permanent withdrawal path. */
export function CookieSettingsLink({ className }: { className?: string }) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
