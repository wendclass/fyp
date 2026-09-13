import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BeneficiaryQuiz } from "@/components/beneficiary-quiz";
import { Metadata } from "next";

interface Props {
  params: { token: string };
}

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Une surprise se prépare pour toi 🎁, Fyp",
    description: "Réponds à 4 petites questions simples pour nous aider à te faire plaisir !",
  };
}

export default async function BeneficiaryPage({ params }: Props) {
  const { token } = params;
  const supabase = await createClient();

  // Call the SECURITY DEFINER function to retrieve only public safe data
  const { data, error } = await supabase.rpc("get_questionnaire_by_token", {
    p_token: token,
  });

  if (error || !data) {
    // If not found in database, check fallback query
    const { data: directQ } = await supabase
      .from("questionnaires")
      .select("id, recipient_name, status, occasion")
      .eq("share_token", token)
      .maybeSingle();

    if (!directQ) {
      notFound();
    }

    return (
      <BeneficiaryQuiz
        token={token}
        recipientName={directQ.recipient_name}
        occasion={directQ.occasion}
        alreadyAnswered={directQ.status === "answered" || directQ.status === "completed"}
      />
    );
  }

  const alreadyAnswered = data.status === "answered" || data.status === "completed";

  return (
    <BeneficiaryQuiz
      token={token}
      recipientName={data.recipient_name}
      occasion={data.occasion}
      alreadyAnswered={alreadyAnswered}
    />
  );
}
