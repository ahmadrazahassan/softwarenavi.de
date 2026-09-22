import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/public/BrandLogo";
import { buttonClasses } from "@/components/public/GlossyButton";

export default function NotFound() {
  return (
    <main id="inhalt" className="mx-auto flex min-h-[90vh] w-full max-w-[1400px] flex-col p-3 md:p-6">
      <div className="grid flex-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl bg-paper p-8 md:p-12">
          <BrandLogo />
          <div className="py-12">
            <p className="font-heading text-sm font-medium tabular-nums text-brand-dark">Fehler 404</p>
            <h1 className="mt-4 font-heading text-[2.6rem] font-medium leading-[1] tracking-[-0.04em] md:text-7xl">Hier ist kein Fahrwasser</h1>
            <p className="mt-5 max-w-md text-muted-foreground">Die angeforderte Seite existiert nicht oder wurde verschoben. Wir navigieren Sie gern zurück.</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link href="/" className={buttonClasses({})}>
                Zur Startseite
              </Link>
              <Link href="/software" className={buttonClasses({ variant: "neutral" })}>
                Software durchsuchen
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <Link href="/impressum" className="underline decoration-brand underline-offset-2">
              Impressum
            </Link>{" "}
            ·{" "}
            <Link href="/datenschutz" className="underline decoration-brand underline-offset-2">
              Datenschutz
            </Link>
          </p>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-xl bg-black">
          <Image src="/images/maskottchen-traurig.webp" alt="Traurige blaue Figur mit einer Träne" fill sizes="(min-width: 1024px) 700px, 100vw" className="object-contain p-8" priority />
        </div>
      </div>
    </main>
  );
}
