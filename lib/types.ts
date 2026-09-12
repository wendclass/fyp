export type OccasionType = 
  | "Anniversaire"
  | "Amour / couple"
  | "Réussite"
  | "Remerciement"
  | "Félicitations"
  | "Autre";

export type QuestionnaireStatus = "draft" | "sent" | "answered" | "completed";

export interface Questionnaire {
  id: string;
  owner_id: string;
  recipient_name: string;
  budget: string;
  occasion?: string;
  title: string;
  status: QuestionnaireStatus;
  share_token: string;
  selected_gift_id?: string | null;
  personal_note?: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  questionnaire_id?: string;
  position: number;
  prompt: string;
  options: string[];
}

export interface AnswersRecord {
  id: string;
  questionnaire_id: string;
  q1_pleasure: string;
  q2_likes: string[];
  q3_dislikes: string[];
  created_at: string;
}

export interface Gift {
  id: string;
  name: string;
  budget_min: number;
  budget_max: number;
  categories: string[];
  excluded_categories: string[];
  gift_type: "wear" | "use" | "eat" | "experience" | "surprise" | string;
  description: string;
  image_url?: string;
  estimated_price?: string;
}

export interface ScoredGift {
  gift: Gift;
  score: number;
  rank_label: "Très adapté" | "Adapté" | "Alternative";
  explanation: string;
  reasons: string[];
}

export interface BeneficiaryPublicData {
  id: string;
  recipient_name: string;
  status: QuestionnaireStatus;
  occasion?: string;
}

export interface RecipientSubmission {
  q1_pleasure: string;
  q2_likes: string[];
  q3_dislikes: string[];
}
