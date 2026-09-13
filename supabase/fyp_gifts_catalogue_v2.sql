-- ==============================================================================
-- MIGRATION V2 - FYP (CATALOGUE ENRICHI, QUESTIONNAIRE 4Q & TAUX DE CHANGE)
-- ==============================================================================

-- 1. Mise à jour de la table questionnaires
ALTER TABLE public.questionnaires ADD COLUMN IF NOT EXISTS recipient_age_range TEXT;
ALTER TABLE public.questionnaires ADD COLUMN IF NOT EXISTS recipient_country TEXT;
ALTER TABLE public.questionnaires ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'FCFA';

-- 2. Mise à jour de la table answers
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS q4_hedonic_utilitarian TEXT;

-- 3. Mise à jour de la table gifts
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS hedonic_utilitarian TEXT NOT NULL DEFAULT 'Les deux' CHECK (hedonic_utilitarian IN ('Utile', 'Fun', 'Les deux'));
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS age_min INT NOT NULL DEFAULT 13;
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS age_max INT NOT NULL DEFAULT 99;

-- 4. Table: exchange_rate (Taux de change fixe / manuel pour USD -> FCFA)
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
ON CONFLICT (id) DO UPDATE SET fcfa_per_usd = EXCLUDED.fcfa_per_usd;

-- 5. Mise à jour de la fonction submit_questionnaire (Support de Q4)
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

    -- Insertion ou mise à jour des 4 réponses
    INSERT INTO public.answers (questionnaire_id, q1_pleasure, q2_likes, q3_dislikes, q4_hedonic_utilitarian)
    VALUES (v_q_id, p_q1, p_q2, p_q3, p_q4);

    -- Mise à jour du statut du questionnaire en answered
    UPDATE public.questionnaires
    SET status = 'answered'
    WHERE id = v_q_id;

    RETURN jsonb_build_object('success', true, 'message', 'Réponses enregistrées avec succès');
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_questionnaire(TEXT, TEXT, TEXT[], TEXT[], TEXT) TO anon, authenticated;

-- 6. Remplacement / Réinitialisation du catalogue de cadeaux (V2 avec hedonic_utilitarian & âges)
TRUNCATE TABLE public.gifts RESTART IDENTITY;

