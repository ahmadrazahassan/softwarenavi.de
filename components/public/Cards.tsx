import Link from "next/link";
import { ArrowRight, ArrowUpRight, Boxes, Star, Calculator, Clock, FolderArchive, Handshake, KanbanSquare, Users, Wallet } from "lucide-react";
import type { Category, ComparisonWithSoftware, Software } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatCount, formatMoney, formatPeriod, formatPrice, formatRating } from "@/lib/utils/format";
import { hy } from "@/lib/utils/hyphenate";
import { SoftwareLogo } from "./SoftwareLogo";
import { AffiliateCTAButton } from "./Affiliate";
import { StarRating } from "./Rating";
import { ComplianceBadges } from "./ComplianceBadges";
import { ratingCaption, ratingCaptionShort } from "@/lib/rating";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  calculator: Calculator,
  wallet: Wallet,
  users: Users,
  handshake: Handshake,
  boxes: Boxes,
  kanban: KanbanSquare,
  clock: Clock,
  "folder-archive": FolderArchive,
};

/** Line icon only — never on a filled tile. */
export function CategoryIcon({ icon, className }: { icon: string | null; className?: string }) {
  const Icon = (icon && CATEGORY_ICONS[icon]) || Boxes;
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />;
}

/** Shared card surface: white, hairline border, soft radius, border darkens on hover. */
export const cardBase =
  "group relative flex flex-col rounded-xl border border-border bg-white transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink";

/** „ab 12,90 € / Monat · netto" — or „Preis auf Anfrage". */
export function PriceLine({ software, className }: { software: Software; className?: string }) {
  const v = software.starting_price;
  if (v === null || v === 0) {
    return (
      <p className={cn("text-sm", className)}>
        <span className="font-medium text-ink">{v === 0 ? "Kostenlos" : formatPrice(null)}</span>
      </p>
    );
  }
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      ab <span className="font-semibold text-ink">{formatMoney(v, software.price_currency)}</span> {formatPeriod(software.billing_period, software.price_unit)}
      <span className="text-xs"> · netto</span>
    </p>
  );
}

/**
 * What a buyer can try before paying, straight from the verified vendor data:
 * „30 Tage kostenlos testen" · „Kostenlose Demo" · „Gratis-Version". Nothing is shown when nothing is offered.
 */
export function OfferBadges({ software, className, max = 3 }: { software: Software; className?: string; max?: number }) {
  const out: { key: string; label: string; strong?: boolean }[] = [];
  if (software.free_version) out.push({ key: "free", label: "Gratis-Version", strong: true });
  if (software.free_trial) out.push({ key: "trial", label: software.trial_days ? `${software.trial_days} Tage kostenlos testen` : "Kostenlos testen", strong: !software.free_version });
  if (software.free_demo) out.push({ key: "demo", label: "Kostenlose Demo" });
  if (!out.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Testmöglichkeiten">
      {out.slice(0, max).map((b) => (
        <li
          key={b.key}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold",
            b.strong ? "bg-lime text-ink" : "border border-border text-ink",
          )}
        >
          {b.label}
        </li>
      ))}
    </ul>
  );
}

/** Solid lime rating meter (0–5 → 0–100 %), no gradient. */
export function RatingMeter({ rating, className, track = "light" }: { rating: number; className?: string; track?: "light" | "dark" }) {
  return (
    <span className={cn("block h-1.5 overflow-hidden rounded-full", track === "dark" ? "bg-white/12" : "bg-ink/[0.07]", className)} aria-hidden="true">
      <span className="block h-full rounded-full bg-lime" style={{ width: `${Math.max(0, Math.min(100, (rating / 5) * 100))}%` }} />
    </span>
  );
}

/** Prominent price block: small label, large figure, period + „netto" underneath. */
export function PriceTag({ software, className, size = "md", align = "left" }: { software: Software; className?: string; size?: "md" | "lg"; align?: "left" | "right" }) {
  const v = software.starting_price;
  const big = size === "lg" ? "text-[1.75rem] md:text-[2rem]" : "text-[1.5rem]";
  return (
    <div className={cn("min-w-0", align === "right" && "text-right", className)}>
      <span className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{v === null ? "Preis" : v === 0 ? "Einstieg" : "ab"}</span>
      <span className={cn("mt-0.5 block font-heading font-medium leading-none tracking-[-0.035em] tabular-nums text-ink", big)}>
        {v === null ? "auf Anfrage" : v === 0 ? "Kostenlos" : formatMoney(v, software.price_currency)}
      </span>
      {v !== null && v > 0 && (
        <span className="mt-1.5 block truncate text-xs text-muted-foreground">
          {formatPeriod(software.billing_period, software.price_unit)} · netto
        </span>
      )}
    </div>
  );
}

