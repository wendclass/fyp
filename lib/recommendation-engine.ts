import { Gift, AnswersRecord, ScoredGift } from "./types";
import { formatFCFA } from "./utils";

// Mapping between Q1 user choices and internal gift_type / tags
const Q1_MAPPING: Record<string, string[]> = {
  "Quelque chose à porter": ["wear", "mode", "vêtements", "bijoux", "accessoires"],
  "Quelque chose à utiliser": ["use", "technologie", "cuisine", "sport", "décoration", "beauté", "livres"],
  "Quelque chose à manger": ["eat", "nourriture", "cuisine", "gourmandise", "chocolat"],
  "Une expérience": ["experience", "voyage", "atelier", "bien-être", "détente", "spectacle"],
  "Une surprise": ["surprise", "wear", "use", "eat", "experience", "jeux"],
};

// Normalized category matcher
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function parseBudgetValue(budgetStr: string): number {
  const match = budgetStr.replace(/\s/g, "").match(/\d+/);
  if (!match) return 25000;
  return parseInt(match[0], 10);
}

export function generateRecommendations(
  gifts: Gift[],
  budgetStr: string,
  answers: AnswersRecord,
  recipientName: string = "Le bénéficiaire"
): ScoredGift[] {
  const targetBudget = parseBudgetValue(budgetStr);
  const q1 = answers.q1_pleasure || "";
  const q2Likes = (answers.q2_likes || []).map(normalize);
  const q3Dislikes = (answers.q3_dislikes || [])
    .filter((item) => !item.toLowerCase().includes("rien"))
    .map(normalize);

  // Helper: check if a gift has any category in disliked list
  const isExcluded = (gift: Gift): boolean => {
    const allGiftCategories = [
      ...gift.categories.map(normalize),
      ...gift.excluded_categories.map(normalize),
    ];
    return q3Dislikes.some((disliked) =>
      allGiftCategories.some((cat) => cat.includes(disliked) || disliked.includes(cat))
    );
  };

  // Helper: score a gift
  const scoreGift = (gift: Gift): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Check Q1 Pleasure match
    const q1Matches = Q1_MAPPING[q1] || [];
    const giftTypeNorm = normalize(gift.gift_type);
    const hasQ1Match =
      q1Matches.includes(giftTypeNorm) ||
      gift.categories.some((c) => q1Matches.includes(normalize(c)));

    if (hasQ1Match) {
      score += 1.5;
      if (q1 === "Quelque chose à porter") {
        reasons.push("Correspond à son envie d'un article à porter.");
      } else if (q1 === "Quelque chose à utiliser") {
        reasons.push("C'est un objet utile au quotidien selon son souhait.");
      } else if (q1 === "Quelque chose à manger") {
        reasons.push("Répond à son goût pour les plaisirs gourmands.");
      } else if (q1 === "Une expérience") {
        reasons.push("Offre une expérience mémorable comme souhaité.");
      } else {
        reasons.push("Parfait pour créer une belle surprise.");
      }
    }

    // 2. Check Q2 Likes (Categories in common)
    const matchingCategories: string[] = [];
    gift.categories.forEach((cat) => {
      const catNorm = normalize(cat);
      if (q2Likes.some((liked) => liked.includes(catNorm) || catNorm.includes(liked))) {
        score += 1.0;
        matchingCategories.push(cat);
      }
    });

    if (matchingCategories.length > 0) {
      reasons.push(
        `${recipientName} a mentionné aimer : ${matchingCategories.join(", ")}.`
      );
    }

    // 3. Budget alignment bonus
    if (gift.budget_min <= targetBudget && gift.budget_max >= targetBudget) {
      score += 1.0;
      reasons.push(`S'intègre parfaitement dans votre budget (${formatFCFA(targetBudget)}).`);
    } else {
      reasons.push(`Adapté à la fourchette budgétaire envisagée.`);
    }

    return { score, reasons };
  };

  // Phase 1: Filter strictly without excluded categories & matching budget
  let candidates = gifts.filter((gift) => {
    if (isExcluded(gift)) return false;
    return gift.budget_min <= targetBudget * 1.3 && gift.budget_max >= targetBudget * 0.7;
  });

  // Phase 2: If we have less than 3, widen budget filter while preserving strict exclusion
  if (candidates.length < 3) {
    candidates = gifts.filter((gift) => !isExcluded(gift));
  }

  // Phase 3: Fallback if all gifts were somehow excluded
  if (candidates.length === 0) {
    candidates = [...gifts];
  }

  // Score all candidates
  const scored = candidates.map((gift) => {
    const { score, reasons } = scoreGift(gift);
    return {
      gift,
      score,
      reasons,
    };
  });

  // Sort descending by score, then closest to target budget
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const diffA = Math.abs(a.gift.budget_min - targetBudget);
    const diffB = Math.abs(b.gift.budget_min - targetBudget);
    return diffA - diffB;
  });

  // Take top 3
  const top3 = scored.slice(0, 3);

  const rankLabels: Array<"Très adapté" | "Adapté" | "Alternative"> = [
    "Très adapté",
    "Adapté",
    "Alternative",
  ];

  return top3.map((item, index) => {
    const rank_label = rankLabels[index] || "Alternative";
    const explanation =
      item.reasons.length > 0
        ? item.reasons.slice(0, 2).join(" ")
        : `Idée sélectionnée en accord avec les réponses de ${recipientName}.`;

    return {
      gift: item.gift,
      score: item.score,
      rank_label,
      explanation,
      reasons: item.reasons,
    };
  });
}
