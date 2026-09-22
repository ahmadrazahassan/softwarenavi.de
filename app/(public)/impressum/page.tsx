import { LegalPage, legalMetadata } from "@/components/public/LegalPage";

export const revalidate = 3600;

export const generateMetadata = () => legalMetadata("impressum");

export default function Page() {
  return <LegalPage slug="impressum" />;
}