/**
 * Two actions per product card: our profile (reviews, prices, compliance) and the vendor's site via partner link.
 * Sits above the card-wide link overlay (z-[1]). The partner link is labelled „Anzeige" in the section disclosure.
 */
export function CardActions({ software, tone = "light", className }: { software: Software; tone?: "light" | "dark"; className?: string }) {
  return (
    <div className={cn("relative z-[1] grid grid-cols-2 gap-2", className)}>
      <Link
        href={`/software/${software.slug}`}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-[7px] border px-3 text-sm font-medium transition-colors",
          tone === "dark" ? "border-white/20 text-white hover:border-white" : "border-border bg-white text-ink hover:border-ink",
        )}
      >
        Zum Profil
      </Link>
      <AffiliateCTAButton software={software} label="Zur Website" size="sm" className="h-10" />
    </div>
  );
}

/** One line under a card grid that marks the „Zur Website" buttons as advertising (§ 5a Abs. 4 UWG). */
export function PartnerLinkNote({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <p className={cn("text-xs leading-relaxed", tone === "dark" ? "text-white/55" : "text-muted-foreground", className)}>
      <strong className={cn("font-semibold", tone === "dark" ? "text-white" : "text-ink")}>Anzeige:</strong> „Zur Website“ führt über einen Partnerlink zum
      Anbieter. Kommt ein Vertrag zustande, erhalten wir eine Provision. Ihr Preis bleibt gleich, die Rangfolge ebenfalls.{" "}
      <Link href="/affiliate-hinweis" className="underline decoration-brand underline-offset-2">
        Mehr dazu
      </Link>
    </p>
  );
}

