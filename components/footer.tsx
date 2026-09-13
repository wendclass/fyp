import Link from "next/link";
import { Gift } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-blush-100 border-t border-blush-200/80 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-brand text-white flex items-center justify-center shadow-pink-sm">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl text-charcoal">
              Fyp<span className="text-fuchsia-brand">.</span>
            </span>
          </Link>
          <p className="text-xs text-charcoal-muted max-w-sm">
            La recommandation de cadeaux à l’aveugle. Votre proche répond, vous choisissez le cadeau idéal sans jamais gâcher la surprise.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs text-charcoal-light font-medium">
          <Link href="/#concept" className="hover:text-fuchsia-brand transition-colors">
            Mécanisme d’aveuglement
          </Link>
          <Link href="/create" className="hover:text-fuchsia-brand transition-colors">
            Créer une surprise
          </Link>
          <Link href="/support" className="text-fuchsia-brand font-semibold hover:underline">
            Une suggestion ? Un souci ?
          </Link>
          <Link href="/mentions-legales" className="hover:text-fuchsia-brand transition-colors">
            Mentions légales
          </Link>
        </div>

        <div className="text-xs text-charcoal-muted font-medium">
          © 2026 Fyp, tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
