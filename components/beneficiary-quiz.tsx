"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/tracker";

interface BeneficiaryQuizProps {
  token: string;
  recipientName: string;
  occasion?: string;
  questionnaireId?: string;
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

// Q3: Extended list combining Q2 domains + materials
const Q3_OPTIONS = [
  // Domaines
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
  // Matières & univers
  { label: "Parfums", icon: "🌸" },
  { label: "Vêtements", icon: "👔" },
  { label: "Bijoux", icon: "💍" },
  { label: "Cosmétiques", icon: "🧴" },
  { label: "Nourriture", icon: "🍕" },
  { label: "Gadgets électroniques", icon: "📱" },
  { label: "Objets décoratifs", icon: "🏺" },
  { label: "Expériences", icon: "🎟️" },
  // Option neutre
  { label: "Rien en particulier", icon: "😊" },
];

const Q4_OPTIONS = [
  {
    label: "Utile",
    icon: "🛠️",
    title: "Quelque chose d’utile",
    desc: "Un objet pratique qui sert réellement au quotidien",
  },
  {
    label: "Fun",
    icon: "🎉",
    title: "Quelque chose de fun",
    desc: "Pour le pur plaisir, sans besoin d’être pratique",
  },
  {
    label: "Les deux",
    icon: "✨",
    title: "Les deux / Peu importe",
    desc: "Un équilibre idéal ou une surprise totale",
  },
];

export function BeneficiaryQuiz({
  token,
  recipientName,
  occasion = "un événement spécial",
  questionnaireId,
  alreadyAnswered = false,
}: BeneficiaryQuizProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(0); // 0 = intro, 1 = Q1, 2 = Q2, 3 = Q3, 4 = Q4, 5 = success
  const [direction, setDirection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Answers state
  const [q1, setQ1] = useState<string>("");
  const [q2, setQ2] = useState<string[]>([]);
  const [q3, setQ3] = useState<string[]>([]);
  const [q4, setQ4] = useState<string>("Les deux");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    trackEvent("questionnaire_ouvert", {
      token,
      recipient_name: recipientName,
      already_answered: alreadyAnswered,
      questionnaire_id: questionnaireId || null,
    });
  }, [token, recipientName, alreadyAnswered, questionnaireId]);

  const handleBecomeSender = () => {
    if (typeof window !== "undefined") {
      if (questionnaireId) localStorage.setItem("fyp_converted_from_qid", questionnaireId);
      localStorage.setItem("fyp_converted_from_token", token);
    }
    trackEvent("beneficiaire_devient_expediteur", {
      questionnaire_id: questionnaireId || null,
      token,
      recipient_name: recipientName,
    });
    const qidParam = questionnaireId ? `&qid=${encodeURIComponent(questionnaireId)}` : "";
    router.push(`/auth/signup?from_quiz=${encodeURIComponent(token)}${qidParam}&redirect=/create`);
  };

