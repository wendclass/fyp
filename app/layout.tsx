import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
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

const SITE_URL = "https://foryou-fyp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fyp, offrir le cadeau parfait sans jamais gâcher la surprise",
    template: "%s | Fyp",
  },
  description:
    "Trouvez le cadeau idéal sans dévoiler votre budget. Le proche répond à 4 questions discrètes, vous choisissez parmi 3 recommandations ciblées.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fyp, offrir le cadeau parfait sans jamais gâcher la surprise",
    description:
      "Trouvez le cadeau idéal sans dévoiler votre budget. Le proche répond à 4 questions discrètes, vous choisissez parmi 3 recommandations ciblées.",
    url: SITE_URL,
    siteName: "Fyp",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Fyp, recommandation de cadeaux avec mécanisme d’aveuglement",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fyp, offrir le cadeau parfait sans jamais gâcher la surprise",
    description:
      "Trouvez le cadeau idéal sans dévoiler votre budget. Le proche répond à 4 questions discrètes, vous choisissez parmi 3 recommandations ciblées.",
    images: [`${SITE_URL}/opengraph-image`],
  },
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
        <GoogleAnalytics />
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
