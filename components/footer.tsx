import Link from "next/link";
import { Gift, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-blush-100 border-t border-blush-200/80 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-brand text-white flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl text-charcoal">
              Fyp<span className="text-fuchsia-brand">.</span>
            </span>
          </Link>
          <p className="text-xs text-charcoal-muted max-w-sm">
            La recommandation de cadeaux à l''aveugle. Votre proche répond, vous choisissez le cadeau parfait sans jamais gâcher la surprise.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-charcoal-light font-medium">
          <Link href="/#concept" className="hover:text-fuchsia-brand transition-colors">
            Mécanisme d''aveuglement
          </Link>
          <Link href="/create" className="hover:text-fuchsia-brand transition-colors">
            Créer une surprise
          </Link>
          <Link href="/auth/login" className="hover:text-fuchsia-brand transition-colors">
            Espace membre
          </Link>
        </div>

        <div className="text-xs text-charcoal-muted flex items-center justify-center gap-1">
          Fait avec <Heart className="w-3.5 h-3.5 text-fuchsia-brand fill-fuchsia-brand inline" /> pour faire plaisir.
        </div>
      </div>
    </footer>
  );
}
