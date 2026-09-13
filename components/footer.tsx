"use client";

import Link from "next/link";
import { Gift, Heart, Shield, Cookie, HelpCircle } from "lucide-react";

export function Footer() {
  const openCookiePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
    }
  };

  return (
    <footer className="w-full bg-blush-200/50 border-t border-blush-200 mt-20 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Slogan */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-fuchsia-brand text-white flex items-center justify-center shadow-pink-sm group-hover:scale-105 transition-transform">
                <Gift className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-xl text-charcoal">
                Fyp<span className="text-fuchsia-brand">.</span>
              </span>
            </Link>
            <p className="text-xs text-charcoal-muted text-center md:text-left max-w-sm">
              La plateforme de recommandation de cadeaux basée sur le mécanisme d’aveuglement.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal-light font-medium">
            <Link
              href="/#concept"
              className="hover:text-fuchsia-brand transition-colors"
            >
              Le mécanisme d’aveuglement
            </Link>
            <Link
              href="/create"
              className="hover:text-fuchsia-brand transition-colors"
            >
              Créer une surprise
            </Link>
            <Link
              href="/support"
              className="hover:text-fuchsia-brand transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-fuchsia-brand" />
              <span>Une suggestion ? Un souci ?</span>
            </Link>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="hover:text-fuchsia-brand transition-colors flex items-center gap-1 underline underline-offset-2"
            >
              <Cookie className="w-3.5 h-3.5 text-fuchsia-brand" />
              <span>Gérer mes préférences cookies</span>
            </button>
            <Link
              href="/mentions-legales"
              className="hover:text-fuchsia-brand transition-colors"
            >
              Mentions légales
            </Link>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-8 pt-8 border-t border-blush-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <div>
            © 2026 Fyp, tous droits réservés.
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-fuchsia-brand" />
            <span>Confidentialité et budget secret garantis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
