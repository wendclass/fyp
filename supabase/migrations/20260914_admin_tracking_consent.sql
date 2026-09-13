-- ==============================================================================
-- MIGRATION: CONSENTS, EVENTS TRACKING & ADMIN CAPABILITIES
-- ==============================================================================

-- 1. Table: consents
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

-- 2. Table: events (Tracking analytique complet & flexible)
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

-- 3. Fonction pour relier un visitor_id à un user_id lors de l'authentification
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

GRANT EXECUTE ON FUNCTION public.link_visitor_to_user(TEXT, UUID) TO anon, authenticated;
