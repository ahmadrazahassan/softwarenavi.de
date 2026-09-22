import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** The same transparent vector mark is served as the site's favicon. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <Image src="/icon.svg?mark=4" alt={title ?? ""} width={64} height={64} unoptimized className={cn("size-8", className)} />
  );
}

export function BrandLogo({
  className,
  showClaim = false,
  inverted = false,
  monochrome = false,
}: {
  className?: string;
  showClaim?: boolean;
  inverted?: boolean;
  monochrome?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-md", inverted ? "text-white" : "text-ink", className)}
      aria-label="Softwarenavi, zur Startseite"
    >
      <LogoMark className={cn("size-8 transition-transform duration-500 group-hover:scale-105", monochrome && "brightness-0")} />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[1.25rem] font-medium tracking-[-0.04em]">
          Software<span className={inverted ? "text-brand-soft" : monochrome ? "text-ink/65" : "text-brand-dark"}>navi</span>
        </span>
        {showClaim && (
          <span className={cn("mt-1 text-[11px] font-medium", inverted ? "text-white/70" : "text-muted-foreground")}>
            Unabhängig. Geprüft. Deutsch.
          </span>
        )}
      </span>
    </Link>
  );
}
