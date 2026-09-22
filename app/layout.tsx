import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/public/Theme";
import { ConsentProvider } from "@/components/public/Consent";
import { SITE_NAME, siteUrl } from "@/lib/site";

// Self-hosted by next/font — no request to a font CDN at runtime (DSGVO).
// General Sans (ITF Free Font License, see app/fonts/GeneralSans-LICENSE.txt) covers ä ö ü ß „ “ €.
const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Variable.woff2", weight: "200 700", style: "normal" },
    { path: "./fonts/GeneralSans-VariableItalic.woff2", weight: "200 700", style: "italic" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Softwarenavi | Unternehmenssoftware unabhängig vergleichen",
    template: "%s | Softwarenavi",
  },
  description:
    "Geprüfte Bewertungen und Nettopreise für Buchhaltung, Lohnabrechnung, HR, CRM und ERP. Mit DATEV, GoBD und E-Rechnung im Blick, geschrieben für den deutschen Mittelstand.",
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Softwarenavi" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning className={`${generalSans.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <ConsentProvider analyticsDomain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ConsentProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
