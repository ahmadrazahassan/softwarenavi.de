import Link from "next/link";
import Image from "next/image";
import type { Software } from "@/lib/types";

/**
 * Slow marquee of the real vendors we compare. Products with a logo in /public show it, the rest show
 * their name set in the display face. Duplicated once for a seamless loop; paused for reduced motion.
 */
export function VendorMarquee({ items }: { items: Pick<Software, "name" | "slug" | "logo_url">[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-14 pr-14" aria-hidden={hidden || undefined}>
      {items.map((s) => (
        <li key={`${s.slug}-${hidden}`} className="shrink-0">
          <Link
            href={`/software/${s.slug}`}
            tabIndex={hidden ? -1 : undefined}
            className="flex items-center gap-3.5 font-heading text-[22px] font-medium tracking-[-0.02em] text-ink/70 transition-colors hover:text-ink"
          >
            {s.logo_url && (
              <Image src={s.logo_url} alt="" width={56} height={56} unoptimized className="size-14 object-contain" />
            )}
            {s.name}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
