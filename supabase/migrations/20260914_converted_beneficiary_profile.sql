-- ==============================================================================
-- MIGRATION: PROFILES & CONVERTED BENEFICIARY TRACKING
-- ==============================================================================

-- 1. Table: profiles (Profils utilisateurs avec lien vers questionnaire d'origine)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    converted_from_questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_converted_from ON public.profiles(converted_from_questionnaire_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admin view all profiles" ON public.profiles;
CREATE POLICY "Admin view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((auth.jwt() ->> 'email') = 'wendclasss@gmail.com');

-- 2. Fonction RPC pour enregistrer ou mettre à jour la conversion bénéficiaire -> expéditeur
CREATE OR REPLACE FUNCTION public.record_converted_beneficiary(
    p_user_id UUID,
    p_email TEXT,
    p_questionnaire_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
    INSERT INTO public.profiles (id, email, converted_from_questionnaire_id)
    VALUES (p_user_id, p_email, p_questionnaire_id)
    ON CONFLICT (id) DO UPDATE
    SET converted_from_questionnaire_id = COALESCE(profiles.converted_from_questionnaire_id, EXCLUDED.converted_from_questionnaire_id),
        email = COALESCE(EXCLUDED.email, profiles.email);
END;
$func$;

GRANT EXECUTE ON FUNCTION public.record_converted_beneficiary(UUID, TEXT, UUID) TO anon, authenticated;
