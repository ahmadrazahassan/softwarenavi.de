import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GlossyButton } from "@/components/public/GlossyButton";
import { formatCount } from "@/lib/utils/format";
import { seedReviewsEnabled } from "@/lib/seedMode";

/** The transparent header floats above the pale sky; the meadow fades into the page below. */
export function LandscapeHero({ softwareCount, reviewCount, editorialCount }: { softwareCount: number; reviewCount: number; editorialCount: number }) {
  return (
    <section aria-labelledby="hero-title" className="relative -mt-[70px] min-h-[900px] overflow-hidden bg-[#fbf8f1]">
      <div className="absolute inset-x-0 bottom-0 top-[300px] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_85%,transparent_100%)]" aria-hidden="true">
        <Image
          src="/images/hero-meadow-v2.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,rgba(255,250,243,.16)_82%,#fff_100%)] md:bg-[linear-gradient(to_bottom,transparent_0%,transparent_62%,rgba(255,250,243,.08)_79%,#fff_100%)]" />

      <div className="relative z-[1] mx-auto flex max-w-4xl flex-col items-center px-5 pb-44 pt-36 text-center md:pt-44">
        <p className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/75">
          <span className="size-1.5 bg-brand-dark" aria-hidden="true" />
          {formatCount(softwareCount)} Programme · {reviewCount > 0 ? `${formatCount(reviewCount)} ${seedReviewsEnabled() ? "" : "geprüfte "}Nutzerbewertungen` : `${formatCount(editorialCount)} redaktionelle Bewertungen`}
        </p>
        <h1
          id="hero-title"
          className="mt-6 font-heading text-[2.75rem] font-medium leading-[1.02] tracking-[-0.04em] text-balance text-ink [hyphens:none] sm:text-6xl md:text-[3.75rem] lg:text-[4.75rem]"
        >
          Software für Buchhaltung, Lohn und Personal. Ehrlich verglichen.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 [hyphens:none] md:text-lg">
          Wir prüfen jedes Programm so, wie es Ihre Steuerkanzlei tun würde: DATEV, GoBD, E-Rechnung und der Nettopreis, den Sie am Ende wirklich zahlen.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          <GlossyButton href="/software" size="lg">
            Programme vergleichen <ArrowRight aria-hidden="true" />
          </GlossyButton>
          <GlossyButton href="/kategorien" size="lg" variant="neutral">
            Alle Kategorien
          </GlossyButton>
        </div>
      </div>

    </section>
  );
}
