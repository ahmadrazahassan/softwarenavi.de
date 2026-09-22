"use client";

import * as React from "react";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({
  className,
  children,
  side = "center",
  closeLabel = "Schließen",
  ...props
}: React.ComponentProps<typeof D.Content> & { side?: "center" | "right" | "bottom"; closeLabel?: string }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[60] bg-ink/40" />
      <D.Content
        className={cn(
          "fixed z-[61] border border-border bg-white shadow-[0_30px_60px_-30px_rgba(21,19,30,0.5)] outline-none",
          side === "center" &&
            "left-1/2 top-1/2 max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg p-6",
          side === "right" && "inset-y-0 right-0 flex w-[min(24rem,100vw)] flex-col overflow-y-auto p-6",
          side === "bottom" && "inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-lg p-6",
          className,
        )}
        {...props}
      >
        {children}
        <D.Close
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-md text-muted-foreground hover:text-foreground"
          aria-label={closeLabel}
        >
          <X className="size-4" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof D.Title>) {
  return <D.Title className={cn("pr-10 font-heading text-xl font-semibold tracking-[-0.01em]", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof D.Description>) {
  return <D.Description className={cn("mt-1.5 text-sm text-muted-foreground", className)} {...props} />;
}
