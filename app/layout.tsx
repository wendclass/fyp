import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { PageTracker } from "@/lib/use-page-tracker";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fyp, offrir le cadeau parfait sans jamais gâcher la surprise",
  description:
    "Recommandation de cadeaux basée sur un mécanisme d’aveuglement. Votre proche répond à 4 questions sans voir le budget, et vous choisissez le meilleur cadeau parmi 3 idées adaptées.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col justify-between selection:bg-fuchsia-brand selection:text-white">
        <Suspense fallback={null}>
          <PageTracker />
        </Suspense>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
