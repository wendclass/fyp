"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

interface BeneficiaryQuizProps {
  token: string;
  recipientName: string;
  occasion?: string;
  alreadyAnswered?: boolean;
}

const Q1_OPTIONS = [
  { label: "Quelque chose à porter", icon: "👕", desc: "Mode, accessoires ou vêtements" },
  { label: "Quelque chose à utiliser", icon: "⚡", desc: "Objets utiles, tech, sport ou déco" },
  { label: "Quelque chose à manger", icon: "🍫", desc: "Douceurs, gastronomie ou gourmandises" },
  { label: "Une expérience", icon: "✨", desc: "Moments mémorables, sorties, bien-être" },
  { label: "Une surprise", icon: "🎁", desc: "Laisse carte blanche totale !" },
];

const Q2_OPTIONS = [
  { label: "Mode", icon: "👗" },
  { label: "Beauté", icon: "💄" },
  { label: "Technologie", icon: "💻" },
  { label: "Sport", icon: "🏃" },
  { label: "Musique", icon: "🎧" },
  { label: "Livres", icon: "📚" },
  { label: "Cuisine", icon: "🍳" },
  { label: "Voyage", icon: "✈️" },
  { label: "Jeux", icon: "🎲" },
  { label: "Décoration", icon: "🛋️" },
  { label: "Autre", icon: "✨" },
];

const Q3_OPTIONS = [
  { label: "Parfums", icon: "🌸" },
  { label: "Vêtements", icon: "👔" },
  { label: "Bijoux", icon: "💍" },
  { label: "Cosmétiques", icon: "🧴" },
  { label: "Nourriture", icon: "🍕" },
  { label: "Gadgets électroniques", icon: "📱" },
  { label: "Objets décoratifs", icon: "🏺" },
  { label: "Expériences", icon: "🎟️" },
  { label: "Rien en particulier", icon: "😊" },
];

