import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte",
  description:
    "Inscrivez-vous sur Fyp pour créer des surprises personnalisées et accéder à vos recommandations de cadeaux.",
  alternates: { canonical: "/auth/signup" },
  openGraph: {
    title: "Créer un compte | Fyp",
    description:
      "Inscrivez-vous sur Fyp pour créer des surprises personnalisées et accéder à vos recommandations de cadeaux.",
    url: "https://foryou-fyp.vercel.app/auth/signup",
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
