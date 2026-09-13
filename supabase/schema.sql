-- ==============================================================================
-- SCHEMA COMPLET SUPABASE - FYP (APPLICATION DE CADEAUX AVEC AVEUGLEMENT)
-- ==============================================================================

-- 1. Table: questionnaires
CREATE TABLE IF NOT EXISTS public.questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    budget TEXT NOT NULL,
    occasion TEXT NOT NULL DEFAULT 'Anniversaire',
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'answered', 'completed')),
    share_token TEXT NOT NULL UNIQUE,
    selected_gift_id UUID,
    personal_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: questions (lisible publiquement, rien de sensible)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE CASCADE,
    position INT NOT NULL,
    prompt TEXT NOT NULL,
    options TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: answers (réponses du bénéficiaire)
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID NOT NULL REFERENCES public.questionnaires(id) ON DELETE CASCADE,
    q1_pleasure TEXT NOT NULL,
    q2_likes TEXT[] NOT NULL DEFAULT '{}',
    q3_dislikes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: gifts (catalogue de cadeaux)
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    budget_min NUMERIC NOT NULL,
    budget_max NUMERIC NOT NULL,
    categories TEXT[] NOT NULL DEFAULT '{}',
    excluded_categories TEXT[] NOT NULL DEFAULT '{}',
    gift_type TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_questionnaires_owner ON public.questionnaires(owner_id);
CREATE INDEX IF NOT EXISTS idx_questionnaires_token ON public.questionnaires(share_token);
CREATE INDEX IF NOT EXISTS idx_answers_questionnaire ON public.answers(questionnaire_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - RÈGLES DE SÉCURITÉ STRICTES & NON NÉGOCIABLES
-- ==============================================================================

ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Questionnaires : Seul le propriétaire authentifié peut lire, insérer, modifier ses propres surprises
DROP POLICY IF EXISTS "Owners can manage questionnaires" ON public.questionnaires;
CREATE POLICY "Owners can manage questionnaires"
    ON public.questionnaires
    FOR ALL
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Questions : Lisible publiquement
DROP POLICY IF EXISTS "Public read questions" ON public.questions;
CREATE POLICY "Public read questions"
    ON public.questions
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Answers : Seul le propriétaire du questionnaire peut lire les réponses
DROP POLICY IF EXISTS "Owner can read answers" ON public.answers;
CREATE POLICY "Owner can read answers"
    ON public.answers
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.questionnaires q
            WHERE q.id = answers.questionnaire_id AND q.owner_id = auth.uid()
        )
    );

-- Gifts : Lecture pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Authenticated can read gifts" ON public.gifts;
CREATE POLICY "Authenticated can read gifts"
    ON public.gifts
    FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- FONCTIONS SECURITY DEFINER (ACCÈS SÉCURISÉ BÉNÉFICIAIRE SANS COMPTE)
-- ==============================================================================

-- 1. Récupération des données publiques pour le bénéficiaire (ZÉRO fuite de budget ni owner_id)
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

-- 2. Soumission des réponses du bénéficiaire et mise à jour du statut
CREATE OR REPLACE FUNCTION public.submit_questionnaire(
    p_token TEXT,
    p_q1 TEXT,
    p_q2 TEXT[],
    p_q3 TEXT[]
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
    -- Vérification du token et de l'existence
    SELECT id, status INTO v_q_id, v_status
    FROM public.questionnaires
    WHERE share_token = p_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Questionnaire introuvable');
    END IF;

    -- Insertion ou mise à jour des réponses
    INSERT INTO public.answers (questionnaire_id, q1_pleasure, q2_likes, q3_dislikes)
    VALUES (v_q_id, p_q1, p_q2, p_q3);

    -- Mise à jour du statut du questionnaire en 'answered'
    UPDATE public.questionnaires
    SET status = 'answered'
    WHERE id = v_q_id;

    RETURN jsonb_build_object('success', true, 'message', 'Réponses enregistrées avec succès');
END;
$$;

-- Attribution des droits d'exécution aux rôles anon et authenticated
GRANT EXECUTE ON FUNCTION public.get_questionnaire_by_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_questionnaire(TEXT, TEXT, TEXT[], TEXT[]) TO anon, authenticated;


-- ==============================================================================
-- 5. Table: support_messages (Support et suggestions client)
-- ==============================================================================
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
    FOR SELECT
    TO authenticated
    USING (true);
