import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 text-center shadow-soft-xl border border-blush-200">
        <div className="w-16 h-16 rounded-3xl bg-blush-100 text-fuchsia-brand mx-auto flex items-center justify-center mb-6 shadow-pink-sm">
          <Gift className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-3xl text-charcoal mb-2">
          Page introuvable
        </h2>
        <p className="text-sm text-charcoal-light leading-relaxed mb-8">
          Le questionnaire ou la page que vous recherchez n’existe pas ou le lien a expiré.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l’accueil</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
