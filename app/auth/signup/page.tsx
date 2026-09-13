"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { linkVisitorToUser, trackEvent } from "@/lib/tracker";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setErrorMsg(err.message || "Erreur de connexion avec Google.");
      setGoogleLoading(false);
    }
  };

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

      if (data?.user) {
        await linkVisitorToUser(data.user.id);
        trackEvent("inscription_reussie", { email });
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
      <div className="text-center mb-6">
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

      {/* Google Signup Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-blush-200 hover:border-blush-300 hover:bg-blush-50/50 text-charcoal font-display font-semibold text-sm shadow-sm hover:shadow-pink-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mb-5"
      >
        {googleLoading ? (
          <div className="w-5 h-5 border-2 border-fuchsia-brand border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5" />
        )}
        <span>Continuer avec Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-blush-200" />
        <span className="text-xs text-charcoal-muted uppercase font-bold tracking-wider">
          ou avec votre email
        </span>
        <div className="flex-1 h-px bg-blush-200" />
      </div>

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
