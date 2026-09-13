"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getAdminData,
  updateExchangeRate,
  updateSupportMessageStatus,
} from "@/app/actions/admin";
import {
  Shield,
  DollarSign,
  MessageSquare,
  BarChart3,
  Globe,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  TrendingUp,
  Gift,
  Mail,
  Smartphone,
  Phone,
  ArrowRight,
  Filter,
  Check,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatFCFA } from "@/lib/utils";

const ADMIN_EMAIL = "wendclasss@gmail.com";

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

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin state
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [adminData, setAdminData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Exchange rate form
  const [newRate, setNewRate] = useState<string>("");
  const [savingRate, setSavingRate] = useState(false);
  const [rateSuccess, setRateSuccess] = useState(false);

  // Support messages filter
  const [supportFilter, setSupportFilter] = useState<"all" | "nouveau" | "traité">("all");
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        if (currentUser.email !== ADMIN_EMAIL) {
          setAuthError("Accès non autorisé. Seul l’administrateur du site peut accéder à cet espace.");
        } else {
          loadData("30d", "all");
        }
      }
      setLoading(false);
    }

    checkAuth();
  }, [supabase]);

  const loadData = async (selectedPeriod: "7d" | "30d" | "all", selectedCountry: string) => {
    setDataLoading(true);
    try {
      const data = await getAdminData(selectedPeriod, selectedCountry);
      setAdminData(data);
      if (data.exchangeRate?.fcfa_per_usd) {
        setNewRate(data.exchangeRate.fcfa_per_usd.toString());
      }
    } catch (err: any) {
      console.error("Error loading admin data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/wendclass-fyp`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || "Erreur de connexion.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdminData(null);
    setAuthError(null);
  };

  const handleSaveRate = async () => {
    const rateNum = parseFloat(newRate);
    if (isNaN(rateNum) || rateNum <= 0) return;
    setSavingRate(true);
    setRateSuccess(false);

    try {
      const res = await updateExchangeRate(rateNum);
      if (res.error) {
        alert(res.error);
      } else {
        setRateSuccess(true);
        setTimeout(() => setRateSuccess(false), 3000);
        loadData(period, countryFilter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRate(false);
    }
  };

  const handleToggleMessage = async (id: string, currentStatus: "nouveau" | "traité") => {
    const newStatus = currentStatus === "nouveau" ? "traité" : "nouveau";
    setUpdatingMessageId(id);

    try {
      await updateSupportMessageStatus(id, newStatus);
      loadData(period, countryFilter);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingMessageId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-fuchsia-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  // 1. NON CONNECTÉ OU COMPTE INVALIDE
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 shadow-soft-xl border border-blush-200 text-center">
          <div className="w-16 h-16 rounded-3xl bg-charcoal text-white mx-auto flex items-center justify-center mb-6 shadow-md">
            <Shield className="w-8 h-8 text-fuchsia-brand" />
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight mb-2">
            Espace d’administration
          </h1>

          <p className="text-sm text-charcoal-light mb-6">
            Accès strictement réservé à l’administrateur du projet.
          </p>

          {authError && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
              {authError}
            </div>
          )}

          {user && user.email !== ADMIN_EMAIL ? (
            <div className="space-y-4">
              <p className="text-xs text-charcoal-muted">
                Connecté avec : <strong>{user.email}</strong>
              </p>
              <Button onClick={handleSignOut} variant="white" className="w-full">
                Se déconnecter et changer de compte
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-blush-200 hover:border-blush-300 hover:bg-blush-50/50 text-charcoal font-display font-semibold text-sm shadow-sm hover:shadow-pink-sm transition-all active:scale-[0.98]"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Connexion administrateur avec Google</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. CONNECTÉ EN TANT QUE WENDCLASSS@GMAIL.COM -> DASHBOARD COMPLET
  const events = adminData?.events || [];
  const questionnaires = adminData?.questionnaires || [];
  const supportMessages = adminData?.supportMessages || [];
  const exchangeRate = adminData?.exchangeRate || { fcfa_per_usd: 600, updated_at: new Date().toISOString() };

  // Calculate rate update freshness
  const rateUpdatedAt = new Date(exchangeRate.updated_at);
  const diffDays = Math.floor((Date.now() - rateUpdatedAt.getTime()) / (1000 * 60 * 60 * 24));
  const isRateOld = diffDays >= 7;

  // Analytics Computations
  // 1. Acquisition
  const pageViews = events.filter((e: any) => e.event_name === "page_vue");
  const sourcesMap: Record<string, number> = {};
  const devicesMap: Record<string, number> = {};
  const browsersMap: Record<string, number> = {};
  const countriesMap: Record<string, number> = {};

  events.forEach((e: any) => {
    const src = e.properties?.source || (e.properties?.referrer ? new URL(e.properties.referrer, "https://fyp.app").hostname : "Direct");
    sourcesMap[src] = (sourcesMap[src] || 0) + 1;

    const dev = e.properties?.device || "Desktop";
    devicesMap[dev] = (devicesMap[dev] || 0) + 1;

    const browser = e.properties?.browser || "Autre";
    browsersMap[browser] = (browsersMap[browser] || 0) + 1;

    const country = e.pays_detecte || "Inconnu";
    countriesMap[country] = (countriesMap[country] || 0) + 1;
  });

  // 2. Questionnaires & Funnel
  const totalQuestionnaires = questionnaires.length;
  const answeredQuestionnaires = questionnaires.filter((q: any) => q.status === "answered" || q.status === "completed").length;
  const completedWithGift = questionnaires.filter((q: any) => q.status === "completed").length;
  const withPersonalNote = questionnaires.filter((q: any) => q.personal_note && q.personal_note.trim().length > 0).length;

  // Occasions count
  const occasionMap: Record<string, number> = {};
  questionnaires.forEach((q: any) => {
    const occ = q.occasion || "Anniversaire";
    occasionMap[occ] = (occasionMap[occ] || 0) + 1;
  });

  // User retention (repeat creators)
  const userQuestionnaireCounts: Record<string, number> = {};
  questionnaires.forEach((q: any) => {
    userQuestionnaireCounts[q.owner_id] = (userQuestionnaireCounts[q.owner_id] || 0) + 1;
  });
  const uniqueUsers = Object.keys(userQuestionnaireCounts).length;
  const repeatUsers = Object.values(userQuestionnaireCounts).filter((c) => c > 1).length;
  const repeatRate = uniqueUsers > 0 ? Math.round((repeatUsers / uniqueUsers) * 100) : 0;

  // Q4 Hedonic distribution from answers
  const answersList = adminData?.answers || [];
  const q4Map: Record<string, number> = { Utile: 0, Fun: 0, "Les deux": 0 };
  answersList.forEach((a: any) => {
    const val = a.q4_hedonic_utilitarian || "Les deux";
    q4Map[val] = (q4Map[val] || 0) + 1;
  });

  // Filtered support messages
  const filteredMessages = supportMessages.filter((m: any) => {
    if (supportFilter === "all") return true;
    return m.status === supportFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Top Header */}
      <div className="bg-charcoal text-white rounded-4xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            Console Administration Fyp
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
            Tableau de bord & Analytics
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Connecté en tant que <strong>{ADMIN_EMAIL}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => loadData(period, countryFilter)}
            variant="white"
            size="sm"
            isLoading={dataLoading}
            className="gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Rafraîchir</span>
          </Button>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-white/70 hover:text-white">
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-3xl p-4 border border-blush-200 shadow-soft-md">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-fuchsia-brand" />
          <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
            Période :
          </span>
          <div className="flex items-center gap-1 bg-blush-100 p-1 rounded-2xl">
            {(["7d", "30d", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  loadData(p, countryFilter);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  period === p ? "bg-white text-fuchsia-brand shadow-sm" : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "Tout l’historique"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-fuchsia-brand" />
          <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
            Pays :
          </span>
          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              loadData(period, e.target.value);
            }}
            className="text-xs font-semibold rounded-xl border border-blush-200 bg-blush-50 px-3 py-1.5 focus:outline-none focus:border-fuchsia-brand"
          >
            <option value="all">Tous les pays</option>
            <option value="Burkina Faso">Burkina Faso</option>
            <option value="Côte d’Ivoire">Côte d’Ivoire</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Mali">Mali</option>
            <option value="Bénin">Bénin</option>
            <option value="Togo">Togo</option>
            <option value="Niger">Niger</option>
            <option value="Guinée-Bissau">Guinée-Bissau</option>
            <option value="France">France</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: TAUX DE CHANGE (USD -> FCFA) */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-charcoal">
                Taux de change manuel (USD → FCFA)
              </h2>
              <p className="text-xs text-charcoal-muted">
                Utilisé exclusivement pour convertir les budgets personnalisés en USD vers le catalogue interne en FCFA.
              </p>
            </div>
          </div>

          <div>
            {isRateOld ? (
              <Badge variant="warning" className="gap-1.5 py-1 px-3">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Mis à jour il y a {diffDays} jours (&gt; 1 semaine)</span>
              </Badge>
            ) : (
              <Badge variant="default" className="gap-1.5 py-1 px-3">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mis à jour récemment (il y a {diffDays} j)</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
          <div className="flex-1 relative">
            <Input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="Ex : 600"
              className="text-lg font-bold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal-muted">
              FCFA pour 1 $
            </span>
          </div>

          <Button
            onClick={handleSaveRate}
            isLoading={savingRate}
            variant="primary"
            className="shrink-0"
          >
            Enregistrer le taux
          </Button>
        </div>

        {rateSuccess && (
          <div className="mt-3 text-xs text-emerald-600 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Taux de change mis à jour avec succès !
          </div>
        )}
      </div>

      {/* SECTION 2: STATS PRINCIPALES DE CONVERSION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Surprises Créées</span>
            <Gift className="w-4 h-4 text-fuchsia-brand" />
          </div>
          <div className="font-display font-black text-3xl text-charcoal">
            {totalQuestionnaires}
          </div>
          <div className="text-xs text-charcoal-muted mt-1">
            Total sur la période
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Taux de réponse</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-black text-3xl text-emerald-600">
            {totalQuestionnaires > 0 ? Math.round((answeredQuestionnaires / totalQuestionnaires) * 100) : 0}%
          </div>
          <div className="text-xs text-charcoal-muted mt-1">
            {answeredQuestionnaires} répondus / {totalQuestionnaires} envoyés
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Cadeaux Validés</span>
            <CheckCircle2 className="w-4 h-4 text-fuchsia-brand" />
          </div>
          <div className="font-display font-black text-3xl text-fuchsia-brand">
            {completedWithGift}
          </div>
          <div className="text-xs text-charcoal-muted mt-1">
            {withPersonalNote} avec un mot doux
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
          <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Rétention Expéditeur</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-display font-black text-3xl text-indigo-600">
            {repeatRate}%
          </div>
          <div className="text-xs text-charcoal-muted mt-1">
            {repeatUsers} créateurs réguliers ({uniqueUsers} uniques)
          </div>
        </div>
      </div>

      {/* SECTION 3: TABLEAUX ANALYTICS DÉTAILLÉS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Acquisition & Appareils */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-fuchsia-brand" />
            <h3 className="font-display font-bold text-lg text-charcoal">
              1. Acquisition & Trafic
            </h3>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
              Sources de trafic :
            </h4>
            <div className="space-y-1.5">
              {Object.entries(sourcesMap).slice(0, 5).map(([src, count]) => (
                <div key={src} className="flex items-center justify-between text-xs p-2 rounded-xl bg-blush-50">
                  <span className="font-semibold text-charcoal">{src}</span>
                  <span className="font-bold text-fuchsia-brand">{count} visites</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Appareils :
              </h4>
              {Object.entries(devicesMap).map(([dev, count]) => (
                <div key={dev} className="flex justify-between text-xs py-1 border-b border-blush-100">
                  <span>{dev}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Navigateurs :
              </h4>
              {Object.entries(browsersMap).slice(0, 4).map(([b, count]) => (
                <div key={b} className="flex justify-between text-xs py-1 border-b border-blush-100">
                  <span>{b}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Données Produit & Orientation Q4 */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-5 h-5 text-fuchsia-brand" />
            <h3 className="font-display font-bold text-lg text-charcoal">
              2. Données Produit & Questionnaire
            </h3>
          </div>

          <div>
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
              Occasions les plus fréquentes :
            </h4>
            <div className="space-y-1.5">
              {Object.entries(occasionMap).map(([occ, count]) => (
                <div key={occ} className="flex items-center justify-between text-xs p-2 rounded-xl bg-blush-50">
                  <span>{occ}</span>
                  <span className="font-bold text-charcoal">{count} créations</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
              Répartition Q4 (Utile vs Fun) :
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                <span className="text-xs font-bold text-indigo-700 block">Utile</span>
                <span className="font-display font-black text-xl text-indigo-900">{q4Map.Utile || 0}</span>
              </div>
              <div className="p-3 rounded-2xl bg-fuchsia-50 border border-fuchsia-100">
                <span className="text-xs font-bold text-fuchsia-700 block">Fun</span>
                <span className="font-display font-black text-xl text-fuchsia-900">{q4Map.Fun || 0}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-xs font-bold text-amber-700 block">Les deux</span>
                <span className="font-display font-black text-xl text-amber-900">{q4Map["Les deux"] || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: MESSAGES DU SUPPORT */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-brand/10 text-fuchsia-brand flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-charcoal">
                Messages de support & suggestions ({supportMessages.length})
              </h2>
              <p className="text-xs text-charcoal-muted">
                Retours clients envoyés depuis le formulaire de contact.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-blush-100 p-1 rounded-2xl">
            {(["all", "nouveau", "traité"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSupportFilter(s)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  supportFilter === s ? "bg-white text-fuchsia-brand shadow-sm" : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                {s === "all" ? "Tous" : s === "nouveau" ? "Nouveaux" : "Traités"}
              </button>
            ))}
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-sm text-charcoal-muted bg-blush-50 rounded-3xl border border-blush-200">
            Aucun message dans cette catégorie.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg: any) => (
              <div
                key={msg.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  msg.status === "nouveau" ? "bg-white border-fuchsia-brand/30 shadow-sm" : "bg-blush-50/50 border-blush-200 opacity-80"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold text-base text-charcoal">
                      {msg.name}
                    </span>
                    <Badge variant={msg.status === "nouveau" ? "fuchsia" : "default"}>
                      {msg.status === "nouveau" ? "Nouveau" : "Traité"}
                    </Badge>
                    <span className="text-[11px] text-charcoal-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-fuchsia-brand flex items-center gap-2">
                    {msg.contact_type === "whatsapp" ? (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> WhatsApp : {msg.contact_value}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email : {msg.contact_value}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-wrap bg-blush-50/70 p-3 rounded-2xl border border-blush-100">
                    {msg.message}
                  </p>
                </div>

                <Button
                  onClick={() => handleToggleMessage(msg.id, msg.status)}
                  isLoading={updatingMessageId === msg.id}
                  variant={msg.status === "nouveau" ? "primary" : "white"}
                  size="sm"
                  className="shrink-0"
                >
                  {msg.status === "nouveau" ? "Marquer comme traité" : "Remettre en nouveau"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
