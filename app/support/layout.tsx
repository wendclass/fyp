import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Contactez l'équipe Fyp pour toute question, suggestion ou signalement de souci.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support | Fyp",
    description:
      "Contactez l'équipe Fyp pour toute question, suggestion ou signalement de souci.",
    url: "https://foryou-fyp.vercel.app/support",
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
