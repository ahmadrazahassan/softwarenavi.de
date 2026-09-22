"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Command } from "cmdk";
import { Popover } from "radix-ui";
import { ArrowLeftRight, Check, ChevronsUpDown } from "lucide-react";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { cn } from "@/lib/utils";

type Opt = { id: string; name: string; slug: string; brand_color: string | null; category?: { name: string } | null };

function Combobox({ id, label, options, value, onChange, exclude }: { id: string; label: string; options: Opt[]; value?: Opt; onChange: (o: Opt) => void; exclude?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span id={`${id}-label`} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-labelledby={`${id}-label`}
          className="flex h-14 w-full items-center gap-3 rounded-lg border border-border bg-white px-4 text-left transition-colors hover:border-border"
        >
          {value ? (
            <>
              <SoftwareLogo software={value} size={32} rounded="rounded-lg" />
              <span className="min-w-0 flex-1 truncate font-semibold">{value.name}</span>
            </>
          ) : (
            <span className="flex-1 text-muted-foreground">Software auswählen …</span>
          )}
          <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content align="start" sideOffset={8} className="z-[60] w-[var(--radix-popover-trigger-width)] min-w-72 rounded-lg border border-border bg-white p-2 shadow-2xl">
            <Command label={label}>
              <Command.Input autoFocus placeholder="Name suchen …" className="mb-2 h-10 w-full rounded-xl border border-border bg-transparent px-3 text-sm outline-none focus:border-brand" />
              <Command.List className="max-h-72 overflow-y-auto">
                <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">Keine Software gefunden.</Command.Empty>
                {options
                  .filter((o) => o.id !== exclude)
                  .map((o) => (
                    <Command.Item
                      key={o.id}
                      value={`${o.name} ${o.category?.name ?? ""}`}
                      onSelect={() => {
                        onChange(o);
                        setOpen(false);
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-sm data-[selected=true]:bg-paper"
                    >
                      <SoftwareLogo software={o} size={26} rounded="rounded-md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{o.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{o.category?.name}</span>
                      </span>
                      {value?.id === o.id && <Check className="size-4 text-brand-dark" aria-hidden="true" />}
                    </Command.Item>
                  ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export function CompareSelector({ options, initialA, initialB, className }: { options: Opt[]; initialA?: string; initialB?: string; className?: string }) {
  const router = useRouter();
  const [a, setA] = useState<Opt | undefined>(options.find((o) => o.slug === initialA));
  const [b, setB] = useState<Opt | undefined>(options.find((o) => o.slug === initialB));
  const ready = a && b && a.id !== b.id;
  return (
    <form
      className={cn("flex flex-col gap-3 md:flex-row md:items-end", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) router.push(`/vergleich/${a!.slug}-vs-${b!.slug}`);
      }}
    >
      <Combobox id="cmp-a" label="Software A" options={options} value={a} onChange={setA} exclude={b?.id} />
      <button
        type="button"
        onClick={() => {
          setA(b);
          setB(a);
        }}
        className="mx-auto grid size-10 shrink-0 place-items-center rounded-md border border-border hover:bg-paper md:mb-2"
        aria-label="Auswahl tauschen"
      >
        <ArrowLeftRight className="size-4" />
      </button>
      <Combobox id="cmp-b" label="Software B" options={options} value={b} onChange={setB} exclude={a?.id} />
      <button type="submit" disabled={!ready} className="h-14 shrink-0 rounded-[7px] btn-glossy px-7 font-medium disabled:cursor-not-allowed disabled:opacity-50">
        Vergleichen
      </button>
    </form>
  );
}
