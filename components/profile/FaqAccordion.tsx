"use client";

import { Accordion as A } from "radix-ui";
import { Plus } from "lucide-react";

/** Flat accordion: hairline rows, plus rotates to a cross when open. */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <A.Root type="multiple" className="flex flex-col border-t border-border">
      {items.map((it, i) => (
        <A.Item key={i} value={`faq-${i}`} className="border-b border-border">
          <A.Header>
            <A.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left font-heading text-[17px] font-medium tracking-[-0.01em] md:text-lg">
              {it.q}
              <Plus className="size-5 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-45" aria-hidden="true" />
            </A.Trigger>
          </A.Header>
          <A.Content className="pb-6 pr-10 text-[15px] leading-relaxed text-muted-foreground">{it.a}</A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
