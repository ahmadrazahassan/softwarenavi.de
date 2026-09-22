import { rangeLabel, RATING_DIMENSIONS } from "@/lib/i18n/options";
import Link from "next/link";
import { BadgeCheck, Building2, Clock, MapPin, MessageSquareReply, Star, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDateLong, formatDateShort } from "@/lib/utils/format";
import { StarRating } from "./Rating";

/** Soft avatar tints from the site palette; picked by name so a reviewer keeps their colour. */
const AVATAR_TINTS = [
  "bg-brand-light text-brand-dark",
  "bg-[#e9f8cf] text-lime-dark",
  "bg-[#fdefe3] text-warning",
  "bg-[#e3f3ee] text-success",
  "bg-paper text-ink",
];

function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
}

function Initials({ name }: { name: string }) {
  const clean = name.replace(/\(Demo\)/, "").trim();
  const parts = clean.split(/\s+/);
  const ini = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (
    <span className={cn("grid size-11 shrink-0 place-items-center rounded-full font-heading text-sm font-semibold", tintFor(clean))} aria-hidden="true">
      {ini.toUpperCase()}
    </span>
  );
}

/** Score pill: lime for 4–5, violet for 3, muted red for 1–2. */
function ScoreBadge({ rating }: { rating: number }) {
  const tone = rating >= 4 ? "bg-lime text-ink" : rating === 3 ? "bg-brand-light text-brand-dark" : "bg-error/10 text-error";
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums", tone)}>
      <Star className="size-3.5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
      {rating.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
    </span>
  );
}

export function ReviewCard({
  review,
  softwareName,
  softwareSlug,
  compact = false,
}: {
  review: Review;
  softwareName?: string;
  softwareSlug?: string;
  compact?: boolean;
}) {
  const meta = [review.reviewer_job_title, review.reviewer_company].filter(Boolean);
  const dims = RATING_DIMENSIONS.flatMap((d) => {
    const value = review[d.key];
    return typeof value === "number" ? [{ label: d.label as string, value }] : [];
  });

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-18px_rgba(21,19,30,0.25)] md:p-7">
      <header className="flex items-start gap-3">
        <Initials name={review.reviewer_name} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 font-medium">
            {review.reviewer_name}
            {review.verified_badge && (
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-success">
                <BadgeCheck className="size-3" aria-hidden="true" /> {review.verified_badge}
              </span>
            )}
          </p>
          {meta.length > 0 && <p className="truncate text-sm text-muted-foreground">{meta.join(" · ")}</p>}
        </div>
        <ScoreBadge rating={review.overall_rating} />
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <StarRating rating={review.overall_rating} size="md" />
        <time dateTime={review.review_date} className="text-xs text-muted-foreground">
          {formatDateShort(review.review_date)}
        </time>
        {softwareName && softwareSlug && (
          <Link href={`/software/${softwareSlug}`} className="text-xs font-medium text-ink underline decoration-brand underline-offset-2">
            {softwareName}
          </Link>
        )}
      </div>

      <h3 className="mt-3 font-heading text-xl font-medium leading-snug tracking-[-0.015em]">„{review.review_title}“</h3>

      {!compact && review.summary && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{review.summary}</p>}

      <div className={cn("mt-5 grid gap-3", !compact && "md:grid-cols-2")}>
        {review.pros && (
          <div className="rounded-xl bg-success/[0.06] p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-success">
              <span className="grid size-6 place-items-center rounded-full bg-success/12" aria-hidden="true">
                <ThumbsUp className="size-3.5" />
              </span>
              Das gefällt
            </p>
            <p className={cn("mt-2 text-sm leading-relaxed text-ink", compact && "line-clamp-3")}>{review.pros}</p>
          </div>
        )}
        {review.cons && !compact && (
          <div className="rounded-xl bg-error/[0.05] p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-error">
              <span className="grid size-6 place-items-center rounded-full bg-error/10" aria-hidden="true">
                <ThumbsDown className="size-3.5" />
              </span>
              Das gefällt nicht
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{review.cons}</p>
          </div>
        )}
      </div>

      {!compact && dims.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 sm:grid-cols-4" aria-label="Teilbewertungen">
          {dims.map((d) => (
            <div key={d.label} className="min-w-0">
              <dt className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                <span className="truncate">{d.label}</span>
                <span className="font-semibold tabular-nums text-ink">{d.value}</span>
              </dt>
              <dd className="mt-1 flex gap-0.5" aria-label={`${d.value} von 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full", i <= d.value ? "bg-brand" : "bg-ink/[0.08]")} />
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {!compact && review.vendor_response && (
        <div className="mt-4 rounded-md bg-paper p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <MessageSquareReply className="size-3.5 text-brand-dark" aria-hidden="true" /> Antwort des Anbieters
            {review.vendor_response_date && <span className="font-normal text-muted-foreground">· {formatDateLong(review.vendor_response_date)}</span>}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{review.vendor_response}</p>
        </div>
      )}

      {!compact && (
        <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-border pt-4 [&]:mt-5">
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {review.reviewer_industry && (
              <li className="inline-flex items-center gap-1">
                <Building2 className="size-3.5" aria-hidden="true" /> {review.reviewer_industry}
              </li>
            )}
            {review.reviewer_company_size && (
              <li className="inline-flex items-center gap-1">
                <Users className="size-3.5" aria-hidden="true" /> {rangeLabel(review.reviewer_company_size)} Mitarbeitende
              </li>
            )}
            {(review.reviewer_city || review.reviewer_country) && (
              <li className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" /> {[review.reviewer_city, review.reviewer_country].filter(Boolean).join(", ")}
              </li>
            )}
            {review.used_for_duration && (
              <li className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" /> Nutzung: {rangeLabel(review.used_for_duration)}
              </li>
            )}
          </ul>
          {review.helpful_count > 0 && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-xs text-muted-foreground">
              <ThumbsUp className="size-3" aria-hidden="true" />
              {review.helpful_count} {review.helpful_count === 1 ? "Person fand" : "Personen fanden"} das hilfreich
            </p>
          )}
        </footer>
      )}
    </article>
  );
}
