import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getQuestionnaireDetails } from "@/app/actions/questionnaire";
import { ShareModal } from "@/components/share-modal";
import { RecommendationsReveal } from "@/components/recommendations-reveal";
import { Badge } from "@/components/ui/badge";
import { formatFCFA } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Gift,
  Sparkles,
  Smile,
} from "lucide-react";

interface Props {
  params: { id: string };
  searchParams: { created?: string };
}

export const revalidate = 0;

export default async function SurpriseDetailPage({ params }: Props) {
  const { id } = params;
  const { questionnaire, answers, recommendations, error } = await getQuestionnaireDetails(id);

  if (error === "Non authentifié") {
    redirect(`/auth/login?redirect=/dashboard/${id}`);
  }

  if (!questionnaire) {
    notFound();
  }

  const isAnswered = questionnaire.status === "answered" || questionnaire.status === "completed";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
      {/* Top Nav Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-light hover:text-fuchsia-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>

        <div>
          {isAnswered ? (
            <Badge variant="fuchsia" className="gap-1.5 px-3.5 py-1.5 text-xs">
              <Sparkles className="w-4 h-4" />
              Réponses reçues
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1.5 px-3.5 py-1.5 text-xs">
              <Clock className="w-4 h-4" />
              En attente des réponses
            </Badge>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-4xl p-6 sm:p-10 border border-blush-200 shadow-soft-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-brand uppercase tracking-wider mb-2">
              <Gift className="w-4 h-4" />
              Surprise Fyp
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight">
              Pour {questionnaire.recipient_name}
            </h1>
            <p className="text-sm text-charcoal-light mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Occasion : <strong>{questionnaire.occasion || "Anniversaire"}</strong></span>
              <span>•</span>
              <span>Budget : <strong className="text-fuchsia-brand">{formatFCFA(questionnaire.budget)}</strong></span>
              <span>•</span>
              <span>Créée le {new Date(questionnaire.created_at).toLocaleDateString("fr-FR")}</span>
            </p>
          </div>

          {!isAnswered && (
            <div className="bg-blush-50 rounded-3xl p-4 border border-blush-200 text-xs text-charcoal-light max-w-xs">
              <div className="font-bold text-charcoal flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                En attente du bénéficiaire
              </div>
              Dès que {questionnaire.recipient_name} aura répondu au questionnaire, vos 3 recommandations apparaîtront ici automatiquement.
            </div>
          )}
        </div>
      </div>

      {/* IF JUST CREATED OR PENDING: DISPLAY SHARE MODAL */}
      {!isAnswered ? (
        <div className="space-y-6">
          <ShareModal
            shareToken={questionnaire.share_token}
            recipientName={questionnaire.recipient_name}
            occasion={questionnaire.occasion}
          />

          <div className="bg-white/60 rounded-4xl p-8 border border-blush-200 text-center max-w-2xl mx-auto">
            <h3 className="font-display font-bold text-lg text-charcoal mb-2">
              Comment ça va se passer ?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              1. Envoyez le lien ci-dessus à <strong>{questionnaire.recipient_name}</strong>.<br />
              2. Votre proche répondra en 1 minute à 3 questions rapides sans jamais voir vos <strong>{formatFCFA(questionnaire.budget)}</strong>.<br />
              3. Vous recevrez l’analyse de ses réponses et 3 idées de cadeaux ultra ciblées.
            </p>
          </div>
        </div>
      ) : (
        /* IF ANSWERED: DISPLAY ANSWERS SUMMARY + RECOMMENDATIONS REVEAL */
        <div className="space-y-12">
          {/* Fiche récapitulative des réponses de la personne */}
          {answers && (
            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-blush-200 shadow-soft-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-fuchsia-brand/10 text-fuchsia-brand flex items-center justify-center">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-charcoal">
                    Ce que {questionnaire.recipient_name} a répondu :
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    Réponses collectées en toute discrétion
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Q1 */}
                <div className="p-4 rounded-3xl bg-blush-50 border border-blush-200">
                  <span className="text-[11px] font-bold text-fuchsia-brand uppercase tracking-wider block mb-1">
                    Ce qui lui ferait plaisir
                  </span>
                  <div className="font-display font-bold text-base text-charcoal">
                    {answers.q1_pleasure}
                  </div>
                </div>

                {/* Q2 */}
                <div className="p-4 rounded-3xl bg-blush-50 border border-blush-200">
                  <span className="text-[11px] font-bold text-fuchsia-brand uppercase tracking-wider block mb-1">
                    Ce qu’elle aime
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {answers.q2_likes?.length > 0 ? (
                      answers.q2_likes.map((like) => (
                        <span
                          key={like}
                          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-charcoal border border-blush-200"
                        >
                          {like}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-charcoal-muted">Non spécifié</span>
                    )}
                  </div>
                </div>

                {/* Q3 */}
                <div className="p-4 rounded-3xl bg-blush-50 border border-blush-200">
                  <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block mb-1">
                    Ce qu’elle préfère éviter
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {answers.q3_dislikes?.length > 0 ? (
                      answers.q3_dislikes.map((dislike) => (
                        <span
                          key={dislike}
                          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-rose-600 border border-rose-200"
                        >
                          {dislike}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-charcoal-muted">Rien en particulier</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chorégraphie des 3 recommandations */}
          <RecommendationsReveal
            questionnaire={questionnaire}
            recommendations={recommendations}
          />
        </div>
      )}
    </div>
  );
}
