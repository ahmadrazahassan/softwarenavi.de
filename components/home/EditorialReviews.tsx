import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Software } from "@/lib/types";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/Rating";
import { formatRating } from "@/lib/utils/format";

/** Editorial assessments are shown when there are no published user reviews yet. */
export function EditorialReviews({ software }: { software: Software[] }) {
  return (
    <div className="container-site grid gap-4 md:grid-cols-3">
      {software.map((s) => {
        const review = s.editorial;
        if (!review) return null;
        return (
          <article key={s.id} className="flex flex-col rounded-xl border border-border bg-white p-6">
            <div className="flex items-center gap-3">
              <SoftwareLogo software={s} size={40} />
              <div className="min-w-0">
                <p className="truncate font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">Redaktionelle Bewertung</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="font-heading text-3xl font-medium tabular-nums">{formatRating(review.rating)}</span>
              <StarRating rating={review.rating} size="xs" />
            </div>
            <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">{review.verdict}</p>
            <Link href={`/software/${s.slug}#redaktion`} className="mt-6 flex items-center gap-1 border-t border-border pt-4 text-sm font-medium hover:text-brand-dark">
              Bewertung lesen <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