export function SoftwareCard({ software, rank, className }: { software: Software; rank?: number; className?: string }) {
  return (
    <article className={cn(cardBase, "p-6 md:p-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <SoftwareLogo software={software} size={72} rounded="rounded-xl" />
        <div className="text-right">
          {rank !== undefined && (
            <span className="block font-heading text-sm font-medium tabular-nums text-muted-foreground" aria-label={`Platz ${rank}`}>
              #{String(rank).padStart(2, "0")}
            </span>
          )}
          <span className="mt-1 block font-heading text-[2rem] font-medium leading-none tracking-[-0.03em] tabular-nums">{formatRating(software.overall_rating)}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{ratingCaption(software)}</span>
        </div>
      </div>

      <h3 className="card-title mt-6 font-heading text-2xl font-medium leading-tight tracking-[-0.025em]">
        <Link href={`/software/${software.slug}`} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
          {software.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {software.vendor_name}
        {software.category && <> · {software.category.name}</>}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <StarRating rating={software.overall_rating} size="md" />
        <RatingMeter rating={software.overall_rating} className="flex-1" />
      </div>

      <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{software.description_short}</p>

      <OfferBadges software={software} max={2} className="mt-5" />
      <ComplianceBadges software={software} max={3} className="relative z-[1] mt-2" />

      <div className="mt-auto border-t border-border pt-5 [&]:mt-6">
        <PriceTag software={software} />
        <CardActions software={software} className="mt-4" />
      </div>
    </article>
  );
}

/** Minimal directory tile: identity, rating, two-line pitch, up to two compliance chips, price. */
export function DirectoryCard({ software, className }: { software: Software; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_18px_40px_-24px_rgba(21,19,30,0.35)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <SoftwareLogo software={software} size={48} rounded="rounded-lg" />
        <span className="inline-flex items-center gap-1.5 rounded-md bg-paper px-2 py-1 text-sm">
          <Star className="size-3.5 text-brand-dark" fill="currentColor" strokeWidth={0} aria-hidden="true" />
          <span className="font-semibold tabular-nums">{formatRating(software.overall_rating)}</span>
          <span className="text-xs text-muted-foreground tabular-nums">{ratingCaptionShort(software)}</span>
        </span>
      </div>

      <h3 className="card-title mt-5 font-heading text-xl font-medium leading-tight tracking-[-0.02em]">
        <Link href={`/software/${software.slug}`} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none">
          {software.name}
        </Link>
      </h3>
      <p className="mt-1 truncate text-[13px] text-muted-foreground">
        {software.vendor_name}
        {software.category && <> · {software.category.name}</>}
      </p>

      <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{software.description_short}</p>

      <OfferBadges software={software} max={2} className="mt-5" />
      <ComplianceBadges software={software} max={2} className="relative z-[1] mt-2" />

      <div className="mt-auto border-t border-border pt-5 [&]:mt-6">
        <PriceTag software={software} />
        <CardActions software={software} className="mt-4" />
      </div>
    </article>
  );
}

export function SoftwareListRow({ software }: { software: Software }) {
  return (
    <article className={cn(cardBase, "flex-row items-center gap-4 p-4 hover:translate-y-0 md:gap-5 md:p-5")}>
      <SoftwareLogo software={software} size={60} rounded="rounded-xl" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="card-title font-heading text-[17px] font-semibold">
            <Link href={`/software/${software.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
              {software.name}
            </Link>
          </h3>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <StarRating rating={software.overall_rating} size="xs" />
            <span className="font-semibold tabular-nums">{formatRating(software.overall_rating)}</span>
            <span className="text-muted-foreground">{ratingCaptionShort(software)}</span>
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{software.description_short}</p>
        <ComplianceBadges software={software} className="relative z-[1] mt-2.5 hidden sm:flex" />
      </div>
      <PriceLine software={software} className="hidden shrink-0 text-right lg:block" />
    </article>
  );
}

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  return (
    <article className={cn(cardBase, "p-6", className)}>
      <CategoryIcon icon={category.icon} className="size-7 text-brand-dark" />
      <h3 className="card-title mt-8 font-heading text-xl font-semibold tracking-[-0.015em]">
        <Link href={`/kategorie/${category.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
          {hy(category.name)}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
      <p className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm font-medium [&]:mt-6">
        <span>{formatCount(category.software_count)} Programme</span>
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </p>
    </article>
  );
}

export function ComparisonCard({ comparison, className }: { comparison: ComparisonWithSoftware; className?: string }) {
  const { a, b } = comparison;
  return (
    <article className={cn(cardBase, "p-5", className)}>
      <div className="flex items-center gap-2">
        <SoftwareLogo software={a} size={40} />
        <span className="text-xs font-medium text-muted-foreground">vs.</span>
        <SoftwareLogo software={b} size={40} />
      </div>
      <h3 className="card-title mt-5 font-heading text-base font-semibold leading-snug">
        <Link href={`/vergleich/${comparison.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
          {a.name} vs. {b.name}
        </Link>
      </h3>
      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        {[a, b].map((s) => (
          <div key={s.id} className="flex flex-col-reverse">
            <dt className="truncate">{s.name}</dt>
            <dd className="font-heading text-lg font-semibold tabular-nums text-ink">{formatRating(s.overall_rating)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
        Zum Vergleich <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </p>
    </article>
  );
}

export function AlternativeCard({ software, base }: { software: Software; base?: Software }) {
  return (
    <article className={cn(cardBase, "p-5")}>
      <div className="flex items-center gap-3">
        <SoftwareLogo software={software} size={44} />
        <div className="min-w-0">
          <h3 className="card-title font-heading font-semibold">
            <Link href={`/software/${software.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
              {software.name}
            </Link>
          </h3>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <StarRating rating={software.overall_rating} size="xs" />
            <span className="font-semibold tabular-nums">{formatRating(software.overall_rating)}</span>
            <span className="text-muted-foreground">{ratingCaptionShort(software)}</span>
          </span>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{software.description_short}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <PriceLine software={software} className="text-xs" />
        {base && (
          <Link
            href={`/vergleich/${base.slug}-vs-${software.slug}`}
            className="relative z-[1] shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-ink"
          >
            Vergleichen
          </Link>
        )}
      </div>
    </article>
  );
}
