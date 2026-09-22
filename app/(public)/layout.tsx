import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { getCategories, getMostReviewedSoftware, getSiteSettings } from "@/lib/supabase/queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [categories, popular, settings] = await Promise.all([getCategories(), getMostReviewedSoftware(5), getSiteSettings()]);
  return (
    <>
      <a
        href="#inhalt"
        className="sr-only z-[100] rounded-[7px] btn-glossy px-5 py-3 font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Zum Inhalt springen
      </a>
      <Navbar categories={categories.map(({ name, slug }) => ({ name, slug }))} />
      <main id="inhalt" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer settings={settings} popular={popular} />
    </>
  );
}
