"use client";

import { CompliancePanel, DatevExportPanel, EInvoicePanel } from "./FinanceVisuals";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    title: "DATEV-Schnittstelle",
    text: "Die DATEV eG zählt rund 40.000 Mitglieder, die meisten davon Steuerkanzleien. Die entscheidende Frage lautet deshalb: Kommen Buchungsstapel und Belegbilder sauber bei Ihrer Kanzlei an?",
    points: ["DATEV-Export oder Vollintegration", "Belegbilder inklusive", "SKR 03 und SKR 04"],
    href: "/software?datev=ja",
    cta: "Programme mit DATEV-Schnittstelle",
  },
  {
    title: "E-Rechnung",
    text: "Seit dem 1. Januar 2025 müssen Unternehmen E-Rechnungen empfangen können. Ab 2027 müssen Betriebe mit mehr als 800.000 Euro Vorjahresumsatz sie auch ausstellen, ab 2028 alle. Wir zeigen, wer XRechnung und ZUGFeRD beherrscht.",
    points: ["XRechnung und ZUGFeRD", "Validierung im Eingang", "Archivierung im Originalformat"],
    href: "/software?erechnung=ja",
    cta: "Programme mit E-Rechnung",
  },
  {
    title: "GoBD-Konformität",
    text: "Festgeschriebene Buchungen, lückenlose Protokolle und eine Archivierung, die einer Betriebsprüfung standhält. Wir kennzeichnen, welche Anbieter die GoBD nach eigener Angabe erfüllen.",
    points: ["Unveränderbare Buchungen", "Aufbewahrungsfristen", "Verfahrensdokumentation"],
    href: "/software?gobd=ja",
    cta: "GoBD-konforme Programme",
  },
  {
    title: "Serverstandort Deutschland",
    text: "Für Kanzleien, Arztpraxen und öffentliche Auftraggeber oft das erste Kriterium: ein Rechenzentrum in Deutschland und ein AV-Vertrag nach DSGVO.",
    points: ["Hosting in Deutschland oder EU", "AV-Vertrag nach Art. 28 DSGVO", "ISO 27001 wo vorhanden"],
    href: "/software?serverstandort=Deutschland",
    cta: "Programme mit Serverstandort Deutschland",
  },
];

/** Use-case accordion with a matching product panel (reference „Squish — Use for every project"). */
export function ComplianceAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
      <div key={open} className="animate-[reveal_.5s_cubic-bezier(0.22,1,0.36,1)_both] lg:min-h-[420px]">
        {open === 0 ? (
          <DatevExportPanel className="h-full" />
        ) : open === 1 ? (
          <EInvoicePanel className="h-full" />
        ) : (
          <CompliancePanel className="h-full" />
        )}
      </div>
      <ul className="flex flex-col border-t border-border">
        {ITEMS.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={it.title} className="border-b border-border">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`acc-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-heading text-xl font-medium tracking-[-0.015em] md:text-2xl"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    {it.title}
                  </span>
                  {isOpen ? <Minus className="size-5 shrink-0" aria-hidden="true" /> : <Plus className="size-5 shrink-0" aria-hidden="true" />}
                </button>
              </h3>
              <div id={`acc-${i}`} className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="pb-6 pl-10">
                    <p className="max-w-lg text-[15px] leading-relaxed text-muted-foreground">{it.text}</p>
                    <ul className="mt-4 flex flex-col gap-2 text-sm">
                      {it.points.map((p) => (
                        <li key={p} className="flex items-center gap-2.5">
                          <span className="size-1.5 bg-brand" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link href={it.href} className="mt-5 inline-flex text-sm font-medium underline decoration-brand decoration-2 underline-offset-4 hover:decoration-ink" tabIndex={isOpen ? 0 : -1}>
                      {it.cta} →
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
