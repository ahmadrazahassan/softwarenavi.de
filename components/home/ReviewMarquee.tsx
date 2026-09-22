import { rangeLabel } from "@/lib/i18n/options";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { Review, Software } from "@/lib/types";
import { StarRating } from "@/components/public/Rating";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatDateShort, formatRating } from "@/lib/utils/format";

type Item = Review & { software: Pick<Software, "name" | "slug" | "brand_color" | "logo_url"> };

function ReviewTile({ r, hidden }: { r: Item; hidden: boolean }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-ink md:w-[380px]">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/software/${r.software.slug}`}
          tabIndex={hidden ? -1 : undefined}
          className="flex min-w-0 items-center gap-2.5 font-medium hover:underline hover:decoration-brand hover:underline-offset-4"
        >
          <SoftwareLogo software={r.software} size={32} rounded="rounded-md" />
          <span className="truncate">{r.software.name}</span>
        </Link>
        <span className="flex shrink-0 items-center gap-1.5">
          <StarRating rating={r.overall_rating} size="xs" />
          <span className="text-sm font-medium tabular-nums">{formatRating(r.overall_rating)}</span>
        </span>
      </div>
      <blockquote className="mt-5 font-heading text-lg font-medium leading-snug tracking-[-0.015em]">„{r.review_title}“</blockquote>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{r.pros ?? r.summary}</p>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4 text-sm [&]:mt-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] border-ink/80 text-xs font-semibold" aria-hidden="true">
          {r.reviewer_name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 font-medium">
            <span className="truncate">{r.reviewer_name}</span>
            {r.verified_linkedin && <BadgeCheck className="size-4 shrink-0 text-brand-dark" aria-label="verifiziert" />}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {[r.reviewer_job_title, r.reviewer_company_size && `${rangeLabel(r.reviewer_company_size)} MA`].filter(Boolean).join(" · ")} · {formatDateShort(r.review_date)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse, duration }: { items: Item[]; reverse?: boolean; duration: number }) {
  const list = (hidden: boolean) => (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {items.map((r) => (
        <ReviewTile key={`${r.id}-${hidden}`} r={r} hidden={hidden} />
      ))}
    </div>
  );
  return (
    <div className="group flex overflow-hidden">
      <div
        className="flex w-max items-stretch group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
        style={{ animation: `marquee ${duration}s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}

/**
 * Two rows of reviews drifting in opposite directions; hover pauses a row, reduced motion stops it
 * (the row then scrolls horizontally by hand). Edges fade out via mask so tiles dissolve, not clip.
 */
export function ReviewMarquee({ reviews }: { reviews: Item[] }) {
  const half = Math.ceil(reviews.length / 2);
  return (
    <div className="flex flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto">
      <Row items={reviews.slice(0, half)} duration={90} />
      <Row items={reviews.slice(half)} duration={100} reverse />
    </div>
  );
}