export function BeneficiaryQuiz({
  token,
  recipientName,
  occasion = "un événement spécial",
  alreadyAnswered = false,
}: BeneficiaryQuizProps) {
  const [step, setStep] = useState<number>(0); // 0 = intro, 1 = Q1, 2 = Q2, 3 = Q3, 4 = success
  const [direction, setDirection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Answers state
  const [q1, setQ1] = useState<string>("");
  const [q2, setQ2] = useState<string[]>([]);
  const [q3, setQ3] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  if (alreadyAnswered) {
    return (
      <div className="min-h-screen bg-blush-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 text-center shadow-soft-xl border border-blush-200"
        >
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal mb-3">
            C''est déjà noté ❤️
          </h2>
          <p className="text-charcoal-light text-base leading-relaxed mb-6">
            Tu as déjà répondu à ce questionnaire pour {recipientName}. Tout est prêt pour ta surprise !
          </p>
        </motion.div>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1 && !q1) {
      setErrorMsg("Choisis une option pour continuer 😊");
      return;
    }
    if (step === 2 && q2.length === 0) {
      setErrorMsg("Sélectionne au moins une catégorie que tu aimes");
      return;
    }
    if (step === 3 && q3.length === 0) {
      setErrorMsg("Sélectionne au moins une option (ou 'Rien en particulier')");
      return;
    }

    setErrorMsg(null);
    setDirection(1);
    if (step < 3) {
      setStep((s) => s + 1);
    } else if (step === 3) {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const toggleQ2Option = (opt: string) => {
    setQ2((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt]
    );
  };

  const toggleQ3Option = (opt: string) => {
    if (opt === "Rien en particulier") {
      setQ3(["Rien en particulier"]);
      return;
    }
    setQ3((prev) => {
      const filtered = prev.filter((i) => i !== "Rien en particulier");
      if (filtered.includes(opt)) {
        return filtered.filter((i) => i !== opt);
      } else {
        return [...filtered, opt];
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.rpc("submit_questionnaire", {
        p_token: token,
        p_q1: q1,
        p_q2: q2,
        p_q3: q3,
      });

      if (error) {
        throw error;
      }

      setStep(4); // Success screen
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg("Une erreur est survenue lors de l''envoi. Merci de réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      filter: "blur(4px)",
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="min-h-screen bg-blush-100 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Brand Header */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-fuchsia-brand text-white flex items-center justify-center shadow-pink-sm">
            <Gift className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-xl text-charcoal">
            Fyp<span className="text-fuchsia-brand">.</span>
          </span>
        </div>

        {step >= 1 && step <= 3 && (
          <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Question {step} sur 3
          </div>
        )}
      </div>

      {/* Progress Bar (3 segments) */}
      {step >= 1 && step <= 3 && (
        <div className="max-w-xl w-full mx-auto mt-4 px-2">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-2 rounded-full overflow-hidden bg-blush-200"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step >= s ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="h-full bg-fuchsia-brand rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Form Area */}
      <div className="max-w-xl w-full mx-auto my-auto py-6">
        <AnimatePresence custom={direction} mode="wait">
          {/* STEP 0: INTRO SCREEN */}
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-4xl p-8 sm:p-10 shadow-soft-xl border border-blush-200 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-blush-100 text-fuchsia-brand mx-auto flex items-center justify-center mb-6 shadow-pink-sm">
                <Gift className="w-8 h-8 animate-float" />
              </div>

              <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-charcoal mb-4 tracking-tight leading-snug">
                On prépare quelque chose pour toi 🎁
              </h1>

              <p className="text-charcoal-light text-base sm:text-lg leading-relaxed mb-8">
                Quelqu''un qui t''apprécie souhaite te faire une surprise pour {occasion}. Réponds à <span className="font-semibold text-charcoal">3 petites questions</span> très rapides (1 minute max) pour l''aider à cerner tes goûts !
              </p>

              <Button
                onClick={() => {
                  setDirection(1);
                  setStep(1);
                }}
                size="lg"
                className="w-full"
              >
                <span>C''est parti !</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {/* STEP 1: Q1 (CHOIX UNIQUE) */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-4xl p-6 sm:p-8 md:p-10 shadow-soft-xl border border-blush-200"
            >
              <div className="mb-6">
                <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                  Question 1 / 3
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Qu''est-ce qui te ferait le plus plaisir ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Choisis l''option qui te tente le plus en ce moment.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {Q1_OPTIONS.map((opt) => {
                  const isSelected = q1 === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setQ1(opt.label)}
                      className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-fuchsia-brand bg-blush-50 shadow-pink-sm scale-[1.01]"
                          : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <div className="font-display font-bold text-base text-charcoal">
                            {opt.label}
                          </div>
                          <div className="text-xs text-charcoal-muted">{opt.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-fuchsia-brand bg-fuchsia-brand text-white"
                            : "border-blush-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <div className="text-sm text-rose-500 font-medium mb-4 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="white"
                  size="md"
                  onClick={handlePrev}
                  className="px-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  className="flex-1"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Q2 (CHOIX MULTIPLE) */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-4xl p-6 sm:p-8 md:p-10 shadow-soft-xl border border-blush-200"
            >
              <div className="mb-6">
                <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                  Question 2 / 3
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Qu''est-ce que tu aimes ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Sélectionne tous les univers qui te passionnent (plusieurs choix possibles).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
                {Q2_OPTIONS.map((opt) => {
                  const isSelected = q2.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => toggleQ2Option(opt.label)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 text-center transition-all ${
                        isSelected
                          ? "border-fuchsia-brand bg-blush-50 shadow-pink-sm scale-[1.02]"
                          : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/50"
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.icon}</span>
                      <span className="font-display font-semibold text-xs text-charcoal">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <div className="text-sm text-rose-500 font-medium mb-4 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="white"
                  size="md"
                  onClick={handlePrev}
                  className="px-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  className="flex-1"
                >
                  <span>Continuer ({q2.length} choisis)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Q3 (CHOIX MULTIPLE - EXCLUSIONS) */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-4xl p-6 sm:p-8 md:p-10 shadow-soft-xl border border-blush-200"
            >
              <div className="mb-6">
                <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                  Question 3 / 3
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Y a-t-il des choses que tu évites ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Ce que tu n''aimes pas recevoir ou as déjà en trop grande quantité.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
                {Q3_OPTIONS.map((opt) => {
                  const isSelected = q3.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => toggleQ3Option(opt.label)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 text-center transition-all ${
                        isSelected
                          ? "border-rose-400 bg-rose-50 shadow-sm scale-[1.02]"
                          : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/50"
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.icon}</span>
                      <span className="font-display font-semibold text-xs text-charcoal">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <div className="text-sm text-rose-500 font-medium mb-4 text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="white"
                  size="md"
                  onClick={handlePrev}
                  className="px-4"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  <Heart className="w-4 h-4" />
                  <span>Envoyer mes réponses</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white rounded-4xl p-8 sm:p-12 shadow-soft-xl border border-blush-200 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-blush-100 text-fuchsia-brand mx-auto flex items-center justify-center mb-6 shadow-pink-md animate-float">
                <Heart className="w-10 h-10 fill-fuchsia-brand text-fuchsia-brand" />
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal mb-3 tracking-tight">
                C''est noté ❤️
              </h2>

              <p className="text-charcoal-light text-lg sm:text-xl leading-relaxed mb-6">
                Merci d''avoir répondu, {recipientName} !
              </p>

              <div className="p-4 rounded-3xl bg-blush-50 border border-blush-200 text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto">
                <Sparkles className="w-4 h-4 text-fuchsia-brand inline mr-1.5" />
                Tes réponses ont été transmises en toute discrétion. Prépare-toi à être surpris(e) !
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Discreet Footer */}
      <div className="text-center text-xs text-charcoal-muted py-2">
        Propulsé par <span className="font-bold text-charcoal">Fyp</span> — L''art de faire plaisir sans se tromper.
      </div>
    </div>
  );
}
