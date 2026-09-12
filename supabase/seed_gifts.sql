-- ==============================================================================
-- CATALOGUE DE CADEAUX DE TEST (20+ ENTRÉES VARIÉES)
-- ==============================================================================

INSERT INTO public.gifts (name, budget_min, budget_max, categories, excluded_categories, gift_type, description, image_url)
VALUES
(
    'Carnet de notes artisanal en cuir & stylo bambou',
    4000, 6000,
    ARRAY['Livres', 'Décoration', 'Autre'],
    ARRAY['Vêtements', 'Parfums'],
    'use',
    'Un magnifique carnet relié avec pages épaisses pour noter pensées, croquis et projets.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'
),
(
    'Coffret de thés précieux & infusions parfumées',
    4500, 7000,
    ARRAY['Cuisine', 'Autre'],
    ARRAY['Nourriture', 'Gadgets électroniques'],
    'eat',
    'Sélection de 4 mélanges de thés bio bien-être et gourmands.',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop'
),
(
    'Support de téléphone ergonomique en bois sculpté',
    4000, 6000,
    ARRAY['Technologie', 'Décoration'],
    ARRAY['Gadgets électroniques', 'Vêtements'],
    'use',
    'Accessoire élégant pour bureau ou table de chevet, compatible tout smartphone.',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop'
),
(
    'Chaussettes cocooning brodées en coton peigné',
    3500, 5500,
    ARRAY['Mode', 'Beauté'],
    ARRAY['Vêtements'],
    'wear',
    'Paire de chaussettes douces et chaudes avec motifs originaux brodés.',
    'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&auto=format&fit=crop'
),
(
    'Gourde isotherme inox 750ml finition mate',
    8000, 12000,
    ARRAY['Sport', 'Cuisine', 'Voyage'],
    ARRAY['Gadgets électroniques'],
    'use',
    'Garde les boissons au frais 24h ou au chaud 12h, indispensable pour le sport et les déplacements.',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop'
),
(
    'Jeu d''ambiance et de cartes créatif',
    8000, 12000,
    ARRAY['Jeux', 'Autre'],
    ARRAY['Parfums', 'Cosmétiques'],
    'surprise',
    'Le jeu idéal pour des soirées mémorables entre amis ou en famille.',
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&auto=format&fit=crop'
),
(
    'Enceinte Bluetooth compacte waterproof',
    9000, 14000,
    ARRAY['Technologie', 'Musique', 'Voyage'],
    ARRAY['Gadgets électroniques', 'Cosmétiques'],
    'use',
    'Son puissant et basses claires dans un format de poche résistant à l''eau.',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop'
),
(
    'Coffret chocolats fins d''artisan chocolatier',
    8500, 13000,
    ARRAY['Cuisine', 'Autre'],
    ARRAY['Nourriture'],
    'eat',
    'Assortiment de 16 chocolats d''exception aux fèves d''Afrique de l''Ouest.',
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop'
),
(
    'Bougie parfumée végétale aux essences naturelles',
    7500, 11000,
    ARRAY['Décoration', 'Beauté'],
    ARRAY['Objets décoratifs', 'Parfums'],
    'use',
    'Coulée à la main, diffuse une ambiance douce et relaxante pendant 45h.',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop'
),
(
    'Casque audio Bluetooth à réduction de bruit',
    20000, 30000,
    ARRAY['Technologie', 'Musique', 'Voyage'],
    ARRAY['Gadgets électroniques'],
    'use',
    'Autonomie de 30h, coussinets ultra-confortables et immersion sonore totale.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop'
),
(
    'Montre chronographe minimaliste avec bracelet cuir',
    22000, 30000,
    ARRAY['Mode', 'Bijoux'],
    ARRAY['Bijoux', 'Vêtements'],
    'wear',
    'Design épuré et moderne, s''associe avec toutes les tenues quotidiennes ou habillées.',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop'
),
(
    'Séance Massage Relaxant & Spa 1h en institut',
    20000, 30000,
    ARRAY['Beauté', 'Voyage', 'Autre'],
    ARRAY['Expériences'],
    'experience',
    'Un moment de détente absolue pour évacuer les tensions du quotidien.',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop'
),
(
    'Appareil photo instantané rétro style polaroid',
    23000, 32000,
    ARRAY['Technologie', 'Voyage', 'Jeux'],
    ARRAY['Gadgets électroniques'],
    'use',
    'Pour capturer et imprimer instantanément les meilleurs moments sur papier argentique.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop'
),
(
    'Atelier Masterclass Cocktail ou Pâtisserie pour 1 personne',
    22000, 28000,
    ARRAY['Cuisine', 'Jeux', 'Autre'],
    ARRAY['Expériences', 'Nourriture'],
    'experience',
    'Apprentissage des techniques de mixologie ou de haute pâtisserie avec un chef.',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop'
),
(
    'Sac weekend en toile canevas & cuir véritable',
    22000, 30000,
    ARRAY['Mode', 'Voyage'],
    ARRAY['Vêtements'],
    'wear',
    'Robuste, spacieux et chic pour les escapades de fin de semaine.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop'
),
(
    'Dîner Gastronomique d''exception en tête-à-tête',
    45000, 65000,
    ARRAY['Cuisine', 'Voyage', 'Autre'],
    ARRAY['Expériences', 'Nourriture'],
    'experience',
    'Menu dégustation 5 temps dans l''une des tables les plus réputées de la ville.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'
),
(
    'Liseuse numérique haute résolution avec éclairage chaud',
    42000, 58000,
    ARRAY['Livres', 'Technologie', 'Voyage'],
    ARRAY['Gadgets électroniques'],
    'use',
    'Permet d''emporter des milliers de livres partout sans aucune fatigue oculaire.',
    'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&auto=format&fit=crop'
),
(
    'Journée Escapade & Nuitée dans un éco-lodge de charme',
    45000, 70000,
    ARRAY['Voyage', 'Décoration', 'Autre'],
    ARRAY['Expériences'],
    'experience',
    'Une parenthèse dépaysante au vert avec petit-déjeuner gourmand inclus.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop'
),
(
    'Parfum de niche Haute Parfumerie 100ml',
    45000, 60000,
    ARRAY['Beauté', 'Mode'],
    ARRAY['Parfums', 'Cosmétiques'],
    'wear',
    'Une fragrance rare, envoûtante et signée par un grand nez parfumeur.',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop'
),
(
    'Console de jeux rétro transportable avec écran OLED',
    45000, 60000,
    ARRAY['Jeux', 'Technologie'],
    ARRAY['Gadgets électroniques'],
    'use',
    'Des milliers de classiques rétro dans une coque élégante avec écran vibrant.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop'
);
