import { cn } from "@/lib/utils";

const ICONS: Record<string, { label: string; path: string }> = {
  linkedin: {
    label: "LinkedIn",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65V21h-4V9.75Z",
  },
  xing: {
    label: "XING",
    path: "M5.2 6.6h3.4l1.9 3.4-2.7 4.7H4.4l2.7-4.7-1.9-3.4ZM15.6 2h3.5l-5.6 9.9 3.6 6.6h-3.5l-3.6-6.6L15.6 2Z",
  },
  twitter: {
    label: "X",
    path: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.57L16.67 19.2Z",
  },
  facebook: {
    label: "Facebook",
    path: "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.46A20.7 20.7 0 0 0 14.3 4.3c-2.24 0-3.8 1.37-3.8 3.9v2.3H8v3h2.5V21h3Z",
  },
};

/** Renders only networks that have a URL configured in site_settings. */
export function SocialIcons({ links, className }: { links: Record<string, string | undefined>; className?: string }) {
  const entries = Object.entries(ICONS).filter(([k]) => links[k]);
  if (!entries.length) return null;
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {entries.map(([k, { label, path }]) => (
        <li key={k}>
          <a
            href={links[k]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Softwarenavi auf ${label} (öffnet in neuem Tab)`}
            className="grid size-9 place-items-center rounded-md border border-ink/25 text-ink transition-colors hover:border-ink"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d={path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
