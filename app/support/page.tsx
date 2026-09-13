"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle2, Phone, Mail, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { submitSupportMessage } from "@/app/actions/support";

export default function SupportPage() {
  const [contactType, setContactType] = useState<"email" | "whatsapp">("email");
  const [name, setName] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("contact_type", contactType);
    formData.append("contact_value", contactValue);
    formData.append("message", message);

    const res = await submitSupportMessage(null, formData);
    setIsSubmitting(false);
    setResult(res);

    if (res.success) {
      setName("");
      setContactValue("");
      setMessage("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blush-200 text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          À votre écoute
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
          Une suggestion ? Un souci ?
        </h1>
        <p className="text-charcoal-light text-base sm:text-lg mt-2">
          Votre avis nous aide à perfectionner Fyp. Écrivez-nous directement, nous vous répondrons avec plaisir.
        </p>
      </div>

      <Card className="p-6 sm:p-10">
        {result?.success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-charcoal mb-2">
              Message bien reçu !
            </h2>
            <p className="text-charcoal-light text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
              {result.message}
            </p>
            <Button
              variant="white"
              onClick={() => setResult(null)}
            >
              Envoyer un autre message
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {result?.error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium text-center">
                {result.error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Votre nom ou prénom
              </label>
              <Input
                type="text"
                required
                placeholder="Ex : Scott, Sarah, Marc..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Comment préférez-vous être recontacté(e) ?
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setContactType("email")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 font-display font-semibold text-sm transition-all ${
                    contactType === "email"
                      ? "border-fuchsia-brand bg-blush-50 text-fuchsia-brand shadow-pink-sm"
                      : "border-blush-200 bg-white text-charcoal hover:border-blush-300"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Adresse email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContactType("whatsapp")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 font-display font-semibold text-sm transition-all ${
                    contactType === "whatsapp"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-blush-200 bg-white text-charcoal hover:border-blush-300"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Numéro WhatsApp</span>
                </button>
              </div>

              <Input
                type={contactType === "email" ? "email" : "tel"}
                required
                placeholder={
                  contactType === "email"
                    ? "votre.email@exemple.com"
                    : "+226 XX XX XX XX ou 06 XX XX XX XX"
                }
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />
              <p className="text-[11px] text-charcoal-muted mt-1.5">
                Renseignez uniquement ce moyen de contact pour vous répondre.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Votre message ou suggestion
              </label>
              <textarea
                required
                rows={5}
                placeholder="Partagez-nous votre retour, une idée d’amélioration ou signalez un souci rencontré..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-blush-200 bg-white p-4 text-base text-charcoal shadow-sm transition-all placeholder:text-charcoal-muted focus-visible:outline-none focus-visible:border-fuchsia-brand focus-visible:ring-2 focus-visible:ring-fuchsia-brand/20 resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer mon message</span>
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
