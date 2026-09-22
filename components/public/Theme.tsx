"use client";

import { ThemeProvider as NextThemes } from "next-themes";

/** Light theme only — dark mode is intentionally disabled site-wide. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
