"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setSuccessMsg(
          "Compte créé avec succès ! Si un email de confirmation est requis, veuillez vérifier votre boîte de réception."
        );
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setErrorMsg(err.message || "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 shadow-soft-xl border border-blush-200"
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-3xl bg-fuchsia-brand text-white mx-auto flex items-center justify-center mb-4 shadow-pink-md">
          <Gift className="w-7 h-7" />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
          Créer un compte Fyp 🎁
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Gérez vos surprises et accédez aux recommandations de cadeaux
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
            Adresse Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              className="pl-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
            Mot de passe (6 caractères min)
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          variant="primary"
          size="lg"
          className="w-full mt-2"
        >
          <span>Créer mon compte</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-blush-100 text-center text-xs text-charcoal-light">
        Vous avez déjà un compte ?{" "}
        <Link
          href={`/auth/login${redirectPath !== "/dashboard" ? `?redirect=${redirectPath}` : ""}`}
          className="font-bold text-fuchsia-brand hover:underline"
        >
          Se connecter
        </Link>
      </div>
    </motion.div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<div className="h-96 w-full max-w-md bg-white rounded-4xl animate-pulse" />}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
