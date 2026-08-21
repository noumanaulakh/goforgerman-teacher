export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export const REASONS = [
  { value: "general", label: "General conversation / travel", category: "general" },
  { value: "business", label: "Work / business", category: "business" },
  { value: "medical", label: "Medical or healthcare career", category: "medical" },
  { value: "academic", label: "Academic studies", category: "academic" },
  { value: "exam_prep", label: "Upcoming exam (Goethe/TestDaF)", category: "exam_prep" },
] as const;

export type ReasonValue = (typeof REASONS)[number]["value"];

export const PROFICIENCY_QUESTIONS: { id: string; level: CefrLevel; question: string }[] = [
  {
    id: "intro",
    level: "A1",
    question: "Can you introduce yourself and have a very basic conversation in German?",
  },
  {
    id: "everyday",
    level: "A2",
    question:
      "Can you handle everyday situations like shopping, ordering food, or asking for directions?",
  },
  {
    id: "opinions",
    level: "B1",
    question: "Can you discuss familiar topics and express your opinions in German?",
  },
  {
    id: "professional",
    level: "B2",
    question:
      "Can you understand fairly complex texts and communicate fluently in professional settings?",
  },
  {
    id: "specialist",
    level: "C1",
    question:
      "Do you use German confidently in specialized professional or academic contexts?",
  },
];

/**
 * Highest level for which the student answered "yes" to every question
 * at or below that level, walking up from A1. A student who says no to
 * the A1 question is treated as a true beginner (A1) rather than
 * "no level" — this mirrors the "learn from scratch" use case on the
 * landing page.
 */
export function computeLevel(answers: Record<string, boolean>): CefrLevel {
  let highest: CefrLevel = "A1";
  for (const q of PROFICIENCY_QUESTIONS) {
    if (answers[q.id]) {
      highest = q.level;
    } else {
      break;
    }
  }
  return highest;
}

/**
 * Price tiers to pre-select in the teacher directory. Derived from the
 * computed level, with a bump to Tier 4 (Specialist Expert) for the
 * medical reason specifically, since that's where the medical/nursing
 * German offerings actually sit in the seed pricing data.
 */
export function recommendedTiers(level: CefrLevel, reason: ReasonValue): number[] {
  const base = level === "A1" || level === "A2" ? 1 : level === "B1" || level === "B2" ? 2 : 3;
  const tiers = new Set([base]);
  if (reason === "medical") tiers.add(4);
  return [...tiers].sort();
}
