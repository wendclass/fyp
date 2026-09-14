-- ==============================================================================
-- SCHEMA COMPLET SUPABASE - APPLICATION FYP (Recommandation de Cadeaux)
-- ==============================================================================

-- 1. Table: questionnaires
CREATE TABLE IF NOT EXISTS public.questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    occasion TEXT NOT NULL DEFAULT 'Anniversaire',
    budget TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'FCFA',
    recipient_age_range TEXT,
    recipient_country TEXT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'answered', 'completed')),
    share_token TEXT NOT NULL UNIQUE,
    selected_gift_id UUID,
    personal_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour accélérer la recherche par token de partage
CREATE INDEX IF NOT EXISTS idx_questionnaires_share_token ON public.questionnaires(share_token);
CREATE INDEX IF NOT EXISTS idx_questionnaires_owner ON public.questionnaires(owner_id);

-- Activer Row Level Security (RLS)
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour questionnaires :
DROP POLICY IF EXISTS "Users can view own questionnaires" ON public.questionnaires;
CREATE POLICY "Users can view own questionnaires"
    ON public.questionnaires
    FOR SELECT
    TO authenticated
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own questionnaires" ON public.questionnaires;
CREATE POLICY "Users can insert own questionnaires"
    ON public.questionnaires
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own questionnaires" ON public.questionnaires;
CREATE POLICY "Users can update own questionnaires"
    ON public.questionnaires
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own questionnaires" ON public.questionnaires;
CREATE POLICY "Users can delete own questionnaires"
    ON public.questionnaires
    FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admin view all questionnaires" ON public.questionnaires;
CREATE POLICY "Admin view all questionnaires"
    ON public.questionnaires
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() ->> 'email') = 'wendclasss@gmail.com');


-- 2. Table: answers
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
    q1_pleasure TEXT NOT NULL,
    q2_likes TEXT[] NOT NULL DEFAULT '{}',
    q3_dislikes TEXT[] NOT NULL DEFAULT '{}',
    q4_hedonic_utilitarian TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_questionnaire_id ON public.answers(questionnaire_id);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour answers :
DROP POLICY IF EXISTS "Owners can view answers of their questionnaires" ON public.answers;
CREATE POLICY "Owners can view answers of their questionnaires"
    ON public.answers
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.questionnaires q
            WHERE q.id = answers.questionnaire_id
            AND q.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admin view all answers" ON public.answers;
CREATE POLICY "Admin view all answers"
    ON public.answers
    FOR SELECT
    TO authenticated
    USING ((auth.jwt() ->> 'email') = 'wendclasss@gmail.com');


-- 3. Table: gifts
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    budget_min NUMERIC NOT NULL,
    budget_max NUMERIC NOT NULL,
    categories TEXT[] NOT NULL DEFAULT '{}',
    excluded_categories TEXT[] NOT NULL DEFAULT '{}',
    gift_type TEXT NOT NULL,
    hedonic_utilitarian TEXT NOT NULL DEFAULT 'Les deux' CHECK (hedonic_utilitarian IN ('Utile', 'Fun', 'Les deux')),
    age_min INT NOT NULL DEFAULT 13,
    age_max INT NOT NULL DEFAULT 99,
    description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to gifts" ON public.gifts;
CREATE POLICY "Allow public read access to gifts"
    ON public.gifts
    FOR SELECT
    TO anon, authenticated
    USING (true);


-- 4. Table: exchange_rate
CREATE TABLE IF NOT EXISTS public.exchange_rate (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    fcfa_per_usd NUMERIC NOT NULL DEFAULT 600,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.exchange_rate ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read exchange_rate" ON public.exchange_rate;
CREATE POLICY "Public read exchange_rate"
    ON public.exchange_rate
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated update exchange_rate" ON public.exchange_rate;
CREATE POLICY "Authenticated update exchange_rate"
    ON public.exchange_rate
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

INSERT INTO public.exchange_rate (id, fcfa_per_usd)
VALUES (1, 600)
ON CONFLICT (id) DO NOTHING;


-- 5. Table: support_messages
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('whatsapp', 'email')),
    contact_value TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'traité')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert support messages" ON public.support_messages;
