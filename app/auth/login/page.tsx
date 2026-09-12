"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Identifiants invalides.");
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
        <div className="w-14 h-14 rounded-3xl bg-blush-100 text-fuchsia-brand mx-auto flex items-center justify-center mb-4 shadow-pink-sm">
          <Gift className="w-7 h-7" />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
          Bon retour sur Fyp ✨
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Connectez-vous pour retrouver vos surprises et recommandations
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
          {errorMsg}
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
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <Input
              type="password"
              required
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
          <span>Se connecter</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-blush-100 text-center text-xs text-charcoal-light">
        Pas encore de compte ?{" "}
        <Link
          href={`/auth/signup${redirectPath !== "/dashboard" ? `?redirect=${redirectPath}` : ""}`}
          className="font-bold text-fuchsia-brand hover:underline"
        >
          Créer un compte
        </Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<div className="h-96 w-full max-w-md bg-white rounded-4xl animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
