"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Gift, Sparkles, User, LogOut, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Hide standard navbar on the recipient secret questionnaire path `/s/[token]`
  if (pathname.startsWith("/s/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-blush-100/80 border-b border-blush-200/60 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-fuchsia-brand text-white flex items-center justify-center shadow-pink-md group-hover:scale-105 group-hover:bg-fuchsia-hover transition-all">
            <Gift className="w-6 h-6 animate-pulseGlow" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-2xl tracking-tight text-charcoal">
              Fyp<span className="text-fuchsia-brand">.</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#concept"
            className="text-sm font-medium text-charcoal-light hover:text-fuchsia-brand transition-colors"
          >
            Le principe
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-charcoal-light hover:text-fuchsia-brand transition-colors"
          >
            Comment ça marche
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={
                pathname === "/dashboard"
                  ? "text-sm font-bold text-fuchsia-brand"
                  : "text-sm font-medium text-charcoal-light hover:text-fuchsia-brand transition-colors"
              }
            >
              Mes surprises
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-24 bg-blush-200/60 rounded-2xl animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/create">
                <Button size="sm" variant="primary" className="hidden sm:inline-flex">
                  <PlusCircle className="w-4 h-4" />
                  Créer une surprise
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" variant="white">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <button
                onClick={handleSignOut}
                title="Se déconnecter"
                className="p-2.5 rounded-2xl text-charcoal-muted hover:text-charcoal hover:bg-blush-200/60 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="primary" size="sm">
                  <Sparkles className="w-4 h-4" />
                  Offrir un cadeau
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
