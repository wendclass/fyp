"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Gift,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  User,
  Globe,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { slugifyRecipient, formatFCFA } from "@/lib/utils";
import { AgeRangeType } from "@/lib/types";
import { trackEvent } from "@/lib/tracker";

const OCCASIONS = [
  { id: "Anniversaire", title: "Anniversaire", icon: "🎂", desc: "Pour fêter un an de plus comme il se doit" },
  { id: "Amour / couple", title: "Amour / couple", icon: "❤️", desc: "Saint-Valentin, date spéciale ou juste pour faire plaisir" },
  { id: "Réussite", title: "Réussite", icon: "🏆", desc: "Diplôme, promotion, nouvel emploi ou projet" },
  { id: "Remerciement", title: "Remerciement", icon: "🙏", desc: "Dire un grand merci avec une belle attention" },
  { id: "Félicitations", title: "Félicitations", icon: "🎉", desc: "Mariage, naissance ou bonne nouvelle" },
  { id: "Autre", title: "Autre occasion", icon: "✨", desc: "Une surprise spontanée sans raison particulière" },
];

const AGE_RANGES: { id: AgeRangeType; label: string; desc: string; icon: string }[] = [
  { id: "13-17", label: "13 - 17 ans", desc: "Adolescent(e)", icon: "🎒" },
  { id: "18-24", label: "18 - 24 ans", desc: "Jeune adulte / Étudiant(e)", icon: "🎓" },
  { id: "25-34", label: "25 - 34 ans", desc: "Jeune actif / Adulte", icon: "💼" },
  { id: "35+", label: "35 ans et +", desc: "Adulte établi / Senior", icon: "🌟" },
];

const FCFA_COUNTRIES = [
  "Bénin",
  "Burkina Faso",
  "Côte d’Ivoire",
  "Guinée-Bissau",
  "Mali",
  "Niger",
  "Sénégal",
  "Togo",
];

const BUDGET_PRESETS_FCFA = [
  { value: "5000", label: "5 000 FCFA", desc: "Petite attention délicate" },
  { value: "10000", label: "10 000 FCFA", desc: "Joli cadeau sympa" },
  { value: "25000", label: "25 000 FCFA", desc: "Superbe cadeau marquant" },
  { value: "50000", label: "50 000 FCFA", desc: "Cadeau d’exception et prestige" },
];

const BUDGET_PRESETS_USD = [
  { value: "10", label: "10 $", desc: "Petite attention délicate (~5 000 FCFA)" },
  { value: "20", label: "20 $", desc: "Joli cadeau sympa (~10 000 FCFA)" },
  { value: "45", label: "45 $", desc: "Superbe cadeau marquant (~25 000 FCFA)" },
  { value: "90", label: "90 $", desc: "Cadeau d’exception et prestige (~50 000 FCFA)" },
];

