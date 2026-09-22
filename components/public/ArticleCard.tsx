import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDateLong } from "@/lib/utils/format";
import { hy } from "@/lib/utils/hyphenate";
import { ArticleCover } from "@/components/home/FinanceVisuals";

/** Topic-specific editorial thumbnails for the three latest homepage guides. */
const EDITORIAL_THUMBNAILS: Record<string, string> = {
  "sage-software-deutschland-welches-produkt": "/images/articles/sage-software-guide.webp",
  "kleinunternehmerregelung-software": "/images/articles/kleinunternehmer-software.webp",
  "serverstandort-deutschland-oder-eu": "/images/articles/serverstandort-deutschland-eu.webp",
};

/** Remaining articles retain their stable code-drawn cover unless they have a supplied image. */
const TAG_VARIANT: Record<string, number> = { Buchhaltung: 0, Vergleich: 2, "E-Rechnung": 1, GoBD: 1, Lohn: 2, DATEV: 0, Zeiterfassung: 2, HR: 0, Datenschutz: 1 };

export function ArticleCard({ article, className, large }: { article: Article; className?: string; large?: boolean }) {
  const imageSrc = EDITORIAL_THUMBNAILS[article.slug] ?? article.featured_image_url;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative overflow-hidden rounded-xl border border-border bg-paper", large ? "aspect-[16/8]" : "aspect-[16/10]")}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 1024px) 420px, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <ArticleCover tag={article.category_tag} variant={TAG_VARIANT[article.category_tag ?? ""] ?? 0} className="transition-transform duration-700 group-hover:scale-[1.03]" />
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-ink">{article.category_tag}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.published_date}>{formatDateLong(article.published_date)}</time>
          <span aria-hidden="true">·</span>
          {article.read_time_minutes} Min.
        </p>
        <h3 className={cn("card-title mt-2 font-heading font-medium leading-snug tracking-[-0.015em]", large ? "text-2xl md:text-[2rem]" : "text-lg")}>
          <Link href={`/ratgeber/${article.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-brand group-hover:underline-offset-4">
            {hy(article.title)}
          </Link>
        </h3>
        {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>}
      </div>
    </article>
  );
}
