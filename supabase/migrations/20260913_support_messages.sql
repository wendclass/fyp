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
