"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dialog as D } from "radix-ui";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { GlossyButton } from "./GlossyButton";
import { SearchCommand } from "./SearchCommand";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/site";
import { DEFAULT_BRAND_COLOR } from "@/lib/brandColors";

/** Navbar CTA accent — reads from the same constant as the rest of the brand system. */
export const LIST_CTA_COLOR = DEFAULT_BRAND_COLOR;

const LINKS = [
  { href: "/software", label: "Software" },
  { href: "/kategorien", label: "Kategorien" },
  { href: "/vergleich", label: "Vergleich" },
  { href: "/ratgeber", label: "Ratgeber" },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`) || (href === "/kategorien" && pathname.startsWith("/kategorie/"));

/**
 * Floating, centred header bar (reference „Popcorn"): square-ish corners, hairline border,
 * a violet underline that slides between links instead of a pill.
 */
export function Navbar({ categories = [] }: { categories?: { name: string; slug: string }[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const [bar, setBar] = useState({ x: 0, w: 0, visible: false });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const measure = useCallback((el: HTMLElement | null | undefined) => {
    const nav = navRef.current;
    if (!el || !nav) {
      setBar((p) => ({ ...p, visible: false }));
      return;
    }
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBar({ x: r.left - n.left + 12, w: r.width - 24, visible: true });
  }, []);

  const activeIndex = LINKS.findIndex((l) => isActive(pathname, l.href));
  const restOnActive = useCallback(() => measure(activeIndex >= 0 ? linkRefs.current[activeIndex] : null), [activeIndex, measure]);

  useLayoutEffect(() => {
    restOnActive();
  }, [restOnActive]);

  useEffect(() => {
    window.addEventListener("resize", restOnActive);
    return () => window.removeEventListener("resize", restOnActive);
  }, [restOnActive]);

  // Close overlays on route change (state adjusted during render, per React guidance)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSearchOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // Home: transparent over the light meadow sky until the page scrolls.
  const overHero = pathname === "/" && !scrolled && !searchOpen;

  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Software eintragen")}`;

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-6">
      <div
        className={cn(
          "mx-auto max-w-[1120px] rounded-lg border transition-[background-color,border-color,box-shadow] duration-300",
          overHero
            ? "border-transparent bg-transparent"
            : cn("border-border bg-white/95 backdrop-blur", (scrolled || searchOpen) && "shadow-[0_10px_30px_-18px_rgba(21,19,30,0.35)]"),
        )}
      >
        <div className="flex h-14 items-center gap-4 pl-4 pr-2">
          <BrandLogo className="shrink-0" />

          <nav aria-label="Hauptnavigation" className="relative mx-auto hidden lg:block" ref={navRef} onMouseLeave={restOnActive}>
            <ul className="flex items-center">
              {LINKS.map((l, i) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      ref={(el) => {
                        linkRefs.current[i] = el;
                      }}
                      href={l.href}
                      onMouseEnter={(e) => measure(e.currentTarget)}
                      onFocus={(e) => measure(e.currentTarget)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "nav-label inline-flex h-14 items-center px-3 text-[14.5px] font-medium transition-colors",
                        overHero ? (active ? "text-ink" : "text-ink/70 hover:text-ink") : active ? "text-ink" : "text-muted-foreground hover:text-ink",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[2px] bg-brand transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(${bar.x}px)`, width: bar.w, opacity: bar.visible ? 1 : 0 }}
            />
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <button
              ref={searchBtnRef}
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-controls="nav-search-panel"
              aria-label={searchOpen ? "Suche schließen" : "Suche öffnen"}
              className="grid size-10 place-items-center rounded-md text-ink transition-colors hover:text-brand-dark"
            >
              {searchOpen ? <X className="size-[18px]" /> : <Search className="size-[18px]" />}
            </button>
            <GlossyButton href={mail} size="sm" className="hidden sm:inline-flex">
              Software eintragen
            </GlossyButton>

            <D.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <D.Trigger className="grid size-10 place-items-center rounded-md text-ink lg:hidden" aria-label="Menü öffnen">
                <Menu className="size-5" />
              </D.Trigger>
              <D.Portal>
                <D.Overlay className="fixed inset-0 z-[70] bg-ink/30" />
                <D.Content className="fixed inset-x-3 top-3 z-[71] flex max-h-[calc(100dvh-1.5rem)] flex-col rounded-lg border border-border bg-white p-5 outline-none">
                  <div className="flex items-center justify-between">
                    <D.Title className="sr-only">Menü</D.Title>
                    <D.Description className="sr-only">Hauptnavigation und Kategorien</D.Description>
                    <BrandLogo />
                    <D.Close className="grid size-10 place-items-center rounded-md" aria-label="Menü schließen">
                      <X className="size-5" />
                    </D.Close>
                  </div>
                  <nav aria-label="Mobile Navigation" className="mt-6 flex-1 overflow-y-auto">
                    <ul className="flex flex-col border-t border-border">
                      {LINKS.map((l, i) => (
                        <li
                          key={l.href}
                          className="animate-[reveal_.4s_cubic-bezier(0.22,1,0.36,1)_both] border-b border-border"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <Link
                            href={l.href}
                            aria-current={isActive(pathname, l.href) ? "page" : undefined}
                            className="flex items-center justify-between py-4 font-heading text-2xl font-medium tracking-[-0.02em]"
                          >
                            {l.label}
                            <ArrowUpRight className={cn("size-5", isActive(pathname, l.href) ? "text-brand-dark" : "text-muted-foreground")} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {categories.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Kategorien</p>
                        <ul className="mt-2 grid grid-cols-2 gap-x-4">
                          {categories.map((c, i) => (
                            <li
                              key={c.slug}
                              className="animate-[reveal_.4s_cubic-bezier(0.22,1,0.36,1)_both]"
                              style={{ animationDelay: `${(i + LINKS.length) * 40}ms` }}
                            >
                              <Link href={`/kategorie/${c.slug}`} className="block py-1.5 text-sm text-muted-foreground hover:text-ink">
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </nav>
                  <GlossyButton href={mail} fullWidth className="mt-5">
                    Software eintragen
                  </GlossyButton>
                </D.Content>
              </D.Portal>
            </D.Root>
          </div>
        </div>

        <div
          id="nav-search-panel"
          className={cn("grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
          aria-hidden={!searchOpen}
          inert={!searchOpen}
        >
          <div className={cn("min-h-0", searchOpen ? "overflow-visible" : "overflow-hidden")}>
            <div className="border-t border-border p-3">
              {searchOpen && <SearchCommand autoFocus inputId="nav-search" onNavigate={() => setSearchOpen(false)} />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
