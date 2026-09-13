import Link from "next/link";
import { Shield, ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Mentions légales, Fyp",
  description: "Mentions légales et informations éditoriales du service Fyp.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-light hover:text-fuchsia-brand transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l’accueil</span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-brand/10 text-fuchsia-brand flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-charcoal tracking-tight">
            Mentions légales
          </h1>
        </div>
        <p className="text-sm text-charcoal-light">
          Informations légales et éditoriales régissant l’utilisation de Fyp.
        </p>
      </div>

      <Card className="p-6 sm:p-10 space-y-8 text-charcoal leading-relaxed">
        {/* Éditeur */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xl text-charcoal flex items-center gap-2">
            Éditeur du site
          </h2>
          <p className="text-sm text-charcoal-light">
            Le site <strong>Fyp</strong> est édité par <strong>Scott Nana (Class S)</strong>, entrepreneur individuel basé à Ouagadougou, Burkina Faso.
          </p>
          <p className="text-sm text-charcoal-light">
            Contact :{" "}
            <a
              href="mailto:wendclasss@gmail.com"
              className="font-semibold text-fuchsia-brand hover:underline"
            >
              wendclasss@gmail.com
            </a>
          </p>
        </section>

        <hr className="border-blush-200" />

        {/* Hébergement */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xl text-charcoal">
            Hébergement
          </h2>
          <p className="text-sm text-charcoal-light">
            Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>
          <p className="text-sm text-charcoal-light">
            La base de données et l’authentification sont hébergées par <strong>Supabase Inc.</strong>
          </p>
        </section>

        <hr className="border-blush-200" />

        {/* Propriété intellectuelle */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xl text-charcoal">
            Propriété intellectuelle
          </h2>
          <p className="text-sm text-charcoal-light">
            L’ensemble des contenus présents sur Fyp (textes, identité visuelle, logo, structure et code source du site) est la propriété exclusive de Scott Nana / Class S, sauf mention contraire explicite. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
          </p>
        </section>

        <hr className="border-blush-200" />

        {/* Crédits visuels */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xl text-charcoal">
            Crédits visuels
          </h2>
          <p className="text-sm text-charcoal-light">
            Les images illustrant le catalogue d’idées de cadeaux proviennent de la plateforme <strong>Unsplash</strong> et sont utilisées conformément à la licence libre Unsplash. Crédits aux photographes : Content Pixie, Tea Creatives, NordWood Themes, Ksenia Chernaya, Juliette F, Roman Kraft, C-Valentin, Mockup Photos, et Unsplash Community.
          </p>
          <p className="text-sm text-charcoal-light">
            Les icônes vectorielles sont issues de la bibliothèque <strong>Lucide Icons</strong> (licence ISC).
          </p>
        </section>

        <hr className="border-blush-200" />

        {/* Données personnelles */}
        <section className="space-y-2">
          <h2 className="font-display font-bold text-xl text-charcoal">
            Données personnelles
          </h2>
          <p className="text-sm text-charcoal-light">
            Le traitement des données personnelles (adresses email, réponses aux questionnaires de cadeaux) est strictement réservé au bon fonctionnement du service Fyp. Aucune donnée n’est vendue, cédée ou partagée avec des tiers publicitaires. Conformément aux bonnes pratiques, vous pouvez demander la suppression de votre compte et de vos données en nous contactant.
          </p>
        </section>

        <hr className="border-blush-200" />

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-charcoal">
            Contact
          </h2>
          <p className="text-sm text-charcoal-light">
            Pour toute question relative à ces mentions légales ou pour faire part d’une suggestion, contactez-nous via notre formulaire de support :
          </p>
          <Link href="/support">
            <Button variant="primary" size="sm">
              <Mail className="w-4 h-4" />
              <span>Accéder à la page support</span>
            </Button>
          </Link>
        </section>
      </Card>
    </div>
  );
}
