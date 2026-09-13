"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroAnimatedText } from "@/components/hero-animated-text";
import { Button } from "@/components/ui/button";
import {
  Gift,
  EyeOff,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Lock,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-brand/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-blush-200 text-charcoal text-xs sm:text-sm font-semibold shadow-pink-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-fuchsia-brand animate-ping" />
          <Sparkles className="w-4 h-4 text-fuchsia-brand" />
          <span>Le mécanisme d’aveuglement pour réussir tous vos cadeaux</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-charcoal tracking-tight leading-[1.2] mb-6 max-w-4xl mx-auto"
        >
          Le cadeau parfait pour <br />
          <HeroAnimatedText />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-xl text-charcoal-light max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Vous définissez votre budget, votre proche répond à 3 questions rapides sans jamais voir vos chiffres ni les idées suggérées. Vous recevez ensuite 3 recommandations sur-mesure et choisissez activement la meilleure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="xl" variant="primary" className="w-full">
              <Gift className="w-6 h-6" />
              <span>Créer une surprise</span>
            </Button>
          </Link>
          <Link href="/#concept" className="w-full sm:w-auto">
            <Button size="xl" variant="white" className="w-full">
              <span>Voir comment ça marche</span>
            </Button>
          </Link>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-charcoal-muted"
        >
          <span className="flex items-center gap-1.5">
            <EyeOff className="w-4 h-4 text-fuchsia-brand" /> Budget 100% secret
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-fuchsia-brand" /> Questionnaire 1 minute
          </span>
          <span className="flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-fuchsia-brand" /> Choix actif garanti
          </span>
        </motion.div>
      </section>

      {/* SECTION: CONCEPT DE L’AVEUGLEMENT */}
      <section id="concept" className="w-full py-20 px-4 sm:px-6 bg-white border-y border-blush-200/80">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-2 block">
              Le secret du produit
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight">
              Le mécanisme d’aveuglement 🙈
            </h2>
            <p className="text-base sm:text-lg text-charcoal-light mt-3 leading-relaxed">
              Demander à quelqu’un ce qu’il veut ruine la surprise. Deviner au hasard risque de décevoir. Fyp résout ce dilemme avec une étanchéité totale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Colonne 1: Ce que vous voyez */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-blush-50 rounded-4xl p-8 border-2 border-fuchsia-brand/30 shadow-soft-xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-brand text-white flex items-center justify-center mb-6 shadow-pink-sm">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-charcoal mb-3">
                Vous (La personne qui offre)
              </h3>
              <ul className="space-y-3.5 text-sm text-charcoal-light">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-fuchsia-brand shrink-0 mt-0.5" />
                  <span>Vous fixez l’occasion et le <strong>budget précis</strong> (ex : 25 000 FCFA).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-fuchsia-brand shrink-0 mt-0.5" />
                  <span>Vous recevez les <strong>réponses réelles</strong> de votre proche.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-fuchsia-brand shrink-0 mt-0.5" />
                  <span>Vous découvrez les <strong>3 meilleures idées de cadeaux</strong> scorées avec explications.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-fuchsia-brand shrink-0 mt-0.5" />
                  <span>Vous <strong>choisissez vous-même</strong> le cadeau final et y ajoutez un mot doux.</span>
                </li>
              </ul>
            </motion.div>

            {/* Colonne 2: Ce que le bénéficiaire voit */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blush-100/60 rounded-4xl p-8 border border-blush-200 shadow-soft-xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-charcoal flex items-center justify-center mb-6 shadow-sm">
                <EyeOff className="w-6 h-6 text-fuchsia-brand" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-charcoal mb-3">
                Votre proche (Le bénéficiaire)
              </h3>
              <ul className="space-y-3.5 text-sm text-charcoal-light">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-charcoal shrink-0 mt-0.5" />
                  <span>Ouvre un lien unique <strong>sans avoir besoin de créer de compte</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-charcoal shrink-0 mt-0.5" />
                  <span>Répond à <strong>3 questions visuelles simples</strong> en moins d’une minute.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Ne voit JAMAIS le montant du budget</strong> (garanti au niveau base de données).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Ne voit JAMAIS les cadeaux recommandés</strong> pour préserver l’effet de surprise.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: COMMENT ÇA MARCHE (4 ÉTAPES) */}
      <section id="how-it-works" className="w-full py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-2 block">
            Le parcours
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight">
            Comment ça marche ?
          </h2>
          <p className="text-base text-charcoal-light mt-2">
            Créer, Envoyer, Consulter, Choisir
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Créez la surprise",
              desc: "Choisissez l’occasion (Anniversaire, Couple, Réussite...) et définissez votre budget en FCFA.",
              icon: "🎁",
            },
            {
              step: "02",
              title: "Envoyez le lien secret",
              desc: "Partagez le lien personnalisé en un clic par WhatsApp, Messenger ou SMS.",
              icon: "🔗",
            },
            {
              step: "03",
              title: "Votre proche répond",
              desc: "3 questions ultra rapides pour cerner ce qu’il aime, préfère utiliser et souhaite éviter.",
              icon: "💬",
            },
            {
              step: "04",
              title: "Révélation et Choix",
              desc: "Découvrez ses réponses et les 3 idées de cadeaux parfaitement ajustées, puis validez votre choix.",
              icon: "✨",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-blush-200/80 shadow-soft-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-display font-black text-2xl text-blush-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FINAL BANNER */}
      <section className="w-full py-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-fuchsia-brand to-fuchsia-hover rounded-5xl p-8 sm:p-14 text-center text-white shadow-pink-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4 leading-tight">
            Prêt(e) à offrir le cadeau inoubliable ?
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Prenez 30 secondes pour créer votre lien secret et préparez la meilleure surprise.
          </p>

          <Link href="/create">
            <Button
              size="xl"
              variant="white"
              className="text-fuchsia-brand font-black hover:bg-blush-50 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-fuchsia-brand" />
              <span>Créer ma surprise maintenant</span>
              <ArrowRight className="w-5 h-5 text-fuchsia-brand" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
