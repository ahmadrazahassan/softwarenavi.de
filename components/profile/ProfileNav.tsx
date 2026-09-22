"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type NavSection = { id: string; label: string; count?: number };

/** Distance from the viewport top at which a section counts as "current" (site navbar + this bar). */
const SPY_OFFSET = 150;

/**
 * Sticky segmented section nav.
 * - Sliding ink indicator behind the active tab, scroll-spy driven by scroll position (no flicker between sections).
 * - Once stuck, the product identity slides in on the left and the CTA on the right.
 * - Hairline reading-progress bar along the bottom edge.
 * - Horizontally scrollable on mobile with edge fades — German labels are long.
 */
export function ProfileNav({
  sections,
  identity,
  cta,
}: {
  sections: NavSection[];
  /** compact logo + name, shown once the bar is stuck */
  identity?: React.ReactNode;
  /** compact primary action, shown once the bar is stuck (desktop only) */
  cta?: React.ReactNode;
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const [stuck, setStuck] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState({ left: false, right: false });
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const sentinel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const tabs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const locked = useRef(false);

  // ── scroll-spy + progress ──
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
      if (!els.length) return;

      const first = els[0].getBoundingClientRect().top + window.scrollY;
      const last = els[els.length - 1];
      const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, (window.scrollY - first + SPY_OFFSET) / Math.max(1, end - first + SPY_OFFSET))));

      if (locked.current) return; // a click-initiated smooth scroll is in flight
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top - SPY_OFFSET <= 1) current = el.id;
      setActive(atBottom ? els[els.length - 1].id : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // ── stuck state (sentinel scrolls out from under the site navbar) ──
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 120), {
      rootMargin: "-84px 0px 0px 0px",
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── sliding indicator + keep active tab in view ──
  const place = useCallback(() => {
    const tab = active ? tabs.current[active] : null;
    if (!tab) return;
    setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth, ready: true });
  }, [active]);

  useLayoutEffect(place, [place, stuck]);

  useEffect(() => {
    const box = scroller.current;
    if (!box) return;
    const ro = new ResizeObserver(place);
    ro.observe(box);
    return () => ro.disconnect();
  }, [place]);

  useEffect(() => {
    const tab = active ? tabs.current[active] : null;
    const box = scroller.current;
    if (!tab || !box || box.scrollWidth <= box.clientWidth) return;
    box.scrollTo({ left: tab.offsetLeft - box.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  // ── edge fades on the horizontal scroller ──
  useEffect(() => {
    const box = scroller.current;
    if (!box) return;
    const update = () => setFade({ left: box.scrollLeft > 4, right: box.scrollLeft + box.clientWidth < box.scrollWidth - 4 });
    update();
    box.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => {
      box.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      locked.current = true;
      const release = () => (locked.current = false);
      window.addEventListener("scrollend", release, { once: true });
      window.setTimeout(release, 2000);
    }
    setActive(id);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SPY_OFFSET + 1, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <nav aria-label="Abschnitte" className="sticky top-[76px] z-40 mt-6">
        <div
          className={cn(
            "relative flex items-center gap-3 rounded-xl border bg-white/90 p-1.5 backdrop-blur-md transition-[box-shadow,border-color] duration-300",
            stuck ? "border-border shadow-[0_12px_32px_-16px_rgba(21,19,30,0.28)]" : "border-border shadow-none",
          )}
        >
          {identity && (
            <div
              inert={!stuck}
              className={cn(
                "hidden shrink-0 items-center overflow-hidden transition-[max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex",
                stuck ? "max-w-64 pl-2 pr-1 opacity-100" : "max-w-0 opacity-0",
              )}
            >
              {identity}
              <span className="ml-4 h-6 w-px bg-border" />
            </div>
          )}

          <div className="relative min-w-0 flex-1">
            <div
              ref={scroller}
              className="scrollbar-none relative flex overflow-x-auto"
              style={{
                maskImage: `linear-gradient(to right, ${fade.left ? "transparent" : "#000"}, #000 28px, #000 calc(100% - 28px), ${fade.right ? "transparent" : "#000"})`,
              }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-0 rounded-lg bg-ink transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  !indicator.ready && "opacity-0",
                )}
                style={{ left: indicator.left, width: indicator.width }}
              />
              {sections.map((s) => {
                const isActive = s.id === active;
                return (
                  <a
                    key={s.id}
                    ref={(el) => {
                      tabs.current[s.id] = el;
                    }}
                    href={`#${s.id}`}
                    onClick={(e) => go(e, s.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "nav-label relative z-[1] inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-muted-foreground hover:bg-paper hover:text-ink",
                    )}
                  >
                    {s.label}
                    {s.count !== undefined && s.count > 0 && (
                      <span
                        className={cn(
                          "rounded-[5px] px-1.5 py-px text-[11px] font-semibold tabular-nums transition-colors",
                          isActive ? "bg-white/15 text-white" : "bg-paper text-muted-foreground",
                        )}
                      >
                        {s.count}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {cta && (
            <div
              inert={!stuck}
              className={cn(
                "hidden shrink-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
                stuck ? "max-w-56 opacity-100" : "pointer-events-none max-w-0 opacity-0",
              )}
            >
              {cta}
            </div>
          )}

          <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 -bottom-px h-[2px] overflow-hidden rounded-full">
            <span
              className={cn("block h-full origin-left bg-brand transition-opacity duration-300", stuck ? "opacity-100" : "opacity-0")}
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        </div>
      </nav>
    </>
  );
}