CREATE POLICY "Public insert support messages"
    ON public.support_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read support messages" ON public.support_messages;
CREATE POLICY "Admin read support messages"
    ON public.support_messages
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- 6. Table: consents
CREATE TABLE IF NOT EXISTS public.consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    localisation_accepted BOOLEAN NOT NULL,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_consents_visitor ON public.consents(visitor_id);
CREATE INDEX IF NOT EXISTS idx_consents_user ON public.consents(user_id);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert consents" ON public.consents;
CREATE POLICY "Public insert consents"
    ON public.consents
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read consents" ON public.consents;
CREATE POLICY "Admin read consents"
    ON public.consents
    FOR SELECT
    TO authenticated
    USING (true);


-- 7. Table: events (Tracking analytique)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb,
    page_url TEXT,
    pays_detecte TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_visitor ON public.events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_user ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON public.events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_occurred ON public.events(occurred_at);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert events" ON public.events;
CREATE POLICY "Public insert events"
    ON public.events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read events" ON public.events;
CREATE POLICY "Admin read events"
    ON public.events
    FOR SELECT
    TO authenticated
    USING (true);


-- 8. Fonctions Sécurisées (SECURITY DEFINER)

-- get_questionnaire_by_token (Zéro fuite de budget)
CREATE OR REPLACE FUNCTION public.get_questionnaire_by_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
BEGIN
    SELECT id, recipient_name, status, occasion
    INTO v_record
    FROM public.questionnaires
    WHERE share_token = p_token;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    RETURN jsonb_build_object(
        'id', v_record.id,
        'recipient_name', v_record.recipient_name,
        'status', v_record.status,
        'occasion', v_record.occasion
    );
END;
$$;

-- submit_questionnaire (4 questions)
CREATE OR REPLACE FUNCTION public.submit_questionnaire(
    p_token TEXT,
    p_q1 TEXT,
    p_q2 TEXT[],
    p_q3 TEXT[],
    p_q4 TEXT DEFAULT 'Les deux'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_q_id UUID;
    v_status TEXT;
BEGIN
    SELECT id, status INTO v_q_id, v_status
    FROM public.questionnaires
    WHERE share_token = p_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Questionnaire introuvable');
    END IF;

    INSERT INTO public.answers (questionnaire_id, q1_pleasure, q2_likes, q3_dislikes, q4_hedonic_utilitarian)
    VALUES (v_q_id, p_q1, p_q2, p_q3, p_q4);

    UPDATE public.questionnaires
    SET status = 'answered'
    WHERE id = v_q_id;

    RETURN jsonb_build_object('success', true, 'message', 'Réponses enregistrées avec succès');
END;
$$;

-- link_visitor_to_user
CREATE OR REPLACE FUNCTION public.link_visitor_to_user(
    p_visitor_id TEXT,
    p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.events
    SET user_id = p_user_id
    WHERE visitor_id = p_visitor_id AND user_id IS NULL;

    UPDATE public.consents
    SET user_id = p_user_id
    WHERE visitor_id = p_visitor_id AND user_id IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_questionnaire_by_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_questionnaire(TEXT, TEXT, TEXT[], TEXT[], TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.link_visitor_to_user(TEXT, UUID) TO anon, authenticated;

-- 9. Table: profiles (Profils utilisateurs avec lien vers questionnaire d'origine)
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

-- record_converted_beneficiary
CREATE OR REPLACE FUNCTION public.record_converted_beneficiary(
    p_user_id UUID,
    p_email TEXT,
    p_questionnaire_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, converted_from_questionnaire_id)
    VALUES (p_user_id, p_email, p_questionnaire_id)
    ON CONFLICT (id) DO UPDATE
    SET converted_from_questionnaire_id = COALESCE(profiles.converted_from_questionnaire_id, EXCLUDED.converted_from_questionnaire_id),
        email = COALESCE(EXCLUDED.email, profiles.email);
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_converted_beneficiary(UUID, TEXT, UUID) TO anon, authenticated;

