import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const qid = searchParams.get("qid");
  const fromQuiz = searchParams.get("from_quiz");

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server Component context
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Link visitor_id from cookie to user_id
      const vid = cookieStore.get("fyp_vid")?.value;
      if (vid) {
        try {
          await supabase.rpc("link_visitor_to_user", {
            p_visitor_id: vid,
            p_user_id: data.user.id,
          });
        } catch (e) {
          // ignore
        }
      }

      // If converted from questionnaire, record in profiles
      if (qid) {
        try {
          await supabase.rpc("record_converted_beneficiary", {
            p_user_id: data.user.id,
            p_email: data.user.email || "",
            p_questionnaire_id: qid,
          });

          await supabase.from("events").insert({
            visitor_id: vid || `vid_oauth_${data.user.id}`,
            user_id: data.user.id,
            session_id: `sid_${Date.now()}`,
            event_name: "beneficiaire_devient_expediteur",
            page_url: next,
            properties: {
              questionnaire_id: qid,
              token: fromQuiz,
              auth_provider: "google",
            },
          });
        } catch (e) {
          console.debug("Error recording conversion on OAuth callback", e);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