  if (alreadyAnswered) {
    return (
      <div className="min-h-screen bg-blush-100 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 text-center shadow-soft-xl border border-blush-200 space-y-6"
        >
          <div>
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal mb-2">
              C’est déjà noté ❤️
            </h2>
            <p className="text-charcoal-light text-sm leading-relaxed">
              Tu as déjà répondu à ce questionnaire pour {recipientName}. Tout est prêt pour ta surprise !
            </p>
          </div>

          {/* Second temps : À ton tour */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blush-50 to-white border border-blush-200 text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-brand/10 text-fuchsia-brand text-[11px] font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              À ton tour
            </div>
            <h3 className="font-display font-bold text-lg text-charcoal">
              À ton tour de faire plaisir à quelqu’un ?
            </h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Prépare une surprise secrète pour un proche sans jamais dévoiler ton budget.
            </p>
            <Button
              onClick={handleBecomeSender}
              variant="primary"
              size="md"
              className="w-full gap-2 mt-2"
            >
              <span>Créer une surprise pour un proche</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
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
      setErrorMsg("Sélectionne au moins une catégorie (3 maximum)");
      return;
    }
    if (step === 3 && q3.length === 0) {
      setErrorMsg("Sélectionne au moins une option (ou \"Rien en particulier\")");
      return;
    }
    if (step === 4 && !q4) {
      setErrorMsg("Choisis une option pour finaliser 😊");
      return;
    }

    setErrorMsg(null);
    setDirection(1);

    if (step === 1) {
      trackEvent("reponse_q1", { q1, token });
      setStep(2);
    } else if (step === 2) {
      trackEvent("reponse_q2", { q2, token });
      setStep(3);
    } else if (step === 3) {
      trackEvent("reponse_q3", { q3, token });
      setStep(4);
    } else if (step === 4) {
      trackEvent("reponse_q4", { q4, token });
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const toggleQ2Option = (opt: string) => {
    setErrorMsg(null);
    setQ2((prev) => {
      if (prev.includes(opt)) {
        return prev.filter((i) => i !== opt);
      }
      if (prev.length >= 3) {
        setErrorMsg("3 choix maximum pour tes univers favoris !");
        return prev;
      }
      return [...prev, opt];
    });
  };

  const toggleQ3Option = (opt: string) => {
    setErrorMsg(null);
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
      const { error } = await supabase.rpc("submit_questionnaire", {
        p_token: token,
        p_q1: q1,
        p_q2: q2,
        p_q3: q3,
        p_q4: q4,
      });

      if (error) {
        throw error;
      }

      trackEvent("questionnaire_complete", {
        token,
        recipient_name: recipientName,
        q1,
        q2_count: q2.length,
        q3_count: q3.length,
        q4,
      });

      setStep(5);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg("Une erreur est survenue lors de l’envoi. Merci de réessayer.");
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

        {step >= 1 && step <= 4 && (
          <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            Question {step} sur 4
          </div>
        )}
      </div>

      {/* Progress Bar (4 segments) */}
      {step >= 1 && step <= 4 && (
        <div className="max-w-xl w-full mx-auto mt-4 px-2">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
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
                Quelqu’un qui t’apprécie souhaite te faire une surprise pour {occasion}. Réponds à <span className="font-semibold text-charcoal">4 petites questions</span> très rapides (1 minute max) pour l’aider à cerner tes goûts !
              </p>

              <Button
                onClick={() => {
                  setDirection(1);
                  setStep(1);
                  trackEvent("demarrage_questionnaire", { token, recipient_name: recipientName });
                }}
                size="lg"
                className="w-full"
              >
                <span>C’est parti !</span>
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
                  Question 1 / 4
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Qu’est-ce qui te ferait le plus plaisir ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Choisis l’option qui te tente le plus en ce moment.
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

          {/* STEP 2: Q2 (CHOIX MULTIPLE - MAX 3) */}
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
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider block">
                    Question 2 / 4
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blush-100 text-fuchsia-brand">
                    {q2.length}/3 sélectionnés
                  </span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight mt-1">
                  Qu’est-ce que tu aimes ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Sélectionne <strong>jusqu’à 3 univers favoris</strong> qui te passionnent.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
                {Q2_OPTIONS.map((opt) => {
                  const isSelected = q2.includes(opt.label);
                  const isMaxReached = q2.length >= 3 && !isSelected;

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={isMaxReached}
                      onClick={() => toggleQ2Option(opt.label)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 text-center transition-all ${
                        isSelected
                          ? "border-fuchsia-brand bg-blush-50 shadow-pink-sm scale-[1.02]"
                          : isMaxReached
                          ? "border-blush-100 bg-blush-50/40 text-charcoal-muted opacity-50 cursor-not-allowed"
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

          {/* STEP 3: Q3 (CHOIX MULTIPLE ILLIMITÉ - EXCLUSIONS ÉTENDUES) */}
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
              <div className="mb-4">
                <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                  Question 3 / 4
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Y a-t-il quelque chose que tu n’aimes pas recevoir ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Ce que tu préfères éviter ou as déjà en trop grande quantité (choix illimité).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto p-1 mb-8">
                {Q3_OPTIONS.map((opt) => {
                  const isSelected = q3.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => toggleQ3Option(opt.label)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all ${
                        isSelected
                          ? opt.label === "Rien en particulier"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-rose-400 bg-rose-50 text-rose-700 shadow-sm scale-[1.02]"
                          : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/50 text-charcoal"
                      }`}
                    >
                      <span className="text-xl mb-1">{opt.icon}</span>
                      <span className="font-display font-semibold text-xs leading-tight">
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
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Q4 (NOUVELLE: UTILE VS FUN) */}
          {step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-4xl p-6 sm:p-8 md:p-10 shadow-soft-xl border border-blush-200"
            >
              <div className="mb-6">
                <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                  Question 4 / 4
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Utile au quotidien ou purement fun ?
                </h2>
                <p className="text-sm text-charcoal-muted mt-1">
                  Qu’est-ce qui te ferait le plus plaisir entre ces orientations ?
                </p>
              </div>

              <div className="space-y-3.5 mb-8">
                {Q4_OPTIONS.map((opt) => {
                  const isSelected = q4 === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setQ4(opt.label)}
                      className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-3xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-fuchsia-brand bg-blush-50 shadow-pink-sm scale-[1.01]"
                          : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-3xl">{opt.icon}</span>
                        <div>
                          <div className="font-display font-bold text-base sm:text-lg text-charcoal">
                            {opt.title}
                          </div>
                          <div className="text-xs text-charcoal-muted mt-0.5">{opt.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
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
                  <span>Envoyer mes 4 réponses</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION + VIRAL LOOP */}
          {step === 5 && (
            <motion.div
              key="step-5"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white rounded-4xl p-6 sm:p-10 shadow-soft-xl border border-blush-200 text-center space-y-6"
            >
              {/* Premier temps : Remerciement */}
              <div>
                <div className="w-16 h-16 rounded-3xl bg-blush-100 text-fuchsia-brand mx-auto flex items-center justify-center mb-4 shadow-pink-md animate-float">
                  <Heart className="w-8 h-8 fill-fuchsia-brand text-fuchsia-brand" />
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-charcoal mb-2 tracking-tight">
                  C’est noté ❤️
                </h2>

                <p className="text-charcoal-light text-base sm:text-lg leading-relaxed mb-4">
                  Merci d’avoir répondu, {recipientName} !
                </p>

                <div className="p-4 rounded-3xl bg-blush-50 border border-blush-200 text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto">
                  <Sparkles className="w-4 h-4 text-fuchsia-brand inline mr-1.5" />
                  Tes 4 réponses ont été transmises en toute discrétion. Prépare-toi à être surpris(e) !
                </div>
              </div>

              {/* Séparateur */}
              <div className="border-t border-blush-100 my-4" />

              {/* Second temps : À ton tour de faire plaisir à quelqu'un ? */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blush-50 to-white border border-blush-200 text-left space-y-3 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-brand/10 text-fuchsia-brand text-[11px] font-bold uppercase tracking-wider">
                  <Gift className="w-3.5 h-3.5" />
                  À ton tour
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-charcoal tracking-tight">
                  À ton tour de faire plaisir à quelqu’un ?
                </h3>

                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                  Fais vivre la même expérience à un proche : choisis une occasion, fixe ton budget secret et envoie-lui son lien personnalisé en 30 secondes.
                </p>

                <Button
                  onClick={handleBecomeSender}
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 mt-2 shadow-pink-md hover:shadow-pink-lg transition-all"
                >
                  <span>Créer une surprise pour un proche</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Discreet Footer */}
      <div className="text-center text-xs text-charcoal-muted py-2">
        Propulsé par <span className="font-bold text-charcoal">Fyp</span>, l’art de faire plaisir sans se tromper.
      </div>
    </div>
  );
}
