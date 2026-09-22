"use client";

import { useId, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS = ["", "Sehr schlecht", "Schlecht", "Befriedigend", "Gut", "Sehr gut"];

/** Radio-group star input: arrow keys, visible focus, value submitted as a hidden form field. */
export function StarSelector({
  name,
  label,
  defaultValue = 0,
  error,
  size = "md",
}: {
  name: string;
  label: string;
  defaultValue?: number;
  error?: string;
  size?: "md" | "lg";
}) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const id = useId();
  const shown = hover || value;
  const px = size === "lg" ? "size-9" : "size-7";
  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${id}-l`} className="text-sm font-semibold">
        {label}
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      </span>
      <div className="flex items-center gap-3">
        <div
          role="radiogroup"
          aria-labelledby={`${id}-l`}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-e` : undefined}
          className="flex items-center gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} von 5 Sternen: ${LABELS[n]}`}
              tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
              onClick={() => setValue(n)}
              onMouseEnter={() => setHover(n)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const next = Math.min(5, (value || 0) + 1);
                  setValue(next);
                  (e.currentTarget.parentElement?.children[next - 1] as HTMLElement)?.focus();
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  const next = Math.max(1, (value || 2) - 1);
                  setValue(next);
                  (e.currentTarget.parentElement?.children[next - 1] as HTMLElement)?.focus();
                }
              }}
              className="rounded-md p-0.5 transition-transform hover:scale-110"
            >
              <Star className={cn(px, n <= shown ? "text-star" : "text-[#d6d3de]")} fill="currentColor" strokeWidth={0} />
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {shown ? LABELS[shown] : "Bitte wählen"}
        </span>
      </div>
      <input type="hidden" name={name} value={value || ""} />
      {error && (
        <p id={`${id}-e`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
