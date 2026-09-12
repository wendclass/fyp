"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Veuillez renseigner un email et un mot de passe." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Identifiants invalides." };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez renseigner un email et un mot de passe." };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit comporter au moins 6 caractères." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Erreur lors de l''inscription." };
  }

  revalidatePath("/", "layout");

  // If session is immediately available (email confirmation disabled in Supabase)
  if (data.session) {
    redirect("/dashboard");
  }

  return { success: true, message: "Compte créé ! Vous pouvez maintenant vous connecter." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
