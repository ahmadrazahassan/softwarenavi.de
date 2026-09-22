"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export type Shot = { src: string; caption: string };

/** embla carousel + lightbox, keyboard navigable, German aria labels. */
export function ScreenshotCarousel({ shots, productName }: { shots: Shot[]; productName: string }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: false, align: "start" });
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  if (!shots.length) return null;

  return (
    <div
      role="region"
      aria-roledescription="Karussell"
      aria-label={`Screenshots von ${productName}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") embla?.scrollPrev();
        if (e.key === "ArrowRight") embla?.scrollNext();
      }}
    >
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex gap-4">
          {shots.map((s, i) => (
            <figure key={s.src} className="min-w-0 shrink-0 basis-full md:basis-[85%]" aria-roledescription="Folie" aria-label={`${i + 1} von ${shots.length}`}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-paper"
                aria-label={`${s.caption} vergrößern`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic SVG mock, not optimisable */}
                <img src={s.src} alt={`${productName}: ${s.caption}`} width={1120} height={560} loading="lazy" className="block h-auto w-full" />
                <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-md bg-white/90 opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="size-4" aria-hidden="true" />
                </span>
              </button>
              <figcaption className="mt-2 text-sm text-muted-foreground">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5" role="tablist" aria-label="Screenshot auswählen">
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Screenshot ${i + 1}: ${s.caption}`}
              onClick={() => embla?.scrollTo(i)}
              className={cn("h-1.5 rounded-sm transition-all", i === index ? "w-6 bg-brand" : "w-3 bg-[#d6d3de]")}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => embla?.scrollPrev()} aria-label="Vorheriger Screenshot" className="grid size-9 place-items-center rounded-md border border-border hover:bg-paper">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => embla?.scrollNext()} aria-label="Nächster Screenshot" className="grid size-9 place-items-center rounded-md border border-border hover:bg-paper">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={shots.map((s) => ({ src: s.src, alt: `${productName}: ${s.caption}`, width: 1120, height: 560 }))}
        labels={{ Previous: "Zurück", Next: "Weiter", Close: "Schließen", Lightbox: "Bildergalerie", Carousel: "Karussell", Slide: "Folie" }}
      />
    </div>
  );
}
