"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyRecipient } from "@/lib/utils";
import { generateRecommendations } from "@/lib/recommendation-engine";
import { Questionnaire, AnswersRecord, Gift, ScoredGift } from "@/lib/types";

export async function createSurpriseAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/create");
  }

  const recipient_name = (formData.get("recipient_name") as string)?.trim();
  const occasion = (formData.get("occasion") as string) || "Anniversaire";
  const budget = (formData.get("budget") as string) || "25000";
  const currency = (formData.get("currency") as string) || "FCFA";
  const recipient_age_range = (formData.get("recipient_age_range") as string) || "25-34";
  const recipient_country = (formData.get("recipient_country") as string) || "";

  if (!recipient_name) {
    return { error: "Veuillez entrer le prénom de la personne à qui vous offrez ce cadeau." };
  }

  const share_token = slugifyRecipient(recipient_name);
  const title = `Surprise pour ${recipient_name} (${occasion})`;

  const { data, error } = await supabase
    .from("questionnaires")
    .insert({
      owner_id: user.id,
      recipient_name,
      occasion,
      budget,
      currency,
      recipient_age_range,
      recipient_country,
      title,
      status: "sent",
      share_token,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating questionnaire:", error);
    return { error: "Impossible de créer la surprise. Veuillez réessayer." };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/${data.id}?created=true`);
}

export async function getQuestionnaireDetails(id: string): Promise<{
  questionnaire: Questionnaire | null;
  answers: AnswersRecord | null;
  recommendations: ScoredGift[];
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { questionnaire: null, answers: null, recommendations: [], error: "Non authentifié" };
  }

  // Fetch questionnaire
  const { data: questionnaire, error: qError } = await supabase
    .from("questionnaires")
    .select("*")
    .eq("id", id)
    .single();

  if (qError || !questionnaire) {
    return { questionnaire: null, answers: null, recommendations: [], error: "Questionnaire introuvable" };
  }

  // Fetch answers
  const { data: answers } = await supabase
    .from("answers")
    .select("*")
    .eq("questionnaire_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch exchange rate
  let fcfaRate = 600;
  const { data: rateRow } = await supabase
    .from("exchange_rate")
    .select("fcfa_per_usd")
    .eq("id", 1)
    .maybeSingle();

  if (rateRow?.fcfa_per_usd) {
    fcfaRate = Number(rateRow.fcfa_per_usd);
  }

  // If questionnaire is answered, compute recommendations
  let recommendations: ScoredGift[] = [];
  if (answers) {
    const { data: gifts } = await supabase
      .from("gifts")
      .select("*");

    if (gifts && gifts.length > 0) {
      recommendations = generateRecommendations(
        gifts as Gift[],
        questionnaire.budget,
        answers as AnswersRecord,
        questionnaire.recipient_name,
        questionnaire.currency || "FCFA",
        questionnaire.recipient_age_range,
        fcfaRate
      );
    }
  }

  return {
    questionnaire: questionnaire as Questionnaire,
    answers: answers as AnswersRecord | null,
    recommendations,
  };
}
