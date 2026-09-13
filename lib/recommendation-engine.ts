import { Gift, AnswersRecord, ScoredGift, AgeRangeType } from "./types";

// Fixed preset USD to FCFA mapping
export const USD_PRESET_TO_FCFA: Record<string, number> = {
  "10": 5000,
  "20": 10000,
  "45": 25000,
  "90": 50000,
};

// Mapping between Q1 user choices and internal gift_type
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

export function parseBudgetValue(
  budgetStr: string,
  currency: string = "FCFA",
  fcfaPerUsd: number = 600
): number {
  const cleanStr = budgetStr.replace(/\s/g, "").replace(/\$/g, "");
  const numMatch = cleanStr.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 25000;

  if (currency === "USD" || cleanStr.includes("$")) {
    if (USD_PRESET_TO_FCFA[num.toString()]) {
      return USD_PRESET_TO_FCFA[num.toString()];
    }
    return Math.round(num * fcfaPerUsd);
  }

  return num;
}

// Age range check with significant gap tolerance
function isAgeGapSignificant(
  giftAgeMin: number,
  giftAgeMax: number,
  ageRange?: string
): boolean {
  if (!ageRange) return false;

  const min = giftAgeMin ?? 13;
  const max = giftAgeMax ?? 99;

  switch (ageRange) {
    case "13-17":
      // Significant gap if gift is strictly for adults 18+
      return min >= 18;
    case "18-24":
      return max < 18;
    case "25-34":
      return max < 18;
    case "35+":
      // Significant gap if gift is strictly for teenagers / young people under 35
      return max < 35;
    default:
      return false;
  }
}

export function generateRecommendations(
  gifts: Gift[],
  budgetStr: string,
  answers: AnswersRecord,
  recipientName: string = "Le bénéficiaire",
  currency: string = "FCFA",
  recipientAgeRange?: string,
  fcfaPerUsd: number = 600
): ScoredGift[] {
  const targetBudget = parseBudgetValue(budgetStr, currency, fcfaPerUsd);
  const q1 = answers.q1_pleasure || "";
  const q2Likes = (answers.q2_likes || []).map(normalize);
  const q3Dislikes = (answers.q3_dislikes || [])
    .filter((item) => !item.toLowerCase().includes("rien"))
    .map(normalize);
  const q4Hedonic = answers.q4_hedonic_utilitarian || "Les deux";

  // Helper: check if a gift has any category in disliked list
  const isExcludedByDislikes = (gift: Gift): boolean => {
    const allGiftExcluded = [
      ...gift.excluded_categories.map(normalize),
      ...gift.categories.map(normalize),
    ];
    return q3Dislikes.some((disliked) =>
      allGiftExcluded.some((cat) => cat.includes(disliked) || disliked.includes(cat))
    );
  };

  // Helper: check significant age exclusion
  const isExcludedByAge = (gift: Gift): boolean => {
    return isAgeGapSignificant(gift.age_min, gift.age_max, recipientAgeRange);
  };

  // Helper: score a gift
  const scoreGift = (gift: Gift): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Q1 Pleasure match (+1)
    const q1Matches = Q1_MAPPING[q1] || [];
    const giftTypeNorm = normalize(gift.gift_type || "");
    const hasQ1Match =
      q1Matches.includes(giftTypeNorm) ||
      gift.categories.some((c) => q1Matches.includes(normalize(c)));

    if (hasQ1Match) {
      score += 1.0;
      if (q1 === "Quelque chose à porter") {
        reasons.push("Correspond à son envie d’un article à porter.");
      } else if (q1 === "Quelque chose à utiliser") {
        reasons.push("C’est un objet utile au quotidien selon son souhait.");
      } else if (q1 === "Quelque chose à manger") {
        reasons.push("Répond à son goût pour les plaisirs gourmands.");
      } else if (q1 === "Une expérience") {
        reasons.push("Offre une expérience mémorable comme souhaité.");
      } else {
        reasons.push("Idéal pour créer une belle surprise.");
      }
    }

    // 2. Q2 Likes (Categories in common, +1 per category, max 3)
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

    // 3. Q4 Hedonic vs Utilitarian match (+1)
    const giftHedonic = gift.hedonic_utilitarian || "Les deux";
    if (giftHedonic === "Les deux" || q4Hedonic === "Les deux" || giftHedonic === q4Hedonic) {
      score += 1.0;
      if (q4Hedonic === "Utile" && (giftHedonic === "Utile" || giftHedonic === "Les deux")) {
        reasons.push("Apporte une réelle utilité pratique au quotidien.");
      } else if (q4Hedonic === "Fun" && (giftHedonic === "Fun" || giftHedonic === "Les deux")) {
        reasons.push("Apporte une touche de fun et de plaisir immédiat.");
      }
    }

    // 4. Budget alignment bonus
    if (gift.budget_min <= targetBudget && gift.budget_max >= targetBudget) {
      score += 0.5;
    }

    return { score, reasons };
  };

  // Phase 1: Filter strictly without excluded categories, age gap, and matching budget
  let candidates = gifts.filter((gift) => {
    if (isExcludedByDislikes(gift)) return false;
    if (isExcludedByAge(gift)) return false;
    return gift.budget_min <= targetBudget * 1.35 && gift.budget_max >= targetBudget * 0.65;
  });

  // Phase 2: If we have less than 3, widen budget filter while preserving strict exclusion
  if (candidates.length < 3) {
    candidates = gifts.filter((gift) => !isExcludedByDislikes(gift) && !isExcludedByAge(gift));
  }

  // Phase 3: Fallback if all gifts were somehow excluded
  if (candidates.length === 0) {
    candidates = gifts.filter((gift) => !isExcludedByDislikes(gift));
    if (candidates.length === 0) candidates = [...gifts];
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
