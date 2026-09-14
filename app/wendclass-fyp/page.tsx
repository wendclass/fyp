"use client";

import { useEffect, useState, useMemo } from "react";
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
  FileText,
  GitMerge,
  MapPin,
  Smile,
  Package,
  Layers,
  Settings,
  HelpCircle,
  Laptop,
  Tablet,
  Activity,
  UserCheck,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatFCFA } from "@/lib/utils";

const ADMIN_EMAIL = "wendclasss@gmail.com";

type AdminTab =
  | "overview"
  | "acquisition"
  | "pages"
  | "funnel"
  | "location"
  | "beneficiary"
  | "product"
  | "conversion"
  | "support"
  | "settings";

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Admin filter state
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

  // Raw data from server
  const events = adminData?.events || [];
  const questionnaires = adminData?.questionnaires || [];
  const answers = adminData?.answers || [];
  const gifts = adminData?.gifts || [];
  const supportMessages = adminData?.supportMessages || [];
  const consents = adminData?.consents || [];
  const exchangeRate = adminData?.exchangeRate || {
    fcfa_per_usd: 600,
    updated_at: new Date().toISOString(),
  };

  // Exchange rate status
  const rateUpdatedAt = new Date(exchangeRate.updated_at);
  const diffDays = Math.floor((Date.now() - rateUpdatedAt.getTime()) / (1000 * 60 * 60 * 24));
  const isRateOld = diffDays >= 7;

  // Count unread support messages
  const unreadMessagesCount = supportMessages.filter((m: any) => m.status === "nouveau").length;

  // --- COMPUTATIONS & ANALYTICS ---
  const analytics = useMemo(() => {
    // 1. Visitors
    const todayStr = new Date().toISOString().split("T")[0];
    const todayVisitors = new Set(
      events
        .filter((e: any) => e.occurred_at && e.occurred_at.startsWith(todayStr))
        .map((e: any) => e.visitor_id)
    ).size;

    const uniqueVisitorsPeriod = new Set(events.map((e: any) => e.visitor_id)).size;

    // Accounts created
    const uniqueUsersPeriod = new Set(
      events.filter((e: any) => e.user_id).map((e: any) => e.user_id)
    ).size;

    // 2. Questionnaires & Funnel
    const totalQ = questionnaires.length;
    const pendingQ = questionnaires.filter((q: any) => q.status === "sent").length;
    const answeredQ = questionnaires.filter(
      (q: any) => q.status === "answered" || q.status === "completed"
    ).length;
    const completedQ = questionnaires.filter((q: any) => q.status === "completed").length;
    const responseRate = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;

    // 3. Acquisition Data
    const sourcesMap: Record<string, number> = {};
    const mediumsMap: Record<string, number> = {};
    const campaignsMap: Record<string, number> = {};
    const referrersMap: Record<string, number> = {};
    const landingPagesMap: Record<string, number> = {};
    const devicesMap: Record<string, number> = {};
    const browsersMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    const languagesMap: Record<string, number> = {};
    const channelSignupsMap: Record<string, number> = {};

    // First visit tracking by visitor
    const firstVisitsByHour: Record<number, number> = {};
    const recentFirstVisits: any[] = [];

    const visitorFirstSeen: Record<string, any> = {};

    events.forEach((e: any) => {
      const p = e.properties || {};
      const src = p.source || (p.referrer && p.referrer !== "direct" ? "Referrer externe" : "Direct / Inconnu");
      sourcesMap[src] = (sourcesMap[src] || 0) + 1;

      if (p.medium) mediumsMap[p.medium] = (mediumsMap[p.medium] || 0) + 1;
      if (p.campaign) campaignsMap[p.campaign] = (campaignsMap[p.campaign] || 0) + 1;

      const ref = p.referrer || "direct";
      referrersMap[ref] = (referrersMap[ref] || 0) + 1;

      const lp = p.landing_page || "/";
      landingPagesMap[lp] = (landingPagesMap[lp] || 0) + 1;

      const dev = p.device || "Desktop";
      devicesMap[dev] = (devicesMap[dev] || 0) + 1;

      const b = p.browser || "Autre";
      browsersMap[b] = (browsersMap[b] || 0) + 1;

      const os = p.os || "Autre";
      osMap[os] = (osMap[os] || 0) + 1;

      const lang = p.language ? p.language.substring(0, 5) : "fr";
      languagesMap[lang] = (languagesMap[lang] || 0) + 1;

      if (e.event_name === "inscription_reussie" || e.event_name === "surprise_creee") {
        channelSignupsMap[src] = (channelSignupsMap[src] || 0) + 1;
      }

      // Track first visit
      if (!visitorFirstSeen[e.visitor_id]) {
        visitorFirstSeen[e.visitor_id] = e;
        const date = new Date(e.occurred_at);
        const hour = date.getHours();
        firstVisitsByHour[hour] = (firstVisitsByHour[hour] || 0) + 1;
        recentFirstVisits.push({
          visitor_id: e.visitor_id,
          date: e.occurred_at,
          source: src,
          landing_page: lp,
          device: dev,
          country: e.pays_detecte || "Inconnu",
        });
      }
    });

    // 3b. Converted Beneficiary -> Sender (Viral Loop)
    const profilesList = adminData?.profiles || [];
    const convertedProfiles = profilesList.filter((p: any) => p.converted_from_questionnaire_id);
    const viralUserIds = new Set<string>(convertedProfiles.map((p: any) => p.id));

    // Also check events for any beneficiaire_devient_expediteur
    events
      .filter((e: any) => e.event_name === "beneficiaire_devient_expediteur")
      .forEach((e: any) => {
        if (e.user_id) viralUserIds.add(e.user_id);
      });

    const viralAccountsCount = viralUserIds.size;
    const viralSurprises = questionnaires.filter((q: any) => viralUserIds.has(q.owner_id));
    const viralSurprisesCount = viralSurprises.length;
    const viralCreatorsCount = new Set(viralSurprises.map((q: any) => q.owner_id)).size;
    const viralConversionRate =
      viralAccountsCount > 0
        ? Math.round((viralCreatorsCount / viralAccountsCount) * 100)
        : 0;

    // Add viral channel to channelSignupsMap if > 0
    if (viralAccountsCount > 0) {
      channelSignupsMap["Bénéficiaire devenu expéditeur (Boucle virale)"] = viralAccountsCount;
    }

    // 4. Pages Visitées (page_vue events)
    const pageViewsMap: Record<string, { totalViews: number; uniqueVisitors: Set<string> }> = {};
    events
      .filter((e: any) => e.event_name === "page_vue")
      .forEach((e: any) => {
        const path = e.properties?.path || e.page_url?.split("?")[0] || "/";
        if (!pageViewsMap[path]) {
          pageViewsMap[path] = { totalViews: 0, uniqueVisitors: new Set() };
        }
        pageViewsMap[path].totalViews += 1;
        pageViewsMap[path].uniqueVisitors.add(e.visitor_id);
      });

    const pagesList = Object.entries(pageViewsMap)
      .map(([path, data]) => ({
        path,
        views: data.totalViews,
        visitors: data.uniqueVisitors.size,
      }))
      .sort((a, b) => b.views - a.views);

    const totalPageViews = pagesList.reduce((acc, p) => acc + p.views, 0);

    // 5. Funnel (Creation -> Reveal -> Validation)
    const funnelCounts = {
      step1_start: events.filter((e: any) => e.event_name === "clic_creer_surprise" || e.properties?.path === "/create").length,
      step2_occasion: events.filter((e: any) => e.event_name === "etape_suivante_creation" || e.event_name === "age_selectionne").length,
      step3_created: questionnaires.length,
      step4_quiz_opened: events.filter((e: any) => e.event_name === "questionnaire_ouvert").length,
      step5_quiz_start: events.filter((e: any) => e.event_name === "demarrage_questionnaire").length,
      step6_q1: events.filter((e: any) => e.event_name === "reponse_q1").length,
      step7_q2: events.filter((e: any) => e.event_name === "reponse_q2").length,
      step8_q3: events.filter((e: any) => e.event_name === "reponse_q3").length,
      step9_q4_completed: answers.length,
      step10_recommendations_seen: events.filter((e: any) => e.event_name === "recommandations_consultees").length || answeredQ,
      step11_gift_validated: completedQ,
    };

    // 6. Beneficiary Behavior & Drop-off
    const quizDropoffs = {
      intro_drop: Math.max(0, funnelCounts.step4_quiz_opened - funnelCounts.step5_quiz_start),
      q1_drop: Math.max(0, funnelCounts.step5_quiz_start - funnelCounts.step6_q1),
      q2_drop: Math.max(0, funnelCounts.step6_q1 - funnelCounts.step7_q2),
      q3_drop: Math.max(0, funnelCounts.step7_q2 - funnelCounts.step8_q3),
      q4_drop: Math.max(0, funnelCounts.step8_q3 - funnelCounts.step9_q4_completed),
    };

    // Delay between Questionnaire creation and Answer creation
    const delayListHours: number[] = [];
    questionnaires.forEach((q: any) => {
      const relatedAnswer = answers.find((a: any) => a.questionnaire_id === q.id);
      if (relatedAnswer) {
        const diffMs = new Date(relatedAnswer.created_at).getTime() - new Date(q.created_at).getTime();
        const diffHours = Math.max(0, diffMs / (1000 * 60 * 60));
        delayListHours.push(diffHours);
      }
    });

    const avgDelayHours =
      delayListHours.length > 0
        ? Math.round((delayListHours.reduce((a, b) => a + b, 0) / delayListHours.length) * 10) / 10
        : 0;

    const delayBrackets = {
      lessThan1h: delayListHours.filter((h) => h < 1).length,
      from1to6h: delayListHours.filter((h) => h >= 1 && h < 6).length,
      from6to24h: delayListHours.filter((h) => h >= 6 && h < 24).length,
      from1to3d: delayListHours.filter((h) => h >= 24 && h < 72).length,
      moreThan3d: delayListHours.filter((h) => h >= 72).length,
    };

    // Beneficiary devices on /s/[token]
    const beneficiaryDevices: Record<string, number> = {};
    events
      .filter((e: any) => e.page_url && e.page_url.includes("/s/"))
      .forEach((e: any) => {
        const dev = e.properties?.device || "Mobile";
        beneficiaryDevices[dev] = (beneficiaryDevices[dev] || 0) + 1;
      });

    // 7. Location
    const visitorsCountryMap: Record<string, number> = {};
    const recipientsCountryMap: Record<string, number> = {};
    events.forEach((e: any) => {
      const c = e.pays_detecte || "Inconnu";
      visitorsCountryMap[c] = (visitorsCountryMap[c] || 0) + 1;
    });
    questionnaires.forEach((q: any) => {
      const c = q.recipient_country || "Non renseigné";
      recipientsCountryMap[c] = (recipientsCountryMap[c] || 0) + 1;
    });

    // Consent localisation accepted
    const totalConsents = consents.length;
    const acceptedConsents = consents.filter((c: any) => c.localisation_accepted).length;
    const consentRate = totalConsents > 0 ? Math.round((acceptedConsents / totalConsents) * 100) : 100;

    // 8. Product Data
    const occasionsMap: Record<string, number> = {};
    const budgetByOccasion: Record<string, { totalFCFA: number; count: number }> = {};
    const budgetByCountry: Record<string, { totalFCFA: number; count: number }> = {};
    const ageRangesMap: Record<string, number> = {};
    let personalNotesCount = 0;

    questionnaires.forEach((q: any) => {
      const occ = q.occasion || "Anniversaire";
      occasionsMap[occ] = (occasionsMap[occ] || 0) + 1;

      const ar = q.recipient_age_range || "25-34";
      ageRangesMap[ar] = (ageRangesMap[ar] || 0) + 1;

      if (q.personal_note && q.personal_note.trim().length > 0) {
        personalNotesCount += 1;
      }

      // Budget parsing
      let numericBudget = 0;
      if (q.budget) {
        const raw = parseInt(q.budget.toString().replace(/\D/g, ""), 10);
        if (!isNaN(raw)) {
          if (q.currency === "USD") {
            numericBudget = raw * (exchangeRate.fcfa_per_usd || 600);
          } else {
            numericBudget = raw;
          }
        }
      }

      if (numericBudget > 0) {
        if (!budgetByOccasion[occ]) budgetByOccasion[occ] = { totalFCFA: 0, count: 0 };
        budgetByOccasion[occ].totalFCFA += numericBudget;
        budgetByOccasion[occ].count += 1;

        const c = q.recipient_country || "Autre";
        if (!budgetByCountry[c]) budgetByCountry[c] = { totalFCFA: 0, count: 0 };
        budgetByCountry[c].totalFCFA += numericBudget;
        budgetByCountry[c].count += 1;
      }
    });

    // Top likes (Q2) & Top dislikes (Q3)
    const q2LikesMap: Record<string, number> = {};
    const q3DislikesMap: Record<string, number> = {};
    const q4Map: Record<string, number> = { Utile: 0, Fun: 0, "Les deux": 0 };

    answers.forEach((a: any) => {
      if (Array.isArray(a.q2_likes)) {
        a.q2_likes.forEach((item: string) => {
          q2LikesMap[item] = (q2LikesMap[item] || 0) + 1;
        });
      }
      if (Array.isArray(a.q3_dislikes)) {
        a.q3_dislikes.forEach((item: string) => {
          q3DislikesMap[item] = (q3DislikesMap[item] || 0) + 1;
        });
      }
      const hed = a.q4_hedonic_utilitarian || "Les deux";
      q4Map[hed] = (q4Map[hed] || 0) + 1;
    });

    // Chosen gifts ranking
    const chosenGiftsMap: Record<string, { count: number; name: string; type: string }> = {};
    questionnaires.forEach((q: any) => {
      if (q.selected_gift_id) {
        const g = gifts.find((item: any) => item.id === q.selected_gift_id);
        const name = g?.name || "Cadeau spécifique";
        const type = g?.gift_type || "Cadeau";
        if (!chosenGiftsMap[q.selected_gift_id]) {
          chosenGiftsMap[q.selected_gift_id] = { count: 0, name, type };
        }
        chosenGiftsMap[q.selected_gift_id].count += 1;
      }
    });

    // 9. Conversion & Retention
    const userQCounts: Record<string, number> = {};
    questionnaires.forEach((q: any) => {
      userQCounts[q.owner_id] = (userQCounts[q.owner_id] || 0) + 1;
    });

    const totalActiveSenders = Object.keys(userQCounts).length;
    const sendersWith1 = Object.values(userQCounts).filter((c) => c === 1).length;
    const sendersWith2 = Object.values(userQCounts).filter((c) => c === 2).length;
    const sendersWith3Plus = Object.values(userQCounts).filter((c) => c >= 3).length;
    const retentionRate =
      totalActiveSenders > 0
        ? Math.round(((sendersWith2 + sendersWith3Plus) / totalActiveSenders) * 100)
        : 0;

    return {
      todayVisitors,
      uniqueVisitorsPeriod,
      uniqueUsersPeriod,
      totalQ,
      pendingQ,
      answeredQ,
      completedQ,
      responseRate,
      sourcesMap,
      mediumsMap,
      campaignsMap,
      referrersMap,
      landingPagesMap,
      devicesMap,
      browsersMap,
      osMap,
      languagesMap,
      channelSignupsMap,
      firstVisitsByHour,
      recentFirstVisits: recentFirstVisits.slice(0, 10),
      pagesList,
      totalPageViews,
      funnelCounts,
      quizDropoffs,
      avgDelayHours,
      delayBrackets,
      beneficiaryDevices,
      visitorsCountryMap,
      recipientsCountryMap,
      consentRate,
      occasionsMap,
      budgetByOccasion,
      budgetByCountry,
      ageRangesMap,
      personalNotesCount,
      personalNotesRate: totalQ > 0 ? Math.round((personalNotesCount / totalQ) * 100) : 0,
      q2LikesMap,
      q3DislikesMap,
      q4Map,
      chosenGiftsMap,
      totalActiveSenders,
      sendersWith1,
      sendersWith2,
      sendersWith3Plus,
      retentionRate,
      viralAccountsCount,
      viralSurprisesCount,
      viralCreatorsCount,
      viralConversionRate,
    };
  }, [events, questionnaires, answers, gifts, consents, exchangeRate, adminData?.profiles]);

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

  // Filtered support messages
  const filteredMessages = supportMessages.filter((m: any) => {
    if (supportFilter === "all") return true;
    return m.status === supportFilter;
  });

  const navItems = [
    { id: "overview" as AdminTab, label: "Vue d’ensemble", icon: Activity },
    { id: "acquisition" as AdminTab, label: "Acquisition", icon: BarChart3 },
    { id: "pages" as AdminTab, label: "Pages visitées", icon: FileText },
    { id: "funnel" as AdminTab, label: "Parcours / Entonnoir", icon: GitMerge },
    { id: "location" as AdminTab, label: "Localisation", icon: MapPin },
    { id: "beneficiary" as AdminTab, label: "Comportement bénéficiaire", icon: Smile },
    { id: "product" as AdminTab, label: "Produit & Catalogue", icon: Package },
    { id: "conversion" as AdminTab, label: "Conversion & Rétention", icon: UserCheck },
    {
      id: "support" as AdminTab,
      label: "Support",
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: "settings" as AdminTab,
      label: "Réglages & Taux",
      icon: Settings,
      alert: isRateOld,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
      {/* Top Header Card */}
      <div className="bg-charcoal text-white rounded-4xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            Console Administration Fyp
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight">
            Tableau de bord & Pilotage
          </h1>
          <p className="text-white/70 text-xs sm:text-sm mt-1">
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
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
          >
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Navigation Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-blush-200">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-display font-bold shrink-0 transition-all ${
                isActive
                  ? "bg-fuchsia-brand text-white shadow-pink-sm scale-[1.02]"
                  : "bg-white text-charcoal-light hover:text-charcoal hover:bg-blush-50 border border-blush-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
              {tab.alert && (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Bar (Active for all tabs except Support & Settings) */}
      {activeTab !== "support" && activeTab !== "settings" && (
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
                    period === p
                      ? "bg-white text-fuchsia-brand shadow-sm"
                      : "text-charcoal-muted hover:text-charcoal"
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
      )}

      {/* ========================================================================= */}
      {/* 1. VUE D'ENSEMBLE (RÉSUMÉ HAUT NIVEAU SEULEMENT) */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Alerte Taux de change si périmé */}
          {isRateOld && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-amber-900">
                    Taux de change USD → FCFA à mettre à jour
                  </h3>
                  <p className="text-xs text-amber-800">
                    Le taux actuel ({exchangeRate.fcfa_per_usd} FCFA/$) n’a pas été modifié depuis {diffDays} jours (&gt; 1 semaine).
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setActiveTab("settings")}
                variant="primary"
                size="sm"
                className="shrink-0"
              >
                Mettre à jour le taux
              </Button>
            </div>
          )}

          {/* Grille des 4 KPIs directeurs haut niveau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
                <span>Visiteurs du jour</span>
                <Users className="w-4 h-4 text-fuchsia-brand" />
              </div>
              <div className="font-display font-black text-3xl text-charcoal">
                {analytics.todayVisitors}
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                {analytics.uniqueVisitorsPeriod} uniques sur la période
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
                <span>Comptes créés</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-display font-black text-3xl text-emerald-600">
                {analytics.uniqueUsersPeriod}
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                {analytics.totalActiveSenders} créateurs actifs
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
                <span>Surprises en attente</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-display font-black text-3xl text-amber-600">
                {analytics.pendingQ}
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                Liens secrets transmis en attente de réponse
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold uppercase tracking-wider mb-2">
                <span>Surprises répondues</span>
                <CheckCircle2 className="w-4 h-4 text-fuchsia-brand" />
              </div>
              <div className="font-display font-black text-3xl text-fuchsia-brand">
                {analytics.answeredQ}
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                Taux de réponse : {analytics.responseRate}%
              </div>
            </div>
          </div>

          {/* Raccourcis & navigation rapide */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal">
              Accès rapide aux analyses détaillées
            </h3>
            <p className="text-xs text-charcoal-muted">
              Consultez les métriques approfondies dans chaque section spécialisée ci-dessous :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => setActiveTab("acquisition")}
                className="p-4 rounded-2xl bg-blush-50 hover:bg-blush-100 text-left transition-all border border-blush-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-sm text-charcoal">Acquisition</div>
                  <div className="text-xs text-charcoal-muted">UTM, canaux, navigateurs</div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-brand" />
              </button>

              <button
                onClick={() => setActiveTab("funnel")}
                className="p-4 rounded-2xl bg-blush-50 hover:bg-blush-100 text-left transition-all border border-blush-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-sm text-charcoal">Entonnoir de conversion</div>
                  <div className="text-xs text-charcoal-muted">Taux d’abandon étape par étape</div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-brand" />
              </button>

              <button
                onClick={() => setActiveTab("product")}
                className="p-4 rounded-2xl bg-blush-50 hover:bg-blush-100 text-left transition-all border border-blush-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-sm text-charcoal">Données Produit</div>
                  <div className="text-xs text-charcoal-muted">Occasions, budgets, goûts Q2/Q3</div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-brand" />
              </button>

              <button
                onClick={() => setActiveTab("beneficiary")}
                className="p-4 rounded-2xl bg-blush-50 hover:bg-blush-100 text-left transition-all border border-blush-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-sm text-charcoal">Bénéficiaires</div>
                  <div className="text-xs text-charcoal-muted">Délais de réponse, abandons Q1-Q4</div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-brand" />
              </button>

              <button
                onClick={() => setActiveTab("location")}
                className="p-4 rounded-2xl bg-blush-50 hover:bg-blush-100 text-left transition-all border border-blush-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-sm text-charcoal">Localisation</div>
                  <div className="text-xs text-charcoal-muted">Pays, langues, consentement</div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-brand" />
              </button>

              <button
                onClick={() => setActiveTab("support")}
                className="p-4 rounded-2xl bg-blush-50 hover:bg-blush-100 text-left transition-all border border-blush-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-bold text-sm text-charcoal">Messages Support</div>
                  <div className="text-xs text-charcoal-muted">
                    {unreadMessagesCount} non traité(s)
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-brand" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACQUISITION & TRAFIC */}
      {/* ========================================================================= */}
      {activeTab === "acquisition" && (
        <div className="space-y-6">
          {/* CARTE SPÉCIALE : BOUCLE VIRALE (Bénéficiaire -> Expéditeur) */}
          <div className="bg-gradient-to-br from-white via-blush-50/70 to-pink-50/50 rounded-4xl p-6 sm:p-8 border-2 border-fuchsia-brand/30 shadow-soft-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-3xl bg-fuchsia-brand text-white flex items-center justify-center shadow-pink-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-xl text-charcoal">
                      Bénéficiaires devenus expéditeurs (Boucle virale)
                    </h3>
                    <Badge variant="fuchsia" className="text-[10px]">
                      Organique viral
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Utilisateurs ayant répondu à un questionnaire et créé leur compte directement depuis l’écran de fin.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-3xl bg-white border border-blush-200 text-center shadow-sm">
                <span className="text-xs text-charcoal-muted font-bold block mb-1">
                  Comptes créés via ce flux
                </span>
                <span className="font-display font-black text-3xl text-charcoal">
                  {analytics.viralAccountsCount}
                </span>
                <span className="text-[10px] text-charcoal-muted block mt-1">
                  Inscriptions après questionnaire
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-blush-200 text-center shadow-sm">
                <span className="text-xs text-charcoal-muted font-bold block mb-1">
                  Surprises créées par ces convertis
                </span>
                <span className="font-display font-black text-3xl text-fuchsia-brand">
                  {analytics.viralSurprisesCount}
                </span>
                <span className="text-[10px] text-charcoal-muted block mt-1">
                  {analytics.viralCreatorsCount} créateur(s) actif(s)
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-blush-200 text-center shadow-sm">
                <span className="text-xs text-charcoal-muted font-bold block mb-1">
                  Taux de passage à l’acte
                </span>
                <span className="font-display font-black text-3xl text-emerald-600">
                  {analytics.viralConversionRate}%
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                  Taux de conversion en surprise
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sources UTM & Referrers */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-fuchsia-brand" />
                <h3 className="font-display font-bold text-lg text-charcoal">
                  Trafic par source UTM / Référent
                </h3>
              </div>

              <div className="space-y-2">
                {Object.entries(analytics.sourcesMap).length === 0 ? (
                  <div className="text-xs text-charcoal-muted py-4 text-center">Aucune donnée de source pour le moment.</div>
                ) : (
                  Object.entries(analytics.sourcesMap).map(([src, count]) => (
                    <div key={src} className="flex items-center justify-between p-3 rounded-2xl bg-blush-50 border border-blush-100">
                      <div>
                        <div className="font-display font-bold text-xs text-charcoal">{src}</div>
                        <div className="text-[10px] text-charcoal-muted">Canal d’acquisition</div>
                      </div>
                      <div className="font-display font-black text-sm text-fuchsia-brand">
                        {count} visites
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comptes créés par canal */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-lg text-charcoal">
                  Comptes créés par canal
                </h3>
              </div>

              <div className="space-y-2">
                {Object.entries(analytics.channelSignupsMap).length === 0 ? (
                  <div className="text-xs text-charcoal-muted py-4 text-center">Aucune inscription liée sur la période.</div>
                ) : (
                  Object.entries(analytics.channelSignupsMap).map(([chan, count]) => (
                    <div key={chan} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <span className="font-display font-bold text-xs text-charcoal">{chan}</span>
                      <span className="font-display font-black text-sm text-emerald-700">{count} créations</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Appareils, Navigateurs & OS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Appareils */}
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-fuchsia-brand" />
                <h4 className="font-display font-bold text-sm text-charcoal">Appareils</h4>
              </div>
              <div className="space-y-2 pt-2">
                {Object.entries(analytics.devicesMap).map(([dev, count]) => (
                  <div key={dev} className="flex justify-between items-center text-xs py-1.5 border-b border-blush-100">
                    <span className="font-medium text-charcoal">{dev}</span>
                    <span className="font-bold text-fuchsia-brand">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigateurs */}
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <h4 className="font-display font-bold text-sm text-charcoal">Navigateurs</h4>
              </div>
              <div className="space-y-2 pt-2">
                {Object.entries(analytics.browsersMap).map(([b, count]) => (
                  <div key={b} className="flex justify-between items-center text-xs py-1.5 border-b border-blush-100">
                    <span className="font-medium text-charcoal">{b}</span>
                    <span className="font-bold text-indigo-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Systèmes d'exploitation */}
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-amber-600" />
                <h4 className="font-display font-bold text-sm text-charcoal">Systèmes (OS)</h4>
              </div>
              <div className="space-y-2 pt-2">
                {Object.entries(analytics.osMap).map(([os, count]) => (
                  <div key={os} className="flex justify-between items-center text-xs py-1.5 border-b border-blush-100">
                    <span className="font-medium text-charcoal">{os}</span>
                    <span className="font-bold text-amber-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premières visites récentes */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal">
              Dernières 10 premières visites enregistrées
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blush-200 text-charcoal-muted uppercase text-[10px]">
                    <th className="py-2">Date & Heure</th>
                    <th className="py-2">Source</th>
                    <th className="py-2">Page d’entrée</th>
                    <th className="py-2">Appareil</th>
                    <th className="py-2">Pays</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentFirstVisits.map((fv: any, idx: number) => (
                    <tr key={idx} className="border-b border-blush-100 hover:bg-blush-50/50">
                      <td className="py-2.5 font-medium text-charcoal">
                        {new Date(fv.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 font-semibold text-fuchsia-brand">{fv.source}</td>
                      <td className="py-2.5 text-charcoal-muted font-mono">{fv.landing_page}</td>
                      <td className="py-2.5">{fv.device}</td>
                      <td className="py-2.5 font-medium">{fv.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PAGES VISITÉES */}
      {/* ========================================================================= */}
      {activeTab === "pages" && (
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-xl text-charcoal">
                Pages les plus vues (Événements `page_vue`)
              </h3>
              <p className="text-xs text-charcoal-muted">
                Classement des URLs par nombre de consultations et visiteurs uniques.
              </p>
            </div>
            <Badge variant="fuchsia" className="w-fit">
              {analytics.totalPageViews} vues au total
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-blush-200 text-charcoal-muted uppercase text-[10px]">
                  <th className="py-3 px-2">Page / URL</th>
                  <th className="py-3 px-2">Vues totales</th>
                  <th className="py-3 px-2">Visiteurs uniques</th>
                  <th className="py-3 px-2">% du trafic</th>
                </tr>
              </thead>
              <tbody>
                {analytics.pagesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-charcoal-muted">
                      Aucune vue de page enregistrée pour l’instant.
                    </td>
                  </tr>
                ) : (
                  analytics.pagesList.map((page, idx) => {
                    const percentage = analytics.totalPageViews > 0 ? Math.round((page.views / analytics.totalPageViews) * 100) : 0;
                    return (
                      <tr key={idx} className="border-b border-blush-100 hover:bg-blush-50/50">
                        <td className="py-3 px-2 font-mono font-bold text-charcoal">
                          {page.path}
                        </td>
                        <td className="py-3 px-2 font-display font-bold text-sm text-fuchsia-brand">
                          {page.views}
                        </td>
                        <td className="py-3 px-2 font-semibold text-charcoal-light">
                          {page.visitors}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-blush-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-fuchsia-brand h-full rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-charcoal-muted">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PARCOURS / ENTONNOIR */}
      {/* ========================================================================= */}
      {activeTab === "funnel" && (
        <div className="space-y-6">
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-6">
            <div>
              <h3 className="font-display font-bold text-xl text-charcoal">
                Tunnel de conversion & Parcours complet
              </h3>
              <p className="text-xs text-charcoal-muted">
                De l’arrivée sur le formulaire jusqu’à la validation finale du cadeau recommandé.
              </p>
            </div>

            {/* Funnel Steps */}
            <div className="space-y-4">
              {[
                { label: "1. Arrivée sur le formulaire de création", count: analytics.funnelCounts.step1_start, color: "bg-charcoal text-white" },
                { label: "2. Occasion & destinataire renseignés (Étape 1)", count: analytics.funnelCounts.step2_occasion, color: "bg-indigo-600 text-white" },
                { label: "3. Budget validé & Surprise créée (Lien généré)", count: analytics.funnelCounts.step3_created, color: "bg-fuchsia-brand text-white" },
                { label: "4. Lien secret ouvert par le bénéficiaire", count: analytics.funnelCounts.step4_quiz_opened, color: "bg-pink-500 text-white" },
                { label: "5. Questionnaire démarré par le proche", count: analytics.funnelCounts.step5_quiz_start, color: "bg-purple-600 text-white" },
                { label: "6. Réponse Q1 (Ce qui ferait plaisir)", count: analytics.funnelCounts.step6_q1, color: "bg-purple-700 text-white" },
                { label: "7. Réponse Q2 (Univers favoris)", count: analytics.funnelCounts.step7_q2, color: "bg-purple-800 text-white" },
                { label: "8. Réponse Q3 (À éviter)", count: analytics.funnelCounts.step8_q3, color: "bg-purple-900 text-white" },
                { label: "9. Réponse Q4 & Questionnaire envoyé", count: analytics.funnelCounts.step9_q4_completed, color: "bg-emerald-600 text-white" },
                { label: "10. Recommandations consultées par l’expéditeur", count: analytics.funnelCounts.step10_recommendations_seen, color: "bg-amber-600 text-white" },
                { label: "11. Cadeau finalisé & validé", count: analytics.funnelCounts.step11_gift_validated, color: "bg-emerald-700 text-white" },
              ].map((step, idx, arr) => {
                const prevCount = idx === 0 ? step.count : arr[idx - 1].count;
                const conversionFromPrev = prevCount > 0 ? Math.round((step.count / prevCount) * 100) : 100;
                const dropoff = prevCount > 0 ? Math.max(0, 100 - conversionFromPrev) : 0;
                const maxCount = arr[0].count || 1;
                const widthPercent = Math.max(8, Math.round((step.count / maxCount) * 100));

                return (
                  <div key={idx} className="p-4 rounded-3xl bg-blush-50 border border-blush-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-display font-bold text-sm text-charcoal">
                        {step.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-base text-charcoal">
                          {step.count}
                        </span>
                        {idx > 0 && (
                          <Badge variant={conversionFromPrev >= 70 ? "default" : "warning"} className="text-[10px]">
                            {conversionFromPrev}% convertis (Abandon: {dropoff}%)
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-blush-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${step.color}`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LOCALISATION */}
      {/* ========================================================================= */}
      {activeTab === "location" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visiteurs par pays */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-fuchsia-brand" />
                <h3 className="font-display font-bold text-lg text-charcoal">
                  Répartition des visiteurs par pays
                </h3>
              </div>

              <div className="space-y-2">
                {Object.entries(analytics.visitorsCountryMap).map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center p-3 rounded-2xl bg-blush-50">
                    <span className="font-semibold text-xs text-charcoal">{country}</span>
                    <span className="font-bold text-sm text-fuchsia-brand">{count} visites</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bénéficiaires ciblés par pays */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-lg text-charcoal">
                  Pays des bénéficiaires (Questionnaires)
                </h3>
              </div>

              <div className="space-y-2">
                {Object.entries(analytics.recipientsCountryMap).map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <span className="font-semibold text-xs text-charcoal">{country}</span>
                    <span className="font-bold text-sm text-indigo-700">{count} surprises</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Langues & Consentement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <h4 className="font-display font-bold text-sm text-charcoal">Langue du navigateur</h4>
              <div className="space-y-2 pt-2">
                {Object.entries(analytics.languagesMap).map(([lang, count]) => (
                  <div key={lang} className="flex justify-between items-center text-xs py-1.5 border-b border-blush-100">
                    <span className="font-mono text-charcoal">{lang}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <h4 className="font-display font-bold text-sm text-charcoal">Consentement Localisation</h4>
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
                <span className="font-display font-black text-3xl text-emerald-700 block">
                  {analytics.consentRate}%
                </span>
                <span className="text-xs text-emerald-800 font-medium">
                  Taux d’acceptation de détection automatique
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. COMPORTEMENT BÉNÉFICIAIRE */}
      {/* ========================================================================= */}
      {activeTab === "beneficiary" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Taux de réponse
              </span>
              <div className="font-display font-black text-3xl text-emerald-600">
                {analytics.responseRate}%
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                {analytics.answeredQ} répondues sur {analytics.totalQ} créées
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Délai moyen d’envoi → réponse
              </span>
              <div className="font-display font-black text-3xl text-indigo-600">
                {analytics.avgDelayHours}h
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                Temps moyen mis par le proche pour répondre
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Appareil bénéficiaire
              </span>
              <div className="font-display font-black text-3xl text-fuchsia-brand">
                {analytics.beneficiaryDevices["Mobile"] || 0} Mobiles
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                {analytics.beneficiaryDevices["Desktop"] || 0} Desktops
              </div>
            </div>
          </div>

          {/* Délais & Abandons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tranches de délais de réponse */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Distribution des délais de réponse
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-blush-50">
                  <span>Moins d’une heure :</span>
                  <span className="font-bold text-emerald-600">{analytics.delayBrackets.lessThan1h}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-blush-50">
                  <span>Entre 1h et 6h :</span>
                  <span className="font-bold text-indigo-600">{analytics.delayBrackets.from1to6h}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-blush-50">
                  <span>Entre 6h et 24h :</span>
                  <span className="font-bold text-indigo-600">{analytics.delayBrackets.from6to24h}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-blush-50">
                  <span>Entre 1 et 3 jours :</span>
                  <span className="font-bold text-amber-600">{analytics.delayBrackets.from1to3d}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-blush-50">
                  <span>Plus de 3 jours :</span>
                  <span className="font-bold text-rose-600">{analytics.delayBrackets.moreThan3d}</span>
                </div>
              </div>
            </div>

            {/* Étape d'abandon du questionnaire */}
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Étape d’abandon du questionnaire
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                  <span>Abandon à l’écran d’accueil :</span>
                  <span className="font-bold text-rose-700">{analytics.quizDropoffs.intro_drop}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                  <span>Abandon après Q1 :</span>
                  <span className="font-bold text-rose-700">{analytics.quizDropoffs.q1_drop}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                  <span>Abandon après Q2 :</span>
                  <span className="font-bold text-rose-700">{analytics.quizDropoffs.q2_drop}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                  <span>Abandon après Q3 :</span>
                  <span className="font-bold text-rose-700">{analytics.quizDropoffs.q3_drop}</span>
                </div>
                <div className="flex justify-between text-xs p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                  <span>Abandon sur Q4 sans valider :</span>
                  <span className="font-bold text-rose-700">{analytics.quizDropoffs.q4_drop}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PRODUIT & CATALOGUE */}
      {/* ========================================================================= */}
      {activeTab === "product" && (
        <div className="space-y-6">
          {/* Occasions & Tranches d'âge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Occasions les plus fréquentes
              </h3>
              <div className="space-y-2">
                {Object.entries(analytics.occasionsMap).map(([occ, count]) => {
                  const pct = analytics.totalQ > 0 ? Math.round((count / analytics.totalQ) * 100) : 0;
                  return (
                    <div key={occ} className="flex justify-between items-center p-3 rounded-2xl bg-blush-50">
                      <div>
                        <div className="font-display font-bold text-xs text-charcoal">{occ}</div>
                        <div className="text-[10px] text-charcoal-muted">{pct}% du total</div>
                      </div>
                      <span className="font-bold text-sm text-fuchsia-brand">{count} créations</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Tranches d’âge ciblées
              </h3>
              <div className="space-y-2">
                {Object.entries(analytics.ageRangesMap).map(([ar, count]) => (
                  <div key={ar} className="flex justify-between items-center p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                    <span className="font-semibold text-xs text-charcoal">{ar} ans</span>
                    <span className="font-bold text-sm text-indigo-700">{count} surprises</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget moyen par occasion et par pays */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Budget moyen par occasion
              </h3>
              <div className="space-y-2">
                {Object.entries(analytics.budgetByOccasion).map(([occ, data]) => {
                  const avg = data.count > 0 ? Math.round(data.totalFCFA / data.count) : 0;
                  return (
                    <div key={occ} className="flex justify-between items-center p-2.5 rounded-2xl bg-blush-50">
                      <span className="font-medium text-xs text-charcoal">{occ}</span>
                      <span className="font-bold text-xs text-fuchsia-brand">{formatFCFA(avg)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Budget moyen par pays
              </h3>
              <div className="space-y-2">
                {Object.entries(analytics.budgetByCountry).map(([c, data]) => {
                  const avg = data.count > 0 ? Math.round(data.totalFCFA / data.count) : 0;
                  return (
                    <div key={c} className="flex justify-between items-center p-2.5 rounded-2xl bg-blush-50">
                      <span className="font-medium text-xs text-charcoal">{c}</span>
                      <span className="font-bold text-xs text-indigo-600">{formatFCFA(avg)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Goûts Q2 & Q3 & Orientation Q4 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Q2 Likes */}
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <h4 className="font-display font-bold text-sm text-charcoal">Top 5 Univers aimés (Q2)</h4>
              <div className="space-y-1.5 pt-2">
                {Object.entries(analytics.q2LikesMap)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([like, count]) => (
                    <div key={like} className="flex justify-between text-xs py-1 border-b border-blush-100">
                      <span>{like}</span>
                      <span className="font-bold text-fuchsia-brand">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Q3 Dislikes */}
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <h4 className="font-display font-bold text-sm text-charcoal">Top 5 Univers évités (Q3)</h4>
              <div className="space-y-1.5 pt-2">
                {Object.entries(analytics.q3DislikesMap)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([dislike, count]) => (
                    <div key={dislike} className="flex justify-between text-xs py-1 border-b border-blush-100">
                      <span>{dislike}</span>
                      <span className="font-bold text-rose-600">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Q4 Orientation */}
            <div className="bg-white rounded-4xl p-6 border border-blush-200 shadow-soft-xl space-y-3">
              <h4 className="font-display font-bold text-sm text-charcoal">Orientation Q4</h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-2xl bg-indigo-50">
                  <span className="text-[10px] font-bold text-indigo-700 block">Utile</span>
                  <span className="font-display font-black text-lg text-indigo-900">{analytics.q4Map.Utile || 0}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-fuchsia-50">
                  <span className="text-[10px] font-bold text-fuchsia-700 block">Fun</span>
                  <span className="font-display font-black text-lg text-fuchsia-900">{analytics.q4Map.Fun || 0}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50">
                  <span className="text-[10px] font-bold text-amber-700 block">Les deux</span>
                  <span className="font-display font-black text-lg text-amber-900">{analytics.q4Map["Les deux"] || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cadeaux choisis & Mot doux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Cadeaux sélectionnés par l’expéditeur
              </h3>
              <div className="space-y-2">
                {Object.entries(analytics.chosenGiftsMap).length === 0 ? (
                  <div className="text-xs text-charcoal-muted py-4 text-center">Aucun cadeau finalisé pour l’instant.</div>
                ) : (
                  Object.entries(analytics.chosenGiftsMap).map(([id, info]) => (
                    <div key={id} className="flex justify-between items-center p-3 rounded-2xl bg-blush-50">
                      <div>
                        <div className="font-display font-bold text-xs text-charcoal">{info.name}</div>
                        <div className="text-[10px] text-charcoal-muted">{info.type}</div>
                      </div>
                      <span className="font-bold text-sm text-fuchsia-brand">{info.count} fois choisi</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Utilisation du mot personnel
              </h3>
              <div className="p-6 rounded-3xl bg-blush-50 border border-blush-200 text-center space-y-2">
                <span className="font-display font-black text-4xl text-fuchsia-brand block">
                  {analytics.personalNotesRate}%
                </span>
                <p className="text-xs text-charcoal-light">
                  {analytics.personalNotesCount} surprises sur {analytics.totalQ} comportent un mot doux rédigé avant validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CONVERSION & RÉTENTION */}
      {/* ========================================================================= */}
      {activeTab === "conversion" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Comptes actifs
              </span>
              <div className="font-display font-black text-3xl text-charcoal">
                {analytics.totalActiveSenders}
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                Ayant créé au moins 1 surprise
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Taux de rétention
              </span>
              <div className="font-display font-black text-3xl text-indigo-600">
                {analytics.retentionRate}%
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                Expéditeurs récurrents (2+ surprises)
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-blush-200 shadow-soft-md">
              <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
                Cadeaux validés
              </span>
              <div className="font-display font-black text-3xl text-fuchsia-brand">
                {analytics.completedQ}
              </div>
              <div className="text-xs text-charcoal-muted mt-1">
                Cycle complet de surprise terminé
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal">
              Fréquence de retour des expéditeurs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-3xl bg-blush-50 border border-blush-200 text-center">
                <span className="text-xs text-charcoal-muted font-bold block mb-1">1 surprise créée</span>
                <span className="font-display font-black text-2xl text-charcoal">{analytics.sendersWith1}</span>
                <span className="text-[10px] text-charcoal-muted block mt-1">Créateur ponctuel</span>
              </div>
              <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="text-xs text-indigo-700 font-bold block mb-1">2 surprises créées</span>
                <span className="font-display font-black text-2xl text-indigo-900">{analytics.sendersWith2}</span>
                <span className="text-[10px] text-indigo-600 block mt-1">Créateur fidèle</span>
              </div>
              <div className="p-4 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 text-center">
                <span className="text-xs text-fuchsia-700 font-bold block mb-1">3+ surprises créées</span>
                <span className="font-display font-black text-2xl text-fuchsia-900">{analytics.sendersWith3Plus}</span>
                <span className="text-[10px] text-fuchsia-600 block mt-1">Super-utilisateur</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SUPPORT & MESSAGES */}
      {/* ========================================================================= */}
      {activeTab === "support" && (
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-charcoal">
                Messages de support & suggestions ({supportMessages.length})
              </h2>
              <p className="text-xs text-charcoal-muted">
                Retours clients envoyés depuis le formulaire de contact.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-blush-100 p-1 rounded-2xl">
              {(["all", "nouveau", "traité"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSupportFilter(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    supportFilter === s
                      ? "bg-white text-fuchsia-brand shadow-sm"
                      : "text-charcoal-muted hover:text-charcoal"
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
                    msg.status === "nouveau"
                      ? "bg-white border-fuchsia-brand/30 shadow-sm"
                      : "bg-blush-50/50 border-blush-200 opacity-80"
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
      )}

      {/* ========================================================================= */}
      {/* 10. RÉGLAGES & TAUX */}
      {/* ========================================================================= */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-charcoal">
                    Taux de change manuel (USD → FCFA)
                  </h2>
                  <p className="text-xs text-charcoal-muted">
                    Utilisé pour convertir les budgets saisis en USD vers le catalogue interne en FCFA.
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
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Taux de change mis à jour avec succès !
              </div>
            )}

            {/* Simulation des paliers USD */}
            <div className="pt-4 border-t border-blush-100">
              <h4 className="font-display font-bold text-xs text-charcoal uppercase tracking-wider mb-3">
                Simulation des paliers prédéfinis USD avec ce taux :
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[10, 20, 45, 90].map((val) => {
                  const rate = parseFloat(newRate) || exchangeRate.fcfa_per_usd || 600;
                  const converted = val * rate;
                  return (
                    <div key={val} className="p-3 rounded-2xl bg-blush-50 border border-blush-200 text-center">
                      <span className="font-display font-black text-sm text-charcoal block">{val} $</span>
                      <span className="text-xs font-bold text-fuchsia-brand">~{formatFCFA(converted)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
