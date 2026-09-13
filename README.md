# Fyp 🎁, Recommandation de cadeaux basée sur un mécanisme d’aveuglement

**Fyp** est une application web moderne qui résout le dilemme du cadeau : comment surprendre quelqu’un avec un cadeau sur-mesure sans lui demander directement ce qu’il souhaite et sans risquer de le décevoir ?

---

## 🌟 Le Concept : Mécanisme d’aveuglement

1. **L’offrant** crée une surprise en choisissant l’occasion et en fixant son **budget secret** en FCFA (5 000, 10 000, 25 000, 50 000 FCFA ou personnalisé).
2. **L’offrant** partage un lien unique (`/s/prenom-xxxxx`) par WhatsApp, Messenger ou SMS.
3. **Le bénéficiaire** ouvre le lien sans compte et répond à **3 questions simples** (ce qui lui ferait plaisir, ses univers favoris, ce qu’il préfère éviter) **sans jamais voir le budget ni les idées de cadeaux**.
4. **L’offrant** découvre les réponses de son proche et **3 recommandations de cadeaux scorées** avec des explications personnalisées.
5. **L’offrant choisit activement** son cadeau préféré et peut y associer un mot doux personnel.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, Server Components et Actions)
- **Langage** : TypeScript
- **Style** : [Tailwind CSS](https://tailwindcss.com/) (Palette blush `#FDE7F0`, accent fuchsia `#E8368F`, charbon doux `#2B2230`)
- **Animations** : [Framer Motion](https://www.framer-motion.com/) (Hero texte rotatif, transitions questionnaire en swipe horizontal, révélation chorégraphiée)
- **Base de données et Auth** : [Supabase](https://supabase.com/) avec Row Level Security (RLS) et fonctions `SECURITY DEFINER`
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Célébrations** : Canvas Confetti

---

## 🗄️ Structure de la Base de Données (Supabase)

Le schéma complet et les politiques de sécurité sont disponibles dans `supabase/schema.sql` et `supabase/seed_gifts.sql`.

### Tables
- `questionnaires` : Surprises créées (propriétaire, bénéficiaire, budget, occasion, statut, slug unique, cadeau choisi).
- `questions` : Questions posées au bénéficiaire.
- `answers` : Réponses fournies par le bénéficiaire.
- `gifts` : Catalogue de cadeaux avec tags, exclusions et fourchettes de prix en FCFA.
- `support_messages` : Messages et suggestions envoyés depuis le formulaire de contact.

### Fonctions Sécurisées (`SECURITY DEFINER`)
- `get_questionnaire_by_token(p_token)` : Retourne uniquement les données publiques non sensibles (`id`, `recipient_name`, `status`, `occasion`) sans jamais divulguer le budget ni l’identifiant du créateur.
- `submit_questionnaire(p_token, p_q1, p_q2, p_q3)` : Enregistre les réponses du bénéficiaire anonyme et passe le statut à `answered`.

---

## 🚀 Installation et Développement Local

1. **Cloner le projet** :
```bash
git clone https://github.com/wendclass/fyp.git
cd fyp
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Variables d’environnement** :
Créez un fichier `.env.local` basé sur `.env.example` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://gztzlluiregsznejfptj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Lancer le serveur de développement** :
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

---

## 📦 Déploiement sur Vercel

1. Importez ce dépôt GitHub (`wendclass/fyp`) dans **Vercel**.
2. Dans **Project Settings > Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Déployez le projet.
4. Une fois votre URL de production Vercel obtenue (ex : `https://foryou-fyp.vercel.app`), ajoutez-la dans **Supabase Console > Authentication > URL Configuration** :
   - **Site URL** : `https://foryou-fyp.vercel.app`
   - **Redirect URLs** : `https://foryou-fyp.vercel.app/**` et `https://foryou-fyp.vercel.app/auth/callback`
