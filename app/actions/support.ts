"use server";

import { createClient } from "@/lib/supabase/server";

export interface SupportSubmissionState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function submitSupportMessage(
  prevState: SupportSubmissionState | null,
  formData: FormData
): Promise<SupportSubmissionState> {
  const name = (formData.get("name") as string)?.trim();
  const contact_type = (formData.get("contact_type") as string) || "email";
  const contact_value = (formData.get("contact_value") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name) {
    return { error: "Veuillez renseigner votre nom ou prénom." };
  }

  if (!contact_value) {
    return {
      error:
        contact_type === "whatsapp"
          ? "Veuillez renseigner votre numéro WhatsApp."
          : "Veuillez renseigner votre adresse email.",
    };
  }

  if (!message || message.length < 5) {
    return { error: "Votre message est trop court, merci de préciser votre demande." };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("support_messages").insert({
      name,
      contact_type: contact_type === "whatsapp" ? "whatsapp" : "email",
      contact_value,
      message,
      status: "nouveau",
    });

    if (error) {
      console.error("Support message insert error:", error);
      return { error: "Une erreur est survenue lors de l’envoi. Merci de réessayer." };
    }

    return {
      success: true,
      message: "Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.",
    };
  } catch (err) {
    console.error("Support action error:", err);
    return { error: "Impossible d’envoyer le message pour le moment. Veuillez réessayer plus tard." };
  }
}
