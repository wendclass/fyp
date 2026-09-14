import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer une surprise",
  description:
    "Définissez l'occasion, le bénéficiaire et le budget pour générer un lien secret de questionnaire cadeau Fyp.",
  alternates: { canonical: "/create" },
  openGraph: {
    title: "Créer une surprise | Fyp",
    description:
      "Définissez l'occasion, le bénéficiaire et le budget pour générer un lien secret de questionnaire cadeau Fyp.",
    url: "https://foryou-fyp.vercel.app/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
