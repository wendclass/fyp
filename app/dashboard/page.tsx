import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Questionnaire } from "@/lib/types";
import { formatFCFA } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gift,
  PlusCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Heart,
  Share2,
} from "lucide-react";

export const revalidate = 0; // Dynamic data

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: questionnaires, error } = await supabase
    .from("questionnaires")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const list: Questionnaire[] = questionnaires || [];

  const countTotal = list.length;
  const countAnswered = list.filter((q) => q.status === "answered" || q.status === "completed").length;
  const countPending = list.filter((q) => q.status === "sent" || q.status === "draft").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-charcoal tracking-tight">
            Mes Surprises 🎁
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Gérez vos questionnaires et consultez les recommandations de cadeaux
          </p>
        </div>

        <Link href="/create">
          <Button size="md" variant="primary">
            <PlusCircle className="w-5 h-5" />
            <span>Nouvelle surprise</span>
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-blush-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blush-100 text-fuchsia-brand flex items-center justify-center font-display font-extrabold text-xl">
            {countTotal}
          </div>
          <div>
            <div className="text-xs text-charcoal-muted uppercase font-bold tracking-wider">
              Total Surprises
            </div>
            <div className="font-display font-bold text-lg text-charcoal">
              {countTotal} créée{countTotal > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-blush-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-display font-extrabold text-xl">
            {countPending}
          </div>
          <div>
            <div className="text-xs text-charcoal-muted uppercase font-bold tracking-wider">
              En attente
            </div>
            <div className="font-display font-bold text-lg text-charcoal">
              {countPending} questionnaire{countPending > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-blush-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-display font-extrabold text-xl">
            {countAnswered}
          </div>
          <div>
            <div className="text-xs text-charcoal-muted uppercase font-bold tracking-wider">
              Réponses reçues
            </div>
            <div className="font-display font-bold text-lg text-charcoal">
              {countAnswered} prêt{countAnswered > 1 ? "s" : ""} à choisir
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaires List */}
      {list.length === 0 ? (
        <div className="bg-white rounded-4xl p-10 sm:p-16 text-center border border-blush-200 shadow-soft-xl max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-blush-100 text-fuchsia-brand mx-auto flex items-center justify-center mb-4 shadow-pink-sm">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl text-charcoal mb-2">
            Aucune surprise pour l''instant
          </h2>
          <p className="text-charcoal-light text-sm max-w-md mx-auto mb-6">
            Créez votre premier questionnaire en 30 secondes pour surprendre un proche sans gâcher la surprise !
          </p>
          <Link href="/create">
            <Button size="lg" variant="primary">
              <PlusCircle className="w-5 h-5" />
              <span>Créer une surprise</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {list.map((item) => {
            const isAnswered = item.status === "answered" || item.status === "completed";
            const isCompleted = item.status === "completed";

            return (
              <div
                key={item.id}
                className="bg-white rounded-4xl p-6 border border-blush-200/90 shadow-soft-xl hover:shadow-pink-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {isCompleted ? (
                      <Badge variant="success" className="gap-1">
                        <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        Cadeau finalisé
                      </Badge>
                    ) : isAnswered ? (
                      <Badge variant="fuchsia" className="gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Réponses reçues !
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        En attente du bénéficiaire
                      </Badge>
                    )}

                    <span className="text-xs text-charcoal-muted">
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-charcoal tracking-tight mb-1">
                    {item.recipient_name}
                  </h3>
                  <div className="text-xs text-charcoal-light mb-4">
                    Occasion : <span className="font-semibold text-charcoal">{item.occasion || "Anniversaire"}</span> • Budget :{" "}
                    <span className="font-bold text-fuchsia-brand">{formatFCFA(item.budget)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-blush-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-mono text-charcoal-muted truncate max-w-[160px]">
                    /s/{item.share_token}
                  </div>

                  <Link href={`/dashboard/${item.id}`}>
                    <Button size="sm" variant={isAnswered ? "primary" : "secondary"}>
                      <span>{isAnswered ? "Voir les 3 idées" : "Gérer le lien"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