INSERT INTO public.gifts (name, budget_min, budget_max, categories, excluded_categories, gift_type, hedonic_utilitarian, age_min, age_max, description, image_url)
VALUES
(
    'Carnet de notes artisanal en cuir & stylo bambou',
    4000, 6000,
    ARRAY['Livres', 'Décoration', 'Autre'],
    ARRAY['Livres', 'Décoration', 'Objets décoratifs', 'Vêtements', 'Parfums'],
    'use',
    'Utile',
    13, 99,
    'Un élégant carnet relié avec papier vergé pour noter pensées, projets ou croquis.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'
),
(
    'Coffret de thés précieux & infusions d''exception',
    4500, 7000,
    ARRAY['Cuisine', 'Autre'],
    ARRAY['Cuisine', 'Nourriture', 'Gadgets électroniques', 'Cosmétiques'],
    'eat',
    'Fun',
    18, 99,
    'Assortiment raffiné de 4 mélanges bien-être et gourmands aux arômes délicats.',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop'
),
(
    'Support de smartphone sculpté en bois noble',
    4000, 6000,
    ARRAY['Technologie', 'Décoration'],
    ARRAY['Technologie', 'Décoration', 'Gadgets électroniques', 'Objets décoratifs'],
    'use',
    'Utile',
    13, 99,
    'Accessoire moderne et minimaliste en bois massif pour bureau ou chevet.',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop'
),
(
    'Chaussettes cocooning brodées en coton doux',
    3500, 5500,
    ARRAY['Mode', 'Beauté'],
    ARRAY['Mode', 'Beauté', 'Vêtements'],
    'wear',
    'Les deux',
    13, 99,
    'Paire de chaussettes douces et stylées avec détails brodés pour un confort total.',
    'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&auto=format&fit=crop'
),
(
    'Tasse design en céramique émaillée & sous-verre',
    4000, 6500,
    ARRAY['Cuisine', 'Décoration'],
    ARRAY['Cuisine', 'Décoration', 'Objets décoratifs', 'Nourriture'],
    'use',
    'Les deux',
    13, 99,
    'Mug artisanal aux finitions soignées pour savourer thé ou café avec style.',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop'
),
(
    'Gourde isotherme inox 750ml finition mate',
    8000, 12000,
    ARRAY['Sport', 'Cuisine', 'Voyage'],
    ARRAY['Sport', 'Cuisine', 'Voyage', 'Gadgets électroniques'],
    'use',
    'Utile',
    13, 99,
    'Maintient les boissons fraîches 24h ou chaudes 12h, idéale pour le sport et les trajets.',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop'
),
(
    'Jeu d''ambiance et de cartes créatif',
    8000, 12000,
    ARRAY['Jeux', 'Autre'],
    ARRAY['Jeux', 'Parfums', 'Cosmétiques'],
    'surprise',
    'Fun',
    13, 99,
    'Le jeu convivial parfait pour animer les soirées entre amis ou en famille.',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop'
),
(
    'Enceinte Bluetooth compacte waterproof',
    9000, 14000,
    ARRAY['Technologie', 'Musique', 'Voyage'],
    ARRAY['Technologie', 'Musique', 'Voyage', 'Gadgets électroniques'],
    'use',
    'Fun',
    13, 99,
    'Son puissant et clair dans un format nomade qui résiste aux éclaboussures.',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop'
),
(
    'Coffret chocolats fins d''artisan chocolatier',
    8500, 13000,
    ARRAY['Cuisine', 'Autre'],
    ARRAY['Cuisine', 'Nourriture'],
    'eat',
    'Fun',
    13, 99,
    'Sélection de 16 chocolats d''exception aux fèves d''Afrique de l''Ouest.',
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop'
),
(
    'Bougie parfumée végétale aux essences naturelles',
    7500, 11000,
    ARRAY['Décoration', 'Beauté'],
    ARRAY['Décoration', 'Beauté', 'Objets décoratifs', 'Parfums', 'Cosmétiques'],
    'use',
    'Les deux',
    18, 99,
    'Coulée à la main en cire de soja, crée une atmosphère apaisante pendant 45 heures.',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop'
),
(
    'Lampe de lecture nomade à pince rechargeable',
    8000, 12000,
    ARRAY['Livres', 'Technologie'],
    ARRAY['Livres', 'Technologie', 'Gadgets électroniques'],
    'use',
    'Utile',
    13, 99,
    'Éclairage chaleureux et doux sans reflet pour lire sans déranger ni fatiguer les yeux.',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop'
),
(
    'Casque audio Bluetooth à réduction de bruit',
    20000, 30000,
    ARRAY['Technologie', 'Musique', 'Voyage'],
    ARRAY['Technologie', 'Musique', 'Voyage', 'Gadgets électroniques'],
    'use',
    'Les deux',
    13, 99,
    '30h d''autonomie, coussinets ultra-doux et isolation phonique pour savourer ses musiques.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop'
),
(
    'Montre chronographe minimaliste avec bracelet cuir',
    22000, 30000,
    ARRAY['Mode', 'Bijoux'],
    ARRAY['Mode', 'Bijoux', 'Vêtements'],
    'wear',
    'Utile',
    18, 99,
    'Lignes épurées et boîtier raffiné pour sublimer les tenues de tous les jours.',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop'
),
(
    'Séance Massage Relaxant & Spa 1h en institut',
    20000, 30000,
    ARRAY['Beauté', 'Voyage', 'Autre'],
    ARRAY['Beauté', 'Expériences', 'Cosmétiques'],
    'experience',
    'Fun',
    18, 99,
    'Une parenthèse bien-être absolue aux huiles essentielles pour évacuer les tensions.',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop'
),
(
    'Appareil photo instantané rétro style polaroid',
    23000, 32000,
    ARRAY['Technologie', 'Voyage', 'Jeux'],
    ARRAY['Technologie', 'Voyage', 'Jeux', 'Gadgets électroniques'],
    'use',
    'Fun',
    13, 99,
    'Capture et imprime instantanément les plus beaux souvenirs sur papier glacé.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop'
),
(
    'Atelier Masterclass Cocktail ou Pâtisserie',
    22000, 28000,
    ARRAY['Cuisine', 'Jeux', 'Autre'],
    ARRAY['Cuisine', 'Expériences', 'Nourriture'],
    'experience',
    'Fun',
    18, 99,
    'Apprentissage des secrets de grands chefs lors d''une session immersive et gourmande.',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop'
),
(
    'Sac weekend en toile canevas & finitions cuir',
    22000, 30000,
    ARRAY['Mode', 'Voyage'],
    ARRAY['Mode', 'Voyage', 'Vêtements'],
    'wear',
    'Utile',
    18, 99,
    'Spacieux, résistant et élégant pour toutes les escapades de courte durée.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop'
),
(
    'Dîner Gastronomique d''exception en tête-à-tête',
    45000, 65000,
    ARRAY['Cuisine', 'Voyage', 'Autre'],
    ARRAY['Cuisine', 'Expériences', 'Nourriture'],
    'experience',
    'Fun',
    18, 99,
    'Menu dégustation raffiné en 5 temps dans une table renommée.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'
),
(
    'Liseuse numérique haute résolution avec rétroéclairage',
    42000, 58000,
    ARRAY['Livres', 'Technologie', 'Voyage'],
    ARRAY['Livres', 'Technologie', 'Voyage', 'Gadgets électroniques'],
    'use',
    'Utile',
    13, 99,
    'Permet d''emporter une bibliothèque entière sans reflet ni fatigue pour les yeux.',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop'
),
(
    'Journée Escapade & Nuitée dans un éco-lodge de charme',
    45000, 70000,
    ARRAY['Voyage', 'Décoration', 'Autre'],
    ARRAY['Voyage', 'Expériences'],
    'experience',
    'Fun',
    18, 99,
    'Un séjour dépaysant au vert avec petit-déjeuner gourmand inclus.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop'
),
(
    'Parfum de niche Haute Parfumerie 100ml',
    45000, 60000,
    ARRAY['Beauté', 'Mode'],
    ARRAY['Beauté', 'Mode', 'Parfums', 'Cosmétiques'],
    'wear',
    'Les deux',
    18, 99,
    'Une fragrance rare et envoûtante signée par un grand nez parfumeur.',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop'
),
(
    'Console de jeux rétro transportable avec écran vibrant',
    45000, 60000,
    ARRAY['Jeux', 'Technologie'],
    ARRAY['Jeux', 'Technologie', 'Gadgets électroniques'],
    'use',
    'Fun',
    13, 34,
    'Des milliers de chefs-d''œuvre classiques dans une console portable moderne.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop'
);
