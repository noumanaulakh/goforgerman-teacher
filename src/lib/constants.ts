export const TEACHING_FORMATS = [
  { value: "one_on_one", label: "One-on-one" },
  { value: "small_group", label: "Small group" },
  { value: "exam_prep", label: "Exam prep (Goethe/TestDaF)" },
  { value: "subject_specific", label: "Subject-specific language course" },
] as const;

export type TeachingFormat = (typeof TEACHING_FORMATS)[number]["value"];

export function formatLabel(format: string): string {
  return TEACHING_FORMATS.find((f) => f.value === format)?.label ?? format;
}

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const PAGE_SIZE = 6;
