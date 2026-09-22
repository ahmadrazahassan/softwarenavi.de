import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Flat, square-cornered CTA (no gradients, no pills).
 * - "brand"   glossy violet #8A7FFE, ink text — primary action
 * - "accent"  same as brand (kept for API compatibility)
 * - "neutral" glossy white with hairline border
 * The historic name is kept so existing imports keep working.
 */
type Variant = "brand" | "accent" | "neutral";
type Common = {
  children: ReactNode;
  /** kept for API compatibility; the palette no longer uses per-vendor button colours */
  brandColor?: string;
  variant?: Variant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function buttonClasses({ variant = "brand", fullWidth, size = "md", className }: Omit<Common, "children" | "brandColor">) {
  return cn(
    "relative inline-flex items-center justify-center gap-2 rounded-[7px] font-medium tracking-[-0.005em] disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
    size === "sm" && "h-9 px-3.5 text-sm",
    size === "md" && "h-11 px-5 text-[15px]",
    size === "lg" && "h-13 px-7 text-base",
    (variant === "brand" || variant === "accent") && "btn-glossy",
    variant === "neutral" && "btn-glossy-light",
    fullWidth && "w-full",
    className,
  );
}

export function GlossyButton({
  href,
  external,
  children,
  brandColor,
  variant,
  fullWidth,
  size,
  className,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">) {
  void brandColor;
  const cls = buttonClasses({ variant, fullWidth, size, className });
  if (external || href.startsWith("mailto:") || href.startsWith("/api/")) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function GlossySubmit({
  children,
  brandColor,
  variant,
  fullWidth,
  size,
  className,
  ...rest
}: Common & Omit<ComponentProps<"button">, "children" | "className">) {
  void brandColor;
  return (
    <button className={buttonClasses({ variant, fullWidth, size, className })} {...rest}>
      {children}
    </button>
  );
}
