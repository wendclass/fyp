"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "wendclasss@gmail.com";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Accès non autorisé. Seul l’administrateur du site peut accéder à cet espace.");
  }

  return { supabase, user };
}

export async function updateExchangeRate(newRate: number) {
  const { supabase } = await verifyAdmin();

  if (!newRate || newRate <= 0) {
    return { error: "Veuillez entrer un taux de change valide." };
  }

  const { error } = await supabase
    .from("exchange_rate")
    .upsert({
      id: 1,
      fcfa_per_usd: newRate,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message || "Erreur lors de la mise à jour du taux." };
  }

  revalidatePath("/wendclass-fyp");
  return { success: true };
}

export async function updateSupportMessageStatus(id: string, status: "nouveau" | "traité") {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("support_messages")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Erreur lors de la mise à jour." };
  }

  revalidatePath("/wendclass-fyp");
  return { success: true };
}

export async function getAdminData(period: "7d" | "30d" | "all" = "30d", countryFilter?: string) {
  const { supabase } = await verifyAdmin();

  // 1. Fetch Exchange Rate
  const { data: exchangeRate } = await supabase
    .from("exchange_rate")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  // 2. Fetch Support Messages
  const { data: supportMessages } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Date Filter calculation
  let dateLimit: string | null = null;
  const now = new Date();
  if (period === "7d") {
    dateLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (period === "30d") {
    dateLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  // 4. Fetch Events
  let eventsQuery = supabase.from("events").select("*").order("occurred_at", { ascending: false });
  if (dateLimit) {
    eventsQuery = eventsQuery.gte("occurred_at", dateLimit);
  }
  if (countryFilter && countryFilter !== "all") {
    eventsQuery = eventsQuery.eq("pays_detecte", countryFilter);
  }
  const { data: events } = await eventsQuery.limit(10000);

  // 5. Fetch Questionnaires
  let qQuery = supabase.from("questionnaires").select("*").order("created_at", { ascending: false });
  if (dateLimit) {
    qQuery = qQuery.gte("created_at", dateLimit);
  }
  if (countryFilter && countryFilter !== "all") {
    qQuery = qQuery.eq("recipient_country", countryFilter);
  }
  const { data: questionnaires } = await qQuery;

  // 6. Fetch Answers
  const { data: answers } = await supabase
    .from("answers")
    .select("*")
    .order("created_at", { ascending: false });

  // 7. Fetch Gifts catalogue for recommendations analytics
  const { data: gifts } = await supabase
    .from("gifts")
    .select("id, name, gift_type, categories, excluded_categories, hedonic_utilitarian, budget_min, budget_max, age_min, age_max");

  // 8. Fetch Consents
  let consentsQuery = supabase.from("consents").select("*").order("consented_at", { ascending: false });
  if (dateLimit) {
    consentsQuery = consentsQuery.gte("consented_at", dateLimit);
  }
  const { data: consents } = await consentsQuery.limit(5000);

  return {
    exchangeRate: exchangeRate || { id: 1, fcfa_per_usd: 600, updated_at: new Date().toISOString() },
    supportMessages: supportMessages || [],
    events: events || [],
    questionnaires: questionnaires || [],
    answers: answers || [],
    gifts: gifts || [],
    consents: consents || [],
  };
}
