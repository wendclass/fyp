"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Check, MapPin, ShieldCheck, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { getVisitorId, trackEvent } from "@/lib/tracker";

const COOKIE_CONSENT_KEY = "fyp_cookie_consent_v1";

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localisationAccepted, setLocalisationAccepted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Show after small smooth delay on first visit
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setLocalisationAccepted(parsed.localisation ?? true);
      } catch (e) {
        // ignore
      }
    }

    // Listener to reopen preferences from footer
    const handleOpenModal = () => {
      setIsExpanded(true);
      setIsOpen(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenModal);
    return () => window.removeEventListener("open-cookie-preferences", handleOpenModal);
  }, []);

  const saveConsent = async (locAccepted: boolean) => {
    const consentData = {
      localisation: locAccepted,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    document.cookie = `fyp_consent_loc=${locAccepted ? "1" : "0"}; path=/; max-age=31536000; SameSite=Lax`;
    setLocalisationAccepted(locAccepted);
    setIsOpen(false);

    // Save to Supabase `consents` table
    try {
      const supabase = createClient();
      const visitor_id = getVisitorId();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user_id = session?.user?.id || null;

      await supabase.from("consents").insert({
        visitor_id,
        user_id,
        localisation_accepted: locAccepted,
      });

      trackEvent("consentement_cookies", {
        localisation_accepted: locAccepted,
      });

      // Dispatch event to inform create page or other components
      window.dispatchEvent(
        new CustomEvent("fyp-consent-updated", {
          detail: { localisation_accepted: locAccepted },
        })
      );
    } catch (err) {
      console.debug("Error recording consent", err);
    }
  };

  const handleAcceptAll = () => {
    saveConsent(true);
  };

  const handleRefuseLocation = () => {
    saveConsent(false);
  };

  const handleSaveCustom = () => {
    saveConsent(localisationAccepted);
  };

  if (!mounted || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-3 sm:p-6 bg-charcoal/20 backdrop-blur-xs transition-all">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-4xl p-6 sm:p-8 border border-blush-200/90 shadow-soft-2xl ring-1 ring-fuchsia-brand/10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-fuchsia-brand/10 text-fuchsia-brand flex items-center justify-center shadow-pink-sm shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-charcoal tracking-tight">
                  Respect de votre vie privée 🍪
                </h3>
                <span className="text-[11px] font-bold text-fuchsia-brand uppercase tracking-wider">
                  Fyp & vos données
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-blush-100 transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Intro Text */}
          <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed mb-4">
            Nous utilisons des cookies essentiels pour sécuriser votre navigation et vos surprises. Avec votre accord, nous utilisons la localisation pour vous afficher automatiquement les prix et cadeaux dans votre devise locale.
          </p>

          {/* Toggle "Voir plus" Link */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-bold text-fuchsia-brand underline underline-offset-4 hover:text-fuchsia-hover transition-colors"
            >
              <span>{isExpanded ? "Masquer le détail" : "Voir plus (détail des 2 catégories)"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Categories Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 mb-5 overflow-hidden"
              >
                {/* 1. Essentiels */}
                <div className="p-4 rounded-2xl bg-blush-50/70 border border-blush-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-display font-bold text-sm text-charcoal">
                        1. Essentiels (Parcours et compte)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Toujours actif
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    On l’utilise pour retenir où tu en es dans l’app et relier tes surprises créées à ton compte, pour que tu les retrouves à chaque connexion.
                  </p>
                </div>

                {/* 2. Localisation */}
                <div className="p-4 rounded-2xl bg-blush-50/70 border border-blush-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-fuchsia-brand" />
                      <span className="font-display font-bold text-sm text-charcoal">
                        2. Localisation
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localisationAccepted}
                        onChange={(e) => setLocalisationAccepted(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-blush-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fuchsia-brand" />
                    </label>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    On l’utilise pour détecter ton pays et t’afficher directement les prix et les idées de cadeaux dans la bonne devise, sans que tu aies à le choisir toi-même à chaque visite.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            {isExpanded ? (
              <>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSaveCustom}
                  className="w-full sm:flex-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer mes préférences</span>
                </Button>
                <Button
                  type="button"
                  variant="white"
                  size="md"
                  onClick={handleRefuseLocation}
                  className="w-full sm:w-auto text-xs"
                >
                  <span>Refuser la localisation</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleAcceptAll}
                  className="w-full sm:flex-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>J’accepte</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleRefuseLocation}
                  className="w-full sm:w-auto text-xs text-charcoal-muted hover:text-charcoal"
                >
                  <span>Continuer sans localisation</span>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
