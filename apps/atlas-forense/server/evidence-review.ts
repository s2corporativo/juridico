import { isSafeReviewNote } from "./compendium.utils";

export const REVIEW_STATUSES = ["pending", "approved", "rejected", "returned"] as const;
export const REVIEW_DECISIONS = ["approved", "rejected", "returned"] as const;
export const REVIEW_PRIORITIES = ["routine", "elevated", "urgent"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];
export type ReviewPriority = (typeof REVIEW_PRIORITIES)[number];

export function validateReviewRequest(reason: string) {
  if (!isSafeReviewNote(reason)) throw new Error("A motivação da revisão é obrigatória e não pode conter dados pessoais.");
  return reason.trim();
}

export function validateReviewDecision(currentStatus: ReviewStatus, decision: ReviewDecision, note: string) {
  if (currentStatus === "approved" || currentStatus === "rejected") {
    throw new Error("O item já possui decisão final. Reabra a revisão em novo ciclo antes de alterá-la.");
  }
  if (!isSafeReviewNote(note)) throw new Error("A fundamentação da decisão é obrigatória e não pode conter dados pessoais.");
  return { status: decision, note: note.trim() };
}
