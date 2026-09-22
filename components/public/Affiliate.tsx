import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Software } from "@/lib/types";
import { cn } from "@/lib/utils";
import { buttonClasses } from "./GlossyButton";

/**
 * Always routes through /api/track-click — the single source of truth for vendor URLs.
 * Never hardcode a vendor link in JSX.
 */
export function AffiliateCTAButton({
  software,
  label,
  size = "md",
  fullWidth,
  className,
  variant = "brand",
}: {
  software: Pick<Software, "id" | "name" | "slug" | "brand_color" | "starting_price" | "free_trial">;
  label?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  variant?: "brand" | "accent" | "outline";
}) {
  const text = label ?? (software.free_trial ? "Kostenlos testen" : software.starting_price === null ? "Preis anfragen" : "Zum Anbieter");
  return (
    <a
      href={`/api/track-click?id=${encodeURIComponent(software.id)}`}
      target="_blank"
      rel="sponsored nofollow noopener"
      aria-label={`${text}: ${software.name}, Partnerlink, öffnet in neuem Tab`}
      className={cn("group", buttonClasses({ variant: variant === "outline" ? "neutral" : variant, size, fullWidth }), className)}
    >
      {text}
      <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

/** Werbekennzeichnung nach § 5a Abs. 4 UWG — placed directly under the primary CTA. */
export function AffiliateDisclosureNote({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <p className={cn("text-[12px] leading-snug text-muted-foreground", className)}>
        <strong className="font-semibold text-ink">Anzeige:</strong> Partnerlink. Bei Abschluss erhalten wir eine Provision, Ihr Preis ändert sich nicht.{" "}
        <Link href="/affiliate-hinweis" className="underline decoration-brand underline-offset-2 hover:text-ink">
          Mehr erfahren
        </Link>
      </p>
    );
  }
  return (
    <p className={cn("border-l-2 border-brand pl-3 text-xs leading-relaxed text-muted-foreground", className)}>
      <strong className="font-semibold text-ink">Anzeige:</strong> Dieser Link ist ein Partnerlink. Bei einem Abschluss erhalten wir eine Provision. Für Sie
      ändert sich der Preis dadurch nicht. Unsere Bewertungen bleiben davon unberührt.{" "}
      <Link href="/affiliate-hinweis" className="underline decoration-brand underline-offset-2 hover:text-ink">
        Affiliate-Hinweis
      </Link>
    </p>
  );
}