export default function CreateSurprisePage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState("");
  const [occasion, setOccasion] = useState("Anniversaire");
  const [ageRange, setAgeRange] = useState<AgeRangeType>("25-34");
  const [country, setCountry] = useState<string>("");

  const [currency, setCurrency] = useState<"FCFA" | "USD">("FCFA");
  const [budgetType, setBudgetType] = useState<"preset" | "custom">("preset");
  const [budgetPreset, setBudgetPreset] = useState("25000");
  const [customBudget, setCustomBudget] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  // Track initial page visit
  useEffect(() => {
    trackEvent("clic_creer_surprise", { step: 1 });
  }, []);

  // Geolocation & Timezone detection on mount
  useEffect(() => {
    async function checkAuthAndLocation() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setCheckingAuth(false);

      // Check cookie consent for localisation
      const consentStr = localStorage.getItem("fyp_cookie_consent_v1");
      let locAllowed = true;
      if (consentStr) {
        try {
          const parsed = JSON.parse(consentStr);
          if (parsed.localisation === false) locAllowed = false;
        } catch (e) {}
      }

      if (!locAllowed) {
        // If localisation refused, switch to USD and leave country unselected
        setCurrency("USD");
        setBudgetPreset("45");
        return;
      }

      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (timeZone.includes("Ouagadougou")) setCountry("Burkina Faso");
        else if (timeZone.includes("Abidjan")) setCountry("Côte d’Ivoire");
        else if (timeZone.includes("Dakar")) setCountry("Sénégal");
        else if (timeZone.includes("Bamako")) setCountry("Mali");
        else if (timeZone.includes("Niamey")) setCountry("Niger");
        else if (timeZone.includes("Lome")) setCountry("Togo");
        else if (timeZone.includes("Porto-Novo") || timeZone.includes("Cotonou")) setCountry("Bénin");
        else if (timeZone.includes("Bissau")) setCountry("Guinée-Bissau");
        else {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              () => {
                setCurrency("FCFA");
              },
              () => {
                setCurrency("USD");
                setBudgetPreset("45");
              }
            );
          }
        }
      } catch (e) {
        // fallback
      }
    }

    checkAuthAndLocation();

    const handleConsentChange = (e: any) => {
      const loc = e.detail?.localisation_accepted;
      if (loc === false) {
        setCurrency("USD");
        setBudgetPreset("45");
      }
    };

    window.addEventListener("fyp-consent-updated", handleConsentChange);
    return () => window.removeEventListener("fyp-consent-updated", handleConsentChange);
  }, [supabase]);

  // Sync preset default when currency changes
  const handleCurrencyChange = (newCurr: "FCFA" | "USD") => {
    setCurrency(newCurr);
    setBudgetType("preset");
    if (newCurr === "FCFA") {
      setBudgetPreset("25000");
    } else {
      setBudgetPreset("45");
    }
    trackEvent("devise_selectionnee", { currency: newCurr });
  };

  const effectiveBudget = budgetType === "preset" ? budgetPreset : customBudget;

  const handleCreate = async () => {
    if (!recipientName.trim()) {
      setErrorMsg("Veuillez renseigner le prénom du bénéficiaire.");
      setStep(1);
      return;
    }

    if (!country) {
      setErrorMsg("Veuillez sélectionner le pays du bénéficiaire.");
      setStep(1);
      return;
    }

    if (!effectiveBudget || parseInt(effectiveBudget.replace(/\D/g, ""), 10) <= 0) {
      setErrorMsg("Veuillez sélectionner ou saisir un budget valide.");
      return;
    }

    if (!user) {
      trackEvent("redirection_login_creation", { recipient_name: recipientName, occasion });
      router.push(`/auth/login?redirect=/create`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const share_token = slugifyRecipient(recipientName);
      const title = `Surprise pour ${recipientName.trim()} (${occasion})`;

      const formattedBudget =
        currency === "USD"
          ? `${effectiveBudget.replace(/\$/g, "")} $`
          : effectiveBudget;

      const { data, error } = await supabase
        .from("questionnaires")
        .insert({
          owner_id: user.id,
          recipient_name: recipientName.trim(),
          occasion,
          budget: formattedBudget,
          currency,
          recipient_age_range: ageRange,
          recipient_country: country,
          title,
          status: "sent",
          share_token,
        })
        .select()
        .single();

      if (error) throw error;

      trackEvent("surprise_creee", {
        id: data.id,
        recipient_name: recipientName.trim(),
        occasion,
        age_range: ageRange,
        country,
        currency,
        budget: formattedBudget,
      });

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
          Renseignez les détails pour générer le lien secret sans rien dévoiler au bénéficiaire.
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: Profil du bénéficiaire & Occasion */}
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
              Ce prénom sera affiché sur le lien secret (ex : Amélie, Thomas, Sarah...).
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

          {/* Card Tranche d’âge & Pays */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl max-w-2xl mx-auto space-y-6">
            {/* Tranche d’âge */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-fuchsia-brand" />
                <label className="font-display font-bold text-lg text-charcoal">
                  Tranche d’âge du bénéficiaire
                </label>
              </div>
              <p className="text-xs text-charcoal-light mb-4">
                Permet d’écarter les cadeaux inadaptés à son âge.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AGE_RANGES.map((ar) => {
                  const isSelected = ageRange === ar.id;
                  return (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => {
                        setAgeRange(ar.id);
                        trackEvent("age_selectionne", { age: ar.id });
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all ${
                        isSelected
                          ? "border-fuchsia-brand bg-blush-50 ring-2 ring-fuchsia-brand/20 shadow-pink-sm scale-[1.02]"
                          : "border-blush-200 bg-white hover:border-blush-300 hover:bg-blush-50/40"
                      }`}
                    >
                      <span className="text-2xl mb-1">{ar.icon}</span>
                      <span className="font-display font-bold text-sm text-charcoal">
                        {ar.label}
                      </span>
                      <span className="text-[10px] text-charcoal-muted leading-tight mt-0.5">
                        {ar.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-blush-100" />

            {/* Pays du bénéficiaire (Zone FCFA) */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-fuchsia-brand" />
                <label className="font-display font-bold text-lg text-charcoal">
                  Pays du bénéficiaire (Zone FCFA)
                </label>
              </div>
              <p className="text-xs text-charcoal-light mb-3">
                Sélectionnez le pays de résidence de votre proche.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FCFA_COUNTRIES.map((c) => {
                  const isSelected = country === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCountry(c);
                        trackEvent("pays_selectionne", { country: c });
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-fuchsia-brand bg-blush-50 text-fuchsia-brand shadow-sm font-bold"
                          : "border-blush-200 bg-white text-charcoal hover:border-blush-300"
                      }`}
                    >
                      <span>{c}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-fuchsia-brand" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card Occasion */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl">
            <div className="mb-6">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-charcoal">
                Quelle est l’occasion ?
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
                    onClick={() => {
                      setOccasion(occ.id);
                      trackEvent("occasion_selectionnee", { occasion: occ.id });
                    }}
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
                if (!country) {
                  setErrorMsg("Veuillez sélectionner le pays du bénéficiaire.");
                  return;
                }
                setErrorMsg(null);
                setStep(2);
                trackEvent("etape_suivante_creation", { step: 2, recipient_name: recipientName, occasion });
              }}
              className="w-full sm:w-auto"
            >
              <span>Étape suivante : Budget</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Budget, Devise & Validation */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl">
            {/* Header with Currency Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-1 block">
                  Confidentialité absolue
                </span>
                <h2 className="font-display font-bold text-2xl text-charcoal">
                  Quel est votre budget pour {recipientName} ?
                </h2>
              </div>

              {/* Devise Switch */}
              <div className="flex items-center bg-blush-100 p-1 rounded-2xl border border-blush-200 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCurrencyChange("FCFA")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currency === "FCFA"
                      ? "bg-white text-fuchsia-brand shadow-pink-sm"
                      : "text-charcoal-light hover:text-charcoal"
                  }`}
                >
                  FCFA
                </button>
                <button
                  type="button"
                  onClick={() => handleCurrencyChange("USD")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currency === "USD"
                      ? "bg-white text-fuchsia-brand shadow-pink-sm"
                      : "text-charcoal-light hover:text-charcoal"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-light mb-6">
              🔒 {recipientName} ne verra jamais ce montant. Il sert uniquement à filtrer les idées de cadeaux.
            </p>

            {/* Presets (FCFA or USD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {(currency === "FCFA" ? BUDGET_PRESETS_FCFA : BUDGET_PRESETS_USD).map((preset) => {
                const isSelected = budgetType === "preset" && budgetPreset === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setBudgetType("preset");
                      setBudgetPreset(preset.value);
                      trackEvent("budget_choisi", { budget: preset.value, currency, type: "preset" });
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
                      {isSelected && <Check className="w-3.5 h-3.5" />}
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
                <span>Montant personnalisé ({currency})</span>
              </label>

              {budgetType === "custom" && (
                <div className="mt-3">
                  <Input
                    type="number"
                    placeholder={currency === "FCFA" ? "Ex : 35000" : "Ex : 60"}
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    className="text-lg font-bold"
                  />
                  <span className="text-xs text-charcoal-muted mt-1 block">
                    Montant en {currency === "FCFA" ? "Francs CFA" : "Dollars américains ($)"}
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
              <div>Âge : <strong className="text-charcoal">{ageRange} ans</strong></div>
              <div>Pays : <strong className="text-charcoal">{country}</strong></div>
              <div>Occasion : <strong className="text-charcoal">{occasion}</strong></div>
              <div>Budget : <strong className="text-fuchsia-brand">{currency === "USD" ? `${effectiveBudget} $` : formatFCFA(effectiveBudget)}</strong></div>
              <div>Lien secret : <strong className="text-charcoal">fyp.app/{recipientName.toLowerCase()}-...</strong></div>
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
