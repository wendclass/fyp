# Parcours de l'application de recommandation de cadeaux

## Concept

L'application permet à une personne de préparer un cadeau pour quelqu'un sans avoir à lui demander directement ce qu'elle souhaite.

Le principe est simple :

1. La personne qui offre crée un questionnaire.
2. Elle choisit l'occasion et son budget.
3. Elle envoie un lien au futur bénéficiaire.
4. Le bénéficiaire répond à quelques questions simples.
5. La personne qui offre consulte les réponses.
6. L'application propose quelques idées de cadeaux adaptées.

Le bénéficiaire ne voit pas le budget défini par la personne qui offre et ne voit pas les recommandations finales.

---

## 1. Création du questionnaire

La personne qui offre commence par créer une nouvelle surprise.

### Occasion

Elle choisit :

- Anniversaire
- Amour / couple
- Réussite
- Remerciement
- Félicitations
- Autre

### Budget

Elle définit ensuite son budget :

- 5 000 FCFA
- 10 000 FCFA
- 25 000 FCFA
- 50 000 FCFA
- Montant personnalisé

Puis elle clique sur :

**Créer le questionnaire**

L'application génère un lien unique.

Exemple :

`cadeau.app/amelie-7Kx92`

La personne peut ensuite envoyer ce lien au bénéficiaire par WhatsApp, Messenger ou tout autre moyen.

---

## 2. Le bénéficiaire répond

Le bénéficiaire ouvre le lien.

Il voit une interface très simple :

> **On prépare quelque chose pour toi 🎁**  
> Quelques petites questions pour mieux cerner tes goûts.

Il répond à seulement quelques questions, une par une.

### Question 1

> **Qu'est-ce qui te ferait le plus plaisir ?**

- Quelque chose à porter
- Quelque chose à utiliser
- Quelque chose à manger
- Une expérience
- Une surprise

### Question 2

> **Qu'est-ce que tu aimes ?**

Le bénéficiaire peut sélectionner plusieurs catégories :

- Mode
- Beauté
- Technologie
- Sport
- Musique
- Livres
- Cuisine
- Voyage
- Jeux
- Décoration
- Autre

### Question 3

> **Y a-t-il quelque chose que tu n'aimes pas recevoir ?**

Le bénéficiaire peut sélectionner plusieurs catégories à éviter :

- Parfums
- Vêtements
- Bijoux
- Cosmétiques
- Nourriture
- Gadgets électroniques
- Objets décoratifs
- Expériences
- Rien en particulier

### Fin du questionnaire

Après avoir répondu :

> **C'est noté ❤️**  
> Merci d'avoir répondu.

Le questionnaire est terminé.

---

## 3. La personne qui offre consulte les réponses

C'est une partie importante du parcours.

La personne qui offre ne reçoit pas seulement des recommandations : **elle peut voir les réponses données par le bénéficiaire.**

Elle retrouve par exemple :

### Réponses de la personne

**Ce qui lui ferait plaisir :**  
Quelque chose à utiliser

**Ce qu'elle aime :**  
Technologie, musique, jeux

**Ce qu'elle préfère éviter :**  
Parfums, vêtements

**Budget défini :**  
25 000 FCFA

Ces réponses permettent de comprendre pourquoi les recommandations sont proposées.

---

## 4. Recommandations de cadeaux

L'application analyse les réponses et le budget.

Elle propose un maximum de **3 idées de cadeaux**.

Exemple :

### 1. Casque audio Bluetooth

**Très adapté**

Pourquoi :
- Elle aime la musique.
- Elle préfère les objets utiles.
- Le prix correspond au budget.

### 2. Accessoire pour smartphone

**Adapté**

Pourquoi :
- Elle aime la technologie.
- C'est un objet qu'elle peut utiliser régulièrement.

### 3. Jeu de société

**Alternative**

Pourquoi :
- Elle aime les jeux.
- Cela correspond à son profil.

La personne qui offre peut ensuite choisir le cadeau qu'elle souhaite réellement acheter.

---

# Parcours global

```text
PERSONNE QUI OFFRE
        ↓
Créer une surprise
        ↓
Choisir l'occasion
        ↓
Définir le budget
        ↓
Créer le questionnaire
        ↓
Obtenir un lien
        ↓
Envoyer le lien
        ↓
BÉNÉFICIAIRE
        ↓
Ouvre le lien
        ↓
Répond à 3 questions
        ↓
Termine le questionnaire
        ↓
PERSONNE QUI OFFRE
        ↓
Consulte les réponses
        ↓
Voit les recommandations
        ↓
Choisit le cadeau
```

---

## Principe UX

Le parcours doit rester extrêmement simple.

### Pour la personne qui offre

**Créer → Envoyer → Consulter → Choisir**

### Pour le bénéficiaire

**Ouvrir → Répondre → Terminer**

L'objectif est de ne pas transformer l'application en long formulaire.

Le questionnaire doit être rapide, visuel et agréable, avec très peu de texte.

---

## MVP

Pour une première version, il n'est pas nécessaire de créer un système complexe.

Les éléments essentiels sont :

- Création d'un questionnaire
- Choix de l'occasion
- Définition du budget
- Génération d'un lien unique
- Questionnaire de 3 questions
- Réponses enregistrées
- Consultation des réponses par l'expéditeur
- Suggestions de cadeaux
- Filtrage des suggestions selon le budget et les préférences

Le cœur du produit est donc :

**Les réponses du bénéficiaire + le budget de l'expéditeur → des idées de cadeaux pertinentes.**
