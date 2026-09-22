import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Real vendor logo shown as-is — no tile, no background, no border.
 * Products without a logo file get a monogram in a hairline outline (no fill).
 */
export function SoftwareLogo({
  software,
  size = 48,
  className,
  rounded = "rounded-lg",
}: {
  software: { name: string; slug: string; logo_url?: string | null; brand_color?: string | null };
  size?: number;
  className?: string;
  rounded?: string;
}) {
  if (software.logo_url) {
    return (
      <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
        <Image src={software.logo_url} alt={`${software.name} Logo`} fill sizes={`${size}px`} unoptimized className={cn("object-contain", rounded)} />
      </span>
    );
  }
  const initials = software.name
    .replace(/[^A-Za-zÄÖÜäöü0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center border-[1.5px] border-ink/80 font-heading font-semibold tracking-[-0.02em] text-ink", rounded, className)}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials || software.name[0]}
    </span>
  );
}
