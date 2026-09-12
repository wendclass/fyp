"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ArrowRight, ArrowLeft, Sparkles, Check, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { slugifyRecipient, formatFCFA } from "@/lib/utils";

const OCCASIONS = [
  { id: "Anniversaire", title: "Anniversaire", icon: "🎂", desc: "Pour fêter un an de plus comme il se doit" },
  { id: "Amour / couple", title: "Amour / couple", icon: "❤️", desc: "Saint-Valentin, date spéciale ou juste pour faire plaisir" },
  { id: "Réussite", title: "Réussite", icon: "🏆", desc: "Diplôme, promotion, nouvel emploi ou projet" },
  { id: "Remerciement", title: "Remerciement", icon: "🙏", desc: "Dire un grand merci avec une belle attention" },
  { id: "Félicitations", title: "Félicitations", icon: "🎉", desc: "Mariage, naissance ou bonne nouvelle" },
  { id: "Autre", title: "Autre occasion", icon: "✨", desc: "Une surprise spontanée sans raison particulière" },
];

const BUDGET_PRESETS = [
  { value: "5000", label: "5 000 FCFA", desc: "Petite attention délicate" },
  { value: "10000", label: "10 000 FCFA", desc: "Joli cadeau sympa" },
  { value: "25000", label: "25 000 FCFA", desc: "Superbe cadeau marquant" },
  { value: "50000", label: "50 000 FCFA", desc: "Cadeau d''exception & prestige" },
];

export default function CreateSurprisePage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState("");
  const [occasion, setOccasion] = useState("Anniversaire");
  const [budgetType, setBudgetType] = useState("preset"); // "preset" | "custom"
  const [budgetPreset, setBudgetPreset] = useState("25000");
  const [customBudget, setCustomBudget] = useState("");
  
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    }
    checkAuth();
  }, [supabase]);

  const effectiveBudget = budgetType === "preset" ? budgetPreset : customBudget;

  const handleCreate = async () => {
    if (!recipientName.trim()) {
      setErrorMsg("Veuillez renseigner le prénom du bénéficiaire.");
      setStep(1);
      return;
    }

    if (!effectiveBudget || parseInt(effectiveBudget.replace(/\D/g, ""), 10) <= 0) {
      setErrorMsg("Veuillez sélectionner ou saisir un budget valide.");
      return;
    }

    if (!user) {
      // If not logged in, redirect to login with query params to preserve draft
      router.push(`/auth/login?redirect=/create`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const share_token = slugifyRecipient(recipientName);
      const title = `Surprise pour ${recipientName.trim()} (${occasion})`;

      const { data, error } = await supabase
        .from("questionnaires")
        .insert({
          owner_id: user.id,
          recipient_name: recipientName.trim(),
          occasion,
          budget: effectiveBudget,
          title,
          status: "sent",
          share_token,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/dashboard/${data.id}?created=true`);
    } catch (err: any) {
      console.error("Error creating questionnaire:", err);
      setErrorMsg(err.message || "Erreur lors de la création. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-fuchsia-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blush-200 text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Nouvelle surprise Fyp
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
          Préparer une surprise 🎁
        </h1>
        <p className="text-charcoal-light text-base sm:text-lg mt-2">
          Renseignez le prénom, l''occasion et votre budget pour générer le lien secret.
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Prénom & Occasion */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Card Prénom */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl max-w-2xl mx-auto">
            <label className="block font-display font-bold text-lg sm:text-xl text-charcoal mb-2">
              Pour qui préparez-vous ce cadeau ?
            </label>
            <p className="text-xs sm:text-sm text-charcoal-light mb-4">
              Ce prénom sera affiché sur le lien personnalisé (ex: Amélie, Thomas, Sarah...).
            </p>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <Input
                type="text"
                required
                placeholder="Ex : Amélie"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="pl-12 text-lg font-semibold"
              />
            </div>
          </div>

          {/* Card Occasion (Cartes Larges) */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl">
            <div className="mb-6">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-charcoal">
                Quelle est l''occasion ?
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light mt-1">
                Cela permet de contextualiser les suggestions de cadeaux.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {OCCASIONS.map((occ) => {
                const isSelected = occasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ.id)}
                    className={`flex flex-col items-start p-5 rounded-3xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-fuchsia-brand bg-blush-50 ring-2 ring-fuchsia-brand/20 shadow-pink-sm scale-[1.01]"
                        : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/40"
                    }`}
                  >
                    <span className="text-3xl mb-2">{occ.icon}</span>
                    <span className="font-display font-bold text-base text-charcoal mb-1">
                      {occ.title}
                    </span>
                    <span className="text-xs text-charcoal-muted leading-relaxed">
                      {occ.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end max-w-2xl mx-auto">
            <Button
              type="button"
              size="lg"
              onClick={() => {
                if (!recipientName.trim()) {
                  setErrorMsg("Veuillez saisir le prénom de votre proche.");
                  return;
                }
                setErrorMsg(null);
                setStep(2);
              }}
              className="w-full sm:w-auto"
            >
              <span>Étape suivante : Budget</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Budget & Validation */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl">
            <div className="mb-6">
              <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                Confidentialité absolue
              </span>
              <h2 className="font-display font-bold text-2xl text-charcoal">
                Quel est votre budget pour {recipientName} ?
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light mt-1">
                🔒 {recipientName} ne verra jamais ce montant. Il sert uniquement à filtrer les idées de cadeaux.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {BUDGET_PRESETS.map((preset) => {
                const isSelected = budgetType === "preset" && budgetPreset === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setBudgetType("preset");
                      setBudgetPreset(preset.value);
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-fuchsia-brand bg-blush-50 shadow-pink-sm"
                        : "border-blush-200 bg-white hover:border-blush-300"
                    }`}
                  >
                    <div>
                      <div className="font-display font-black text-lg text-charcoal">
                        {preset.label}
                      </div>
                      <div className="text-xs text-charcoal-muted">{preset.desc}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-fuchsia-brand bg-fuchsia-brand text-white"
                          : "border-blush-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount option */}
            <div className="pt-4 border-t border-blush-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-2">
                <input
                  type="radio"
                  name="budgetSelection"
                  checked={budgetType === "custom"}
                  onChange={() => setBudgetType("custom")}
                  className="accent-fuchsia-brand w-4 h-4"
                />
                <span>Montant personnalisé (FCFA)</span>
              </label>

              {budgetType === "custom" && (
                <div className="mt-3">
                  <Input
                    type="number"
                    placeholder="Ex: 35000"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    className="text-lg font-bold"
                  />
                  <span className="text-xs text-charcoal-muted mt-1 block">
                    Montant en Francs CFA
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recap Box */}
          <div className="p-5 rounded-3xl bg-blush-50 border border-blush-200/80 text-sm text-charcoal">
            <div className="font-display font-bold text-charcoal mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4 text-fuchsia-brand" />
              Récapitulatif de la surprise :
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-light">
              <div>Bénéficiaire : <strong className="text-charcoal">{recipientName}</strong></div>
              <div>Occasion : <strong className="text-charcoal">{occasion}</strong></div>
              <div>Budget défini : <strong className="text-fuchsia-brand">{formatFCFA(effectiveBudget)}</strong></div>
              <div>Lien généré : <strong className="text-charcoal">fyp.app/{recipientName.toLowerCase()}-...</strong></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="white"
              size="lg"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>

            <Button
              type="button"
              size="xl"
              variant="primary"
              onClick={handleCreate}
              isLoading={loading}
              className="flex-1 sm:flex-none"
            >
              <Sparkles className="w-5 h-5" />
              <span>Générer le lien secret</span>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
