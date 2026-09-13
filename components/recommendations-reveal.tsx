"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoredGift, Questionnaire } from "@/lib/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Gift as GiftIcon, CheckCircle2, Heart, Sparkles, Send, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface RecommendationsRevealProps {
  questionnaire: Questionnaire;
  recommendations: ScoredGift[];
  onGiftSelected?: (giftId: string, note?: string) => void;
}

export function RecommendationsReveal({
  questionnaire,
  recommendations,
}: RecommendationsRevealProps) {
  const router = useRouter();
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(
    questionnaire.selected_gift_id || null
  );
  const [personalNote, setPersonalNote] = useState<string>(
    questionnaire.personal_note || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(questionnaire.status === "completed");

  const supabase = createClient();

  const handleSelect = (giftId: string) => {
    setSelectedGiftId(giftId);
  };

  const handleFinalize = async () => {
    if (!selectedGiftId) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("questionnaires")
        .update({
          selected_gift_id: selectedGiftId,
          personal_note: personalNote,
          status: "completed",
        })
        .eq("id", questionnaire.id);

      if (error) throw error;

      setIsSaved(true);

      // Trigger festive confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E8368F", "#F8B0CD", "#FDE7F0", "#FFD700"],
        });
      } catch (e) {
        // confetti fallback
      }

      router.refresh();
    } catch (err: any) {
      console.error("Error saving selected gift:", err);
      alert("Une erreur est survenue lors de la validation. Veuillez réessayer.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedGiftObj = recommendations.find((r) => r.gift.id === selectedGiftId);

  return (
    <div className="space-y-8">
      {/* Header with high energy intro */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-brand/10 text-fuchsia-brand text-xs font-bold uppercase tracking-wider mb-3"
        >
          <Sparkles className="w-4 h-4" />
          Révélation des 3 meilleures idées
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-black text-3xl sm:text-4xl text-charcoal tracking-tight"
        >
          Voici les 3 idées de cadeaux les plus adaptées pour {questionnaire.recipient_name} ✨
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-charcoal-light text-base mt-2"
        >
          Sélectionnées sur-mesure selon les réponses reçues et vos critères.
          Sélectionnez activement l’idée qui vous inspire le plus.
        </motion.p>
      </div>

      {/* 3 Choreographed Recommendation Cards (NO PRICES DISPLAYED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item, index) => {
          const isSelected = selectedGiftId === item.gift.id;
          const badgeVariants: Record<string, "fuchsia" | "default" | "secondary"> = {
            "Très adapté": "fuchsia",
            Adapté: "default",
            Alternative: "secondary",
          };

          return (
            <motion.div
              key={item.gift.id}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative flex flex-col justify-between bg-white rounded-4xl p-6 border-2 transition-all duration-300 shadow-soft-xl ${
                isSelected
                  ? "border-fuchsia-brand ring-4 ring-fuchsia-brand/15 shadow-pink-lg"
                  : "border-blush-200 hover:border-blush-300"
              }`}
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <Badge variant={badgeVariants[item.rank_label] || "default"}>
                  {item.rank_label}
                </Badge>

                {isSelected && (
                  <span className="flex items-center gap-1 text-xs font-bold text-fuchsia-brand">
                    <CheckCircle2 className="w-4 h-4 fill-fuchsia-brand text-white" />
                    Sélectionné
                  </span>
                )}
              </div>

              {/* Gift Image or Visual Icon */}
              {item.gift.image_url ? (
                <div className="relative w-full h-44 rounded-3xl overflow-hidden mb-4 bg-blush-50">
                  <img
                    src={item.gift.image_url}
                    alt={item.gift.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="w-full h-36 rounded-3xl bg-blush-100 flex items-center justify-center text-fuchsia-brand mb-4">
                  <GiftIcon className="w-12 h-12" />
                </div>
              )}

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-charcoal leading-snug mb-2">
                  {item.gift.name}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed mb-4">
                  {item.gift.description}
                </p>

                {/* Explanation Box */}
                <div className="p-3.5 rounded-2xl bg-blush-50/80 border border-blush-200 text-xs text-charcoal leading-relaxed mb-4">
                  <div className="font-bold text-fuchsia-brand flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Pourquoi ce choix :
                  </div>
                  <p className="text-charcoal-light">{item.explanation}</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.gift.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blush-100 text-charcoal-light"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="button"
                variant={isSelected ? "primary" : "white"}
                size="md"
                onClick={() => handleSelect(item.gift.id)}
                className="w-full"
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>C’est mon choix !</span>
                  </>
                ) : (
                  <span>C’est celui-ci</span>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Active Finalization Step (When a gift is picked) */}
      <AnimatePresence>
        {selectedGiftId && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-4xl p-6 sm:p-10 border-2 border-fuchsia-brand/40 shadow-pink-lg mt-8"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-brand text-white flex items-center justify-center shadow-pink-sm">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-charcoal">
                    Votre choix : {selectedGiftObj?.gift.name}
                  </h3>
                  <p className="text-sm text-charcoal-light">
                    Vous pouvez ajouter un mot doux personnel qui accompagnera votre cadeau.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Un petit mot doux ou message personnalisé (optionnel) :
                </label>
                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder={`Ex : "Joyeux anniversaire ${questionnaire.recipient_name} ! J’espère que cette petite attention te fera plaisir ❤️"`}
                  rows={3}
                  className="w-full rounded-2xl border border-blush-200 bg-blush-50/50 p-4 text-sm text-charcoal focus:outline-none focus:border-fuchsia-brand focus:ring-2 focus:ring-fuchsia-brand/20 transition-all placeholder:text-charcoal-muted resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-charcoal-muted text-center sm:text-left">
                  💡 Ce choix sera enregistré dans votre espace pour préparer votre achat en toute sérénité.
                </div>

                <Button
                  onClick={handleFinalize}
                  isLoading={isSaving}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSaved ? "Mettre à jour mon choix" : "Valider mon choix de cadeau"}</span>
                </Button>
              </div>

              {isSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Votre choix a été validé avec succès ! Vous pouvez retrouver toutes les infos dans votre Dashboard.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
