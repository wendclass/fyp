import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à Fyp pour retrouver vos surprises et recommandations de cadeaux.",
  alternates: { canonical: "/auth/login" },
  openGraph: {
    title: "Connexion | Fyp",
    description:
      "Connectez-vous à Fyp pour retrouver vos surprises et recommandations de cadeaux.",
    url: "https://foryou-fyp.vercel.app/auth/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
