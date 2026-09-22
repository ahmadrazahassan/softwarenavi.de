"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, FolderOpen, Loader2, Search } from "lucide-react";
import type { SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatRating } from "@/lib/utils/format";
import { SoftwareLogo } from "./SoftwareLogo";

const EMPTY: SearchResult = { software: [], articles: [], categories: [] };

/** Debounced search against /api/search, rendered with cmdk. Used by the navbar panel and the hero SearchBar. */
export function SearchCommand({
  size = "sm",
  autoFocus,
  onNavigate,
  className,
  placeholder = "Software, Kategorie oder Anbieter suchen …",
  inputId = "site-search",
}: {
  size?: "sm" | "lg";
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
  placeholder?: string;
  inputId?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [res, setRes] = useState<SearchResult>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (r.ok) setRes(await r.json());
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  };

  const shown = q.trim().length < 2 ? EMPTY : res;
  const hasResults = shown.software.length + shown.articles.length + shown.categories.length > 0;
  const showList = open && q.trim().length >= 2;

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <Command shouldFilter={false} label="Suche" className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 rounded-md border border-border bg-white transition-colors focus-within:border-ink",
            size === "lg" ? "h-14 pl-4 pr-1.5" : "h-11 pl-3.5 pr-1",
          )}
        >
          <Search className={cn("shrink-0 text-muted-foreground", size === "lg" ? "size-5" : "size-4")} aria-hidden="true" />
          <label htmlFor={inputId} className="sr-only">
            Suche
          </label>
          <Command.Input
            id={inputId}
            ref={inputRef}
            value={q}
            onValueChange={(v) => {
              setQ(v);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !document.querySelector("[cmdk-item][data-selected=true]") && q.trim()) {
                go(`/suche?q=${encodeURIComponent(q.trim())}`);
              }
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder={placeholder}
            className={cn("min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground", size === "lg" ? "text-base" : "text-sm")}
          />
          {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />}
          <button
            type="button"
            onClick={() => q.trim() && go(`/suche?q=${encodeURIComponent(q.trim())}`)}
            className={cn(
              "shrink-0 rounded-[5px] btn-glossy font-medium",
              size === "lg" ? "h-11 px-5 text-sm" : "h-9 px-3.5 text-xs",
            )}
          >
            Suchen
          </button>
        </div>

        {showList && (
          <Command.List
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(70vh,28rem)] overflow-y-auto rounded-lg border border-border bg-white p-1.5 text-left shadow-[0_24px_50px_-28px_rgba(21,19,30,0.45)]"
            aria-label="Suchvorschläge"
          >
            {!loading && !hasResults && (
              <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
                Keine Treffer für „{q.trim()}“.
              </Command.Empty>
            )}
            {shown.software.length > 0 && (
              <Command.Group heading="Software" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground">
                {shown.software.map((s) => (
                  <Command.Item
                    key={s.id}
                    value={`sw-${s.slug}`}
                    onSelect={() => go(`/software/${s.slug}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 data-[selected=true]:bg-paper"
                  >
                    <SoftwareLogo software={s} size={34} rounded="rounded-md" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{s.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {s.category_name} · {formatRating(s.overall_rating)} ★
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {shown.categories.length > 0 && (
              <Command.Group heading="Kategorien" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground">
                {shown.categories.map((c) => (
                  <Command.Item
                    key={c.id}
                    value={`cat-${c.slug}`}
                    onSelect={() => go(`/kategorie/${c.slug}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm data-[selected=true]:bg-paper"
                  >
                    <FolderOpen className="size-4 text-brand-dark" aria-hidden="true" />
                    {c.name}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {shown.articles.length > 0 && (
              <Command.Group heading="Ratgeber" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground">
                {shown.articles.map((a) => (
                  <Command.Item
                    key={a.id}
                    value={`ar-${a.slug}`}
                    onSelect={() => go(`/ratgeber/${a.slug}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm data-[selected=true]:bg-paper"
                  >
                    <FileText className="size-4 shrink-0 text-brand-dark" aria-hidden="true" />
                    <span className="line-clamp-1">{a.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {hasResults && (
              <Command.Item
                value="alle-ergebnisse"
                onSelect={() => go(`/suche?q=${encodeURIComponent(q.trim())}`)}
                className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-t border-border px-3 py-2.5 text-sm font-semibold text-brand-dark data-[selected=true]:bg-paper"
              >
                Alle Ergebnisse für „{q.trim()}“ anzeigen
              </Command.Item>
            )}
          </Command.List>
        )}
      </Command>
    </div>
  );
}
