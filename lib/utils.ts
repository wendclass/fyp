import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFCFA(amount: string | number): string {
  const numeric = typeof amount === "string" ? parseInt(amount.replace(/\D/g, ""), 10) : amount;
  if (isNaN(numeric)) return `${amount} FCFA`;
  return `${new Intl.NumberFormat("fr-FR").format(numeric)} FCFA`;
}

export function slugifyRecipient(name: string): string {
  const cleaned = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  
  const randomChars = Math.random().toString(36).substring(2, 7);
  return `${cleaned || "cadeau"}-${randomChars}`;
}
